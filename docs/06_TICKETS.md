# 06_TICKETS.md — Feature & Engineering Ticket List: INCORRUPTA (Mumbai Police Edition)

- **Purpose:** Provide an exhaustive, actionable ticket backlog localized for the **Mumbai Police**, **Bharatiya Sakshya Adhiniyam (BSA), 2023**, and **Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023**.
- **Status:** Draft v1 (Mumbai Police Customization)
- **Last Updated:** 2026-09-25
- **Depends On:** `docs/01_PRD.md`, `docs/02_TRD.md`, `docs/04_ARCHITECTURE.md`, `docs/05_SECURITY.md`

---

## 1. Ticket Directory

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TICKET BACKLOG OVERVIEW                         │
├────────┬───────────────────────────────────────────┬──────────┬────────┤
│ ID     │ Title                                     │ Phase    │ Size   │
├────────┼───────────────────────────────────────────┼──────────┼────────┤
│ T-001  │ Repository Bootstrapping & Vite Setup     │ Phase 0  │ S      │ DONE   │
│ T-002  │ Mumbai Police Theme & Design Tokens Setup │ Phase 0  │ S      │ DONE   │
│ T-003  │ CI Workflow & Test Pipeline               │ Phase 0  │ S      │ DONE   │
│ T-004  │ Mumbai Police PostgreSQL Schema Migration │ Phase 1  │ M      │ DONE   │
│ T-005  │ WebAuthn Relying Party Edge Functions     │ Phase 1  │ M      │ DONE   │
│ T-006  │ Sevarth ID WebAuthn Client Login UI       │ Phase 1  │ M      │ TODO   │
│ T-007  │ FIR / CR Case Management CRUD UI          │ Phase 2  │ M      │
│ T-008  │ Police Station & Zone RLS Security        │ Phase 2  │ M      │
│ T-009  │ Web Crypto Streaming Dual-Hashing Engine  │ Phase 3  │ M      │
│ T-010  │ Direct S3 Encrypted Upload Integration    │ Phase 3  │ M      │
│ T-011  │ BNSS 105 Seizure Studio & Panchnama Form  │ Phase 3  │ M      │
│ T-012  │ Append-Only Chained Audit Database Engine │ Phase 4  │ M      │
│ T-013  │ Station Malkhana & FSL Custody Timeline   │ Phase 4  │ M      │
│ T-014  │ Digital Muddemal Transfer & Dual-Sign     │ Phase 4  │ M      │
│ T-015  │ Evidence Integrity Verification Service   │ Phase 5  │ S      │
│ T-016  │ Section 63 BSA (2023) PDF Certificate Gen │ Phase 5  │ M      │
│ T-017  │ WCAG 2.2 AA & Marathi Bilingual Polish    │ Phase 6  │ S      │
│ T-018  │ Station Isolation & RLS Security Suite    │ Phase 6  │ M      │
│ T-019  │ Mumbai Police Seed Data & Deployment      │ Phase 6  │ S      │
└────────┴───────────────────────────────────────────┴──────────┴────────┘
```

---

## 2. Key Ticket Specifications (Mumbai Police Adaptations)

### T-001: Repository Bootstrapping & Vite Setup
- **Type:** `chore` | **Phase:** Phase 0 | **Size:** S | **Status:** DONE
- **Linked Requirements:** TR-001, NFR-002
- **Description:** Initialize Vite with React 18, TypeScript strict mode, Vitest testing, and walking skeleton.
- **Acceptance Criteria:**
  - *Given* a fresh clone of the repository,
  - *When* `npm run build && npm run test` is executed,
  - *Then* the application builds and tests with 0 errors.
- **Changelog:** Bootstrapped Vite 5 + React 18 + TypeScript strict mode + Vitest + walking skeleton (`App.tsx`). Verified build and unit tests pass.

---

### T-002: Mumbai Police Theme & Design Tokens Setup
- **Type:** `feature` | **Phase:** Phase 0 | **Size:** S | **Status:** DONE
- **Linked Requirements:** NFR-007, 03_UIUX Section 2
- **Description:** Configure TailwindCSS 3.4 with custom Mumbai Police color tokens, Devanagari typography, base styles, and walking skeleton theme styling.
- **Acceptance Criteria:**
  - *Given* the configured Tailwind setup,
  - *When* rendering sample cards with `bg-police-navy`, `bg-police-slate`, `text-accent-cyan`, and `text-accent-gold`,
  - *Then* styles inspect accurately to `#070D1E`, `#0E172E`, `#00B4D8`, and `#D4AF37`.
