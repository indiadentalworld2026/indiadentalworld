# TASKS: Dentist & Clinic Finder

**Status:** Draft v0.2
**Governed by:** `CONSTITUTION.md`
**Implements:** `PLAN.md` v0.2 for `SPEC.md` v0.4
**Last updated:** 2026-09-30

**Timeline (about 16 weeks):** M0 week 1 · M1 weeks 2-3 · M2 weeks 4-5 · M3 week 6 · M4 weeks 7-9 · M5 weeks 10-11 · M6 weeks 12-13 · M6b weeks 14-15 · M7 week 16.

**Changelog:** v0.2 adds tasks for SPEC US-11 to US-22 (directory pages, credentials, branches, prescriptions and bills, daily digest, legal and support pages, reviews, showcase content, plans, installable web app), a new milestone **M6b**, spike SP-7 and SP-8, and moves the launch week from 14 to 16.

Small, ordered, verifiable work items. Each task cites the requirement IDs it satisfies and a **Done when** condition, usually an acceptance criterion (AC). Work top to bottom within a milestone unless "Depends" says otherwise.

**Conventions**
- **Size:** S = under half a day, M = about 1 day, L = 2-3 days. Split anything larger than L.
- **Priority:** inherited from the SPEC requirement (P0/P1/P2). P1/P2 tasks are marked and can slip without blocking launch.
- **Definition of done for every task:** code reviewed, tests written and passing in CI, no lint/type errors, docs or OpenAPI updated when behavior changes, no PII in logs.
- **Status column:** ☐ todo, ◐ in progress, ☑ done. Update as you go.

---

## M0: Foundations & Spikes (week 1)

| ID | Task | Refs | Size | Depends | Done when | Status |
|---|---|---|---|---|---|---|
| T-001 | Scaffold repo: Next.js + TypeScript, lint, format, type-check, module folders, import-boundary lint rule | PLAN §2, ADR-001, ADR-002 | M | | CI-ready repo; a cross-module table import fails lint | ☐ |
| T-002 | Local environment via Docker Compose: Postgres+PostGIS, Redis, MinIO, mail catcher; README with one-command setup | PLAN §11 | M | T-001 | A new developer runs the app locally in < 15 min | ☐ |
| T-003 | CI pipeline: lint, types, unit, integration (real Postgres), dependency scan, preview deploy | PLAN §11 | M | T-001, T-002 | PR shows all checks green | ☐ |
| T-004 | Migration framework and first migration enabling `postgis`, `btree_gist`, `pg_trgm` | ADR-003 | S | T-002 | Migration applies and rolls forward in CI | ☐ |
| T-005 | Core schema: Provider, taxonomy, provider-specialty/service, OpeningHours, HoursException, Photo | SPEC S-*, F-*, P-* (PLAN §5) | M | T-004 | Tables and indexes (GiST, GIN, slug unique) created | ☐ |
| T-006 | Seed script: ~200 fake providers across 2-3 cities, realistic hours, specialties, services | SPEC §3 | M | T-005 | Seed runs idempotently; data visible in DB | ☐ |
| T-007 | Platform layer: config validation, structured logger with PII redaction, `problem+json` errors, request IDs, injected Clock | ADR-014, ADR-015, PLAN §8 | M | T-001 | Unit tests prove redaction and error format | ☐ |
| T-008 | OpenAPI 3.1 skeleton and type generation pipeline; request validation at the edge | ADR-015 | M | T-007 | Generated types compile; invalid request returns `400` problem+json | ☐ |
| T-009 | **SP-1** spike: exclusion constraint under 200 parallel bookings | ADR-004 | M | T-004 | Exactly one success; result recorded in ADR-004 | ☐ |
| T-010 | **SP-2** spike: compare maps/geocoding vendors on ~50 real addresses, estimate cost, read storage terms | ADR-012 | M | | Recommendation recorded; ADR-012 status updated | ☐ |
| T-011 | **SP-3** start: SMS vendor selection, DLT registration (sender ID, templates), email domain authentication (SPF/DKIM/DMARC) | ADR-011, R-1 | M | | Registration submitted; expected approval date noted | ☐ |
| T-012 | **SP-4** spike: radius + text search over 100k synthetic providers | ADR-006, SPEC §5 | M | T-005 | p95 measured and recorded; ADR-006 revisit decision made | ☐ |
| T-013 | Resolve blocking open questions 1, 4, 5, 11 (and start 2, 3) and update ADR statuses | SPEC §7, PLAN §13 | S | | Answers written into SPEC §7 and PLAN §13 | ☐ |
| T-014 | **SP-8** spike: choose the dataset for the state > city > locality hierarchy and test locality assignment for providers | ADR-019, S-9 | M | T-005 | Seed for 2-3 launch cities; 95% of test providers assigned correctly; recorded in ADR-019 | ☐ |
| T-015 | Adopt the constitution in the repo: pull request template with the Constitution check, CODEOWNERS requiring human review of security-critical paths (auth, policy, records, encryption, migrations, consent), branch protection, and an `AGENTS.md`/`CLAUDE.md` that points AI tools to the docs | CONSTITUTION II, X, XI | S | T-001 | A test PR shows the checklist and requires owner review on a protected path | ☐ |

