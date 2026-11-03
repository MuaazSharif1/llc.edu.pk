import './dns-fix.js'
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User, Program, Post, Faculty, Setting } from './models.js'
await mongoose.connect(process.env.MONGODB_URI)
const email = (process.env.SEED_ADMIN_EMAIL || 'admin@example.com').toLowerCase()
if (!(await User.findOne({ email }))) await User.create({ email, name: 'Administrator', role: 'ADMIN', passwordHash: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!', 10) })
// PLACEHOLDER content: replace from the admin panel after verifying with the college
if (!(await Program.countDocuments())) await Program.insertMany([
  ['ll-b-5-year', 'LL.B (5-Year)', 'undergrad', 'Foundation in law after intermediate with moot court and internships.'],
  ['ll-b-3-year', 'LL.B (3-Year)', 'undergrad', 'Professional law degree for graduates.'],
  ['ll-m', 'LL.M', 'postgrad', 'Advanced study with a research focus.'],
  ['diploma-legal-studies', 'Diploma in Legal Studies', 'short', 'Short professional course.']].map(([slug, title, level, summary]) => ({ slug, title, level, summary, published: true })))
if (!(await Post.countDocuments())) await Post.create({ slug: 'admissions-open', title: 'Admissions open for the new session', excerpt: 'Placeholder - verify before publishing.', body: 'Placeholder content.', published: true })
if (!(await Faculty.countDocuments())) await Faculty.create({ name: 'Faculty Member', designation: 'Designation', published: true })
await Setting.findOneAndUpdate({ key: 'site' }, { $setOnInsert: { announcement: 'Admissions open · Enquire today', phone: '', email: '', address: 'Lahore, Pakistan', about: 'Lahore Law College provides practice-oriented legal education.' } }, { upsert: true })
console.log('Seed done. Admin:', email); process.exit(0)