- **Changelog:** Configured TailwindCSS 3.4, PostCSS, and Autoprefixer with full Mumbai Police color tokens and Devanagari font rules. Integrated tokens into `src/index.css` and updated `src/App.tsx`. Verified 3 unit tests pass.

---

### T-003: CI Workflow & Test Pipeline
- **Type:** `chore` | **Phase:** Phase 0 | **Size:** S | **Status:** DONE
- **Linked Requirements:** TR-001, 02_TRD Section 6 & 9, 07_RULES Section 6 & 9
- **Description:** Establish GitHub Actions continuous integration pipeline (`.github/workflows/ci.yml`) enforcing ESLint 9 linting, TypeScript 5 strict typechecking, Vitest unit test suite, npm audit production security scan, and Vite 5 production build.
- **Acceptance Criteria:**
  - *Given* the INCORRUPTA repository,
  - *When* CI or `npm run typecheck && npm run lint && npm run test && npm run build` executes,
  - *Then* all steps (linting, typechecking, 3 unit tests, production build) pass with 0 errors and zero warnings.
- **Changelog:** Initialized git repository, installed approved `typescript-eslint` plugin to support ESLint 9 TS/TSX parsing, created `.github/workflows/ci.yml` with 5-stage validation pipeline, and verified all checks pass cleanly.

---

### T-004: Mumbai Police PostgreSQL Schema Migration
- **Type:** `feature` | **Phase:** Phase 1 | **Size:** M | **Status:** DONE
- **Description:** Initialize the 9 specialized tables in Supabase: `roles`, `users` (with `sevarth_id`, `police_rank`, `posted_police_station`), `cases` (with `cr_number`, `police_station`, `penal_sections`), `case_assignments`, `evidence` (with `muddemal_number`, `panchnama_reference`, `panch_witnesses`), `evidence_hashes`, `chain_of_custody`, `audit_logs`, `authentication_events`.
- **Acceptance Criteria:**
  - *Given* a local or cloud Supabase instance,
  - *When* migration script executes,
  - *Then* all tables, enums (`mumbai_police_rank`, `case_status`, `evidence_category`, `muddemal_status`, `custody_movement_type`), and B-tree indexes are created with 0 errors.
- **Changelog:** Created cloud project `incorrupta` on `ap-south-1` (Mumbai), deployed migration `20260925000001_initial_mumbai_police_schema.sql` creating all 9 tables, 5 enums, and indexes, generated `src/types/database.ts`, created typed Supabase client, and added 8 unit tests in `src/types/database.test.ts`.

---

### T-005: WebAuthn Relying Party Edge Functions
- **Type:** `feature` | **Phase:** Phase 1 | **Size:** M | **Status:** DONE
- **Linked Requirements:** TR-001, FR-001, 04_ARCHITECTURE Section 2, 05_SECURITY Section 3
- **Description:** Implement server-side WebAuthn relying party Edge Functions (`auth-register-challenge`, `auth-register-verify`, `auth-login-challenge`, `auth-login-verify`) using `@simplewebauthn/server` bound to Mumbai Police Sevarth IDs.
- **Acceptance Criteria:**
  - *Given* an officer's Sevarth ID (e.g. `MH-POL-40211`),
  - *When* requesting an authentication challenge,
  - *Then* a cryptographic challenge is generated and cached, and upon biometric verification, the sign counter is validated and an authenticated session is established.
- **Changelog:** Implemented WebAuthn relying party engine in `src/lib/auth/webauthnRp.ts`, created 4 Supabase Edge Functions with CORS and deployed them to `ap-south-1` sovereign cloud, verified live challenge invocation, and added 6 unit tests in `src/lib/auth/webauthnRp.test.ts`.

