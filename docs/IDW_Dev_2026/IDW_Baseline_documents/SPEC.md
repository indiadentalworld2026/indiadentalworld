# SPEC: Dentist & Clinic Finder with Patient Accounts and Appointment Booking

**Status:** Draft v0.4
**Owner:** TBD
**Last updated:** 2026-09-30

**Governing document:** `CONSTITUTION.md` (non-negotiable principles; it takes precedence over this file).
**Related documents:** `PLAN.md` (technical decisions, data model, API), `TASKS.md` (ordered work items). This file states *what* and *why*; it deliberately avoids implementation choices.

**Changelog**
- **v0.4:** Added 12 more user stories (US-11 to US-22) from IDW's profile pages, directory pages, and professional registration/plan page: directory browsing, credentials, branches, showcase content, verified-visit reviews, listing claims, trial plans, digital prescription and billing records, daily digest, policy and support pages, and an installable web app. Added requirements (S-8/9, P-8..12, A-10..14, REC-9/10, D-10..15, N-7/8, RV-, SUP-, W-1), AC-22 to AC-35, and open questions 15-21. Reviews moved from non-goal into scope; F-1 taxonomy expanded to 12 specialties; timeline updated to about 16 weeks.
- **v0.3:** Split out technical content. The data model, API, technical approach, and milestones moved to `PLAN.md` and `TASKS.md`. Sections renumbered. Removed implementation details from requirements and NFRs.
- **v0.2:** Added 10 user stories based on the public home page of indiadentalworld.com (IDW). Brought patient login, appointment booking, provider availability, dental records, and a dentist portal into v1 scope. Added requirements (U-, B-, REC-, D-, C-, N-), acceptance criteria AC-10 to AC-21, data model, API, milestones, and open questions.
- **v0.1:** Initial search-only spec.

> **How the stories were derived:** They come from features IDW advertises publicly on its home page, dentist profile and listing pages (city, locality, and state directories), and its professional registration and subscription-plan page: find a dentist by locality or specialization, view profiles (credentials, branches, gallery, videos, reviews), book an online appointment, access dental records maintained by the dentist, separate Patient and Professional logins, claiming an existing profile, subscription plans, practice-management features (prescriptions, billing), and policy and contact pages. Logged-in flows were not visible, so behavior details (slot rules, permissions, policies) are design decisions made in this spec, not a description of IDW's implementation. Section 2.4 shows which IDW features are covered and which are deliberately deferred.

---

## 1. Overview

### 1.1 Problem
People looking for a dentist struggle to find one that is nearby, offers the treatment they need, has a time slot that works, and is trustworthy. Booking usually means phoning a clinic during working hours, and patient history is scattered across paper files and clinics.

### 1.2 Goal
A web app where a patient can **search** for dentists and clinics by location, name, specialty, and service; **see real availability and book an appointment**; **log in** to manage appointments; and **access their dental records** kept by their dentist. Dentists and clinics get a portal to manage their profile, availability, appointments, and patient records.

### 1.3 Success metrics (first 90 days after launch)
| Metric | Target |
|---|---|
| Search-to-profile-view rate | >= 40% |
| Profile-view-to-action rate (book / call / directions / website) | >= 20% |
| Booking completion rate (slot selected to confirmed) | >= 60% |
| Double-booked slots | 0 |
| Published providers with live availability | >= 50% |
| Appointment no-show rate (tracked, reduced by reminders) | Baseline, then -20% |
| Completed appointments followed by a review | >= 10% |
| Reviews held or reported that are resolved within the moderation SLA | >= 95% |
| Claimed listings among imported listings in pilot city | >= 20% |
| Search p95 response time | < 800 ms |
| Searches returning zero results | < 10% |
| Lighthouse performance (mobile) | >= 85 |

### 1.4 Non-goals (v1)
- Online payments, deposits, invoices, or insurance claims and verification
- Video consultation / telehealth and in-app chat
- Native mobile apps (web is responsive; the API is designed so apps can follow)
- Paid or incentivized reviews, and any way for providers to buy removal of reviews (never allowed); free-text review features beyond RV-1..RV-8
- Marketplace features: oral care product store and cart, jobs board, CDE courses, events, dental labs directory
- Clinic microsites with custom domains, branded email addresses, dental tourism promotion, and professional networking
- Integration with national health ID / health record exchange systems (evaluate later)
- Collecting subscription payments online (plan entitlements and trial periods are modeled; payment is handled offline and plans are activated by an admin)

---

## 2. Users & Scenarios

### 2.1 Personas
- **Patient (primary):** Needs a dentist, often urgently or for a specific treatment. Mostly on mobile. May book for themselves or a family member.
- **Dentist (primary):** Independent practitioner or associate in a clinic. Wants bookings, a public profile, and a simple way to keep patient records.
- **Clinic staff:** Receptionist or manager who manages the calendar and profile but should not see clinical notes unless permitted.
- **Admin (internal):** Verifies professionals, moderates content and reports, manages taxonomy and data quality.

### 2.2 Key scenarios
1. *Near me, now:* "I have a toothache. Show clinics open now within 5 km with a slot today."
2. *Specific treatment:* "Find orthodontists in my neighborhood who offer clear aligners and book a consultation."
3. *Returning patient:* "Log in, see my upcoming visit, reschedule it, and look at what my dentist wrote after my last root canal."
4. *Dentist's day:* "See today's appointments, mark patients as completed, add visit notes, and block next Friday for leave."
5. *New practice:* "Register my clinic, get verified, set my hours, and start receiving bookings."
6. *Trust check:* "Before booking, compare two dentists' credentials, branches, photos, and reviews."
7. *Claiming a listing:* "My clinic already appears on the platform; I want to take control of it."
8. *After the visit:* "Get my prescription digitally and leave a review of my dentist."

### 2.3 User stories

Priority: **P0** = required for launch, **P1** = should have, **P2** = nice to have.

**US-1: Find a dentist near me** (P0)
*Source on IDW: "Find a Dentist: search by locality or doctor specialization"; city pages such as "Dentists in Bangalore".*
As a **patient**, I want to search for dentists and clinics by locality and specialization, so that I can shortlist ones that are close and suit my need.
- Covers: S-1 to S-7, F-1 to F-8, R-1 to R-6, C-3
- Acceptance: AC-1, AC-2, AC-3, AC-4, AC-6

**US-2: View a dentist's profile** (P0)
*Source: "View Profile: look at the profile pages of various dental surgeons".*
As a **patient**, I want a detailed profile of a dentist or clinic (services, qualifications, address, hours, photos, next available slot), so that I can decide whom to trust and contact.
- Covers: P-1 to P-7
- Acceptance: AC-7

**US-3: Create an account and log in** (P0)
*Source: "Login/Register" with a separate Patient tab and "Forgot Password".*
As a **patient**, I want to register and log in securely with my mobile number or email, so that I can book appointments and see my history.
- Covers: U-1 to U-8, N-4
- Acceptance: AC-10, AC-11, AC-21