---

## M1: Search Core (weeks 2-3), User Stories US-1, US-11 (place data)

| ID | Task | Refs | Size | Depends | Done when | Status |
|---|---|---|---|---|---|---|
| T-101 | `search` service: radius, text, distance sort, pagination | S-1, S-3, S-4, R-4 | L | T-005, T-006 | **AC-1** integration test passes | ☐ |
| T-102 | `GeoService` interface + chosen vendor adapter + `GET /autocomplete/places` proxy | S-2, ADR-012 | M | T-010 | Autocomplete returns suggestions; keys never reach the browser | ☐ |
| T-103 | `GET /providers/search` endpoint: params, validation, errors (`400`, `429`), rate limit | S-1..S-4 | M | T-101, T-008 | Contract tests pass for valid and invalid params | ☐ |
| T-104 | Search page: text and location inputs, "Use my location", manual fallback | S-2, S-7 | M | T-102, T-103 | **AC-2** E2E passes | ☐ |
| T-105 | Result list and result card (name, type, specialties, distance, open status, phone) | R-2, R-4 | M | T-103 | Cards render for fixtures; total count shown | ☐ |
| T-106 | Map view with pins; list/map toggle on mobile, side-by-side on desktop | R-1 | L | T-105 | Pins match results; keyboard-accessible list equivalent | ☐ |
| T-107 | URL state sync for query, location, filters, sort, page | S-6 | M | T-104 | **AC-4** E2E passes | ☐ |
| T-108 | Empty state with "Expand to 25 km" action | R-6 | S | T-105 | **AC-6** E2E passes | ☐ |
| T-109 | Typo tolerance using trigram fallback (P1) | S-5 | M | T-101 | "orthodntist" returns orthodontists | ☐ |
| T-110 | Pin/card highlight sync and "Search this area" (P1) | R-3, R-5 | M | T-106 | Selecting pin highlights card and vice versa | ☐ |
| T-111 | Place hierarchy schema and seed (state, city, locality); assign `locality_id` to providers; locality picker | S-9, ADR-019 | M | T-014, T-005 | Locality search and picker work for seeded cities | ☐ |
| T-112 | Dentists / Clinics result-type switch in search (P1) | S-8 | S | T-101 | Switching changes results and URL (AC-22, part 2) | ☐ |

---

## M2: Filters & Profiles (weeks 4-5), User Stories US-2, US-12, US-13

