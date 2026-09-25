# 03_UIUX.md — Design & Interface Specification: INCORRUPTA (Mumbai Police Edition)

- **Purpose:** Define visual design tokens, component architecture, responsive layouts, user flows, and bilingual interactions (English & मराठी) for the **Mumbai Police (मुंबई पोलीस)**.
- **Status:** Draft v1 (Mumbai Police Customization)
- **Last Updated:** 2026-09-25
- **Depends On:** `docs/01_PRD.md`, `docs/02_TRD.md`

---

## 1. Design Principles & Mumbai Police Identity

1. **State Police Authority & Dignity:** Reflects the official aesthetic of the Maharashtra Police and Mumbai Police Commissionerate: Navy Blue (`#0B132B`), Deep Police Indigo (`#1C2541`), Gold Accent (`#E0A96D` / `#D4AF37`), and crisp White typography, carrying the historic motto: ***सद्रक्षणाय खलनिग्रहणाय*** (*"For Protection of the Good, For Destruction of the Evil"*).
2. **Clinical Evidentiary Precision:** Every timestamp displayed in Indian Standard Time (IST, UTC+05:30) with explicit NPL-NTP sync badges. Hashes displayed in clean monospace green (`#10B981`).
3. **Bilingual Accessibility (English / मराठी):** Designed from the ground up with native dual-language toggle for all navigation items, form labels, and status badges, allowing both English-proficient Cyber Crime officers and Marathi-speaking Station Malkhana clerks to operate without friction.
4. **Fast Field Deployment:** High-contrast touch targets for rugged field tablets used during nighttime search and seizure operations in Mumbai monsoons or mobile van deployments.

---

## 2. Design Tokens (Mumbai Police Theme)

### 2.1 Color Palette

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MUMBAI POLICE COLOR PALETTE                          │
├───────────────────────┬───────────┬────────────────────────────────────┤
│ Token Name            │ Hex Value │ Semantic Usage                     │
├───────────────────────┼───────────┼────────────────────────────────────┤
│ `--bg-police-navy`    │ `#070D1E` │ Root application dark background   │
│ `--bg-surface-slate`  │ `#0E172E` │ Cards, case binders, modals        │
│ `--bg-surface-elevated`│ `#182442`│ Headers, table rows, dropdowns    │
│ `--border-police`     │ `#233560` │ Inactive borders, dividers         │
│ `--border-focus`      │ `#00B4D8` │ Active focus rings, selected state │
│ `--text-primary`      │ `#F8FAFC` │ Primary headings, CR Numbers       │
│ `--text-secondary`    │ `#94A3B8` │ Labels, officer designations       │
│ `--accent-gold`       │ `#D4AF37` │ Police insignia, official seals    │
│ `--accent-cyan`       │ `#00B4D8` │ Primary actions, verify buttons    │
│ `--status-pristine`   │ `#10B981` │ Verified hash match, sealed intact │
│ `--status-malkhana`   │ `#F59E0B` │ Deposited in Station Malkhana      │
│ `--status-fsl`        │ `#6366F1` │ Dispatched to DFSL Kalina Lab      │
│ `--status-tamper`     │ `#EF4444` │ Critical hash mismatch alert       │
│ `--hash-mono`         │ `#34D399` │ Monospace cryptographic hash text  │
└───────────────────────┴───────────┴────────────────────────────────────┘
```

### 2.2 Typography Scale
- UI Sans: `Inter, "Noto Sans Devanagari", -apple-system, sans-serif`
- Monospace: `"JetBrains Mono", "Fira Code", monospace`
- Scale: `text-xs` (12px), `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px).

---

## 3. Bilingual Terminology Mapping (English / मराठी)

| English Term | Marathi Legal & Police Term (मराठी) | Context in INCORRUPTA |
| :--- | :--- | :--- |
| **First Information Report (FIR)** | प्रथम खबरी अहवाल / गुन्हा रजिस्टर (CR) | Master case identifier e.g. CR No. 142/2026 |
| **Investigating Officer (IO)** | तपास अधिकारी (त.अ.) | API / PSI in charge of investigation |
| **Evidence / Case Property** | मुद्देमाल (Muddemal) | Seized digital artifacts |
| **Police Station Evidence Room** | मालखाना (Malkhana) | Secure station evidence repository |
| **Search & Seizure Memo** | जप्ती पंचनामा (Japti Panchnama) | Seizure record under BNSS Sec 105 |
| **Independent Witnesses** | पंच साक्षीदार (Panchas) | Two mandatory witnesses present during seizure |
| **Forensic Science Laboratory** | न्यायवैद्यक विज्ञान प्रयोगशाळा (FSL, कलिना) | State Forensic Lab, Kalina, Mumbai |
| **Chain of Custody** | ताबा साखळी (Taba Sakhli) | Chronological movement log |
| **Section 63 Certificate** | कलम ६३ बीएसए प्रमाणपत्र | Certificate under BSA 2023 |