**US-4: See availability and book an appointment** (P0)
*Source: "Book Appointment: choose the dentist suitable for your needs and book on-line appointment"; testimonials mention booking instantly from a phone.*
As a **patient**, I want to see a dentist's open time slots and book one in a few taps for myself or a family member, so that I don't have to call the clinic.
- Covers: B-3 to B-8, B-11, N-1
- Acceptance: AC-12, AC-13, AC-14

**US-5: Manage my appointments** (P0)
*Source: implied by online booking; not explicitly described by IDW.*
As a **patient**, I want to see, cancel, or reschedule my appointments and receive reminders, so that my plans are flexible and I don't miss visits.
- Covers: B-9, B-10, B-14, N-2, N-3
- Acceptance: AC-15

**US-6: Access my dental records** (P0)
*Source: "Access Records: dentist would maintain your dental record which is also accessible to you".*
As a **patient**, I want to view the visit records my dentist has created and control who else can see them, so that I have my treatment history in one place.
- Covers: REC-3 to REC-6
- Acceptance: AC-16, AC-21

**US-7: Manage availability and appointments as a dentist** (P0)
*Source: separate "Professionals" login and professional tools.*
As a **dentist or clinic staff member**, I want to define my working hours, block time off, and manage incoming appointments, so that patients can only book times I can actually serve.
- Covers: B-1, B-2, B-7, B-10, B-11, D-2, D-4, D-5, D-7
- Acceptance: AC-12, AC-13, AC-17

**US-8: Maintain patient records** (P0)
*Source: "Dentist would maintain your dental record".*
As a **dentist**, I want to record diagnosis, treatment, prescriptions, and attachments such as X-rays against each visit, so that the patient and I have an accurate history.
- Covers: REC-1, REC-2, REC-5 to REC-7, D-6
- Acceptance: AC-16, AC-18

**US-9: Join and promote my practice** (P0)
*Source: "Promote your Practice" and the dentist membership offer.*
As a **dentist or clinic owner**, I want to register my practice, get verified, and publish a profile, so that patients can find and book me.
- Covers: D-1, D-3, D-8, A-2, A-7
- Acceptance: AC-8, AC-19

**US-10: Learn about a treatment, then find a dentist for it** (P1)
*Source: "Dental Healthcare" guides (root canal, braces, child dentistry, implants, dentures, gum disease, crowns, cavities) and blog.*
As a **patient**, I want to read trustworthy guides about treatments and go straight to dentists who offer them, so that I understand what to expect before I book.
- Covers: C-1, C-2, C-4, C-5
- Acceptance: AC-20

**US-11: Browse dentists by state, city, and locality** (P1)
*Source on IDW: footer city links, and directory pages per state, city, and neighborhood, with separate "Dentist" and "Dental Clinic" views.*
As a **patient**, I want to browse dentists and clinics by state, city, and neighborhood and switch between individual dentists and clinics, so that I can explore options without knowing exactly what to type.
- Covers: S-8, S-9, C-3, P-11
- Acceptance: AC-22

**US-12: Check a dentist's credentials** (P1)
*Source: profile shows academic qualification, years of experience, languages spoken, memberships, registrations, and certifications.*
As a **patient**, I want to see a dentist's qualifications, registration, memberships, certifications, experience, and languages, and whether the registration was verified, so that I can trust who I am booking. As a **dentist**, I want to add and maintain these details.
- Covers: P-8, D-11, A-7
- Acceptance: AC-23

**US-13: See a dentist's branches and book at the right one** (P1)
*Source: a "Branches" section listing each location's address, phone, weekly hours (including split shifts), and its own "Book Appointment" button.*
As a **patient**, I want to see every location where a dentist practices with its hours and book at a specific one, so that I go to the branch that suits me. As a **dentist**, I want to manage my locations and their hours.
- Covers: P-9, D-12, B-1, B-5
- Acceptance: AC-24

**US-14: See a practice's work: photos, videos, case studies, articles** (P2)
*Source: profile gallery, embedded videos, and Case Studies, Blogs, and Publications tabs; registration page promises showcasing skill with pictures and videos.*
As a **patient**, I want to see a practice's photos, videos, case studies, and articles, so that I get a sense of the clinic and the quality of work. As a **dentist**, I want to publish these safely, with patient consent where needed.
- Covers: P-10, D-13, A-11
- Acceptance: AC-34

**US-15: Read and write reviews** (P1)
*Source: profile shows a rating and review count with a Reviews tab; the plans promise ratings and reviews from patients; the home page shows patient testimonials.*
As a **patient**, I want to read reviews from real patients and leave my own after a visit, so that I can choose and help others choose. As a **dentist**, I want to see and respond to reviews.
- Covers: RV-1 to RV-8, P-12, D-14, A-11
- Acceptance: AC-25, AC-26, AC-27

**US-16: Claim an existing listing** (P1)
*Source: unclaimed profiles show "Claim Login", which sends login details after entering mobile, email, and a captcha; registration starts by searching for an existing profile by registered mobile or email.*
As a **dentist or clinic owner** whose practice already appears on the platform, I want to claim and take control of the listing after verifying who I am, so that I do not create a duplicate and patients see accurate information.
- Covers: D-1, D-10, A-7, A-12
- Acceptance: AC-28

**US-17: Start on a trial and understand my plan** (P2)
*Source: registration offers a free trial and tiered paid plans that unlock online appointments, patient history, SMS quotas, and search placement; accounts are activated by staff after payment.*
As a **dentist**, I want a trial period and clear plan details, so that I can try online booking before I commit. As an **admin**, I want to activate, extend, and end plans without engineering help.
- Covers: D-8, D-15, N-8, A-10
- Acceptance: AC-32

**US-18: Give and receive a digital prescription** (P1)
*Source: the practice-management features include digital prescriptions.*
As a **dentist**, I want to write a prescription as part of the visit and give the patient a printable copy, and as a **patient**, I want to keep it with my records, so that I do not depend on paper.
- Covers: REC-9, REC-5, REC-6
- Acceptance: AC-29

**US-19: Record and share a bill for a visit** (P2)
*Source: the practice-management features include digital billing.*
As a **dentist**, I want to record itemized charges for a visit and give the patient a bill or receipt, and as a **patient**, I want to see what I was charged, so that costs are transparent. Payment happens outside the platform in v1.
- Covers: REC-10
- Acceptance: AC-30

**US-20: Get a daily appointment summary** (P1)
*Source: the mid-tier plan includes a daily appointments SMS and monthly SMS quotas.*
As a **dentist or clinic staff member**, I want a daily summary of upcoming appointments by SMS or email, so that I can prepare without opening the app.
- Covers: N-7, N-8
- Acceptance: AC-31

**US-21: Read policies, contact support, and give feedback** (P0 policies, P1 support)
*Source: footer pages (About, Contact, Privacy Policy, Terms, Disclaimer, Sitemap) and "Report Issue" and "Feedback" links on profiles.*
As **any visitor**, I want to read the policies that apply to me, reach a human, and report a problem or give feedback, so that I know my rights and can get help.
- Covers: SUP-1 to SUP-5, P-5, A-13, A-14
- Acceptance: AC-33

