# The Comfort Trip — Enterprise Car Rental & Chauffeur Platform

[![Node.js CI](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black.svg)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen.svg)](https://www.mongodb.com/atlas)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary%20v2-blue.svg)](https://cloudinary.com/)
[![License](https://img.shields.io/badge/License-Proprietary-purple.svg)]()

A high-performance, enterprise-grade car rental and chauffeur dispatch platform designed for **Comfort Trip Car Rentals (Rajkot, Gujarat)**. Featuring end-to-end customer booking flows, real-time telemetry analytics, multi-tier RBAC administrative governance, Cloudinary asset pipelines, and automated transactional email dispatch.

---

## Architecture Overview

```
                      +---------------------------------------+
                      |       Next.js 16 Edge Proxy           |
                      |   (proxy.js & NextAuth Middleware)    |
                      +-------------------+-------------------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
      [Consumer Web App]                                    [Admin Control Desk]
  +-------------------------+                           +-------------------------+
  | - Instant Booking Flow  |                           | - Real-time Telemetry   |
  | - 30-min Draft Memory   |                           | - 6-Mo Revenue Analytics|
  | - Points Wallet Ledger  |                           | - Category Demand Donut |
  | - PDF Invoices & Reviews|                           | - Super Admin Governance|
  +------------+------------+                           +------------+------------+
               |                                                     |
               +--------------------------+--------------------------+
                                          |
                        +-----------------+-----------------+
                        |       REST API Route Handlers     |
                        |      (Controllers & Services)     |
                        +--------+--------+--------+--------+
                                 |        |        |
             +-------------------+        |        +-------------------+
             |                            |                            |
  +----------v----------+      +----------v----------+      +----------v----------+
  |    MongoDB Atlas    |      |  Cloudinary Storage |      |  SMTP Mail Service  |
  | (Mongoose Schemas & |      | (comfort-trip/cars) |      | (Dynamic Domain URI |
  | Live Aggregations)  |      | Streamed Uploads    |      | Invoices & Alerts)  |
  +---------------------+      +---------------------+      +---------------------+
```

---

## Key Enterprise Capabilities (Phase 7.9)

### 1. Multi-Tier RBAC & Super-Admin Provisioning (`/admin/admins`)
- **Role Hierarchy**: Strict separation of capabilities across `user`, `admin` (Operations), and `super-admin` (Executive Governance).
- **Cryptographic Security Checkpoint**: Creation of new administrative profiles requires mandatory super-admin password verification (`bcrypt.compare`) against the calling administrator's hashed credentials.
- **Edge Route Protection**: Direct URL tampering to `/admin/admins` is blocked at the proxy edge and redirected to `/admin`.

### 2. Live Dynamic Telemetry & Revenue Analytics
- **Continuous 6-Month Aggregation**: The Admin Overview charts live gross revenue across the trailing 6 calendar months using native MongoDB `$match` and `$group` aggregations.
- **Real-Time Fleet Demand Donut**: Dynamic SVG donut visualizer renders the live booking distribution across categories (Sedan, SUV, Tempo Traveller, Luxury).
- **Chauffeur Pulse & Radar**: Real-time status cards displaying available, on-trip, and verified driver allocations with 3D elevated card depth.

### 3. Cloudinary Fleet Media Pipeline
- **Streaming Image Ingestion**: Direct multipart form-data upload via `POST /api/admin/upload` converting buffers directly to Cloudinary (`comfort-trip/cars`).
- **Live Preview & Fallbacks**: Admin fleet manager features drag-and-drop file upload, live thumbnail previews, replacement controls, and external URL fallback support.
- **Strict Validation**: Enforces 5MB file size limits and validates MIME types (`image/jpeg`, `image/png`, `image/webp`, `image/avif`).

### 4. 30-Minute Form State Resilience (`useFormDraft`)
- **Fault-Tolerant Input Recovery**: Client booking wizards and admin fleet modals automatically persist drafts in `localStorage` with a 30-minute time-to-live (TTL).
- **Smart Cleanup**: Drafts are automatically purged on explicit form cancellation, `(X)` close buttons, or successful submission.

### 5. Dynamic Reward Points & Wallet Ledger
- **Automatic Point Minting**: Base 100 points welcome bonus upon registration, 1 point per ₹100 of completed ride fare, and +5 points per verified ride review.
- **Interactive Customer Ledger**: Customer profile (`/profile`) displays real-time point balances alongside an itemized transaction ledger.

### 6. Session Persistence & Security
- **30-Day "Remember Me"**: Extensible NextAuth session lifetime configured via dynamic JWT token cookies.
- **Glassmorphic Logout Modal**: Dual confirmation modal prevents accidental sign-out across both consumer header and admin sidebar navigation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, React 19) |
| **Language** | Modern JavaScript (ES Modules, JSX) |
| **Styling** | Tailwind CSS + Custom 3D Floating Glassmorphism System |
| **Database** | MongoDB Atlas with Mongoose ODM |
| **Authentication** | NextAuth.js (Credentials Provider + Google OAuth) |
| **Media Hosting** | Cloudinary v2 SDK (`comfort-trip/cars`) |
| **Email Dispatch** | Nodemailer with Dynamic Domain Routing (`thecomforttrip.com`) |
| **Testing** | Node.js Test Runner & Custom Integration Suites |

---

## Core API Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/cars` | Public / Admin | Fetch fleet catalog with category & status filters |
| `POST` | `/api/cars` | Admin | Create a new fleet vehicle entry |
| `PATCH` | `/api/cars/[id]` | Admin | Update vehicle specifications or pricing |
| `POST` | `/api/admin/upload` | Admin | Upload vehicle asset directly to Cloudinary |
| `GET` | `/api/admin/stats` | Admin | Live telemetry, 6-mo revenue, and demand aggregations |
| `GET` | `/api/admin/staff` | Super-Admin | List all administrative and super-admin accounts |
| `POST` | `/api/admin/staff` | Super-Admin | Provision new admin with password challenge verification |
| `GET` | `/api/bookings` | User / Admin | Retrieve bookings (scoped by role) |
| `POST` | `/api/bookings` | User | Place new cab/tempo booking request |
| `PATCH` | `/api/bookings/[id]` | Admin | Update trip status, driver assignment, or billing |
| `POST` | `/api/reviews` | User | Post trip review and claim reward points |

---

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas Database URI
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/comfort-trip-data

# NextAuth Authentication Secrets
AUTH_SECRET=your_32_character_hex_secret
NEXTAUTH_SECRET=your_32_character_hex_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Credentials (Optional for social login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Media Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Transactional Email Configuration
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=support@thecomforttrip.com
ADMIN_NOTIFICATION_EMAIL=admin@thecomforttrip.com

# Production Domain Path for Dynamic Email Links
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Local Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Execute automated test suite
npm test

# 4. Verify code quality and styling standards
npm run lint
```

---

## License

Proprietary — All rights reserved by **Comfort Trip Car Rentals (Rajkot, Gujarat)**.
