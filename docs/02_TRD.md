# 02_TRD.md — Technical Requirements Document: INCORRUPTA

- **Purpose:** Define technical stack choices, system requirements, performance budgets, testing, environments, observability, CI/CD, and folder structure.
- **Status:** Draft v1
- **Last Updated:** 2026-09-25
- **Depends On:** `docs/01_PRD.md`

---

## 1. Tech Stack Selection & Justification

| Layer | Choice | Why Chosen | Alternative Rejected |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript | Component-based, large ecosystem, native Web Crypto and Web Streams integration, type-safety for forensic contracts. | Vue 3 (smaller ecosystem for FIDO2 libraries), Angular (overly verbose for hackathon agility). |
| **Build Tool & Bundler** | Vite 5 | Sub-second HMR, native ES modules, fast optimized production builds, seamless Worker thread bundling. | Webpack (slow configuration overhead and build times), Next.js (unnecessary SSR complexity for authenticated portal). |
| **Styling & Design System** | TailwindCSS 3.4 + Lucide React | High-velocity utility CSS, precise design-token control (forensic dark mode), accessible high-contrast palettes. | Material UI / Chakra UI (heavy bundle weight, harder to enforce strict military/police custom dark aesthetic). |
| **Database & Auth Platform** | Supabase (PostgreSQL 15+) | Enterprise-grade PostgreSQL, native Row Level Security (RLS), ACID guarantees, built-in GoTrue auth, trigger-based hash chains. | Firebase (NoSQL lacks relational integrity, no native RLS/SQL constraints), MongoDB (weak transactional guarantees). |
| **Authentication Standard** | WebAuthn / FIDO2 (`@simplewebauthn`) | Phishing-resistant, hardware-backed asymmetric cryptographic authentication (Apple TouchID, Windows Hello, YubiKey). | Traditional Passwords (vulnerable to credential theft/phishing), SMS OTP (vulnerable to SIM swapping). |
| **Client Hashing & Cryptography** | W3C Web Crypto API + `@noble/hashes` | Native browser-accelerated hardware SHA-256; `@noble/hashes` for high-speed Blake3 streaming verification. | Crypto-js (outdated, slow JS-only, lacks streaming, fails on large files), WebAssembly OpenSSL (unnecessary binary overhead). |
| **PDF Generation (Certificates)** | `@react-pdf/renderer` or `jspdf` | Deterministic client-side vector rendering of court-admissible FRE 902(14) certificates with QR code embedding. | Server-side Puppeteer/Headless Chrome (heavy resource footprint, memory leaks, slow cold starts). |
| **Object Storage (Evidence)** | Supabase Storage (S3 API) | Private buckets, signed URLs with short TTL (60s), encryption-at-rest, integration with PostgreSQL RLS policies. | Public AWS S3 (accidental public bucket risk), Public IPFS (violates CJIS/privacy laws; see Section 6 in research report). |

---

## 2. Technical Requirements Mapped to FR IDs

| TR ID | Linked FR ID | Technical Requirement Description |
| :--- | :--- | :--- |
| **TR-001** | FR-001 | Implement FIDO2 WebAuthn relying party endpoints (`/api/auth/register-challenge`, `/api/auth/verify-assertion`) using `@simplewebauthn/server` and `@simplewebauthn/browser`. |
| **TR-002** | FR-002, FR-003 | Enforce multi-tenant and role-based data isolation using PostgreSQL Row Level Security (RLS) policies on `cases`, `case_assignments`, and `evidence`. |
| **TR-003** | FR-004 | Ingest evidence files via a chunked Web Stream Worker utilizing `crypto.subtle.digest('SHA-256')` with 16MB array buffer slices to prevent browser UI freezing. |
| **TR-004** | FR-005 | Generate S3-compatible pre-signed upload URLs restricted by exact `Content-Length` and SHA-256 checksum headers. |
| **TR-005** | FR-006 | Store structured hardware, GPS, and seizure metadata in PostgreSQL `JSONB` columns with schema validation via Zod. |
| **TR-006** | FR-007 | Implement automated hash comparator service calculating `verification_passed = (ingestion_sha256 === live_stream_sha256)`. |
| **TR-007** | FR-008 | Build PostgreSQL `AFTER INSERT` trigger on `audit_logs` computing cryptographic hash: $H_n = \text{sha256}(H_{n-1} \,\|\, \text{actor\_id} \,\|\, \text{action} \,\|\, \text{payload})$. |
| **TR-008** | FR-009 | Record custody handoff with WebAuthn digital assertion signature stored in `chain_of_custody.digital_signature`. |
| **TR-009** | FR-010 | Render FRE 902(14) PDF certificate directly in browser incorporating QR code (encoding JSON verification envelope). |
| **TR-010** | FR-011 | Implement dynamic HTML5 Canvas / WebGL watermark overlay injecting officer badge, timestamp, and IP over video playback. |

