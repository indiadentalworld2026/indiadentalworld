# IDW platform: compliance core (database layer)

This is the first piece of the real IndiaDentalWorld platform. It holds the rules that
make the product compliant, enforced **inside the database** so no screen or API route can skip them.
The Next.js app (screens, sign-in, payments) is built on top of this.

**Status: tested on PostgreSQL 16. 60 automated checks pass. Not yet reviewed by a security
engineer or a lawyer. Do not load real patient data until both have signed off.**

## What is in the box

| File | Purpose |
|---|---|
| `db/001_schema.sql` | Tables: users, organisations (clinic, lab, vendor, institute), consents, notice versions, audit log, data requests, grievances, verification submissions, appointments, reviews, sponsored placements, settings, feature flags |
| `db/002_functions.sql` | The rules (see the table below) |
| `db/003_seed.sql` | Starting values. Everything marked placeholder needs your lawyer |
| `db/tests/test_compliance.sql` | 60 checks, run in a transaction that is rolled back |
| `db/run_tests.sh` | Builds a throwaway database, loads everything, runs the checks |

Run the tests: install PostgreSQL 14 or newer, set `PGHOST`, `PGPORT`, `PGUSER`, then `./db/run_tests.sh`.
The last line must read `ALL COMPLIANCE TESTS PASSED`.

## Rules the database enforces

| Rule | How |
|---|---|
| Consent is recorded with wording version and time | `record_consent`; wording is stored as numbered, unchangeable versions |
| Consent must use the newest wording | `record_consent` refuses an older version |
| Withdrawing consent is as easy as giving it | `withdraw_consent`, one call |
| Consent history cannot be edited or deleted | Triggers on `consents` |
| Audit trail cannot be changed, and tampering is detected | Hash-chained `audit_log`; `verify_audit_chain()` |
| Export my data | `request_data_export`, `fulfil_data_export` |
| Delete my data | `request_data_deletion`, `execute_data_deletion` (removes name, phone, email, review text; keeps anonymous ratings, audit trail and consent history) |
| Response deadlines | Set from the `settings` table on every data request and grievance |
| Grievance Officer workflow | `submit_grievance`, `resolve_grievance` |
| "Verified" badge needs a person's approval and expires | `submit_verification`, `claim_verification`, `decide_verification`, `expire_verifications`; the badge is the `verified_organisations` view |
| Nobody approves their own verification | `decide_verification` |
| Reviews only after a completed visit; no editing or deleting | Triggers on `reviews`; only an admin can hide one, with a recorded reason (`moderate_review`) |
| Only the reviewed clinic can reply | Trigger on `review_replies` |
| Sponsored placements start OFF, are labelled "Sponsored", need a verified clinic, max 2 per page | `feature_flags`, trigger on `sponsored_placements` |
| Booking commission, WhatsApp lead fee, brand partnerships start OFF | `feature_flags`; enabling needs a named approver and is audited (`set_feature_flag`) |

## What the app must call

| Screen or action | Database call |
|---|---|
| Consent checkbox, preferences page | `record_consent`, `withdraw_consent`, view `current_consents` |
| Patient dashboard: "Download my data" | `request_data_export` |
| Patient dashboard: "Delete my account" | `request_data_deletion` |
| Admin: data requests queue | `fulfil_data_export`, `execute_data_deletion` |
| Grievance form and officer inbox | `submit_grievance`, `resolve_grievance` |
| Clinic registration: upload registration | `submit_verification` |
| Admin: verification queue | `claim_verification`, `decide_verification` |
| Daily scheduled job | `expire_verifications()` |
| Search results and clinic pages: badge | view `verified_organisations` |
| Review form | plain insert into `reviews` (the database checks the rules) |
| Admin: hide a review | `moderate_review` |
| Admin: switch a revenue feature on | `set_feature_flag` |
| Admin: audit check | `verify_audit_chain()` (should return no rows) |

## Settings your lawyer must confirm

All are in the `settings`, `feature_flags` and `notice_versions` tables, so changing them needs
no code change. Placeholder values are **not legal advice**.

- Notice wording for each purpose (privacy, terms, location, search history, marketing) is placeholder text.
  Publishing the approved text means adding a new version, never editing the old one.
- `data_request_response_days` (30), `grievance_response_days` (15), `verification_validity_days` (365).
- `max_sponsored_per_page` (2).
- What deletion removes and what it must keep (consent history, ratings, audit trail, appointments).
- Whether booking commission, WhatsApp lead fee and sponsored placements may be switched on at all.

## Not built yet (be clear on this)

- The Next.js app: sign-in with phone OTP, screens, API routes, uploads, payments, WhatsApp.
  The environment this was built in could not reach the npm package registry, so the app layer
  has to be built where it can.
- The app must connect to the database with a restricted account that can call these functions and
  read its own data, not with an owner account. Row-level security is not configured yet.
- Column-level encryption of phone and email, and the key management for it.
- Hosting: AWS Mumbai region, encrypted storage, automatic backups, restricted network access.
- Breach response procedure, written policies, grievance page text (lawyer).
- Review of all of the above by a security engineer before real data is loaded.