| ID | Task | Refs | Size | Depends | Done when | Status |
|---|---|---|---|---|---|---|
| T-201 | Taxonomy seed (12 specialties: general, cosmetic/aesthetic, implantology, endodontics, oral and maxillofacial surgery, oral pathology, oral radiology, orthodontics, pediatric, periodontics, preventive and community, prosthodontics; plus services) and `GET /taxonomy` | F-1, F-2 | S | T-005 | Endpoint returns taxonomy used by filters | ☐ |
| T-202 | Filter backend: specialty, service, language, accessibility, children, emergency | F-1, F-2, F-4, F-5 | M | T-101, T-201 | Combined filter integration tests pass | ☐ |
| T-203 | Open-now computation (time-zone aware) and filter | F-3, ADR-014 | M | T-202 | **AC-5** passes (unit + integration) | ☐ |
| T-204 | Filter UI: controls, removable chips, "Clear all" | F-8 | M | T-202, T-107 | **AC-3** E2E passes | ☐ |
| T-205 | Sorting: distance, relevance (rating sort is wired to the review aggregate in T-638) | F-7 | S | T-101 | Sort order verified in tests | ☐ |
| T-206 | Provider profile page (server-rendered) with structured data | P-1, P-2, P-6, ADR-002 | L | T-005 | Page renders all P-2 fields; structured data validates | ☐ |
| T-207 | Contact actions: click-to-call, directions, website | P-3 | S | T-206 | Works on mobile viewport (see AC-7 non-booking part) | ☐ |
| T-208 | Clinic ↔ dentist linking on profile pages (P1) | P-4 | M | T-206 | Clinic lists dentists; dentist links to clinic | ☐ |
| T-209 | Correction report form + `POST /reports`, rate limited | P-5 | M | T-206 | **AC-9** passes | ☐ |
| T-210 | Credentials block on profile: qualifications, experience, registrations, memberships, certifications, languages; "Registration verified" badge vs "provider-declared" (P1) | P-8 | M | T-206, T-005 | Badge appears only for verified registrations (AC-23, display part) | ☐ |
| T-211 | Branches on profile: address, phone, map, weekly hours with split shifts, per-branch "Book" (P1) | P-9 | M | T-206 | Two-branch fixture renders correctly (AC-24, display part) | ☐ |
| T-212 | Breadcrumbs and structured data on profile pages (P1) | P-11 | S | T-206 | Breadcrumb visible and valid in structured data | ☐ |

---

## M3: Accounts & Authentication (week 6), User Stories US-3, US-21 (policies)

| ID | Task | Refs | Size | Depends | Done when | Status |
|---|---|---|---|---|---|---|
| T-301 | Identity schema: User, PatientProfile, ConsentLog, OtpChallenge, sessions | U-1, U-4, U-7 (PLAN §5) | M | T-004 | Migrations applied; indexes created | ☐ |
| T-302 | `NotificationChannel` interface, SMS + email adapters, fake adapter for tests | N-4, ADR-011 | M | T-011 | OTP send works against sandbox; tests use fake | ☐ |
| T-303 | OTP request/verify: hashed codes, 10-min expiry, single use, max 5 attempts | U-1, U-3, ADR-007 | M | T-301, T-302 | **AC-10** passes (integration + E2E) | ☐ |
| T-304 | Rate limiting and lockout (Redis) per identifier and IP; uniform responses | U-3 | M | T-303 | **AC-11** passes | ☐ |
| T-305 | Sessions, cookies, CSRF, logout, logout-all | U-9, ADR-007 | M | T-303 | Session tests pass; cookies `Secure`, `HttpOnly`, `SameSite` | ☐ |
| T-306 | Consent capture UI and storage (Terms, Privacy, health-data) | U-7 | M | T-301 | Registration blocked without consent (AC-10) | ☐ |
| T-307 | Patient profile page: view and edit | U-4 | S | T-301 | Fields persist; validation errors shown | ☐ |
| T-308 | RBAC and policy-layer skeleton (deny by default) | U-8, ADR-008 | M | T-301 | Unauthorized access to a protected route returns `401`/`403` in tests | ☐ |
| T-309 | Professional login: email + password (argon2id) + TOTP MFA | D-2, ADR-007 | L | T-308 | MFA enrollment and login work; MFA enforced for record-access roles | ☐ |
| T-310 | Email + password login and "Forgot password" for patients (P1) | U-2 | M | T-305 | Reset flow works end to end | ☐ |
| T-311 | Admin login with email + password and mandatory MFA; admin role cannot read clinical record content | A-1, U-8, ADR-008 | M | T-309 | Admin without MFA cannot sign in; policy test denies record access | ☐ |
| T-312 | Legal documents module: versioned Privacy Policy, Terms, Disclaimer, About; footer links on every page; consent references the version; grievance contact shown | SUP-1, SUP-5, A-14, U-7 | M | T-301 | AC-33 (policy and consent parts) passes | ☐ |

---

## M4: Availability & Booking (weeks 7-9), User Stories US-4, US-5, US-7, US-13 (booking), US-20

