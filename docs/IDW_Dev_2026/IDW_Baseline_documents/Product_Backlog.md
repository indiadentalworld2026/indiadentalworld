# IndiaDentalWorld Product Backlog

**Status:** Initial prioritized backlog for product and engineering planning  
**Source of truth:** IDW Blueprint, Build Standards, Tech Stack, project plan, compliance material, and existing page/dashboard prototypes.

This backlog orders work by dependency and value. It is a starting point for refinement with the founder, lead developer, clinics, and legal/compliance advisors. Items should be split into delivery-sized stories during sprint planning. P0 is required to begin a safe MVP; P1 is required for the public launch; P2 extends clinic operations and network value; P3 is scale and later-phase work.

## Product goal and MVP strategy

Prove the core loop first: **verified clinics publish useful profiles → patients find and request appointments → clinics respond and manage bookings**. Build the secure, reusable platform foundation underneath it. Expand into a clinic operating system after the demand and clinic onboarding loop works, then add marketplace categories and advanced intelligence in phases.

### MVP definitions

| MVP | Outcome | Included capabilities | Release gate |
|---|---|---|---|
| **MVP 0 — Buildable foundation** | Team can safely develop, review, deploy, and operate the first application. | Architecture and data model; environments; CI/CD; identity and roles; tenant isolation; consent and audit foundations; monitoring and recovery. | Automated checks pass; staging deployment works; security review accepts the foundation; backup restore is demonstrated. |
| **MVP 1 — Clinic discovery and booking** | A patient can find a verified clinic and request an appointment; the clinic can respond. | Clinic onboarding and manual verification; public clinic profiles; location/specialty search; booking request, confirmation, reschedule and cancellation; transactional notifications; required disclosures and SEO. | Critical patient and clinic journeys pass acceptance and accessibility checks; mobile performance targets are met; pilot clinics can use the flow. |
| **MVP 2 — Clinic workflow** | A clinic can manage its daily schedule and core visit records in IDW. | Staff roles, schedules/chairs/doctors, patient chart and visit notes, treatment plan, prescription, invoice/payment recording, consent, audit. | Clinic-level access controls and audit verified; clinical workflows reviewed with pilot clinics; recovery and security gates met. |
| **MVP 3 — Practice operations** | Clinics coordinate stock, labs and operational reporting. | Inventory, expiry/low-stock, lab work orders and status, expense and revenue reporting, patient recalls, clinic analytics. | Reconciliation and workflow acceptance; operational reports match source transactions. |
| **MVP 4 — Industry marketplace** | Verified suppliers and education partners transact with clinics. | Vendor/lab profiles, catalogues, quote/order flows, payments and settlement, education/events, jobs/classifieds in sequenced releases. | Seller verification, payment reconciliation, refund/returns paths, and dispute handling work end to end. |
| **MVP 5 — Scale and intelligence** | Platform expands reach and adds governed integrations and assistive intelligence. | ABDM, mobile/offline, scale search/analytics, advanced recommendations and assistive AI. | Privacy, security, clinical safety, regulatory, and performance reviews approved per capability. |

## Prioritization key

- **P0 — Foundation blocker:** needed before real users or sensitive data.
- **P1 — MVP launch:** needed for clinic discovery and booking pilot.
- **P2 — Core expansion:** substantial clinic operations and marketplace value.
- **P3 — Later:** scale, optimization, and advanced capability after evidence of need.

## P0 — Foundation and delivery readiness (MVP 0)

| ID | Backlog item | Priority | Acceptance summary |
|---|---|---:|---|
| FND-01 | Confirm MVP scope, user journeys, roles, and product terminology | P0 | Approved stories and acceptance criteria exist for patient, clinic owner/staff, dentist, admin, and later seller journeys. |
| FND-02 | Establish application architecture and repository conventions | P0 | Frontend, API, shared schemas, database migrations, configuration, and documentation have clear ownership and boundaries. |
| FND-03 | Create local, test, staging, and production environments | P0 | Environment-specific secrets and data are isolated; no production patient data is used in lower environments. |
| FND-04 | Define core identity, organization, clinic, and tenant data model | P0 | Users can belong to clinic organizations; every protected record has tenant ownership; migrations are versioned and reviewed. |
| FND-05 | Implement authentication and account recovery | P0 | Secure sign-in, sign-out, verification, recovery, session expiry, and rate limits behave as specified. |
| FND-06 | Implement role-based authorization and clinic isolation | P0 | API and database prevent users from accessing records outside their role and clinic, including on malformed or manipulated requests. |
| FND-07 | Implement consent and audit event foundations | P0 | Consent capture/withdrawal and sensitive create/read/update/delete events are attributable and queryable; audit events are append-only. |
| FND-08 | Implement secure file storage foundation | P0 | Upload type/size checks, access authorization, encryption, malware scanning approach, and expiring links are defined and enforced. |
| FND-09 | Set up monitoring, error reporting, logs, alerting, and status communication | P0 | Errors and service health are visible without logging secrets or unnecessary personal/clinical data. |
| FND-10 | Define backup, restore, incident, and data deletion procedures | P0 | Restore is exercised in a non-production environment; incident ownership and escalation steps are documented. |
| FND-11 | Create design system and reusable responsive components | P0 | Shared forms, navigation, buttons, cards, tables, alerts, and loading/error/empty states work on mobile and desktop. |
| FND-12 | Implement baseline accessibility and security practices | P0 | Keyboard access, semantic labels, secure headers, input validation, dependency scanning, and secret handling are in the development workflow. |

