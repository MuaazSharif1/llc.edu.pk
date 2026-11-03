# Lahore Law College - MERN (React + Node/Express + MongoDB)

## 1. Requirements
Node.js 18+, a MongoDB database (free: MongoDB Atlas -> create cluster -> Database Access user -> Network Access allow your IP / 0.0.0.0/0 -> Connect -> Drivers -> copy URI).

## 2. Setup
```
cd server
copy .env.example .env      (Windows)   # then edit .env: MONGODB_URI, JWT_SECRET, SEED_ADMIN_*
npm install
npm run seed                 # creates admin user + sample content
cd ../client
npm install
```
## 3. Run (2 terminals)
- Terminal 1: `cd server && npm run dev`   (API on :5000)
- Terminal 2: `cd client && npm run dev`   (site on http://localhost:5173, admin at /admin)

## 4. Deploy (one service, e.g. Render/Railway/VPS)
Build: `npm run build` (root) | Start: `npm start` | Set env vars from server/.env.example (SITE_URL = your domain, NODE_ENV=production).
Express serves the React build, sitemap.xml, robots.txt and injects SEO meta tags for program/news pages.
NOTE: uploaded images are stored in server/uploads - use a persistent disk (or move to S3/Cloudinary) on hosts with ephemeral storage.

## 5. Handover checklist
Change admin password | replace placeholder content in /admin | add logo/photos | set phone/email/address in Site settings | connect SMTP | add domain + HTTPS | submit sitemap to Google Search Console.
Roles: ADMIN (everything + users + activity log), EDITOR (content, settings), ADMISSIONS (enquiries).
