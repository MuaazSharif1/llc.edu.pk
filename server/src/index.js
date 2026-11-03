import './dns-fix.js'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { User, Program, Post, Faculty, Enquiry, Setting, Audit } from './models.js'

const dir = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(dir, '../../client/dist'), UP = path.join(dir, '../uploads')
fs.mkdirSync(UP, { recursive: true })

const SECRET = process.env.JWT_SECRET || 'dev-secret', SITE = process.env.SITE_URL || 'http://localhost:5000'
const app = express()
app.use('/uploads', express.static(UP));
app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cookieParser())
app.use(express.json())

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

const wrap = f => (q, r, n) => Promise.resolve(f(q, r, n)).catch(e => { console.error(e); r.status(e.code === 11000 ? 400 : 500).json({ error: e.code === 11000 ? 'This slug/email already exists' : 'Server error' }) })
const slugify = s => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const limit = (max, ms = 600000) => rateLimit({ windowMs: ms, max, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests. Please try again later.' } })

// ---------- Public API ----------
app.get('/api/public/bootstrap', wrap(async (_, r) => {
  const [programs, news, faculty, settings] = await Promise.all([
    Program.find({ published: true }).sort('title').lean(), 
    Post.find({ published: true }).select('-body').sort('-createdAt').limit(30).lean(),
    Faculty.find({ published: true }).sort('name').lean(), 
    Setting.findOne({ key: 'site' }).lean()
  ])
  r.json({ programs, news, faculty, settings: settings || {} })
}))
app.get('/api/public/posts/:slug', wrap(async (q, r) => { const p = await Post.findOne({ slug: q.params.slug, published: true }).lean(); p ? r.json(p) : r.status(404).json({ error: 'Not found' }) }))


async function sendBrevoEmail({ to, subject, text }) {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.MAIL_FROM

  if (!apiKey || !senderEmail) {
    throw new Error('Brevo API key or MAIL_FROM is missing')
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: 'Lahore Law College',
        email: senderEmail
      },
      to: [{ email: to }],
      subject,
      textContent: text
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Brevo error: ${error}`)
  }

  return response.json()
}

async function notify(e) {
  try {
    await sendBrevoEmail({
      to: process.env.ADMISSIONS_EMAIL,
      subject: `New enquiry ${e.ref}`,
      text: `${e.name} <${e.email}> - ${e.program}\n${e.message}`
    })

    await sendBrevoEmail({
      to: e.email,
      subject: 'We received your enquiry',
      text: `Thank you ${e.name}. Your reference number is ${e.ref}.`
    })
  } catch (error) {
    console.error('Brevo enquiry email error:', error.message)
  }
}

app.post('/api/enquiries', limit(5), wrap(async (q, r) => {
  const b = q.body || {}
  if (b.website) return r.json({ ok: true, ref: 'LLC-OK' }) // honeypot
  const c = (s, n) => String(s ?? '').trim().slice(0, n)
  const d = { name: c(b.name, 100), email: c(b.email, 150).toLowerCase(), program: c(b.program, 100), phone: c(b.phone, 30), message: c(b.message, 2000) }
  if (d.name.length < 2 || !/^\S+@\S+\.\S+$/.test(d.email) || !d.program) return r.status(400).json({ error: 'Please fill all required fields correctly.' })
  d.ref = 'LLC-' + crypto.randomBytes(3).toString('hex').toUpperCase()
  await Enquiry.create(d); notify(d); r.json({ ok: true, ref: d.ref })
}))

// ---------- Auth: Netlify + Render Production ----------

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: 8 * 60 * 60 * 1000
}

app.post('/api/auth/login', limit(10), wrap(async (q, r) => {
  const { email, password } = q.body || {}

  const u = await User.findOne({
    email: String(email || '').trim().toLowerCase()
  })

  if (!u || !(await bcrypt.compare(String(password || ''), u.passwordHash))) {
    return r.status(401).json({ error: 'Invalid email or password' })
  }

  const s = {
    id: String(u._id),
    email: u.email, 
    role: u.role,
    name: u.name
  }

  const token = jwt.sign(s, SECRET, { expiresIn: '8h' })

  r.cookie('session', token, cookieOptions)

  r.json(s)
}))


app.post('/api/auth/forgot-password', limit(5), wrap(async (q, r) => {
  const email = String(q.body?.email || '').trim().toLowerCase()

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return r.status(400).json({
      error: 'Please enter a valid email address.'
    })
  }

  const user = await User.findOne({ email })

  if (user) {
    if (!process.env.BREVO_API_KEY || !process.env.MAIL_FROM) {
      return r.status(503).json({
        error: 'Email service is not configured.'
      })
    }

    const token = crypto.randomBytes(32).toString('hex')

    user.resetPasswordTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000)

    await user.save()

    const resetBase = process.env.FRONTEND_URL

    if (!resetBase) {
      throw new Error('FRONTEND_URL is not configured')
    }

    const resetUrl =
      `${resetBase.replace(/\/+$/, '')}/admin/reset-password?token=${encodeURIComponent(token)}`

    try {
      await sendBrevoEmail({
        to: user.email,
        subject: 'Reset your Lahore Law College admin password',
        text: `A password reset was requested for your account.

Open this link within 30 minutes to choose a new password:

${resetUrl}

If you did not request this, you can ignore this email.`
      })
    } catch (e) {
      user.resetPasswordTokenHash = undefined
      user.resetPasswordExpiresAt = undefined
      await user.save()
      throw e
    }
  }

  r.json({
    message: 'If an account exists for this email, a reset link has been sent.'
  })
}))

// ---------- Reset Password ----------

app.post('/api/auth/reset-password', limit(10), wrap(async (q, r) => {
  const token = String(q.body?.token || '')
  const password = String(q.body?.password || '')

  if (password.length < 8) {
    return r.status(400).json({
      error: 'Password must be at least 8 characters long.'
    })
  }

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return r.status(400).json({
      error: 'This reset link is invalid or expired. Please request a new one.'
    })
  }

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() }
  })

  if (!user) {
    return r.status(400).json({
      error: 'This reset link is invalid or expired. Please request a new one.'
    })
  }

  user.passwordHash = await bcrypt.hash(password, 10)

  user.resetPasswordTokenHash = undefined
  user.resetPasswordExpiresAt = undefined

  await user.save()

  r.json({
    message: 'Password reset successfully. You can now sign in.'
  })
}))

// ---------- Logout ----------

app.post('/api/auth/logout', (q, r) => {
  r.clearCookie('session', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  })

  r.json({ ok: true })
})

// ---------- Authentication Middleware ----------

const auth = (...roles) => (q, r, n) => {
  try {
    const token = q.cookies?.session

    if (!token) {
      return r.status(401).json({ error: 'Unauthorized' })
    }

    const s = jwt.verify(token, SECRET)

    if (roles.length &&
        s.role !== 'ADMIN' &&
        !roles.includes(s.role)) {
      return r.status(403).json({ error: 'Forbidden' })
    }

    q.user = s
    n()

  } catch (e) {
    return r.status(401).json({ error: 'Unauthorized' })
  }
}

// ---------- Check Logged-in User ----------

app.get('/api/auth/me', auth(), (q, r) => {
  r.json(q.user)
})

// ---------- Admin / CMS ----------
const log = (q, action, id) => Audit.create({ userEmail: q.user.email, action, entity: q.params.model || 'settings', entityId: String(id || '') })
const pick = (b, f) => Object.fromEntries(f.filter(k => k in b).map(k => [k, b[k]]))
const seoF = ['seoTitle', 'seoDescription', 'image', 'published']
const M = {
  program: { m: Program, roles: ['EDITOR'], sort: '-updatedAt', slug: 1, f: ['slug', 'title', 'level', 'summary', 'eligibility', 'curriculum', 'fees', ...seoF] },
  post: { m: Post, roles: ['EDITOR'], sort: '-createdAt', slug: 1, f: ['slug', 'title', 'type', 'excerpt', 'body', ...seoF] },
  faculty: { m: Faculty, roles: ['EDITOR'], sort: 'name', f: ['name', 'designation', 'bio', 'image', 'published'] },
  enquiry: { m: Enquiry, roles: ['ADMISSIONS'], sort: '-createdAt', f: ['status', 'notes'], noCreate: 1 },
  user: { m: User, roles: ['ADMIN'], sort: 'email', f: ['email', 'name', 'role'] },
}
app.get('/api/admin/audit', auth('ADMIN'), wrap(async (_, r) => r.json(await Audit.find().sort('-createdAt').limit(200).lean())))
app.get('/api/admin/settings', auth('EDITOR'), wrap(async (_, r) => r.json((await Setting.findOne({ key: 'site' }).lean()) || {})))
app.put('/api/admin/settings', auth('EDITOR'), wrap(async (q, r) => { await Setting.findOneAndUpdate({ key: 'site' }, pick(q.body, ['announcement', 'phone', 'email', 'address', 'about']), { upsert: true }); await log(q, 'update', 'site'); r.json({ ok: true }) }))
const up = multer({ limits: { fileSize: 5e6 }, fileFilter: (q, f, cb) => cb(null, /^image\/(png|jpe?g|webp|gif)$/.test(f.mimetype)),
  storage: multer.diskStorage({ destination: UP, filename: (q, f, cb) => cb(null, crypto.randomBytes(8).toString('hex') + path.extname(f.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '')) }) })
app.post('/api/admin/upload', auth('EDITOR'), up.single('file'), (q, r) => q.file ? r.json({ url: '/uploads/' + q.file.filename }) : r.status(400).json({ error: 'Image only (png/jpg/webp/gif, max 5MB)' }))

const mdl = (q, r, n) => { const c = M[q.params.model]; if (!c) return r.status(404).json({ error: 'Not found' }); q.c = c; auth(...c.roles)(q, r, n) }
const prep = async (q, create) => {
  const b = q.body || {}, d = pick(b, q.c.f)
  if (q.c.slug && (create || 'slug' in b)) d.slug = slugify(b.slug || b.title)
  if (q.params.model === 'user' && b.password) d.passwordHash = await bcrypt.hash(String(b.password), 10)
  return d
}
app.get('/api/admin/:model', mdl, wrap(async (q, r) => r.json(await q.c.m.find().sort(q.c.sort).select('-passwordHash').lean())))
app.post('/api/admin/:model', mdl, wrap(async (q, r) => { if (q.c.noCreate) return r.status(405).end(); const d = await q.c.m.create(await prep(q, true)); await log(q, 'create', d._id); r.json({ ok: true }) }))
app.put('/api/admin/:model/:id', mdl, wrap(async (q, r) => { await q.c.m.findByIdAndUpdate(q.params.id, await prep(q)); await log(q, 'update', q.params.id); r.json({ ok: true }) }))
app.delete('/api/admin/:model/:id', mdl, wrap(async (q, r) => {
  if (q.c.noCreate || q.params.id === q.user.id) return r.status(400).json({ error: 'Not allowed' })
  await q.c.m.findByIdAndDelete(q.params.id); await log(q, 'delete', q.params.id); r.json({ ok: true })
}))

// ---------- SEO + serve React build ----------
app.get('/robots.txt', (q, r) => r.type('text').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: ${SITE}/sitemap.xml`))
app.get('/sitemap.xml', wrap(async (_, r) => {
  const [p, n] = await Promise.all([Program.find({ published: true }).lean(), Post.find({ published: true }).lean()])
  const u = (l, d) => `<url><loc>${SITE}${l}</loc>${d ? `<lastmod>${new Date(d).toISOString()}</lastmod>` : ''}</url>`
  r.type('xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/programs', '/admissions', '/news', '/about', '/contact'].map(x => u(x)).join('')}${p.map(x => u('/programs/' + x.slug, x.updatedAt)).join('')}${n.map(x => u('/news/' + x.slug, x.updatedAt)).join('')}</urlset>`)
}))


if (fs.existsSync(DIST)) {
  app.use(express.static(DIST, { index: false }))
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const meta = (t, d, u) => `<title>${esc(t)} | Lahore Law College</title><meta name="description" content="${esc(d)}"/><link rel="canonical" href="${SITE}${u}"/><meta property="og:title" content="${esc(t)}"/><meta property="og:description" content="${esc(d)}"/>`
  app.get('*', wrap(async (q, r) => {
    let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8'), m = '', x
    if ((x = q.path.match(/^\/programs\/([^/]+)$/))) { const d = await Program.findOne({ slug: x[1], published: true }).lean(); if (d) m = meta(d.seoTitle || d.title, d.seoDescription || d.summary, q.path) }
    else if ((x = q.path.match(/^\/news\/([^/]+)$/))) { const PostModel = Post; const d = await PostModel.findOne({ slug: x[1], published: true }).lean(); if (d) m = meta(d.seoTitle || d.title, d.seoDescription || d.excerpt, q.path) }
    if (m) html = html.replace(/<title>.*?<\/title>/, '').replace(/<meta name="description"[^>]*>/, '')
    r.send(html.replace('<!--META-->', m))
  }))
}

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000, family: 4 })
  console.log('MongoDB connected')
} catch (e) {
  console.error('MongoDB connection failed:', e.message)
  process.exit(1)
}

app.listen(process.env.PORT || 5000, () => console.log('Server running on port', process.env.PORT || 5000))