## P1 — Clinic discovery and booking (MVP 1)

| ID | Backlog item | Priority | Acceptance summary |
|---|---|---:|---|
| DIS-01 | Public homepage and clinic acquisition entry points | P1 | Responsive page explains the service and gives direct routes to search and clinic onboarding. |
| DIS-02 | Clinic registration and profile onboarding | P1 | Clinic submits required identity, location, contact, services, hours, doctors, and credentials with validation and save/resume behavior. |
| DIS-03 | Clinic credential review and verification workflow | P1 | Admin can review, request corrections, approve, reject, and record verification evidence; unverified status is never presented as verified. |
| DIS-04 | Clinic profile management | P1 | Authorized staff can maintain clinic details, service list, doctors, facilities, hours, photos, directions, and indicative prices. |
| DIS-05 | SEO-ready public clinic profile pages | P1 | Stable canonical URLs, metadata, sitemap inclusion, structured data, useful accessible content, and indexability are correct. |
| DIS-06 | Patient search and results | P1 | Search supports city/locality, specialty/service, and practical filters; results are relevant, explainable, and usable on mobile. |
| DIS-07 | Clinic availability and booking request | P1 | Patient can select an available slot and submit a request; the clinic can confirm, decline, or propose another time. |
| DIS-08 | Booking lifecycle management | P1 | Patient and clinic can view booking status and permitted changes; cancellations and rescheduling preserve history. |
| DIS-09 | Booking notifications | P1 | Patient and clinic receive appropriate confirmation and reminder messages; retry/failure states are observable and duplicate-safe. |
| DIS-10 | Patient account and booking dashboard | P1 | Patient can view upcoming/past bookings, update contact preferences, and manage account access. |
| DIS-11 | Trust and required public disclosures | P1 | Relevant pages show price context, emergency disclaimer, grievance contact/link, privacy notice, consent, and sponsored labels where applicable. |
| DIS-12 | Authentic review capture and display | P1 | Reviews are linked to eligible completed visits, moderated under a documented policy, and never purchased or incentivized. |
| DIS-13 | Search and booking analytics | P1 | Funnel events measure discovery-to-booking and drop-off without sending unnecessary sensitive data to analytics. |

## P2 — Clinic workflow and retention (MVP 2–3)

| ID | Backlog item | Priority | Acceptance summary |
|---|---|---:|---|
| PMS-01 | Clinic staff and dentist account administration | P2 | Owner can invite, deactivate, and assign least-privilege roles; access changes are audited. |
| PMS-02 | Multi-doctor, multi-chair schedule | P2 | Clinic can configure calendars, working hours, time off, walk-ins, waitlist, and conflict prevention. |
| PMS-03 | Patient chart and visit history | P2 | Authorized staff can create and review structured history, alerts, notes, and attachments with version history and audit. |
| PMS-04 | Dental and periodontal charting | P2 | Chart changes are attributable, time-stamped, and retained according to approved policy. |
| PMS-05 | Treatment plan and patient approval | P2 | Clinic can present phased options, costs, status, and capture patient decision/consent. |
| PMS-06 | Prescription and clinical documents | P2 | Authorized clinician can create, sign, and provide prescriptions/referrals/documents; clinician remains responsible for content. |
| PMS-07 | Invoicing and payment recording | P2 | Clinic can create invoices, receipts, part payments, refunds/adjustments, and outstanding balances with auditable calculations. |
| PMS-08 | Expenses and clinic reporting | P2 | Clinic owner can review collections, expenses, outstanding dues, and doctor/chair summaries with defined calculations. |
| PMS-09 | Recall and follow-up campaigns | P2 | Clinic can schedule patient follow-ups based on consent and communication preferences; opt-outs are honored. |
| PMS-10 | Inventory and purchase workflow | P2 | Stock tracked by item/batch/expiry; usage, low-stock alert, and purchase order status are auditable. |
| PMS-11 | Laboratory work orders | P2 | Clinic can create a case with specifications and attachments; lab status, trial/rework, delivery, and reconciliation are traceable. |
| PMS-12 | Clinic analytics dashboard | P2 | Reports derive from defined source events and match underlying booking/billing data. |
| PMS-13 | PWA/offline resilience assessment | P2 | Selected low-connectivity clinic workflows have explicit offline behavior, conflict handling, and safe sync; clinical data is not silently lost. |

