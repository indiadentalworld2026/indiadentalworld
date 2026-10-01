# IDW: ABDM Sandbox Application Sheet and Developer Checklist

Status: DRAFT. Fields marked [FILL] must be completed by IDW. Nothing here has been submitted.
Register at: https://sandbox.abdm.gov.in (applications are approved by the ABDM team; approval time varies).

## Part A: Application details (founder fills in)

| Field | Value |
|---|---|
| Organisation name | IndiaDentalWorld [FILL: exact registered legal name] |
| Website | indiadentalworld.com |
| Registered address | [FILL] |
| Authorised contact person | [FILL: name, role] |
| Contact email / phone | [FILL] |
| Organisation type | Software / health-tech product company [FILL: confirm] |
| Product name | IDW PMS (dental practice management system) |
| Role to be tested | HIP (Health Information Provider) first; HIU later [confirm with developer] |
| Milestones planned | M1 (ABHA creation and verification), M2 (HIP: linking, consent, data transfer), M3 (HIU) later |
| Health record types | OP Consultation, Prescription (dental visits and procedures) |
| Hosting | AWS Mumbai (ap-south-1) |
| Callback (bridge) URL | [FILL: must be publicly reachable HTTPS; use a staging server or tunnel for testing] |
| Use case (one paragraph) | IDW PMS lets dental clinics keep patient records, odontogram, treatment plans and invoices, and (with patient consent) link records to the patient's ABHA and share them through ABDM. |

## Part B: Before you apply

- [ ] Confirm legal entity name and authorised signatory.
- [ ] Decide the staging server that will host the callback URL.
- [ ] Developer has read the HIP/HIU guidelines on the ABDM sandbox site.
- [ ] DPDP consent flow and Grievance Officer are in the plan (see IDW compliance standard).

## Part C: After approval (developer)

1. Store the client ID and client secret in a secrets manager. Never commit them to GitHub or put them in browser code.
2. Fetch a session token (tokens expire in about 5 minutes; refresh before every call).
3. Register the callback (bridge) URL for the client ID.
4. Register the facility/service (HIP) using the sandbox payload.
5. Call ABDM only from the server (browser calls fail on CORS).
6. Request V3 API access on the ABDM developer forum if V3 calls return 403 (error 900908).
7. Expect known sandbox 403s on some M2 endpoints (HIP-initiated linking, data flow); see the Postman collection README and the error catalog.
8. Validate FHIR bundles against the NRCES profiles before sending; use a fresh UUID per bundle.

## Part D: Open-source starting points (all MIT)

Downloaded to the workspace folder `abdm-repos/`:
- `abdm-sdk-node`: TypeScript SDK (npm: @nirmitee/abdm-sdk-node). Small project; test against the sandbox before relying on it.
- `abdm-fhir-bundle-examples`: sample FHIR R4 bundles for six record types. No dental-specific bundle; adapt OP Consultation.
- `abdm-v3-error-catalog`: reference for ABDM V3 error codes and fixes.
- `abdm-v3-postman-collection`: Postman collection and sandbox environment for manual API testing.