---

## 3. Performance Budgets

| Metric | Target Budget | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Initial Bundle Size (Gzipped)** | < 300 KB | Vite bundle visualizer check in CI; dynamic imports for PDF/charts. |
| **First Contentful Paint (FCP)** | < 0.8 seconds | Lighthouse CI assertion on mobile/desktop presets. |
| **Time to Interactive (TTI)** | < 1.4 seconds | Web Vitals performance telemetry. |
| **Client Hashing Throughput** | >= 80 MB/s | Web Worker dedicated thread; chunked 16MB stream buffer. |
| **API Latency (p95)** | < 150 ms | Supabase edge network latency + indexed PostgreSQL queries. |
| **PDF Certificate Generation Time** | < 2.0 seconds | Client-side jsPDF execution benchmark test. |
| **Database Query Execution Time** | < 25 ms | Index coverage on all foreign keys, status enums, and timestamps. |

---

## 4. Environments & Infrastructure

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ENVIRONMENT SPECIFICATIONS                      │
├───────────────┬────────────────────────────┬───────────────────────────┤
│ Environment   │ Host / Platform            │ Purpose                   │
├───────────────┼────────────────────────────┼───────────────────────────┤
│ **Local**     │ Node 20 LTS + Docker       │ Developer workstation,    │
│               │ Supabase CLI Local Stack   │ unit/integration tests.   │
├───────────────┼────────────────────────────┼───────────────────────────┤
│ **Staging**   │ Vercel / Cloudflare Pages  │ Automated PR review apps, │
│               │ Supabase Cloud (Staging)   │ Playwright E2E testing.   │
├───────────────┼────────────────────────────┼───────────────────────────┤
│ **Prod (MVP)**│ Vercel / Cloudflare Pages  │ Live hackathon demo and   │
│               │ Supabase Cloud (Production)│ judge evaluation.         │
└───────────────┴────────────────────────────┴───────────────────────────┘
```

---

## 5. Third-Party Services, Limits, & Cost

| Service | Provider | Tier & Usage Limit | Cost | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Database & Auth** | Supabase Cloud | Free Tier (500MB DB, 1GB Storage, 50k MAU) | $0.00 / month | Core PostgreSQL, Auth, and Storage. |
| **Hosting & CDN** | Vercel or Cloudflare | Free Hobby / Developer Tier | $0.00 / month | Static SPA frontend deployment and Edge DNS. |
| **Decentralized Pin (Opt)** | Pinata IPFS | Free Tier (1GB storage, 500 pins) | $0.00 / month | Encrypted cold evidence backup demo. |
| **Error Monitoring** | Sentry (Optional) | Developer Free (5,000 errors/month) | $0.00 / month | Production exception monitoring. |

---

## 6. Deployment & CI/CD Pipeline

```
GitHub Push / PR
       │
       ▼
 [GitHub Actions CI]
 ├── Step 1: Lint (ESLint 9 + Prettier)
 ├── Step 2: Typecheck (tsc --noEmit)
 ├── Step 3: Unit Tests (Vitest >= 80% coverage)
 ├── Step 4: Security Scan (npm audit --audit-level=high)
 ├── Step 5: Build (vite build)
       │
       ▼
 [Preview / Production Deploy]
 └── Automatic Vercel / Cloudflare Pages deployment upon passing checks.