## P2 — Commerce and network expansion (MVP 4)

| ID | Backlog item | Priority | Acceptance summary |
|---|---|---:|---|
| MKT-01 | Vendor and laboratory onboarding/verification | P2 | Business credentials, contact, tax and payout data are validated and approved before selling. |
| MKT-02 | Product and laboratory catalogues | P2 | Sellers manage accurate catalogue, pricing, availability, service area/capability, and policy information. |
| MKT-03 | Quotes and orders | P2 | Clinic can request quotes, compare responses, order, and track status; parties see only permitted transaction data. |
| MKT-04 | Payment provider abstraction and Razorpay integration | P2 | Payment status is signed/verified server-side; duplicate callbacks are idempotent; settlement, fees, refunds, and reconciliation are recorded. |
| MKT-05 | Shipping, returns, disputes, and seller support | P2 | Order exceptions have explicit states, ownership, evidence, and resolution history. |
| MKT-06 | Education courses and events | P2 | Verified providers can publish offerings; dentists can register, receive updates, and access certificates/credits where applicable. |
| MKT-07 | Jobs, locum shifts, and classifieds | P2 | Listings have ownership, moderation, expiry, reporting, and relevant verification controls. |
| MKT-08 | Sponsored placement controls | P2 | Sponsored content is always labelled; booking path has no ads; search-page and mobile ad-density limits are enforced. |
| MKT-09 | Subscription and commission billing | P2 | Pricing, tax invoices, renewals, failed payments, cancellation, and commission reconciliation have clear user-visible states. |

## P3 — Scale, integrations, and intelligence (MVP 5)

| ID | Backlog item | Priority | Acceptance summary |
|---|---|---:|---|
| SCL-01 | Search scale and relevance improvements | P3 | Migration from managed search to larger-scale search is behind an abstraction and validated against relevance/performance metrics. |
| SCL-02 | ABDM sandbox and production integration | P3 | Consent, security, audit, interoperability, sandbox validation, and required independent review gates are met before production data exchange. |
| SCL-03 | Mobile applications | P3 | Native app workflows are prioritized from usage evidence; authentication, notifications, privacy, and release management match web requirements. |
| SCL-04 | Analytics data platform and aggregate benchmarks | P3 | Aggregations have privacy thresholds, access controls, purpose limits, and documented retention; identifiable records are not exposed. |
| SCL-05 | Assistive voice charting and documentation AI | P3 | Clinician reviews and approves generated content before saving; source/transcription, corrections, and model use are auditable and consent-aware. |
| SCL-06 | AI search intent and patient FAQ assistance | P3 | Responses are bounded, sourced from approved content, avoid diagnosis, provide escalation to a clinician/emergency care when appropriate, and are evaluated for unsafe output. |
| SCL-07 | Imaging decision-support integration | P3 | Only appropriate reviewed tools are integrated; outputs are suggestions, clinicians decide, and acceptance/override is logged. |
| SCL-08 | Multi-region and international readiness | P3 | Data residency, localization, address/phone, currency, payment, and jurisdiction requirements are assessed before expansion. |

## Definition of ready

An item can enter a sprint when it has:

- User, problem, and expected outcome identified.
- Acceptance criteria and important error/empty/loading states defined.
- Data classification, permissions, consent, and retention implications reviewed.
- Dependencies and external services identified, with failure behavior specified.
- Design or prototype reference and responsive behavior identified where relevant.
- Test cases and measurement/analytics requirements written.

## Definition of done

An item is complete when:

- Acceptance criteria are met and code is reviewed.
- Unit, integration, contract, and/or end-to-end tests appropriate to the change pass.
- Authorization, tenant isolation, consent, audit, privacy, and security implications are addressed.
- Accessibility and responsive behavior are checked; SEO and performance requirements are met for public pages.
- User-facing copy and required disclosures are present.
- Database migration, operational logging, monitoring, documentation, and rollback implications are handled.
- Staging acceptance is complete and production rollout has an owner and rollback plan.

## CI/CD backlog

CI/CD is part of MVP 0, not a later infrastructure task. Proposed implementation uses GitHub and GitHub Actions, with environment secrets stored outside source control. Workflow details should be adapted to the selected hosting and AWS deployment configuration.

### CI pipeline (every pull request)