---

### T-006: Sevarth ID WebAuthn Client Login UI
- **Type:** `feature` | **Phase:** Phase 1 | **Size:** M | **Status:** TODO
- **Description:** Build `LoginPage.tsx` with Mumbai Police crest, Sevarth ID input (e.g. `MH-POL-40211`), English / मराठी toggle, and biometric TouchID/YubiKey trigger.
- **Acceptance Criteria:**
  - *Given* an IO on `/login`,
  - *When* entering Sevarth ID and tapping "Verify Biometric Passkey / बायोमेट्रिक पडताळणी",
  - *Then* browser WebAuthn authenticates and navigates to the station dashboard.

---

### T-007: FIR / CR Case Management CRUD UI
- **Type:** `feature` | **Phase:** Phase 2 | **Size:** M | **Status:** TODO
- **Description:** Build `DashboardPage.tsx` and `CaseDetailPage.tsx` featuring Crime Register numbers (e.g. `CR No. 142/2026 of BKC Cyber PS`), BNS 2023 penal sections, and designated court details.
- **Acceptance Criteria:**
  - *Given* an authenticated Investigating Officer,
  - *When* registering a new FIR with BNS sections,
  - *Then* the case record is saved and displayed in the station registry.

---

### T-011: BNSS 105 Seizure Studio & Panchnama Form
- **Type:** `feature` | **Phase:** Phase 3 | **Size:** M | **Status:** TODO
- **Description:** Build `IngestionPage.tsx` tailored for Section 105 BNSS search videography and digital extractions: drag-and-drop video/image, real-time SHA-256 + Blake3 hashing meter, Panchnama reference number, names and details of 2 independent Panch witnesses, and IO biometric sealing button.
- **Acceptance Criteria:**
  - *Given* an on-scene search recording,
  - *When* ingested with Panch witness details and signed with WebAuthn,
  - *Then* file streams to storage, baseline hashes are locked, and Muddemal ID `MDL-XXX` is generated.

---

### T-013 & T-014: Station Malkhana & Kalina FSL Custody Workflow
- **Type:** `feature` | **Phase:** Phase 4 | **Size:** M | **Status:** TODO
- **Description:** Build `<CustodyTimeline />` and `<CustodyTransferModal />` reflecting station Malkhana intake and transit to the Directorate of Forensic Science Laboratories (DFSL), Kalina.
- **Acceptance Criteria:**
  - *Given* seized digital property in the Malkhana,
  - *When* dispatched to Kalina FSL,
  - *Then* dual biometric signoff from Malkhana Mohrir and Carrier Constable commits an immutable chained custody record.

---

### T-016: Section 63 BSA (2023) PDF Certificate Generator
- **Type:** `feature` | **Phase:** Phase 5 | **Size:** M | **Status:** TODO
- **Description:** Build `src/lib/pdf/bsa63Certificate.ts` generating the official statutory certificate required under Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023 with Mumbai Police header, CR Number, Panchnama reference, SHA-256 hash, and verification QR code.
- **Acceptance Criteria:**
  - *Given* an evidence item with verified intact hash,
  - *When* clicking "Generate Section 63 BSA Certificate",
  - *Then* an official PDF downloads in < 2 seconds, fully compliant with Indian court admissibility rules.

---

### T-019: Mumbai Police Seed Data & Deployment
- **Type:** `chore` | **Phase:** Phase 6 | **Size:** S | **Status:** TODO
- **Description:** Populate `supabase/seed.sql` with realistic Mumbai Police scenarios:
  1. `CR No. 142/2026, BKC Cyber Police Station` (Corporate Ransomware & Extortion).
  2. `CR No. 89/2026, Azad Maidan Police Station` (Bank Heist & CCTV Seizure).
  3. Pre-loaded officer accounts for API Sachin Kadam, HC Ramesh Patil, and Prosecutor Meera Deshmukh.
- **Acceptance Criteria:**
  - *Given* fresh deployment to Indian cloud region (`ap-south-1`),
  - *When* opening demo URL,
  - *Then* complete Mumbai Police cases, Muddemal records, and audit chains load instantly.