---

## 4. Screen Specifications (Mumbai Police Context)

### Screen 1: Login & Sevarth WebAuthn Verification
- **Purpose:** Secure passwordless login for Mumbai Police personnel using Sevarth ID and biometric passkeys.
- **Route:** `/login`
- **Branding:** Mumbai Police crest with State Motto (*सद्रक्षणाय खलनिग्रहणाय*).
- **Components:** Sevarth Employee ID input (e.g. `MH-POL-40211`), "Authenticate with Passkey" button, Language Toggle (`English` / `मराठी`), NPL-IST time indicator.
- **Copy:**
  - Header: "मुंबई पोलीस • MUMBAI POLICE"
  - Subheader: "Digital Evidence & Muddemal Custody Management System (INCORRUPTA)"
  - Button: "Verify Biometric Passkey / बायोमेट्रिक पडताळणी"

---

### Screen 2: Police Station Case Dashboard
- **Purpose:** View active FIR / CR investigations, pending Malkhana deposits, and Kalina FSL forensic dispatches.
- **Route:** `/dashboard`
- **Layout:** Top bar displaying Police Station name (`BKC Cyber Crime Police Station, Zone VIII`), 3 KPI metrics (Active FIRs, Sealed Muddemal Blobs, NPL Time Sync Status), 2-column layout (Left: Active CR List; Right: Real-Time Muddemal Movement Ledger).
- **KPI Copy:**
  - Metric 1: "28 Active CR Cases (गुन्हे)"
  - Metric 2: "114 Sealed Muddemal Items (मुद्देमाल)"
  - Metric 3: "100% Cryptographic Ledger Integrity (अखंडित साखळी)"

---

### Screen 3: Case Binder & Muddemal Property Grid
- **Purpose:** Primary working view for Investigating Officers (IOs) and Public Prosecutors.
- **Route:** `/cases/:caseId`
- **Header:** "CR No. 142/2026 • BKC Cyber Police Station"
- **Subheader:** "Sections: BNS 316(2), 318(4), IT Act 66D • Court: Sessions Court, Fort, Mumbai"
- **Columns:** Muddemal No. (`MDL-142/26-01`), Category, Panchnama Ref (`PAN-089`), Baseline SHA-256, Current Custodian, Status Badge, Actions.

---

### Screen 4: BNSS 105 Seizure & Ingestion Studio
- **Purpose:** Ingest mandatory audio-video search & seizure recordings, CCTV extractions, and mobile forensic clones with instant on-site streaming hashing.
- **Route:** `/cases/:caseId/ingest`
- **Form Fields:**
  - Seizure Type: `BNSS Section 105 Videography`, `Mobile Extraction`, `CCTV DVR Image`.
  - Panchnama Reference No.
  - Independent Panch Witnesses: Names, Addresses, Mobile Numbers of 2 Panchas.
  - Seizure Location: Street address and automated GPS coordinates.
  - Source Hardware Details: Make, Model, IMEI 1/2, Serial No.
  - Live Hashing Meter: Real-time SHA-256 + Blake3 computation display (MB/s).
- **Action:** "Sign & Seal Muddemal Seizure / बायोमेट्रिक जप्ती सही".

---

### Screen 5: Station Malkhana & Kalina FSL Custody Timeline
- **Purpose:** Track physical and digital custody handoffs between Investigating Officers, Station Malkhana Clerks, and Kalina FSL Forensic Examiners.
- **Route:** `/cases/:caseId/evidence/:evidenceId/custody`
- **Visual Nodes:**
  - *Node 1:* On-Scene Seizure (Andheri East) by API Sachin Kadam.
  - *Node 2:* Deposited into Azad Maidan PS Malkhana Shelf #4 (HC Ramesh Patil).
  - *Node 3:* Handed over to Carrier PC Sandeep Shinde for transit to DFSL Kalina.
  - *Node 4:* Acknowledged by Scientific Officer, Cyber Forensics Division, DFSL Kalina.
- **Action Drawer:** "Initiate Custody Transfer" with dual WebAuthn digital signatures.

---

### Screen 6: Section 63 BSA (2023) Statutory Certificate Modal
- **Purpose:** Instant cryptographic verification and one-click PDF export of the statutory certificate required under **Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023** (formerly Section 65B Indian Evidence Act).
- **Route:** Modal overlay on `/cases/:caseId`
- **Layout:** Left: Live cryptographic comparison terminal matching scene seizure hash with current vault hash; Right: Formatted preview of the official Mumbai Police Section 63 Certificate.
- **Export Features:**
  - Mumbai Police header emblem.
  - Full statutory declaration under Section 63(4) BSA 2023.
  - Complete 64-character SHA-256 and Blake3 digests.
  - Seizure Panchnama reference and Panch witness records.
  - Cryptographically verifiable QR code linking to offline verification proof.
  - Digital signature seal of the Investigating Officer with NPL-IST timestamp.