| ID | Task | Refs | Size | Depends | Done when | Status |
|---|---|---|---|---|---|---|
| T-401 | Scheduling schema: BookingSettings, AppointmentType, ScheduleRule, ScheduleException | B-1, B-2, B-4, B-8 | M | T-005 | Migrations applied with constraints | ☐ |
| T-402 | Slot computation module (pure domain code) with table-driven unit tests, including time zones | B-3, ADR-005, ADR-014, PLAN §7.1 | L | T-401, T-007 | **AC-12** worked example passes | ☐ |
| T-403 | `GET /providers/{slug}/slots` with short-TTL cache and invalidation | B-3, ADR-005 | M | T-402 | List for a clinic < 200 ms uncached (SP-6); cache invalidates on changes | ☐ |
| T-404 | Appointment schema with `EXCLUDE` constraint and status transition rules | B-6, B-11, ADR-004 | M | T-401, T-009 | Overlap insert fails at DB level; illegal transitions rejected | ☐ |
| T-405 | `POST /appointments`: transaction, re-validation, idempotency key, `409` mapping, enqueue jobs | B-5, B-6, B-16, PLAN §7.2 | L | T-403, T-404, T-410 | **AC-13** concurrency test passes; **AC-14** confirmed status | ☐ |
| T-406 | Job infrastructure (pg-boss), worker process, retries, dead-letter | ADR-010 | M | T-004 | Failed job retries and lands in dead-letter | ☐ |
| T-407 | Notification templates and delivery status; confirmation, cancel/reschedule notices with no clinical content | N-1, N-3, N-5 | M | T-302, T-406 | Notifications sent within 60 s; content test passes (AC-14) | ☐ |
| T-408 | Booking UI: date/slot picker (accessible), patient selection, summary and confirmation | B-5 | L | T-403, T-405 | Keyboard and screen-reader operable; E2E booking passes | ☐ |
| T-409 | Inline login within booking flow preserving selected slot | U-10 | M | T-303, T-408 | Logged-out user completes login and lands on summary with slot intact | ☐ |
| T-410 | (Prereq for T-405, do first) Idempotency key storage and replay of stored response | B-16, ADR-015 | S | T-404 | Retried request returns same response, no duplicate | ☐ |
| T-411 | "My appointments" page and patient cancel with cutoff rule | B-9, B-12 | M | T-405 | **AC-15** (cancel part) passes | ☐ |
| T-412 | Atomic reschedule (P1) | B-9 | M | T-411 | **AC-15** (reschedule part) passes; failure leaves original intact | ☐ |
| T-413 | Dependents / family members (P1) | U-5 | M | T-307 | Book and view for a dependent | ☐ |
| T-414 | Portal: weekly schedule editor and exceptions with conflict resolution flow | B-1, B-2, D-4 | L | T-401, T-309 | **AC-17** passes | ☐ |
| T-415 | Portal: appointment dashboard and actions (confirm, decline, cancel, reschedule, complete, no-show) | B-10, B-11, D-5 | L | T-405, T-309 | Status transitions validated; patient notified | ☐ |
| T-416 | Approval mode with expiry job (P1) | B-7 | M | T-406, T-405 | **AC-14** (approval part) passes | ☐ |
| T-417 | Reminders at 24 h and 2 h (P1) | N-2 | M | T-406 | Reminder jobs sent on schedule in tests with frozen clock | ☐ |
| T-418 | Next-available slot on cards and profile; "Book" CTA; `bookable`/`earliest_slot` filters | R-2, P-7, F-7, F-9 | M | T-403, T-105 | **AC-7** E2E passes (with and without booking) | ☐ |
| T-419 | Abuse limits: max active appointments per patient per provider; temporary block on repeated no-shows (P1) | B-14 | M | T-405 | Limit responses `429`; covered by tests | ☐ |
| T-420 | Feature flags: global booking kill switch and per-provider `booking_enabled` | PLAN §8 | S | T-405 | Disabling hides booking and returns `422` | ☐ |
| T-421 | Branch-aware booking: choose branch, show only that branch's slots; confirm the per-dentist constraint blocks overlaps across branches | P-9, B-5, ADR-004 | M | T-405, T-211 | **AC-24** passes | ☐ |
| T-422 | Daily digest job and settings (time, channel) for dentists and clinics; no clinical details (P1) | N-7 | M | T-406, T-407, T-401 | **AC-31** (digest part) passes | ☐ |

