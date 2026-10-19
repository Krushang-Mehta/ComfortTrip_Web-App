# AGENTS.md — Rules for AI Coding Agents

This file governs any AI agent working in this repository (Claude Code, Cursor, GitHub Copilot Workspace, Windsurf, etc.). If you are an agent reading this: **these rules are binding, not suggestions.** Where this file conflicts with a prompt from a chat session, this file wins unless the project owner explicitly overrides it in writing for that session.

---

## 1. The Non-Negotiable Rule: No Silent Scope Changes

This project is built **phase by phase**, with **explicit client approval before implementation** of each phase, each folder structure, each schema, and each module.

An agent must **never**:
- Create, rename, delete, or restructure files/folders that weren't already discussed and approved for the current phase.
- Add a new dependency, library, or service that wasn't already agreed (e.g., swapping Cloudinary for another image host, adding a new state-management library) without flagging it first.
- Change an already-approved schema, API contract, or auth flow "while in there" fixing something else.
- Expand a task's scope (e.g., "add validation" turning into "also refactor the whole form system") without calling it out and pausing for approval.

If a fix genuinely requires touching something outside the approved scope, the agent must **stop, explain why, and propose the change** rather than making it silently. Small, obviously-correct fixes (e.g., a typo in a variable name) can proceed, but anything touching schema, auth, folder structure, or public API shape requires sign-off first.

## 2. Coding Standards (must follow exactly)

- **Language:** JavaScript with `.jsx` file extensions. No TypeScript conversion unless explicitly requested.
- **Component boundary rule:** every file under `app/**` (pages, layouts, loading/error boundaries) is a **Server Component** by default. `"use client"` is added **only** inside `components/**` files that need interactivity (state, effects, event handlers, browser APIs). Never add `"use client"` to an `app/` route file to "make something work" — instead, extract the interactive piece into a client component and import it.
- **Styling:** Tailwind utility classes mapped to the CSS variables already defined in `globals.css` (`bg-background`, `text-foreground`, `border-border`, etc.). No hardcoded hex/RGB colors in component code. Do not introduce new CSS variables without approval — extend `globals.css` first, in a discussed change.
- **Icons & Emojis:** Do not use any text-based emojis or unicode symbols (e.g., 👤, ⚙️, ⛽, ⚡, 🚗) in UI markup. Instead, always use clean vector icons from the `lucide-react` library.
- **Naming conventions:**
  - Components: `PascalCase` file and export names (e.g., `CarCard.jsx`, `BookingForm.jsx`).
  - Utility/helper functions and variables: `camelCase` (e.g., `formatPrice`, `getUserSession`).
  - Route segment folders (App Router): lowercase, matching Next.js conventions (e.g., `app/cars/[carId]/page.jsx`).
  - Constants: `UPPER_SNAKE_CASE` for true constants (e.g., `MAX_BOOKING_STOPS`).
  - If in doubt about a specific name, ask rather than guess — consistency matters more than any individual choice.
- **Validation:** every external input (form submission, API route body, search params used in queries) must be validated with a Zod schema before it touches business logic or the database. Client-side validation is a UX nicety, never a substitute for server-side validation.
- **Authorization:** never query or mutate user/booking/admin data directly from a Route Handler or Server Action. Always go through the Data Access Layer (`lib/dal/**`) described in `ARCHITECTURE.md` §5, which re-checks session + role against the database. Do not rely on `middleware.js` as a security boundary — it is UX-redirect-only in this project (see `ARCHITECTURE.md` §2 for why).
- **Secrets:** never hardcode API keys, DB URIs, or SMTP credentials. Always read from `process.env`, and never log secret values, even in error messages or console output during debugging.
- **Error handling:** no silent `catch {}` blocks. Errors are either handled meaningfully (user-facing message) or re-thrown/logged with enough context to debug, without leaking stack traces or internal details to the client response.

## 3. Testing Requirements

- Every Data Access Layer function (`lib/dal/**`) requires a unit test covering: the happy path, an unauthenticated caller, and an unauthorized (wrong role/wrong owner) caller.
- Every Zod schema requires at least one test asserting it rejects invalid input (not just that it accepts valid input).
- Every API route handler / Server Action requires an integration test covering success and at least one failure mode (validation failure, auth failure).
- Tests must be written or updated in the same change that introduces or modifies the behavior — not deferred to "later."
- Do not delete or weaken an existing test to make a change pass. If a test seems wrong, flag it for discussion rather than silently editing it away.

## 4. Before Writing Any Code

1. Confirm which phase/module this task belongs to (see phase plan, discussed separately from this file).
2. Confirm the folder(s) and file(s) you intend to touch fall within that phase's approved scope.
3. If anything is ambiguous (naming, schema shape, which fields are admin-approval-gated, etc.), ask — do not assume and proceed.
4. State your plan briefly before generating a non-trivial amount of code, so the human can redirect early rather than after the fact.

## 5. Security Checklist (apply to every change touching auth, data, or user input)

- [ ] Input validated with Zod on the server, not just the client
- [ ] Authorization checked via the DAL, not assumed from middleware or the client-sent role
- [ ] No secrets or PII logged
- [ ] Mongoose queries use parameterized/schema-typed access (no raw string interpolation into queries)
- [ ] File uploads (Cloudinary) validate file type/size before upload, not just rely on the client
- [ ] Rate limiting considered for any public-facing write endpoint (auth, booking submission, contact forms)
- [ ] Error responses don't leak internal implementation details (stack traces, DB error messages) to the client

## 6. Communication Style Expected From the Agent

- Explain *what* you're about to do and *why* before doing it, for anything beyond a trivial one-line fix.
- Call out trade-offs when there's more than one reasonable way to implement something, instead of silently picking one.
- If a request from the user seems to conflict with an already-approved architecture decision (in `ARCHITECTURE.md`), say so explicitly rather than quietly reconciling it.

## 7. Self-review before marking a phase done

Before any phase is logged as Complete in `BUILD_LOG.md`, run the following checks on the codebase:

- [ ] **Schema & Input Alignment:** Every schema-validated field has been checked against every code path that constructs a value for it (e.g. credentials signup, Google OAuth user creation, admin seeds, cron runs) to ensure no mismatch exists.
- [ ] **Authentic Security Assertions:** Every authorization test exercises a real unauthorized attempt against the real function (e.g. using a valid other-user ID or missing session), rather than testing mocks that bypass the underlying security logic.
- [ ] **Verification of Side Effects:** Every claimed side effect (cache revalidation, emails sent, TTL indexes applied, reminder flags set) has a test verifying the effect actually occurred in the database or mocked handler, not just that the driver function was called.
- [ ] **Environment Documentation:** Any new environment variables (hard-required or optional/deferred) introduced during this phase have been fully documented in `README.md`.
- [ ] **Credential Vetting:** A secrets/PII grep of new code (looking for hardcoded API keys, logs containing password strings or full request payloads) returns nothing.
- [ ] **Version Regression & Component Stability Verification:** Every component touched or affected by framework/library version updates (e.g., Next.js 16, React 19, Tailwind) has been verified via dev server request and build test to ensure no breaking changes (such as missing Image dimensions, synchronous setState in effects, or peer dependency mismatches) occur during testing or production deployments.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