**US-22: Use the service like an app on my phone** (P2)
*Source: IDW promotes a mobile app and sending the download link to a mobile number; a testimonial praises booking from a phone.*
As a **patient**, I want to add the site to my phone's home screen and have it load quickly, so that booking and checking appointments feels like using an app. Native apps remain out of scope.
- Covers: W-1
- Acceptance: AC-35

### 2.4 Coverage of IDW features

| IDW feature | Status in this project |
|---|---|
| Find dentist or clinic by locality or specialization | US-1, US-11 |
| Dentist / Dental Clinic views | US-11 (S-8) |
| Profile: services, hours, address, contact | US-2 |
| Profile: qualifications, registrations, memberships | US-12 |
| Profile: branches | US-13 |
| Profile: gallery, videos, case studies, blogs, publications | US-14 |
| Ratings and reviews | US-15 |
| Book appointment (IDW form asks date, time, name, mobile) | US-4. Here booking uses real slots and an OTP-verified mobile number instead of free-typed times |
| Access dental records kept by the dentist | US-6, US-8 |
| Practice management: scheduling, records, prescriptions, billing, stored radiographs | US-7, US-8, US-18, US-19 |
| Patient and professional logins, forgot password | US-3, D-2 |
| Claim login for existing profiles | US-16 |
| Register practice, free trial, paid plans | US-9, US-17 |
| Daily appointments SMS | US-20 |
| Dental health guides, blog, videos, newsletter | US-10 |
| City, locality, and state pages | US-11 |
| About, Contact, Privacy, Terms, Disclaimer, Sitemap | US-21 |
| Mobile app | US-22 (installable web app). Native app deferred |
| Oral care product store and cart, jobs, dental labs, CDE courses, events, professional networking, branded email, full clinic website, dental tourism | **Deferred.** Not needed for search, booking, accounts, or records. Listed under Future |

---

## 3. Functional Requirements

### 3.1 Search

| ID | Requirement | Priority |
|---|---|---|
| S-1 | User can search by free text (dentist name, clinic name, service, specialty). | P0 |
| S-2 | User can specify a location by: (a) typing a city, neighborhood, address, or postal code with autocomplete; (b) using browser geolocation ("Use my location"). | P0 |
| S-3 | Results are limited to a radius, default 10 km, adjustable (1, 2, 5, 10, 25, 50 km). | P0 |
| S-4 | Text and location can be combined or used alone. If no location is given, the app prompts for one rather than returning global results. | P0 |
| S-5 | Search handles typos and partial words (e.g. "orthodntist" matches "orthodontist"). | P1 |
| S-6 | Search state (query, location, filters, sort, page) is reflected in the URL so results are shareable and back-button safe. | P0 |
| S-7 | If geolocation is denied or unavailable, the app falls back to manual location entry with a clear message. | P0 |
| S-8 | Results and directory pages can be switched between **individual dentists** and **clinics**. | P1 |
| S-9 | Users can browse and search by **locality (neighborhood)** within a city, using a maintained hierarchy of state, city, and locality. | P1 |

### 3.2 Filters & Sorting