*Ordering note:* do T-410 before T-405 despite its number.

---

## M5: Dental Records (weeks 10-11), User Stories US-6, US-8, US-18, US-19

*Gate: Open Questions 2 and 3 (legal role, retention) answered before starting. Keep records behind a feature flag.*

| ID | Task | Refs | Size | Depends | Done when | Status |
|---|---|---|---|---|---|---|
| T-501 | Records schema: DentalRecord, RecordAttachment, RecordAccessGrant, RecordAccessLog; finalize/addendum model | REC-1, REC-5..REC-7 | M | T-404 | Migrations applied; addendum links supported | ☐ |
| T-502 | `can_read_record` and related policy functions with exhaustive allow/deny tests | REC-5, ADR-008, PLAN §7.3 | L | T-308, T-501 | Policy matrix test passes for every role and relationship | ☐ |
| T-503 | Access logging for every read, write, download, grant, revoke | REC-6 | M | T-502 | Every access appears in log (AC-16) | ☐ |
| T-504 | Envelope encryption for clinical text fields; key rotation runbook | ADR-009 | L | T-501 | Fields encrypted at rest; rotation test passes | ☐ |
| T-505 | Dentist record editor linked to appointment; finalize; addendum | REC-1, REC-7, D-6 | L | T-502, T-504, T-415 | **AC-18** passes | ☐ |
| T-506 | Attachments: upload, type/size limits, malware scan job, private storage, signed URLs after policy check (P1) | REC-2, ADR-009 | L | T-406, T-502 | Infected test file quarantined; URL expires quickly | ☐ |
| T-507 | Patient records view and access-log view | REC-3, REC-6 | M | T-502 | Patient sees own and dependents' records | ☐ |
| T-508 | Grants: create, expire, revoke (P1) | REC-5 | M | T-502 | **AC-16** full scenario passes | ☐ |
| T-509 | Medical history and allergies entry (P1) | REC-4 | M | T-307 | Provider with relationship can view | ☐ |
| T-510 | Records PDF download (P1) | REC-3 | M | T-507 | PDF matches record contents; access logged | ☐ |
| T-511 | **SP-5** spike: Postgres row-level security for record tables | ADR-008 | M | T-501 | Decision recorded in ADR-008 | ☐ |
| T-512 | **SP-7** spike: template-based PDF generation for prescription and bill, including fonts and print layout | ADR-021 | M | T-501 | Sample documents render correctly; decision recorded in ADR-021 | ☐ |
| T-513 | Structured prescription entry in the record editor, and prescription PDF endpoint (policy check, document ID, access logged) (P1) | REC-9, REC-5..REC-7, ADR-021 | L | T-505, T-512 | **AC-29** passes; unrelated provider gets `403` | ☐ |
| T-514 | Bill record with items, discount, status; bill/receipt PDF; patient view; no online payment (P2) | REC-10, ADR-021 | M | T-513 | **AC-30** passes | ☐ |

---

## M6: Onboarding, Admin, Content (weeks 12-13), User Stories US-9, US-10, US-11, US-16