1. Check out code and install dependencies using lockfiles and caching.
2. Validate formatting, lint, TypeScript types, and build.
3. Run unit and integration tests against isolated test services/database.
4. Validate database migrations against a clean database and a supported upgrade path.
5. Run API/schema contract checks and generate/validate API documentation.
6. Scan dependencies, secrets, container/image configuration, and static code for known issues.
7. Run accessibility smoke checks and SEO/structured-data checks for affected public pages.
8. Build and publish a preview/staging artifact; deploy to preview environment for review.
9. Run critical-path browser E2E tests and attach results/artifacts to the pull request.
10. Require passing checks, review approval, and migration/security sign-off where relevant before merge.

### CD pipeline

1. Merge to protected main branch creates a versioned, immutable artifact.
2. Deploy automatically to staging; apply backward-compatible migrations and run smoke tests.
3. Require release approval for production, with explicit approval for sensitive schema or clinical workflow changes.
4. Deploy gradually where supported; monitor error rates, latency, booking conversion, and service health.
5. Roll back application artifact automatically or manually on defined failure thresholds; database rollback plans must avoid destructive data loss.
6. Record release version, migration, owner, checks, and rollback outcome.

### Workflow files and scripts to create with the application

| Suggested file/script | Responsibility |
|---|---|
| `.github/workflows/ci.yml` | Pull request quality gate and test execution. |
| `.github/workflows/deploy-staging.yml` | Protected-branch staging build, deploy, migration, and smoke checks. |
| `.github/workflows/deploy-production.yml` | Approved production release, staged rollout, and rollback hooks. |
| `lint` | Lint frontend, API, shared packages, and configuration. |
| `typecheck` | TypeScript type validation. |
| `test:unit` | Fast isolated domain logic tests. |
| `test:integration` | API/database and provider adapter behavior. |
| `test:contracts` | API schema and external integration contracts. |
| `test:e2e` | Browser critical journeys. |
| `test:a11y` | Automated accessibility checks plus documented manual assistive-technology checks. |
| `test:seo` | Canonical, metadata, sitemap, robots, JSON-LD, and required disclosure checks. |
| `test:security` | Dependency, secret, static analysis, auth/authorization, and tenant-isolation checks. |
| `test:performance` | Mobile page performance and API/search load checks against agreed targets. |
| `test:recovery` | Backup restore, retry/idempotency, degraded dependency, and rollback exercises. |

No specific workflow or package script is assumed to exist yet; create these as part of foundation implementation and select tools that fit the final application repository.

## Test coverage by release gate

| Gate | Minimum evidence |
|---|---|
| MVP 0 foundation | Auth and role tests; cross-tenant access denial; audit and consent persistence; migration checks; backup restore evidence; secret/dependency scan. |
| MVP 1 pilot | Clinic registration and approval E2E; search filtering and empty results; booking request/confirm/decline/reschedule/cancel E2E; notification retry/idempotency; mobile accessibility and performance; SEO/disclosure checks. |
| MVP 2 clinical workflow | Patient record access control; version/audit trail; prescription and invoice accuracy; consent withdrawal behavior; clinic staff permission matrix; clinical workflow review with pilot users. |
| MVP 3 operations | Inventory adjustment and expiry; lab case state transitions/rework; reporting reconciliation; recall opt-out; queue and messaging outage behavior. |
| MVP 4 marketplace | Seller verification; order lifecycle; payment signature/callback idempotency; refund and settlement reconciliation; returns/dispute path; ad labels and booking-path ad exclusion. |
| MVP 5 scale/integrations | Load and failover tests; ABDM sandbox and security evidence; AI safety and clinician approval tests; privacy review of aggregates; regional data handling review. |

## CI/CD release principles

- Keep `main` releasable; require reviewed pull requests and passing automated checks.
- Never put credentials, tokens, or production health data in source control, logs, fixtures, or screenshots.
- Use synthetic test data and isolated test tenants.
- Make payment, messaging, and search integrations replaceable behind service interfaces; test failure and retry paths.
- Version schema changes and prefer backward-compatible expand/migrate/contract deployments.
- Public pages must meet the IDW discovery, trust, speed, and citation standards; do not trade away performance or the booking experience for advertising.
- Clinical AI remains assistive; a licensed clinician reviews clinical output before it becomes part of a record or care decision.
- Define operational targets and alert thresholds before production launch; review incidents and failed releases to improve the pipeline.

## First implementation sequence

1. Refine and approve P0 stories; identify the MVP pilot clinics and success measures.
2. Build repository/application skeleton and CI checks.
3. Implement identity, organizations, clinic tenancy, roles, consent, audit, and secure storage foundations.
4. Implement clinic onboarding and verification, then public profiles and search.
5. Implement booking and notifications with critical-path end-to-end tests.
6. Run pilot, resolve workflow/performance/security gaps, and decide whether to proceed to MVP 2.

The backlog should be re-ranked after each pilot using clinic activation, search-to-booking conversion, booking completion, clinic retention, workflow usage, support burden, and reliability evidence.
