import './dns-fix.js'
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from './models.js'

// Use: node src/resetAdmin.js admin@example.com "NewPassword123"
const [, , emailArg, passwordArg] = process.argv

if (!emailArg || !passwordArg) {
  console.log('Usage: node src/resetAdmin.js <email> "<password>"')
  process.exit(1)
}
if (passwordArg.length < 8) {
  console.log('Password kam az kam 8 characters ka rakhen.')
  process.exit(1)
}

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000, family: 4 })

  const existing = await User.find().select('email role').lean()
  console.log('Maujooda users:', existing.length ? existing.map(u => `${u.email} (${u.role})`).join(', ') : 'koi nahi')

  const email = emailArg.toLowerCase().trim()
  const passwordHash = await bcrypt.hash(String(passwordArg), 10)

  // Sirf is email ka user update/create hota hai. Baqi data ko haath nahi lagta.
  await User.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, role: 'ADMIN' }, $setOnInsert: { name: 'Admin' } },
    { upsert: true }
  )

  console.log(`Done. Ab is email se login karen: ${email}`)
} catch (e) {
  console.error('Error:', e.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}