| ID | Task | Refs | Size | Depends | Done when | Status |
|---|---|---|---|---|---|---|
| T-601 | Professional registration flow, documents upload, `ProviderVerification` | D-1 | L | T-309, T-005 | Submission sets status `pending_verification`; profile not public | ☐ |
| T-602 | Admin verification queue: approve, reject with reason, request more info; emails | A-7 | M | T-601 | **AC-19** passes | ☐ |
| T-603 | Profile self-edit with re-verification triggers (name, registration number, address) | D-3 | M | T-601 | Changed sensitive fields return provider to pending | ☐ |
| T-604 | Staff invites and roles (owner, dentist, staff) (P1) | D-7 | M | T-309 | Staff manage calendar; clinical notes hidden unless permitted | ☐ |
| T-605 | Admin CRUD for providers, specialties, services; unpublish and suspend behavior | A-2, A-4, A-8 | L | T-005 | **AC-8** passes | ☐ |
| T-606 | CSV import with dry-run preview (P1) | A-3 | M | T-605 | Errors listed per row; commit only after preview | ☐ |
| T-607 | Reports queue and audit log (P1) | A-5, A-6 | M | T-209 | Actions appear in audit log | ☐ |
| T-608 | CMS: treatment guides, disclaimers, "Find a dentist for this treatment" CTA (P1) | A-9, C-1, C-4 | L | T-204 | **AC-20** passes | ☐ |
| T-609 | State, city, and locality directory pages with breadcrumbs, unique metadata, revalidation, `noindex` for empty pages, sitemap from places with providers (P1) | S-8, S-9, C-3, P-11, ADR-019 | L | T-111, T-112, T-206 | **AC-22** passes | ☐ |
| T-610 | Data export and account deletion jobs (P1) | U-6 | L | T-301, T-507 | **AC-21** passes | ☐ |
| T-611 | Claim an existing listing: search, code to the contact on record, admin approval, notifications to existing contacts, documents fallback, rate limits (P1) | D-10, A-12, D-1, ADR-020 | L | T-601, T-602, T-302 | **AC-28** passes; competing claims never auto-approve | ☐ |
| T-612 | Blog and newsletter (P2), provider analytics (P2) | C-2, C-5, D-9 | L | | Deferred; do only if time allows | ☐ |

---

## M6b: Trust, Showcase & Plans (weeks 14-15), User Stories US-12, US-13, US-14, US-15, US-17, US-21, US-22

*Gate: Open Questions 16 (review policy) and 18 (case-study consent) answered before enabling reviews or case studies; 15 (plans) before restricting any feature by plan. Keep reviews and showcase content behind feature flags until moderation tooling and staffing are in place.*

| ID | Task | Refs | Size | Depends | Done when | Status |
|---|---|---|---|---|---|---|
| T-621 | Contact page and support form, tickets, confirmation email, admin queue; feedback and "report an issue" links prefill page URL (P1/P2) | SUP-2, SUP-3, A-13 | M | T-407, T-605 | **AC-33** (support part) passes | ☐ |
| T-622 | Admin UI to publish new legal document versions with effective dates (P0) | A-14, SUP-1 | S | T-312, T-605 | New version referenced by consents recorded afterwards | ☐ |
| T-623 | HTML sitemap page (P2) | SUP-4 | S | T-609 | Page lists states, cities, localities | ☐ |
| T-631 | Review schema and eligibility service (completed appointment, one per appointment, 14-day edit window) | RV-1, ADR-016 | M | T-415 | Ineligible submissions blocked (AC-25) | ☐ |
| T-632 | Automated review checks: abusive language, phone/email/link patterns, clinical details; hold or publish | RV-2 | M | T-631 | Flagged reviews held with reason (AC-26) | ☐ |
| T-633 | Review submit, edit, delete UI and API with guidelines and first-name-plus-initial display | RV-1, RV-6 | M | T-631, T-632 | **AC-25** passes | ☐ |
| T-634 | Aggregate job (transactional enqueue), rating on cards and profile, count-only below 3 reviews | RV-3, RV-7, P-12, ADR-016 | M | T-631, T-406 | Aggregate updates within 1 minute; plan has no effect (AC-26) | ☐ |
| T-635 | Report a review; moderation queue for reviews, media, content; removal with reason | RV-5, A-11 | M | T-632, T-605 | **AC-26** passes | ☐ |
| T-636 | Provider reply and portal review inbox; flag review (P2) | RV-4, D-14 | M | T-633, T-415 | **AC-27** passes | ☐ |
| T-637 | Review-request notification after completed appointment (P2) | RV-8 | S | T-633, T-407 | Sent once, one day after completion | ☐ |
| T-638 | Minimum-rating filter and rating sort using the aggregate table (P2) | F-6, F-7 | S | T-634, T-202 | Filter and sort use published-review aggregates only; plan has no effect | ☐ |
| T-641 | Portal credentials management (qualifications, registrations, memberships, certifications) and admin verification driving the badge | D-11, P-8, A-7 | M | T-601, T-602, T-210 | **AC-23** passes | ☐ |
| T-642 | Portal branch management: add or edit clinic locations, hours, per-branch availability, assign dentists (P1) | D-12, P-9 | M | T-414, T-604 | Second branch created and bookable (AC-24) | ☐ |
| T-651 | Upload pipeline: presigned upload, quarantine bucket, type/size checks, malware scan, EXIF strip, resize, moderation, public copy | ADR-018, P-10 | L | T-406, T-635 | Malicious or oversized file rejected; unapproved media never public | ☐ |
| T-652 | Gallery photos (P1) and approved video links (P2) on profile and in portal | P-10, D-13 | M | T-651 | Only allowlisted video hosts accepted (AC-34) | ☐ |
| T-653 | Case studies, blogs, publications with consent attestation, sanitization, first-post moderation (P2) | P-10, D-13, A-11 | L | T-651, T-635 | **AC-34** passes | ☐ |
| T-661 | Plan and entitlement schema; `entitlements.can`; default all-features plan for approved providers (P2) | D-8, ADR-017 | M | T-601 | Function used by booking and digest checks | ☐ |
| T-662 | Admin trial/plan actions (assign, extend, end), expiry reminders (14/7/1 days), downgrade guardrails, audit log (P2) | D-15, A-10 | M | T-661, T-407 | **AC-32** passes | ☐ |
| T-663 | SMS usage tracking and quota fallback to email; OTP and confirmations never blocked (P2) | N-8 | M | T-661, T-302 | **AC-31** (quota part) passes | ☐ |
| T-671 | Installable web app: manifest, icons, service worker for static assets only, offline page (P2) | W-1, ADR-022 | M | T-001 | **AC-35** passes; no authenticated data in caches | ☐ |