```

---

## 7. Testing Strategy & Coverage Targets

| Test Level | Framework / Tool | Scope & Target Coverage |
| :--- | :--- | :--- |
| **Unit Testing** | Vitest + Testing Library | All utility functions, Web Crypto hash calculators, Merkle tree algorithms, Zod schemas. **Target: >= 80% line coverage**. |
| **Database & RLS Testing** | Supabase pgTAP / Local DB Tests | Verification that RLS blocks cross-tenant queries, trigger immutability prevents audit log modification. **Target: 100% of RLS policies**. |
| **Integration Testing** | Vitest + MSW | API client hooks, WebAuthn assertion handlers, case management state flows. |
| **End-to-End (E2E) Testing** | Playwright | Full browser user journeys: WebAuthn mock login, evidence upload, hash comparison, certificate export. |

---

## 8. Observability: Logs, Metrics, & Error Tracking

- **Client-Side Exception Capture:** Global React Error Boundary logging to browser console with sanitized error envelopes; zero stack trace exposure in UI.
- **Audit Event Telemetry:** Every critical event writes an immutable record to the `audit_logs` table (Actor ID, Target Entity, Verb, Hash, IP, User Agent).
- **Authentication Telemetry:** All WebAuthn challenges, passkey assertions, and sign-counter anomalies write directly to `authentication_events`.

---

## 9. Proposed Folder Structure Tree

```
incorrupta/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/                      # Architectural & Documentation Pack
│   ├── 00_INDEX.md
│   ├── 01_PRD.md
│   ├── ...
├── src/
│   ├── assets/                # Logos, seals, SVG icons
│   ├── components/            # Reusable UI components
│   │   ├── common/            # Button, Badge, Modal, Card, Input
│   │   ├── layout/            # Navbar, Sidebar, TopHeader
│   │   ├── cases/             # CaseCard, CaseFilter, CaseModal
│   │   ├── evidence/          # IngestionStudio, HashBadge, EvidenceGrid
│   │   ├── custody/           # CustodyTimeline, SignTransferModal
│   │   └── audit/             # LedgerViewer, AuditTable
│   ├── context/               # React Context (AuthContext, CaseContext)
│   ├── hooks/                 # Custom React hooks (useWebAuthn, useEvidence)
│   ├── lib/                   # Core business & cryptographic utilities
│   │   ├── crypto/            # sha256.ts, blake3.ts, merkle.ts, envelope.ts
│   │   ├── webauthn/          # passkeyClient.ts, fido2Helpers.ts
│   │   ├── supabase/          # client.ts, types.ts, rlsHelpers.ts
│   │   └── pdf/               # fre902Certificate.ts, qrGenerator.ts
│   ├── pages/                 # Route-level view components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CaseDetailPage.tsx
│   │   ├── IngestionPage.tsx
│   │   ├── CustodyLedgerPage.tsx
│   │   └── VerificationPage.tsx
│   ├── services/              # Supabase API client services
│   ├── types/                 # TypeScript interfaces and DB schema types
│   ├── App.tsx
│   ├── index.css              # Tailwind base, components, utilities
│   └── main.tsx
├── supabase/
│   ├── migrations/            # SQL migration scripts (00001_initial_schema.sql)
│   └── seed.sql               # Seed data for demo cases and officers
├── tests/
│   ├── unit/                  # Vitest unit test suites
│   ├── integration/           # API integration tests
│   └── e2e/                   # Playwright test specs
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 10. Environment Variable Names (Names Only — Zero Values)

```bash
# Supabase Configuration
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

# WebAuthn Relying Party Configuration
VITE_WEBAUTHN_RP_NAME
VITE_WEBAUTHN_RP_ID
VITE_WEBAUTHN_ORIGIN

# Application Settings
VITE_APP_ENV
VITE_STORAGE_BUCKET_NAME

# Optional Pinata IPFS Integration (Cold Backup)
VITE_PINATA_GATEWAY_URL
```

---

## 11. Technical Risks & Mitigations

| Risk | Technical Manifestation | Mitigation Strategy |
| :--- | :--- | :--- |
| **Large File Hashing Crash** | Reading a 2GB file directly into memory with `readAsArrayBuffer()` crashes the browser tab. | Stream file in 16MB chunks using the HTML5 File Slice API into a Web Crypto incremental accumulator. |
| **WebAuthn RP ID Mismatch** | Localhost vs production domain causes FIDO2 signature rejection (`SecurityError`). | Dynamically bind `RP_ID` to `window.location.hostname` in client configuration. |
| **Audit Trigger Performance** | Hash calculation on every insert slows batch operations. | SHA-256 calculation in PostgreSQL `pg_crypto` executes in < 0.1ms; indexes prevent sequential table scans. |

---

## 12. Decision Log

| Decision ID | Context & Options Considered | Selected Choice | Technical Consequence & Rationale |
| :--- | :--- | :--- | :--- |
| **DEC-001** | **Audit Ledger:** Option A (Standard DB logs) vs Option B (PostgreSQL Hash Chain) vs Option C (Public Blockchain). | **Option B: PostgreSQL Hash Chain** | Public blockchain violates CJIS data sovereignty and court expungement laws. PostgreSQL hash chain provides mathematical tamper-evidence with 0 gas fees and instant finality. |
| **DEC-002** | **Evidence Storage:** Public IPFS vs Private S3 vs Hybrid Envelope Storage. | **Private S3 + Envelope Encryption** | Public IPFS exposes sensitive law enforcement media to public P2P nodes. Client-side envelope encryption guarantees that unencrypted bits never touch storage unauthenticated. |
| **DEC-003** | **Authentication:** Email/Password + TOTP vs WebAuthn Passkeys. | **WebAuthn Passkeys** | Eliminates password database breaches and phishing attacks; allows physical biometric hardware binding to officer badge identity. |
