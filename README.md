# The Comfort Trip — Car Rental Platform

A modern, SEO-optimized car rental & cab/tempo booking platform for Comfort Trip (Rajkot), built with Next.js. Includes a public marketing site, a customer booking dashboard, and an admin panel for managing cars, content, bookings, and (in the future) drivers.

> **Status:** Pre-development / architecture & planning phase. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full system design and open decisions awaiting client sign-off.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components by default) |
| Language | JavaScript (`.jsx`) |
| Styling | Tailwind CSS, using only the CSS variables defined in `globals.css` (no ad hoc colors) |
| Database | MongoDB Atlas + Mongoose |
| Validation | Zod (client + server) |
| Auth | Auth.js v5 — Credentials + Google OAuth, single login form for users & admins, RBAC |
| Media | Cloudinary (car images, profile photos, driver photos) |
| Email | SMTP (verification, password reset, booking status, reminders) |
| Hosting | Vercel |
| Scheduled jobs | Vercel Cron (booking reminders) |

## Project Principles

- **Server Components by default.** `"use client"` is only added on interactive leaf components — never on `app/` route files.
- **Single auth pipeline** for users and admins; role determines access, not a separate login route.
- **Authorization is enforced in a Data Access Layer**, not in `middleware.js` alone (see `ARCHITECTURE.md` §2 for why).
- **All styling uses `globals.css` theme variables** — no hardcoded hex colors in components.
- **Naming conventions, file structure, and coding standards** are documented in [`DEVELOPMENT_GUIDELINES.md`](./DEVELOPMENT_GUIDELINES.md).
- **AI coding agents working in this repo** (Claude Code, Cursor, Copilot Workspace, etc.) must follow [`AGENTS.md`](./AGENTS.md) — it is the binding contract for how automated changes are made, reviewed, and approved.

## Getting Started

> Setup instructions will be finalized once the folder structure and Phase 1 scope are approved. Placeholder for reference:

```bash
# clone
git clone <repo-url>
cd comfort-trip-car-rental

# install
npm install

# configure environment
cp .env.example .env.local
# fill in: MONGODB_URI, AUTH_SECRET, GOOGLE_CLIENT_ID/SECRET,
# CLOUDINARY_*, SMTP_*, CRON_SECRET

# run dev server
npm run dev
```

## Environment Variables Configuration

To run the application, configure your `.env.local` using the following groupings:

### 1. Hard Requirements (Must be set to boot the app)
- `MONGODB_URI`: MongoDB connection string (Atlas or Local).
- `AUTH_SECRET`: Secret key used for signing session tokens and encryption. Generate using `openssl rand -hex 32` or `npx auth secret`.

### 2. Deferred Requirements (Needed only for specific features)
- **Google OAuth Login**:
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Client keys from Google Cloud Console. Optional if using only credentials/email sign-up.
- **Image Uploads (Admin Cars CRUD / Profile Avatars)**:
  - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`: Cloudinary service credentials.
- **Transactional Emails (Verification & Booking Reminders)**:
  - `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM`: SMTP credentials (e.g., Resend). If missing, emails are logged to the console (Mail Sandbox) in development.
- **Scheduled Notifications Cron Endpoint**:
  - `CRON_SECRET`: Secret header key protecting `/api/cron/booking-reminders` from unauthorized public invocation.
- **SEO Optimization**:
  - `NEXT_PUBLIC_SITE_URL`: Base canonical site URL (e.g., `https://comforttrip.com` or default `http://localhost:3000`).

## Documentation Index

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system architecture, data model, auth/authorization design, future scope
- [`AGENTS.md`](./AGENTS.md) — rules for AI coding agents contributing to this repo
- [`DEVELOPMENT_GUIDELINES.md`](./DEVELOPMENT_GUIDELINES.md) — naming conventions, folder structure, git workflow, testing standards, security checklist

## Development Process

This project is built **phase by phase, with explicit client approval before each phase begins**. No folder structure, schema, or module is implemented without prior discussion and sign-off. See `AGENTS.md` §1 for how this constraint is enforced for AI-assisted development specifically.

## License

Proprietary — all rights reserved by the client (Comfort Trip Car Rental).
