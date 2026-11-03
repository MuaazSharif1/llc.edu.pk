import mongoose from 'mongoose'
const { Schema, model } = mongoose
const T = { timestamps: true }
const str = { type: String, default: '' }
export const User = model('User', new Schema({ email: { type: String, unique: true, lowercase: true, trim: true }, name: str, passwordHash: String, resetPasswordTokenHash: String, resetPasswordExpiresAt: Date, role: { type: String, enum: ['ADMIN', 'EDITOR', 'ADMISSIONS'], default: 'EDITOR' } }, T))
const seo = { seoTitle: str, seoDescription: str, image: str, published: { type: Boolean, default: false } }
export const Program = model('Program', new Schema({ slug: { type: String, unique: true }, title: String, level: { type: String, default: 'undergrad' }, summary: str, eligibility: str, curriculum: str, fees: str, ...seo }, T))
export const Post = model('Post', new Schema({ slug: { type: String, unique: true }, title: String, type: { type: String, enum: ['NEWS', 'EVENT', 'NOTICE'], default: 'NEWS' }, excerpt: str, body: str, ...seo }, T))
export const Faculty = model('Faculty', new Schema({ name: String, designation: str, bio: str, image: str, published: { type: Boolean, default: false } }, T))
export const Enquiry = model('Enquiry', new Schema({ ref: { type: String, unique: true }, name: String, email: String, phone: str, program: String, message: str, status: { type: String, enum: ['NEW', 'CONTACTED', 'CLOSED'], default: 'NEW' }, notes: str }, T))
export const Setting = model('Setting', new Schema({ key: { type: String, default: 'site', unique: true }, announcement: str, phone: str, email: str, address: str, about: str }))
export const Audit = model('Audit', new Schema({ userEmail: String, action: String, entity: String, entityId: str }, T))