---

## M7: Hardening & Launch (week 16)

| ID | Task | Refs | Size | Depends | Done when | Status |
|---|---|---|---|---|---|---|
| T-701 | Accessibility audit (axe + manual keyboard/screen reader), fix findings | SPEC §5 | L | M1-M6 | No critical issues; slot picker verified | ☐ |
| T-702 | Load tests: search, slots, booking; parallel booking at scale | SPEC §5, AC-13 | M | M4 | Targets met (search p95 < 800 ms, slots < 500 ms, booking < 1 s); no double bookings | ☐ |
| T-703 | Security review and penetration test: auth, OTP abuse, IDOR, records, reviews, listing claims, uploads | ADR-007, ADR-008 | L | M5, M6b | No open high/critical findings | ☐ |
| T-704 | Observability: dashboards for SPEC §1.3 metrics, alerts on booking errors and notification backlog | SPEC §5 | M | M4 | Alerts fire in staging tests | ☐ |
| T-705 | Backups, restore drill, runbooks (incident, key rotation, DLQ handling) | ADR-013, SPEC §5 | M | M5 | Restore meets RPO/RTO in drill | ☐ |
| T-706 | Legal deliverables: privacy notice, consent text, provider agreement, review policy, case-study consent form, grievance contact | SPEC §5.1 | M | T-013 | Reviewed by counsel; published | ☐ |
| T-707 | SEO checks: SSR output, sitemap, structured data, `noindex` on authenticated pages | SPEC §5 | S | T-206, T-609 | Lighthouse SEO and mobile scores meet targets | ☐ |
| T-708 | Soft launch: pilot clinics onboarded, support process, rollback plan, booking flag ready | R-5, PLAN §11 | M | all | Pilot city live with verified clinics and real availability | ☐ |
| T-709 | Moderation and claims operations: runbook, response-time targets, escalation, staffing plan, takedown process | RV-2, A-11, A-12, R-9..R-11 | M | M6b | Team can clear the queues within the targets in a dry run | ☐ |

---

## Backlog (post-launch, from SPEC §8 Future)
Waitlist (B-15), add to calendar (B-13), notification preferences (N-6), tooth chart (REC-8), clinic microsites, branded email, dental tourism promotion, jobs, labs, courses, events, product store, payments/deposits, native apps, health-ID integration.

---

## How to use this file with an AI coding tool
Give the agent one task at a time along with `CONSTITUTION.md`, `SPEC.md`, `PLAN.md`, and the task row (see Article XI). Ask it to (1) restate the acceptance criteria it must satisfy, (2) write or update tests first, (3) implement, (4) run the checks, and (5) report any conflict between the task and the spec or plan instead of silently deviating. If a conflict is real, fix the document first, then the code.
