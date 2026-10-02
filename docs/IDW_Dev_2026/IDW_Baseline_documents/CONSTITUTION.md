# CONSTITUTION: Dentist & Clinic Finder

**Version:** 1.0
**Ratified:** 2026-09-30
**Applies to:** every document and every line of code in this project, written by people or by AI tools.

This document holds the principles that do not change from feature to feature. It is deliberately short. `SPEC.md`, `PLAN.md`, and `TASKS.md` must comply with it. If they conflict, **this document wins**, then `SPEC.md`, then `PLAN.md`, then `TASKS.md`, then code.

---

## Articles

### I. Patient privacy and safety come first
The product handles health information. Therefore:
1. Access to personal and clinical data is **denied by default** and granted only through the central policy layer (PLAN ADR-008). No handler makes its own access decision.
2. Clinical content never appears in logs, analytics, error reports, notifications, URLs, or AI prompts.
3. Consent is explicit, specific, recorded with a version, and withdrawable. We collect the minimum data needed for a stated purpose.
4. Every access to a clinical record is logged and visible to the patient.
5. Real patient data is never used in development, testing, demos, or AI-assisted work. Use synthetic data.

### II. The spec is the source of truth
1. Work flows in one direction: **Constitution → SPEC → PLAN → TASKS → code → verification.**
2. Every task cites the requirement IDs and acceptance criteria it satisfies. Work with no requirement is not done; it is questioned.
3. If the code and the spec disagree, **fix the document first, then the code**. Silent drift is a defect.
4. Requirements describe what and why. Technical choices live in the plan and are recorded as ADRs.

### III. Correctness before convenience for bookings and records
1. Invariants that must never be broken (no double booking, no unauthorized record access) are enforced where they **cannot be bypassed** (database constraints and the central policy layer), not only in application code or the interface.
2. Operations that a client may retry are idempotent.
3. Time is handled in UTC with explicit IANA time zones and an injected clock. No server-local time in domain code.

### IV. Tests come from the acceptance criteria
1. Every P0 acceptance criterion has an automated test before the feature is considered done.
2. Integration tests use a real PostgreSQL with the required extensions. The database is not mocked.
3. External services (SMS, email, maps, storage) are tested through fake adapters, and one test per adapter runs against the vendor sandbox before release.
4. Authorization has an exhaustive allow/deny matrix test. A new endpoint without an authorization test does not merge.

### V. Keep it simple
1. Prefer boring, well-understood technology. A new service, datastore, or framework needs an ADR that shows why the current stack cannot do the job.
2. Start as a modular monolith with enforced module boundaries (PLAN §2). Extract only when a measured problem demands it.
3. Do not build for imagined scale or imagined features. Build what the current milestone needs, and keep the design open for the next.

### VI. Secure by default
1. No hand-rolled cryptography, password hashing, or session handling. Use vetted libraries.
2. Secrets live only in the secret manager and the runtime environment, never in the repository, logs, or prompts.
3. All input is validated at the edge and all output is escaped. User-generated content carries a moderation status and is public only when approved.
4. Rate limits protect every public and authentication endpoint.
5. Dependencies are scanned. High and critical findings block release.

### VII. Accessible and usable for everyone
1. Meet **WCAG 2.2 AA**. Everything works with a keyboard and a screen reader, including the map alternative and the slot picker.
2. Design mobile-first and for slow connections. Core flows (search, profile, booking) must remain usable on a mid-range phone on 4G.
3. Plain language. Errors say what happened and what to do next, without exposing internals.

### VIII. Honesty and trust
1. Ratings and reviews cannot be bought, hidden, or influenced by plans or payment. Paid placement, if it exists, is clearly labelled.
2. A "verified" badge means exactly what it says (an admin checked the registration) and nothing more. Provider-declared information is labelled as such.
3. We do not publish health claims, rankings, or outcomes we cannot substantiate.
4. Patients are never misled about availability: shown slots are bookable, and a failed booking explains why.

### IX. Operable in production
1. Every feature that can fail has a log line, a metric, and (if user-impacting) an alert, with personal data redacted.
2. Backups are restored in a drill before launch and on a schedule after.
3. Risky features (booking, records, reviews) ship behind feature flags with a tested kill switch.
4. Runbooks exist for incidents, key rotation, dead-letter queues, and moderation queues.

### X. Change with discipline
1. Small, reviewable changes. Each pull request links its task and requirement IDs.
2. Architectural decisions are recorded as ADRs with options considered and consequences. Superseded decisions are marked, not deleted.
3. Database migrations are forward-only and reviewed. Destructive changes use expand/contract.
4. Public API changes are versioned. Breaking changes need a new version.

### XI. AI-assisted development rules
AI coding tools are welcome and held to the same standard as any contributor.
1. Give the tool **one task at a time** with `CONSTITUTION.md`, `SPEC.md`, `PLAN.md`, and the task row.
2. The tool must state the acceptance criteria it is satisfying, write or update tests first, and report conflicts instead of resolving them silently.
3. The tool must not invent requirements, change the spec or plan on its own, add dependencies without an ADR, or weaken a test to make it pass.
4. **A human reviews every change to security-critical code**: authentication, authorization and policy functions, record access, encryption, payments-adjacent logic, migrations, and anything touching consent.
5. No secrets, real patient data, or private documents are placed in prompts.

---

## Governance

- **Amendments:** Propose a change as a pull request that edits this file, with the reason and affected documents. Approval by the project owner is required. Bump the version (major for removed or reversed principles, minor for new or expanded ones, patch for wording).
- **Exceptions:** A deviation from an article needs an ADR that names the article, explains why, sets an expiry or review date, and is approved by the owner. Without that, the article applies.
- **Legal and compliance:** Where an article and a legal obligation differ, the legal obligation applies and the article is amended. Legal questions are resolved with counsel, not by engineers or AI tools.
- **Review cadence:** Review this document at the end of each milestone and before launch.

## Constitution check (use in plan reviews and pull requests)

- [ ] Does it expose or log clinical or personal data anywhere new? (I)
- [ ] Does every new endpoint go through the policy layer and have allow/deny tests? (I, IV)
- [ ] Is each invariant enforced where it cannot be bypassed? (III)
- [ ] Is it traced to requirement IDs and acceptance criteria, with tests derived from them? (II, IV)
- [ ] Is anything new being added (service, dependency, datastore) without an ADR? (V)
- [ ] Is user-generated content sanitized, scanned, and moderated before it is public? (VI)
- [ ] Is it accessible by keyboard and screen reader, and usable on a slow mobile connection? (VII)
- [ ] Could it mislead patients or affect ratings in any way? (VIII)
- [ ] Are logging, metrics, alerts, and a kill switch in place if it can fail in production? (IX)
- [ ] Was security-critical code reviewed by a human? (XI)