| ID | Requirement | Priority |
|---|---|---|
| F-1 | Filter by specialty: general dentistry, cosmetic/aesthetic dentistry, dental implantology, endodontics, oral and maxillofacial surgery, oral pathology, oral radiology, orthodontics, pediatric dentistry (pedodontics), periodontics, preventive and community dentistry, prosthodontics. | P0 |
| F-2 | Filter by service (e.g. cleaning, root canal, implants, whitening, braces, aligners, extraction, emergency care). | P0 |
| F-3 | Filter "Open now" (based on clinic's local time zone and listed hours). | P0 |
| F-4 | Filter by languages spoken. | P1 |
| F-5 | Filter by accessibility (wheelchair accessible), accepts children, emergency/after-hours. | P1 |
| F-6 | Filter by minimum rating (if rating data exists). | P2 |
| F-7 | Sort by: distance (default when location set), relevance (default when text only), rating, **earliest availability**. | P0 |
| F-8 | Active filters are visible as removable chips; a "Clear all" control exists. | P0 |
| F-9 | Filter "Online booking available" and "Slots available today / this week". | P1 |

### 3.3 Results

| ID | Requirement | Priority |
|---|---|---|
| R-1 | Results shown as a list and as a map, with a toggle on mobile and side-by-side on desktop. | P0 |
| R-2 | Each result card shows: name, type (clinic / individual dentist), specialties, distance, address snippet, open/closed status, phone, rating (if any), photo (if any), **and next available slot with a "Book" button when online booking is enabled**. | P0 |
| R-3 | Selecting a map pin highlights the matching card and vice versa. | P1 |
| R-4 | Results are paginated (20 per page) or infinitely scrolled; total count is shown. | P0 |
| R-5 | "Search this area" button appears after the user pans/zooms the map. | P1 |
| R-6 | Empty state suggests widening the radius, removing filters, or checking spelling. | P0 |

### 3.4 Profile page

| ID | Requirement | Priority |
|---|---|---|
| P-1 | Each provider has a unique, stable, human-readable URL (`/clinics/{slug}`, `/dentists/{slug}`). | P0 |
| P-2 | Profile shows: name, description, qualifications, registration number (if verified), experience, specialties, services, full address, map, phone, website, opening hours, languages, accessibility, photos, associated dentists, last-verified date. | P0 |
| P-3 | Contact actions: click-to-call, "Get directions", "Visit website". | P0 |
| P-4 | A clinic page lists its dentists; a dentist page links to their clinic(s). | P1 |
| P-5 | Profile has a "Report incorrect info" link (form, no login). | P0 |
| P-6 | Profile includes structured data (schema.org `Dentist` / `LocalBusiness`) for SEO. | P1 |
| P-7 | Profile shows a **"Book appointment"** call to action and a next-7-days availability preview when booking is enabled; otherwise shows call/website actions only. | P0 |
| P-8 | **Credentials block:** primary and additional qualifications, years of experience, registration number(s) and council, professional memberships, certifications, and languages. A **"Registration verified"** badge appears only when an admin has approved the registration; unverified items are labelled as provider-declared. | P1 |
| P-9 | **Branches:** a profile lists every location where the dentist or clinic practices, each with address, phone, map, weekly hours (including split shifts), and its own "Book" button. | P1 |
| P-10 | **Showcase:** photo gallery, embedded videos, case studies, blog posts, and publications, each shown as a tab that is hidden when empty. | P2 |
| P-11 | Breadcrumbs on profile and directory pages (Home > Dentists > Locality, City > Name). | P1 |
| P-12 | Profile shows average rating, review count, and a paged review list (see RV-3). | P1 |

### 3.5 Admin

| ID | Requirement | Priority |
|---|---|---|
| A-1 | Admins authenticate with email + password and MFA. | P0 |
| A-2 | Admins can create, edit, unpublish, and delete providers, services, and specialties. Unpublishing stops new bookings; existing appointments are kept and both parties notified. | P0 |
| A-3 | Admins can bulk import providers from CSV with validation and a dry-run preview. | P1 |
| A-4 | Addresses are geocoded on save; admins can manually adjust the pin. | P0 |
| A-5 | Admins can view and resolve "Report incorrect info" submissions. | P1 |
| A-6 | All admin changes are audit-logged (who, what, when). | P1 |
| A-7 | Admins review professional registrations (registration number, documents) and approve, reject with reason, or request more information. | P0 |
| A-8 | Admins can suspend a user or provider; suspended providers cannot receive bookings. | P1 |
| A-9 | Admins manage treatment guides and articles (CMS) with draft/publish workflow. | P1 |
| A-10 | Admins manage plans and subscriptions: assign a trial, activate a paid plan after offline payment, extend or end a plan, with an audit trail. | P2 |
| A-11 | Admins moderate reviews, showcase media, and case studies through a queue with reasons, and can remove content. | P1 |
| A-12 | Admins review listing claims and resolve competing claims. | P1 |
| A-13 | Admins work a queue of support tickets and feedback. | P1 |
| A-14 | Admins publish new versions of legal documents (Privacy Policy, Terms, Disclaimer) with an effective date; consents reference the version. | P0 |

### 3.6 Patient accounts & authentication (US-3)

| ID | Requirement | Priority |
|---|---|---|
| U-1 | Patients can register and log in with **mobile number + one-time password (OTP)**. Email is optional at signup. | P0 |
| U-2 | Patients can alternatively use email + password, with email verification and a "Forgot password" flow. | P1 |
| U-3 | OTPs are single-use, expire in 10 minutes, and are limited to 5 attempts. Login and OTP requests are rate limited per identifier and IP; error messages do not reveal whether an account exists. | P0 |
| U-4 | A patient profile stores name, date of birth, gender, mobile, email, and city. | P0 |
| U-5 | A patient can add **family members / dependents** (e.g. child, parent) and book and view records for them. | P1 |
| U-6 | A patient can export their data and request account deletion (see 5.1 for what is retained). | P1 |
| U-7 | At registration the patient must accept Terms and Privacy Policy and give explicit consent to processing of health-related data; consent version and time are stored. | P0 |
| U-8 | Roles (`patient`, `dentist`, `clinic_staff`, `admin`) are enforced server-side on every endpoint. | P0 |
| U-9 | Sessions use secure, HttpOnly, SameSite cookies; users can log out of all devices. | P1 |
| U-10 | Booking is allowed only for logged-in users, but login can happen inline in the booking flow without losing the selected slot. | P0 |

### 3.7 Availability & booking (US-4, US-5, US-7)

| ID | Requirement | Priority |
|---|---|---|
| B-1 | A dentist (or authorized clinic staff) defines a **weekly schedule** per clinic location: working days, start/end times, breaks, slot length (e.g. 15/30/60 min), and buffer between appointments. | P0 |
| B-2 | Schedule **exceptions**: holidays, leave, one-off closures, and extra hours for specific dates. Exceptions override the weekly schedule. | P0 |
| B-3 | The system computes **available slots** as: schedule minus exceptions minus existing active appointments, honoring minimum notice and booking horizon. All times are evaluated in the clinic's IANA time zone and displayed with the zone. | P0 |
| B-4 | Providers can define **appointment types** (e.g. Consultation, Cleaning, Root canal sitting) with durations. A default type exists so providers can start without configuring anything. | P1 |
| B-5 | A patient books by selecting dentist, appointment type or reason, slot, and patient (self or dependent), with an optional note. A summary and confirmation step precede submission. | P0 |
| B-6 | **A slot can never be double booked.** The guarantee holds for every client and code path, and concurrent requests for one slot result in exactly one success. | P0 |
| B-7 | Per-provider **booking mode**: *instant confirmation* (default) or *requires approval* (status `pending` until the dentist confirms, with auto-expiry after a configurable time). | P0 (instant), P1 (approval) |
| B-8 | Per-provider settings: minimum notice (default 2 hours), booking horizon (default 60 days), cancellation cutoff (default 2 hours before start). | P1 |
| B-9 | A patient can cancel until the cutoff and reschedule (which is a cancel plus rebook, atomically) subject to the same rule. After the cutoff, the UI shows the clinic phone number. | P0 (cancel), P1 (reschedule) |
| B-10 | A provider can cancel, decline, or reschedule an appointment with a reason; the patient is notified. | P0 |
| B-11 | Appointment statuses: `pending`, `confirmed`, `cancelled_by_patient`, `cancelled_by_provider`, `declined`, `expired`, `completed`, `no_show`. Transitions are validated. | P0 |
| B-12 | "My appointments" page for patients shows upcoming and past appointments with status. | P0 |
| B-13 | Add to calendar (`.ics`) from the confirmation. | P2 |
| B-14 | Abuse limits: max 3 active future appointments per patient per provider, and a temporary booking block after repeated no-shows (configurable). | P1 |
| B-15 | Waitlist for fully booked days with notification when a slot opens. | P2 |
| B-16 | Booking requests are idempotent (client sends an idempotency key) so retries do not create duplicates. | P0 |

### 3.8 Dental records (US-6, US-8)

| ID | Requirement | Priority |
|---|---|---|
| REC-1 | A dentist can create a **visit record** for a patient linked to an appointment or created ad hoc: chief complaint, diagnosis, treatment done, tooth-level notes, prescription, follow-up advice. | P0 |
| REC-2 | Records can have attachments (X-rays, photos, PDFs) with type and size limits, malware scanning, and private storage accessed only through short-lived, authorized links. | P1 |
| REC-3 | A patient can view their records (and their dependents') in reverse chronological order; download as PDF is P1. | P0 |
| REC-4 | Patients can enter and update medical history and allergies, visible to providers they have booked with. | P1 |
| REC-5 | **Access control:** a patient sees their own records; a provider sees only records for patients who have an appointment or record with that provider; records from other providers are visible only through an explicit, revocable, time-bound **patient grant**. Clinic staff see clinical notes only if their role permits. | P0 |
| REC-6 | Every read, create, update, download, and grant/revoke on a record is written to an access log visible to the patient. | P0 |
| REC-7 | A finalized record cannot be silently edited. Changes are added as **addenda** that keep the original and show author and time. | P1 |
| REC-8 | Visual tooth chart (odontogram) for tooth-level entries. | P2 |
| REC-9 | **Digital prescription:** structured items (medicine, strength, dose, frequency, duration, instructions) entered within a visit record. A printable/shareable PDF shows clinic name and address, dentist name and registration number, patient name, date, and items. Patients can view and download it; every access is logged; changes are made by addendum (REC-7). | P1 |
| REC-10 | **Bill record:** itemized charges for a visit (description, amount, discount), status (unpaid, paid offline, waived), and a bill/receipt PDF the patient can view. No online payment in v1. | P2 |

### 3.9 Dentist portal (US-7, US-8, US-9)

| ID | Requirement | Priority |
|---|---|---|
| D-1 | Dentists and clinics can self-register: type, specialization(s), primary qualification, state/city/locality, personal/clinic details, dental council registration number and council name, supporting documents. **Before creating a new profile, the registrant is asked to search for an existing one** (by registered mobile, email, or name). Status starts as `pending_verification`; the profile is not public and cannot take bookings until an admin approves it. | P0 |
| D-2 | Professional login is separate from patient login, using email + password with MFA available (recommended for record access; P1 to enforce). | P0 |
| D-3 | Providers edit their own profile (description, services, hours, photos, languages, contact). Changes to name, registration number, and address require re-verification. | P0 |
| D-4 | Availability management UI for B-1, B-2, B-4, B-8, with a calendar preview of resulting slots. | P0 |
| D-5 | Appointment dashboard: today, upcoming, filter by dentist; confirm, decline, cancel, reschedule, mark completed or no-show. | P0 |
| D-6 | Patient list limited to patients with a relationship to the provider, with search and access to records (REC-1, REC-5). | P0 |
| D-7 | A clinic owner can invite staff and dentists to a clinic and assign roles (`owner`, `dentist`, `staff`). | P1 |
| D-8 | **Plans and entitlements:** each provider has a plan (trial, or paid tier) that controls features such as online booking, records module, SMS quota, and listing priority. New approved providers may start on a trial. No payment collection in v1. Paid placement, if any, is clearly labelled and never affects ratings or reviews. | P2 |
| D-9 | Basic analytics for providers: profile views, contact clicks, bookings, no-shows. | P2 |
| D-10 | **Claim an existing listing:** a professional finds an unclaimed listing and requests a claim. Verification uses a one-time code sent to the phone or email already on record, with a fallback to documents when those contacts are unavailable. A claim never auto-approves; an admin reviews it, and existing contacts are notified. Competing claims go to an admin. Requests are rate limited and protected against automation. | P1 |
| D-11 | Manage credentials: qualifications, registrations, memberships, certifications, with optional documents. Registrations drive the verification badge (P-8). | P1 |
| D-12 | Manage **branches**: add and edit clinic locations with address, phone, weekly hours, and per-branch availability; assign dentists to branches. | P1 |
| D-13 | Manage showcase content: photos, video links (approved video hosts only), case studies (with a patient-consent attestation), blog posts, publications. New content from a provider is reviewed before its first publication. | P2 |
| D-14 | Review inbox: see reviews, reply once to each (RV-4), flag inappropriate reviews for moderation. | P2 |
| D-15 | Plan expiry: reminders before a trial or plan ends (14, 7, and 1 day). After expiry, features drop to the lower plan, but **existing appointments are honored and patients keep access to their records**. | P2 |

### 3.10 Content (US-1, US-10)

| ID | Requirement | Priority |
|---|---|---|
| C-1 | **Treatment guides** (e.g. root canal, braces, child dentistry, implants, dentures, gum disease, crowns, cavities) managed in a CMS, with images and embedded educational videos. Each guide ends with a "Find a dentist for this treatment" button linking to a pre-filtered search. | P1 |
| C-2 | Blog with author, publish date, and "reviewed by" credit for clinical content. | P2 |
| C-3 | State, city, and locality landing pages ("Dentists in {locality}, {city}") with unique titles, meta descriptions, canonical URLs, and indexable listings. Pages with no providers show nearby localities and are not indexed. | P1 |
| C-4 | A visible medical disclaimer on all health content stating it is educational and not a diagnosis. | P0 (with C-1) |
| C-5 | Newsletter subscription with double opt-in and unsubscribe link. | P2 |

### 3.11 Notifications

| ID | Requirement | Priority |
|---|---|---|
| N-1 | Booking confirmation to the patient and to the provider by email and SMS. | P0 |
| N-2 | Reminders to the patient 24 hours and 2 hours before the appointment. | P1 |
| N-3 | Notices on cancel, reschedule, decline, or expiry to the affected party. | P0 |
| N-4 | OTP delivery by SMS (fallback: email if provided). | P0 |
| N-5 | Notifications must not contain diagnoses or clinical details. They contain provider name, time, address, and a link. | P0 |
| N-6 | Patients can set channel preferences for non-essential notifications. | P2 |
| N-7 | **Daily digest** to a dentist or clinic (SMS or email, configurable time, default the evening before): number of appointments and a list of times, patient names, and appointment types for the next day. No clinical details. | P1 |
| N-8 | Monthly SMS quota per plan with usage tracking; when exhausted, notifications fall back to email and the provider is warned. Patient OTP and booking confirmations are never blocked by a provider's quota. | P2 |

### 3.12 Reviews & ratings (US-15)

| ID | Requirement | Priority |
|---|---|---|
| RV-1 | A patient can review a provider only after a **completed appointment** with them: rating 1-5, optional text, optional "would recommend". One review per completed appointment. The patient can edit for 14 days and delete at any time. | P1 |
| RV-2 | New reviews pass automated checks (abuse, personal data, links, clinical details about other people). Clean reviews publish immediately; flagged ones are held for admin moderation. Admins can remove reviews with a recorded reason. | P1 |
| RV-3 | Average rating and count come only from published reviews. The average is shown once a provider has at least 3 reviews; before that, the count is shown. Ratings appear on result cards and profiles. | P1 |
| RV-4 | A provider can post one public reply per review. Providers cannot edit or delete reviews. | P2 |
| RV-5 | Anyone can report a review; reports enter the moderation queue. | P1 |
| RV-6 | Reviewers appear with first name and last initial; reviewer identity is otherwise not shown to providers beyond what they already know from the appointment. Review guidelines are shown at submission. | P1 |
| RV-7 | Ratings and reviews are never affected by plan or payment. Paid placement is labelled. Incentivized or purchased reviews are prohibited and grounds for suspension. | P0 (with RV-1) |
| RV-8 | Optional review-request notification a day after a completed appointment. | P2 |

### 3.13 Policies, support & static pages (US-21)

| ID | Requirement | Priority |
|---|---|---|
| SUP-1 | Privacy Policy, Terms and Conditions, Disclaimer, and About pages exist, are versioned, are linked in the footer of every page, and are linked from registration and consent screens. | P0 |
| SUP-2 | A Contact page with a support form (name, contact detail, topic, message). Submission creates a ticket, sends a confirmation, is rate limited, and appears in the admin queue. | P1 |
| SUP-3 | "Report an issue" and "Feedback" links on pages open the form pre-filled with the page address. (Provider data corrections keep using P-5.) | P2 |
| SUP-4 | An HTML sitemap page in addition to the XML sitemap. | P2 |
| SUP-5 | A named grievance contact and response time are displayed (see 5.1). | P0 |

### 3.14 Web app experience (US-22)

| ID | Requirement | Priority |
|---|---|---|
| W-1 | The site is installable to the home screen (manifest, icons) and loads its shell quickly on repeat visits. Personal or clinical data is never stored for offline use. | P2 |

---

## 4. Acceptance Criteria (Given / When / Then)

**AC-1 Location search (S-2, S-3, R-2)**
- Given providers exist at 1 km, 4 km, and 12 km from a location,
- When the user searches that location with the default 10 km radius,
- Then only the 1 km and 4 km providers appear, ordered by ascending distance, each showing its distance.

**AC-2 Geolocation denied (S-7)**
- Given the user clicks "Use my location" and denies permission,
- When the browser returns a denial,
- Then no error page is shown, a message explains the location was not shared, and the manual location input is focused.

**AC-3 Combined search and filters (S-1, F-1, F-3)**
- Given a location, query "braces", specialty "Orthodontics", and "Open now" enabled,
- When results load,
- Then every result matches all criteria and the URL contains all four parameters.

**AC-4 Shareable URL (S-6)**
- Given a filtered search result page,
- When the URL is opened in a new browser session,
- Then the same query, location, filters, sort, and page are restored.

**AC-5 Open-now correctness (F-3)**
- Given a clinic listed as open 09:00-17:00 in its local time zone,
- When a user in a different time zone searches at 08:30 clinic-local time,
- Then the clinic is shown as closed and excluded by "Open now".

**AC-6 Empty state (R-6)**
- Given a search that matches nothing,
- When results load,
- Then the page shows zero results, explains why, and offers a one-click "Expand to 25 km" action.

**AC-7 Profile actions (P-3, P-7)**
- Given a provider with online booking enabled, a phone number, and coordinates,
- When the profile is viewed on a mobile device,
- Then a "Book appointment" button and next-7-days availability are shown, tapping the phone button opens the dialer, and "Directions" opens a maps app with the destination set.
- And given a provider without booking enabled, then no booking button is shown.

**AC-8 Unpublished providers (A-2)**
- Given an admin unpublishes a provider that has future confirmed appointments,
- When any user searches or visits its URL,
- Then it does not appear in search, the URL returns a 404 (or 410) page, no new bookings can be created, and the existing appointments remain with both parties notified.

**AC-9 Data correction report (P-5)**
- Given a visitor submits the report form with a valid description,
- When submitted,
- Then it is stored, appears in the admin queue, and the visitor sees a confirmation. Submissions are rate limited per IP.

**AC-10 Registration with OTP (U-1, U-3, U-7)**
- Given a new mobile number,
- When the user requests an OTP, enters the correct code within 10 minutes, and accepts the Terms, Privacy Policy, and health-data consent,
- Then an account is created, the user is logged in, and the consent version and timestamp are stored.
- And when the code is wrong 5 times, expired, or reused, then verification fails and a new OTP must be requested.
- And when consent is not given, then registration is blocked with an explanation.

**AC-11 Login protection (U-3)**
- Given more than 5 failed login or OTP attempts for one identifier within 15 minutes,
- When another attempt is made,
- Then it is blocked for 15 minutes with a generic message, and the response for an unknown account is indistinguishable from a known one.

**AC-12 Slot computation (B-1, B-2, B-3, B-8)**
- Given a dentist works Monday 10:00-13:00 with 30-minute slots, has a confirmed appointment at 10:30, and a blocked exception from 12:00 to 13:00,
- When slots are requested for that Monday,
- Then exactly 10:00, 11:00, and 11:30 are offered, and any slot earlier than now plus the minimum notice is excluded.
- And the slot times are shown in the clinic's time zone.

**AC-13 No double booking (B-6, B-16)**
- Given two patients submit a booking for the same dentist and slot at the same moment,
- When both requests are processed,
- Then exactly one succeeds with `201` and the other receives `409 slot_unavailable` with a prompt to choose another slot.
- And when the same request is retried with the same idempotency key, then no second appointment is created.

**AC-14 Booking confirmation (B-5, B-7, N-1, N-5)**
- Given a logged-in patient books an available slot with a provider in instant-confirmation mode,
- When the booking succeeds,
- Then the appointment status is `confirmed`, it appears in "My appointments", and both the patient and provider are notified within 60 seconds with a message that contains no clinical details.
- And given a provider in approval mode, then the status is `pending` until confirmed, and it expires and releases the slot if not actioned within the configured time.

**AC-15 Cancel and reschedule (B-9)**
- Given a confirmed appointment more than 2 hours away (default cutoff),
- When the patient cancels,
- Then the status becomes `cancelled_by_patient`, the slot becomes available again, and the provider is notified.
- And given the appointment is within the cutoff, then cancellation is blocked with a message showing the clinic's phone number.
- And when rescheduling, then the new slot is booked and the old one released atomically, or nothing changes.

**AC-16 Record access control (REC-3, REC-5, REC-6)**
- Given a record authored by Clinic A for patient P,
- When P opens it, then it is visible.
- When a dentist at Clinic B with no relationship or grant requests it, then the API returns `403`.
- When P grants Clinic B access, then Clinic B can read it until the grant expires or is revoked; after revocation the API returns `403` again.
- And every access, grant, and revocation appears in P's access log with actor and time.

**AC-17 Availability change with existing bookings (B-2, B-10, D-4)**
- Given a dentist blocks a time range that contains confirmed appointments,
- When the block is saved,
- Then the dentist is shown the conflicting appointments and must cancel or reschedule each (or explicitly proceed), affected patients are notified, and the blocked slots disappear from public availability immediately.

**AC-18 Record creation and addenda (REC-1, REC-7)**
- Given a dentist completes an appointment,
- When they save a visit record and finalize it,
- Then the patient can see it, the original text can no longer be edited, and any correction is stored as an addendum showing author and timestamp while the original remains visible.

**AC-19 Professional onboarding (D-1, A-7)**
- Given a dentist submits registration with a council registration number and documents,
- When submitted, then the status is `pending_verification`, the profile is not public, and no slots are bookable.
- When an admin approves, then the profile is published and can configure availability.
- When an admin rejects, then the dentist is emailed the reason and can resubmit.

**AC-20 Treatment guide to search (C-1, C-4)**
- Given a guide page for "Root Canal Treatment",
- When the reader clicks "Find a dentist for this treatment",
- Then the search page opens pre-filtered to the matching specialty/service, retains any location the user previously selected, and the guide page displays the medical disclaimer.

**AC-21 Data rights (U-6)**
- Given a logged-in patient requests a data export,
- When processing completes (within 72 hours, target: immediately for small accounts),
- Then a downloadable file of their profile, appointments, and records is provided.
- And when they request account deletion, then personal data is deleted or anonymized, except items that must be retained under legal or clinical record-keeping obligations, which are listed to the user in plain language.

**AC-22 Directory browsing (S-8, S-9, C-3, P-11)**
- Given providers exist in two localities of a city,
- When the user opens the locality page, then only providers in that locality are listed, a breadcrumb is shown, and the page has a unique title, description, and canonical URL.
- When the user switches from "Dentists" to "Clinics", then the list changes accordingly and the URL reflects the view.
- And given a locality with no providers, then nearby localities are suggested and the page is not indexed.

**AC-23 Credentials and verified badge (P-8, D-11, A-7)**
- Given a dentist whose registration number was approved by an admin,
- When the profile is viewed, then it shows "Registration verified" with council name and verification date.
- And given a registration not yet approved, then it is shown as "provider-declared" with no badge.
- And when the dentist changes the registration number, then the badge is removed until an admin re-approves it.

**AC-24 Branches and booking (P-9, D-12, B-1, B-5)**
- Given a dentist practices at Branch A (Mon-Fri) and Branch B (Sat) with different hours,
- When the profile is viewed, then both branches show address, phone, and hours, each with a "Book" button.
- When the patient books at Branch B, then only Branch B's slots are offered.
- And the dentist can never hold two overlapping appointments across branches.

**AC-25 Review eligibility (RV-1, RV-6)**
- Given a patient with a completed appointment with a provider,
- When they submit a 4-star review with text, then it is checked and published under their first name and last initial.
- And given a patient with no completed appointment, then submission is blocked with an explanation.
- And a second review for the same appointment is blocked; editing is blocked after 14 days.

**AC-26 Moderation and aggregates (RV-2, RV-3, RV-5, RV-7)**
- Given a review is reported or auto-flagged, then it enters the moderation queue and an admin can keep or remove it with a recorded reason.
- When reviews are published, edited, deleted, or removed, then the provider's average and count update within 1 minute, using published reviews only.
- And the average is hidden until a provider has 3 reviews; a provider's plan has no effect on rating or ranking of reviews.

**AC-27 Provider reply (RV-4, D-14)**
- Given a published review, when the provider posts a reply, then it appears under the review; a second reply is blocked, and the provider cannot edit or delete the review itself.

**AC-28 Claim a listing (D-10, A-12)**
- Given an unclaimed listing with a phone number on record,
- When a professional requests a claim and enters the correct code sent to that number, then the claim moves to admin review and the listing is not yet editable.
- And after 5 wrong codes, further attempts are blocked for a period; automated attempts are rate limited.
- And when the contacts on record are unavailable, then the professional can submit documents for manual review.
- And when two claims exist for one listing, then neither is auto-approved and an admin resolves it; existing contacts on record are notified of every claim.

**AC-29 Digital prescription (REC-9, REC-5, REC-6, REC-7)**
- Given a dentist finalizes a visit record with prescription items,
- When the patient opens the prescription, then a PDF shows clinic, dentist name and registration number, patient, date, and items.
- And every view or download appears in the access log; a later change is stored as an addendum and the original remains visible.
- And a provider without a relationship or grant cannot retrieve it.

**AC-30 Bill record (REC-10)**
- Given a dentist enters line items and a discount for a visit,
- When saved, then the total equals the sum of items minus discount, the status is tracked (unpaid, paid offline, waived), and the patient can view the bill.
- And no online payment control is shown.

**AC-31 Daily digest (N-7, N-8)**
- Given a dentist has 5 appointments tomorrow and a digest time configured,
- When the time is reached, then one message lists the count, times, patient names, and appointment types, with no clinical details.
- And when SMS quota is exhausted, then the digest goes by email and the provider is warned; patient OTP and confirmations are unaffected.

**AC-32 Trial and plan changes (D-8, D-15, A-10)**
- Given a provider on a trial ending in 14 days,
- When the schedule runs, then reminders are sent at 14, 7, and 1 day before expiry.
- When the trial expires, then features fall to the lower plan, confirmed appointments remain valid, and patients still access their records.
- And when an admin extends or changes a plan, then the change is audit-logged.

**AC-33 Policies and support (SUP-1, SUP-2, SUP-5, A-14)**
- Given any page, then the footer links to the current Privacy Policy, Terms, Disclaimer, About, and Contact pages, and a grievance contact with a response time is shown.
- When a visitor submits the support form, then a ticket is created, a confirmation is sent, and the ticket appears in the admin queue; submissions are rate limited.
- And when an admin publishes a new policy version, then consents recorded afterwards reference that version.

**AC-34 Showcase content (P-10, D-13, A-11)**
- Given a dentist submits a case study, then it requires a patient-consent attestation before it can be published.
- Given a first-time submission from a provider, then it is not public until approved.
- Given a video link from a host that is not approved, then it is rejected.
- When content is unpublished or removed, then it disappears from the profile immediately, and empty tabs are hidden.

**AC-35 Installable web app (W-1)**
- Given a supported mobile browser, then the site meets the criteria for "add to home screen".
- When offline, then a friendly offline page is shown, and no appointment, record, or profile data of a logged-in user is available offline.

---

## 5. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Search API p95 < 800 ms at 50 concurrent users; slot listing p95 < 500 ms; booking p95 < 1 s; profile page LCP < 2.5 s on 4G. |
| Availability | 99.5% monthly uptime target for v1. |
| Data integrity | Zero double-bookings, even under concurrent requests. Backups with RPO <= 15 minutes and RTO <= 4 hours for the primary database. |
| Scalability | Support 100k provider records, 1M appointments, and 100 searches/second with horizontal scaling of the app tier. |
| Accessibility | WCAG 2.2 AA. Full keyboard navigation, map has a list equivalent, date/slot picker fully operable by keyboard and screen reader, sufficient color contrast, labelled controls. |
| Responsive | Usable from 360 px width up. Mobile-first, since most booking happens on phones. |
| Installable web app | Passes installability checks; service worker caches only static assets and the app shell, never authenticated or clinical responses. |
| Browsers | Latest two versions of Chrome, Safari, Firefox, Edge. |
| SEO | Server-rendered profile, city, guide, and search landing pages; sitemap; canonical URLs; structured data. Authenticated pages are `noindex`. |
| Internationalization | UI strings externalized from day one; v1 ships in English with structure ready for Indian languages; distances in km. |
| Security | HTTPS only, OWASP Top 10 review, parameterized queries, CSRF protection, rate limiting on public and auth endpoints, RBAC on every endpoint, secrets in a secret manager, dependency scanning. |
| User-generated content | Reviews, media, case studies, and support messages are sanitized, scanned for malware and unsafe content, and shown publicly only after passing automated checks (and moderation where required). Abuse reporting and takedown work within a defined response time. |
| Data protection | Encryption in transit and at rest; attachments stored privately and reachable only through short-lived, authorized links; sensitive fields (medical history, record text) encrypted at rest with rotation; no clinical data in logs, analytics, or notifications. |
| Observability | Structured logs (with PII redaction), error tracking, tracing for search and booking, dashboards for section 1.3 metrics, alerts on booking failures and notification backlog. |
| Reliability of notifications | Notifications sent through a queue with retries and dead-letter handling; delivery status stored. |

### 5.1 Privacy & compliance

The app now stores **personal health information**, which raises the bar considerably. The following must be confirmed with legal counsel before launch.

- **Applicable law:** India's Digital Personal Data Protection (DPDP) Act, 2023 and its Rules (confirm the current commencement and phase-in timeline), IT Act obligations for sensitive data, and any dental council or clinical-record rules that apply to dentists' records.
- **Consent and notice:** Clear privacy notice; explicit, granular, withdrawable consent for health data; separate consent record per purpose (the consent record structure is defined in PLAN.md).
- **Children:** Records and bookings for minors require a parent/guardian account; confirm verifiable parental consent requirements.
- **Roles:** Decide and document who is the data fiduciary for clinical records (clinic or platform) and who is the processor; sign data processing terms with dentists (see Open Questions).
- **Data principal rights:** Access, correction, export, erasure, and grievance redressal with a named contact and response SLA.
- **Retention:** Define retention for records, appointments, logs, and deleted accounts; retained items are disclosed to users.
- **Breach response:** Documented incident response and notification procedure.
- **Location data:** The user's precise coordinates are used only for the request and are **not stored** with an identifier. Analytics record only coarse location.
- **Hosting:** Prefer an India-region deployment for latency and user expectations; confirm any cross-border transfer restrictions for vendors (SMS, email, analytics, maps).
- **Content and advertising:** Do not display claims that imply endorsement, "best dentist" rankings, or clinical outcomes unless substantiated and permitted by applicable advertising and dental council rules. Sponsored placements must be labelled.
- **Reviews and showcase content:** Reviews can raise defamation and misleading-advertising risks and may impose obligations as an online intermediary (takedown handling, grievance officer). Case studies and before/after photos need documented patient consent. Confirm review policy, consent forms, and takedown timelines with counsel.
- **Prescriptions and bills:** Confirm what a valid prescription must contain and any invoice or tax requirements for the clinics' bills before enabling REC-9 and REC-10 in production.
- **Plans and paid placement:** Paid placement must be clearly labelled, and nothing paid may alter ratings or hide reviews.
- **Provider removal/correction:** Providers can request removal or correction; SLA of 5 business days (existing appointments handled per AC-8).

---

## 6. Data Sourcing

Decision required before build; it determines effort and legal risk. With booking and accounts, **self-registered and verified professionals become the primary source** for bookable providers, while imported listings fill out search coverage.

| Option | Pros | Cons |
|---|---|---|
| Professional self-registration with verification (D-1) | Fresh, owned data; enables booking | Needs onboarding effort and verification workload |
| Manual entry / CSV curated by you | Full control, no licensing issues | Slow to scale, goes stale |
| Public registries (e.g. dental council lists) | Authoritative, includes licence status | Coverage/format varies; check reuse terms |
| Places APIs (Google Places, etc.) | Fast, broad coverage | Cost; terms often forbid storing/caching data long term |

**Requirements:** every record stores `source` and `last_verified_at`. Records not verified in 12 months are flagged for review. Imported (unclaimed) listings are never bookable and offer a "Claim this listing" path into D-1.

---

## 7. Open Questions

*Product and legal questions live here. Technical decisions still pending are tracked in PLAN.md (Pending Decisions & Spikes).*

1. **Launch geography:** Which cities first? Affects language, time zones, geocoding quality, verifier availability, and legal review.
2. **Legal role:** Is the platform a data processor for clinics' patient records or a fiduciary in its own right? What agreement do dentists sign? Who handles patient requests for erasure of clinical records?
3. **Record retention:** How long must clinical records be kept, and what can a patient delete? Does the platform aim to interoperate with national health ID systems later?
4. **Patient login method:** Mobile OTP only (recommended), or also email + password from day one?
5. **Notification channels:** SMS + email only, or WhatsApp too? Who owns DLT registration and sender IDs?
6. **Booking mode default:** Instant confirmation for all, or approval for new providers until they prove responsiveness?
7. **Cancellation and no-show policy:** Cutoff duration, penalties (blocking only, or deposits later)?
8. **Verification process:** Which council registries are used, is verification manual, and what SLA do we promise dentists?
9. **Multi-location and multi-dentist clinics:** Is "any available dentist at this clinic" a booking option in v1 or only booking a named dentist?
10. **Payments and pricing:** Show fee ranges on profiles? Collect deposits later? Membership monetization for dentists (the trial is modeled, billing is not)?
11. **Data source and maps provider:** Which option(s) in Section 6, and Google, Mapbox, or open-source maps within budget?
12. **Ratings and reviews:** Verified-visit reviews are now in scope (RV-*). Still to decide: whether to show any third-party ratings, moderation staffing, and legal review (see 16).
13. **Language support:** English-only at launch or also Hindi and regional languages?
14. **Team & timeline:** Solo or team? Does the 16-week plan (see TASKS.md) fit?
15. **Plans and monetization:** Which features are gated by plan (online booking, records, SMS quota, listing priority)? Trial length? Note that IDW's own pages show both 3-month and 6-month trials, so define ours explicitly. How are payments collected and reconciled offline?
16. **Review policy:** Who may review, how long after a visit, editing window, anonymity, response time for takedowns, and provider replies. Who is the grievance officer?
17. **Claim verification:** Is a code sent to the phone or email already on record enough for approval, and what documents are accepted in the fallback?
18. **Case-study consent:** What consent form is used, who stores it, and can patients withdraw consent later?
19. **Prescription and bill rules:** Required prescription content and invoice/tax requirements for the launch region.
20. **Paid placement:** Will "top listing" or "first page" style promotion exist in v1, and how will it be labelled and ranked?
21. **Chains and branches:** Are multi-branch chains a group of separate clinic listings, or one organization with locations? (v1 treats each branch as its own clinic listing linked to the same dentist.)

---

## 8. Future (out of scope for v1)
- Native mobile apps (API-first design supports this)
- Online payments, deposits, invoicing, insurance
- Waitlist (B-15), calendar sync with Google/Outlook, recurring appointments and treatment plans
- Video consultation and secure messaging
- Health-ID integration and record interoperability
- Oral care product store, jobs board, CDE courses, events, and dental labs directory
- Clinic microsites with custom domains and branded email, dental tourism promotion, professional networking
- Online payment for bills, tax invoicing, and payment reconciliation
- Clinic analytics, marketing tools, and paid featured placements
- Tooth chart (REC-8) and treatment-plan quotes

---

## 9. Definition of Done (v1)
- All P0 requirements implemented and mapped to passing automated tests (AC-1 to AC-35; P1 items as scheduled)
- Concurrency test proves no double booking under parallel load (AC-13)
- Record authorization has unit and integration tests for every deny and allow path (AC-16)
- Non-functional targets in Section 5 verified
- WCAG 2.2 AA audit passed with no critical issues
- Security review and penetration test completed; no open high or critical findings
- Privacy notice, consent flows, provider agreement, and grievance contact published after legal review
- SMS sender and templates approved; email domain authenticated (SPF, DKIM, DMARC)
- Backup restore drill completed; runbook and alerting configured
- Open Questions 1, 2, 4, 5, and 11 resolved and recorded in this document
- Review and content moderation workflows are operating (reporting, queue, takedown) before reviews or showcase content are switched on (AC-26, AC-34); Open Question 16 resolved first
