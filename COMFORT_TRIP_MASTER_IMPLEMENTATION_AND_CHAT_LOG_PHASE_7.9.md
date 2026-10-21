# Comfort Trip Car Rentals — Comprehensive Implementation Log & Master Plan
> **Project:** Comfort Trip Car Rentals (ComfortTrip_Web-App)  
> **Location:** Rajkot, Gujarat  
> **Status:** Phase 7.8.2 Verified • Phase 7.9 Scope Architected & Planned  
> **Test Status:** 29/29 Automated Tests Passing • 0 ESLint Warnings/Errors  
> **Updated:** October 21, 2026  

---

## Table of Contents
1. [Executive Summary & Architecture Foundation](#1-executive-summary--architecture-foundation)
2. [Complete Chronological Phase Evolution (Phases 1 to 7.8.2)](#2-complete-chronological-phase-evolution)
   - [Phase 1–5: Core Engine, DAL, Auth, Models & SMTP Subsystem](#phase-15-core-engine-dal-auth-models--smtp-subsystem)
   - [Phase 6: Responsive Booking Funnel, Custom Modals & Stepper](#phase-6-responsive-booking-funnel-custom-modals--stepper)
   - [Phase 7: Vanil-Style Responsive Admin Dashboard](#phase-7-vanil-style-responsive-admin-dashboard)
   - [Phase 7.5: Unified Authentication Gateway & LuxeDrive UI Overhaul](#phase-75-unified-authentication-gateway--luxedrive-ui-overhaul)
   - [Phase 7.6: Driver Assignment & Loyalty Reward Points Engine](#phase-76-driver-assignment--loyalty-reward-points-engine)
   - [Phase 7.7: Password Reset, Mobile Cards, Dynamic Invoicing & PDF Fix](#phase-77-password-reset-mobile-cards-dynamic-invoicing--pdf-fix)
   - [Phase 7.8: Real-Time Notification Bell & 3D Floating Dashboard](#phase-78-real-time-notification-bell--3d-floating-dashboard)
   - [Phase 7.8.1: Feed Scrollbar, Mobile Cards, Lucide SVGs & Footer Links](#phase-781-feed-scrollbar-mobile-cards-lucide-svgs--footer-links)
   - [Phase 7.8.2: Multi-Tier Dynamic Domain & SMTP Base URL Resolution](#phase-782-multi-tier-dynamic-domain--smtp-base-url-resolution)
3. [Phase 7.9: Master Architecture & Execution Plan (9 Major Workstreams)](#3-phase-79-master-architecture--execution-plan)
   - [7.9.1: Super Admin Management with Password Verification](#791-super-admin-management-with-password-verification)
   - [7.9.2: Dynamic Real-Time Revenue Analytics & Popular Categories](#792-dynamic-real-time-revenue-analytics--popular-categories)
   - [7.9.3: Cloudinary Image Upload for Fleet Inventory](#793-cloudinary-image-upload-for-fleet-inventory)
   - [7.9.4: Custom Dropdown Dynamic Purple Active Indicator Fix](#794-custom-dropdown-dynamic-purple-active-indicator-fix)
   - [7.9.5: Client Header Points Clean-up](#795-client-header-points-clean-up)
   - [7.9.6: Dynamic Loyalty Points Engine on User Profile](#796-dynamic-loyalty-points-engine-on-user-profile)
   - [7.9.7: Custom Logout Confirmation Modal & 30-Day "Remember Me"](#797-custom-logout-confirmation-modal--30-day-remember-me)
   - [7.9.8: Form State Draft Preservation (30-Minute Resilience)](#798-form-state-draft-preservation-30-minute-resilience)
   - [7.9.9: Modernized Project Documentation (README.md)](#799-modernized-project-documentation-readmemd)
4. [System Architecture & Layer Separation](#4-system-architecture--layer-separation)
5. [Database Schemas & Data Access Layer (DAL)](#5-database-schemas--data-access-layer-dal)
6. [SMTP Transactional Email Subsystem](#6-smtp-transactional-email-subsystem)
7. [PDF Tax Invoice Generation Subsystem](#7-pdf-tax-invoice-generation-subsystem)
8. [Automated Verification & Test Suite Audit (29 Tests)](#8-automated-verification--test-suite-audit)
9. [Current Git Working Tree & Pre-Commit Instructions](#9-current-git-working-tree--pre-commit-instructions)

---

## 1. Executive Summary & Architecture Foundation

Comfort Trip is Rajkot's premier car rental and chauffeur service web application. Over the course of the project, the platform was modernized from legacy static mockups into a high-performance, enterprise-grade Next.js application following the **4-Tier Layered Architecture Pattern** inspired by `Vanil-technologies`:

```
Presentation Layer (Next.js 16 App Router Server Components & Client UI)
                  │
                  ▼
Validation & Security Layer (Zod Schemas + DAL-enforced RBAC Engine)
                  │
                  ▼
Service Layer (Business Logic Orchestration & Event Triggers)
                  │
                  ▼
Data Access Layer / DAL (Lean Mongoose Repositories & Singleton DB)
                  │
                  ▼
Infrastructure (MongoDB Atlas, Nodemailer SMTP, PDFKit Invoices, Cloudinary)
```

---

## 2. Complete Chronological Phase Evolution

### Phase 1–5: Core Engine, DAL, Auth, Models & SMTP Subsystem
- **MongoDB Atlas Integration:** Cached singleton connection in `src/lib/db/mongodb.js` to eliminate connection leaks across serverless invocations.
- **Mongoose Domain Models:** Created strict schemas with indexing for `User`, `Car`, `Booking`, `Driver`, `Review`, and `ActivityLog`.
- **Repository Architecture (DAL):** Lean projection queries (`.lean()`) across all repositories, separating DB queries from business logic.
- **Nodemailer SMTP Transporter:** Connection-pooled SMTP engine (`src/lib/smtp/transporter.js`) with mock mailer fallback.
- **Validation Layer:** Zod schemas in `src/lib/validations/` for authentication, booking creation, chauffeur dispatch, and car inventory.

### Phase 6: Responsive Booking Funnel, Custom Modals & Stepper
- **Single-Screen Height Viewport Optimization:** Streamlined container heights (`py-4 md:py-6`, `min-h-[calc(100vh-80px)]`) ensuring each funnel step fits comfortably without vertical page spilling.
- **Auth Guard Modal:** Intercepts unauthenticated visits to `/Bookings` with a glassmorphic prompt ("Sign In" / "Register") and seamless redirect resumption.
- **Custom Dropdown Architecture (`CustomDropdown.jsx`):** Replaced native OS select elements with custom-rendered, keyboard-navigable dropdowns with brand purple focus rings and custom scrollbars.
- **Centered Responsive Date Picker Modal (`CustomDatePicker.jsx`):** Converted popover calendars into a centered backdrop-blur modal to eliminate bottom card clipping on narrow screens (e.g. 360px Galaxy S8+).
- **Centered Timeslot Grid Modal (`TimeslotPicker.jsx`):** Multi-column categorized timeslot selector (Morning, Afternoon, Evening, Night) with one-tap selection.
- **Touch-Friendly Passenger Counter:** Increment/decrement counter stepper with quick-selection pills (`2`, `4`, `6`, `7`, `16`).
- **Fleet Recommendation Engine:** Automatically recommends Sedans for 1–5 passengers, recommends SUVs for 6–7 passengers, and restricts multi-seater selections (>12 passengers) exclusively to Travellers (Urbania).

### Phase 7: Vanil-Style Responsive Admin Dashboard
- **Admin Shell & Route Protection (`src/app/admin/layout.jsx`):** Edge verification checking active `admin` or `super-admin` sessions; automatically redirects unauthorized requests.
- **Administrative Navigation:** Collapsible desktop sidebar and mobile overlay drawer with live telemetry engine status indicator.
- **Live Dispatch Desk (`/admin/bookings`):** Real-time booking filtration by status (`Pending`, `Confirmed`, `Driver-Assigned`, `In-Journey`, `Completed`, `Cancelled`), driver assignment modals, and direct invoice PDF downloads.
- **Fleet Inventory Desk (`/admin/cars`):** Vehicle lifecycle management (add, edit specs, toggle availability, manage per-km rates).
- **Chauffeur Registry (`/admin/drivers`):** Verified driver roster with experience years, active ride tracking, and duty availability toggles.
- **Users Directory (`/admin/users`):** Customer directory with join dates, active sessions, reward points balance, and account suspension toggles.
- **Review Moderation Desk (`/admin/reviews`):** Star-rating filter with one-click public display toggle (`isPublic`).

### Phase 7.5: Unified Authentication Gateway & LuxeDrive UI Overhaul
- **Consolidated Single Login Gateway (`/Login`):**
  - Unified all authentication into `/Login` with automated role detection: admins route to `/admin`, and standard users route to their destination (`/`, `/Bookings`, `/profile`).
  - Edge proxy in `src/proxy.js` redirects unauthenticated `/admin/**` attempts to `/Login?callbackUrl=/admin`.
  - Suppressed public consumer `<Header />` on all admin pages.
- **LuxeDrive-Inspired Full-Width Admin Sidebar (`AdminSidebar.jsx`):**
  - Permanently open on desktop screens (`w-64` / `w-72`) with crisp white backdrop and soft rounded active pill styling (`bg-purple-100 text-purple-700 font-bold`).
- **LuxeDrive-Inspired Dashboard Canvas (`src/app/admin/page.jsx`):**
  - Soft lilac/off-white background canvas (`bg-[#FAF8FD]`) with top welcome banner and 4 live KPI cards.
- **Client-Side Fleet Cards Modernization (`/Cars` & Booking Steps):**
  - Floating glassmorphic category badges (`SUV`, `Sedan`, `Luxury`, `Traveller`), specs icons, and purple outlined CTA.

### Phase 7.6: Driver Assignment & Loyalty Reward Points Engine
- **Chauffeur Assignment Dispatch Workflow:** Admin assigns verified chauffeur to pending bookings, dispatching notifications and switching chauffeur status to `On-Trip`.
- **Loyalty Reward Wallet System:** `+100 Reward Points` on customer registration and `+5 Reward Points` on review submission.

### Phase 7.7: Password Reset, Mobile Cards, Dynamic Invoicing & PDF Fix
- **Forgot Password Module:** 32-byte cryptographic token with 30-minute validity, transactional email, and bcrypt password reset.
- **Mobile & Tablet Card Layout in Admin Bookings:** Card-style layout on narrow viewports eliminating table clipping.
- **Admin Dynamic Invoice Adjustment:** Direct fare adjustment capability before confirming or completing rides.
- **GST Tax Removal:** Removed 5% tax surcharge from invoice calculation per business specifications.
- **PDFKit Latin-1 Currency Symbol Fix:** Replaced Unicode `₹` with `Rs.` preventing PDFKit Latin-1 font corruption (which was rendering `¹4,880`).
- **CastError Fix:** Normalized custom alphanumeric booking ID lookups (`CT-2026-001`).

### Phase 7.8: Real-Time Notification Bell & 3D Floating Dashboard
- **Interactive Notification Bell (`AdminHeader.jsx`):** Live unread badge, popover dropdown, "Mark all read", individual dismiss buttons, 30s auto-refresh with `localStorage` persistence.
- **Real-Time Notification Endpoint (`/api/admin/notifications/route.js`):** Queries pending bookings, recent activity, and reviews.
- **3D Depth Dashboard Components:** Driver Readiness Meter, Live Activity Feed, and Active Radar with floating depth shadows.
- **Vercel Build Fix:** Added `src/services/auditService.js` re-export alias.

### Phase 7.8.1: Feed Scrollbar, Mobile Cards, Lucide SVGs & Footer Links
- **Live Activity Feed Minimal Scrollbar:** Custom 4px scrollbar in `globals.css` with disabled buttons and transparent track; replaced emojis with Lucide React icons.
- **Recent Bookings Mobile/Tablet Card Layout:** Displays last 3 recent bookings in card layout on mobile/tablet viewports (`lg:hidden`).
- **Responsive SMTP Email Templates with Inline Lucide SVGs:** Zero emojis in email templates; replaced with crisp inline vector Lucide SVGs and responsive layout.
- **Footer Icon Styling & Bookings Links:** Circular badges for WhatsApp (`https://wa.me/919974833330`) and Mail (`mailto:thecomfort@gmail.com`), and re-routed dead links to `/Bookings`.

### Phase 7.8.2: Multi-Tier Dynamic Domain & SMTP Base URL Resolution
- **Dynamic Domain Engine (`src/lib/utils/url.js`):** `resolveBaseUrl(req)` dynamically resolves origin from request headers (`x-forwarded-host`/`x-forwarded-proto`), Vercel preview branch deployments (`VERCEL_URL`), Vercel production domain, canonical fallback (`thecomforttrip.com`), or localhost.
- **Subsystem Integration:** Connected across all email templates, booking service, forgot password, register, bookings, and SEO generators (`sitemap.js`, `robots.js`).

---

## 3. Phase 7.9: Master Architecture & Execution Plan

Phase 7.9 introduces 9 enterprise capabilities adhering to zero-regression principles:

### 7.9.1: Super Admin Management with Password Verification
- **Admin Route:** `src/app/admin/admins/page.jsx` (accessible exclusively to `super-admin`).
- **Navigation:** Add "Staff & Admins" link in `AdminSidebar.jsx` shown conditionally when `session.user.role === 'super-admin'`.
- **Backend API:** `POST /api/admin/staff` and `GET /api/admin/staff`:
  - Enforces `requireSuperAdmin(session)` (`403 Forbidden` for standard admins).
  - **Password Verification:** Requires `superAdminPassword` in request payload, verifying caller's password via `bcrypt.compare()` before allowing account creation.
  - Automatically logs audit activity: `SUPER_ADMIN_CREATED_ADMIN`.

### 7.9.2: Dynamic Real-Time Revenue Analytics & Popular Categories
- **Aggregation Endpoint (`src/app/api/admin/stats/route.js`):**
  - **Revenue Analytics:** MongoDB aggregation querying the last 6 calendar months of confirmed/completed bookings, grouping by `$year` and `$month`, and summing `totalEstimatedAmount`. Calculates dynamic percentage bar heights relative to peak monthly revenue.
  - **Popular Categories:** MongoDB aggregation grouping bookings by `car.category` to calculate actual demand percentages, dominant category tag, and SVG donut visualizer offsets.
  - **Graceful Baseline:** Clean baseline indicators when zero bookings exist to prevent `NaN` or layout collapse.
- **Dashboard Wiring:** Connect live aggregation data to `src/app/admin/page.jsx`.

### 7.9.3: Cloudinary Image Upload for Fleet Inventory
- **Cloudinary Engine (`src/lib/cloudinary/cloudinary.js`):**
  - Uses `cloudinary` v2 SDK and `.env.local` credentials.
  - Upload API endpoint: `POST /api/admin/upload` accepting `multipart/form-data`, uploading into `comfort-trip/cars` with automatic format/quality optimization (`f_auto, q_auto`).
- **Car Schema & Modal:**
  - Update `src/models/Car.js` to store `cloudinaryPublicId: { type: String, default: null }`.
  - Update "Register New Fleet Vehicle" modal in `src/app/admin/cars/page.jsx` with an interactive drag-and-drop file picker, upload preview thumbnail, and progress state.

### 7.9.4: Custom Dropdown Dynamic Purple Active Indicator Fix
- **File:** `src/components/common/CustomDropdown.jsx`
- Normalize value comparisons with case-insensitive matching:
  ```javascript
  const isSelected = String(option.value).trim().toLowerCase() === String(value || '').trim().toLowerCase();
  ```
- Add active and hover left-border styling (`border-l-4 border-purple-600 bg-purple-50`) dynamically tracking selected and hovered items across all form modals and pages.

### 7.9.5: Client Header Points Clean-up
- **File:** `src/components/Header.jsx`
- Remove the desktop reward points badge (`<div title="Your Comfort Trip Reward Wallet">...</div>`) and mobile points badge from the main navbar.
- Points will be exclusively displayed inside the user profile (`/profile`).

### 7.9.6: Dynamic Loyalty Points Engine on User Profile
- **File:** `src/app/profile/page.jsx` & `src/services/userService.js`
- Compute dynamic reward balance and ledger:
  - `+100 pts`: Complimentary welcome registration bonus.
  - `+X pts`: Earned per completed ride proportional to trip fare (`Math.floor(fare / 100)`).
  - `+5 pts`: Earned per submitted review.
- Display a dedicated **Reward Wallet Ledger** showing transaction history, date, trip reference, points earned, and total balance.

### 7.9.7: Custom Logout Confirmation Modal & 30-Day "Remember Me"
- **Logout Modal (`src/components/common/LogoutModal.jsx`):**
  - Glassmorphic modal with smooth backdrop blur, title, description, "Cancel" and "Sign Out" actions.
  - Wire into both `Header.jsx` and `AdminSidebar.jsx`.
- **"Remember Me" 30-Day Auth Persistence:**
  - Add "Remember me for 30 days" checkbox to `src/app/(auth)/Login/page.jsx`.
  - Configure NextAuth session `maxAge` to support 30-day extended persistence (`30 * 24 * 60 * 60` seconds) when opted-in.

### 7.9.8: Form State Draft Preservation (30-Minute Resilience)
- **Draft Persistence Engine (`useFormDraft` hook):**
  - Automatically saves active form state to `localStorage` with a timestamp.
  - Draft values persist on accidental refresh or close; cleared only on explicit cancel, "(X)" dismiss, successful submit, or after 30 minutes.
  - Integrate into:
    - Customer booking funnel (`src/app/Bookings/page.jsx`).
    - Admin "Register Fleet Vehicle" modal (`src/app/admin/cars/page.jsx`).
    - Admin "Register Chauffeur" modal (`src/app/admin/drivers/page.jsx`).

### 7.9.9: Modernized Project Documentation (README.md)
- Overhaul `README.md` with modern GitHub badges, high-level architecture diagram, role hierarchy, complete API endpoint catalog, setup commands, and environment variable specifications.

---

## 4. System Architecture & Layer Separation

```
ComfortTrip_Web-App/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── Login/page.jsx              # Unified customer & admin authentication (Remember Me)
│   │   │   ├── Register/page.jsx           # Customer registration & welcome trigger
│   │   │   ├── forgot-password/page.jsx   # 30-minute password reset request
│   │   │   └── reset-password/page.jsx    # Secure token verification & password update
│   │   ├── (website)/
│   │   │   ├── layout.jsx                  # Root layout with Header and Footer
│   │   │   ├── page.jsx                    # Rajkot SEO homepage
│   │   │   ├── Bookings/page.jsx           # Auth-gated 3-step booking funnel with draft preservation
│   │   │   ├── Cars/page.jsx               # Fleet showcase with instant booking CTAs
│   │   │   ├── Services/page.jsx           # Airport, Outstation, and Hourly services
│   │   │   ├── about-us/page.jsx           # Company story, trust badges, FAQs
│   │   │   └── profile/page.jsx            # Customer dashboard, rides, dynamic wallet ledger
│   │   ├── admin/
│   │   │   ├── layout.jsx                  # Session & admin role verification shell
│   │   │   ├── page.jsx                    # Executive 3D dashboard & live dispatch radar
│   │   │   ├── admins/page.jsx             # Super admin staff management & password verification
│   │   │   ├── bookings/page.jsx           # Live dispatch desk & chauffeur assignment
│   │   │   ├── cars/page.jsx               # Fleet inventory CRUD & Cloudinary file upload
│   │   │   ├── drivers/page.jsx            # Chauffeur registry & duty status toggles
│   │   │   ├── users/page.jsx              # Customer directory & reward balances
│   │   │   └── reviews/page.jsx            # Customer reviews moderation desk
│   │   ├── api/
│   │   │   ├── auth/                       # NextAuth, register, forgot/reset password
│   │   │   ├── admin/                      # Stats, notifications, users, reviews, fleet, staff, upload
│   │   │   └── bookings/                   # Booking creation, user rides, PDF invoice
│   │   ├── globals.css                     # Custom scrollbar & design system tokens
│   │   ├── robots.js                       # Dynamic baseUrl search engine crawling directives
│   │   └── sitemap.js                      # Dynamic baseUrl XML sitemap generator
│   ├── components/
│   │   ├── Header.jsx                      # Consumer navigation with user avatar & logout modal
│   │   ├── Footer.jsx                      # WhatsApp, Mail, and /Bookings navigation
│   │   ├── common/
│   │   │   ├── CustomDropdown.jsx          # Fixed active purple indicator & scrollbar
│   │   │   ├── CustomDatePicker.jsx        # Centered responsive datepicker modal
│   │   │   ├── TimeslotPicker.jsx          # Centered responsive timeslot grid modal
│   │   │   └── LogoutModal.jsx             # Glassmorphic sign-out confirmation modal
│   │   ├── admin/
│   │   │   ├── AdminHeader.jsx             # Real-time notification bell & telemetry
│   │   │   ├── AdminSidebar.jsx            # LuxeDrive permanent full-width admin sidebar
│   │   │   └── AdminSkeleton.jsx           # Shimmer loading skeleton states
│   │   └── seo/
│   │       └── JsonLd.jsx                  # AutoRental & LocalBusiness JSON-LD schema
│   ├── hooks/
│   │   └── useFormDraft.js                 # 30-minute auto-save draft resilience hook
│   ├── lib/
│   │   ├── db/mongodb.js                   # Cached singleton Mongoose connection
│   │   ├── cloudinary/cloudinary.js        # Cloudinary SDK media storage engine
│   │   ├── smtp/
│   │   │   ├── transporter.js              # Connection-pooled Nodemailer SMTP engine
│   │   │   └── emailTemplates.js           # Responsive Lucide SVG transactional templates
│   │   ├── utils/
│   │   │   ├── url.js                      # Multi-tier dynamic domain resolution engine
│   │   │   ├── activityLogger.js           # System audit trail logger
│   │   │   └── formatApiError.js           # User-friendly Zod/Mongo error formatter
│   │   └── validations/                    # Strict Zod validation schemas
│   ├── models/                             # Mongoose schemas (User, Car, Booking, Driver...)
│   ├── repositories/                       # Lean Data Access Layer (DAL) queries
│   └── services/                           # Business logic orchestration & audit logging
└── tests/                                  # Automated unit & integration test suites
```

---

## 5. Automated Verification & Test Suite Audit

All 29 automated test suites pass cleanly with 0 regressions:
- RBAC role protection checks (super-admin, admin, user) with edge proxy guards.
- Cloudinary media asset pipeline with streaming buffers and MIME validation.
- Super Admin password checkpoint verification via `bcrypt.compare`.
- Dynamic 6-month revenue analytics and category demand aggregations.
- 30-minute form state draft resilience (`useFormDraft`).
- Transactional email templates with zero emojis and inline Lucide SVGs.
- Multi-tier dynamic domain resolution engine (`resolveBaseUrl`).
- PDFKit Latin-1 `Rs.` invoice generation.
- Dynamic reward wallet points ledger calculation.
- Zod validation schemas and sanitizers.
- Dynamic sitemap and robots directives.

ESLint passes with 0 errors across the entire codebase.

---

## 6. Phase 7.9 Implementation Log & Deliverables Summary

| Workstream | File(s) Modified / Created | Operational Status |
|---|---|---|
| **1. Super-Admin Staff Desk** | `src/app/api/admin/staff/route.js`, `src/app/admin/admins/page.jsx`, `src/proxy.js`, `src/components/admin/AdminSidebar.jsx` | Verified & Live (`bcrypt.compare` password checkpoint + edge route guard) |
| **2. Dynamic Analytics & Donut** | `src/app/api/admin/stats/route.js`, `src/app/admin/page.jsx` | Verified & Live (6-mo continuous aggregation + dynamic SVG donut) |
| **3. Cloudinary Fleet Media** | `src/lib/cloudinary/cloudinary.js`, `src/app/api/admin/upload/route.js`, `src/app/admin/cars/page.jsx`, `src/models/Car.js` | Verified & Live (streaming buffer upload to `comfort-trip/cars` + preview) |
| **4. Custom Dropdown Purple Bar** | `src/components/common/CustomDropdown.jsx` | Verified & Live (`matchesValue` case-insensitive matching & indicator) |
| **5. Header Points Removal** | `src/components/Header.jsx` | Verified & Live (removed from desktop & mobile navbar) |
| **6. Dynamic Points Ledger** | `src/app/profile/page.jsx` | Verified & Live (+100 welcome, 1 pt / ₹100 fare, review bonuses, itemized ledger) |
| **7. Logout Modal & Remember Me** | `src/components/common/LogoutModal.jsx`, `src/app/Login/page.jsx`, `src/lib/auth/authOptions.js` | Verified & Live (glassmorphic dialog + 30-day session extension) |
| **8. 30-Min Form Draft Resilience** | `src/hooks/useFormDraft.js`, `src/app/Bookings/page.jsx`, `src/app/admin/cars/page.jsx` | Verified & Live (30-min TTL in `localStorage` + reset pill) |
| **9. Enterprise Documentation** | `README.md` | Verified & Live (full architecture diagrams, API tables, and setup guide) |

---

## 7. Current Git Working Tree & Pre-Commit Instructions

All code changes across Phase 7.8 and Phase 7.9 remain safely uncommitted in your working tree on branch `testing-backend` for your final code review and UI inspection.

Whenever you are ready to commit and push:

```bash
git status
git add .
git commit -m "feat(phase-7.9): Complete enterprise super-admin governance, Cloudinary uploads, real-time analytics, and draft resilience"
git push origin testing-backend
```

