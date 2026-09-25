# 01_PRD.md — Product Requirements Document: INCORRUPTA (Mumbai Police Edition)

- **Purpose:** Define product vision, target personas, user journeys, functional requirements (FRs), non-functional requirements (NFRs), and legal compliance tailored for the **Mumbai Police (मुंबई पोलीस)**, Maharashtra State Police, and the Indian Criminal Justice System.
- **Status:** Draft v1 (Mumbai Police Customization)
- **Last Updated:** 2026-09-25
- **Depends On:** None

---

## 1. Vision & Problem Statement

### 1.1 Vision
INCORRUPTA (Mumbai Police Edition) is an enterprise-grade digital law-enforcement case management and evidence integrity platform designed specifically for the **Mumbai Police Commissionerate**, **Crime Branch (CID)**, **Cyber Police Stations (BKC, South, Central, East, West, North)**, and all 94+ territorial Police Stations across Mumbai.

It guarantees **unbroken digital chain of custody**, **biometric hardware authentication for Investigating Officers (IOs)**, **tamper-evident Muddemal (मुद्देमाल) tracking**, and **instant statutory certificate generation under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 (BSA)** (formerly Section 65B of the Indian Evidence Act, 1872) and **Section 105 of the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)**.

### 1.2 Problem Statement in the Context of Mumbai Police & Indian Courts
1. **Mandatory Videography under BNSS (Sec 105):** With the enactment of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, search and seizure procedures across Mumbai Police stations legally mandate audio-video electronic recording. Stations lack a standardized, cryptographically secure platform to store and prove the authenticity of these gigabytes of mobile recordings.
2. **Section 63 BSA (formerly 65B IEA) Admissibility Challenges:** Defense attorneys in Sessions Courts (Fort, Dindoshi, Mazgaon) and the Bombay High Court routinely challenge digital evidence due to defective Section 65B/63 certificates, unrecorded hashing, or lack of proof that the hash was calculated at the exact moment of seizure.
3. **Malkhana (मालखाना) & Muddemal Record Vulnerabilities:** Station evidence rooms (Malkhanas) rely on physical paper Muddemal registers (*रजिस्टर नंबर ४*). Digital media on seized hard drives, CCTV DVRs, and smartphones are susceptible to tampering, unrecorded access during custodial interrogation, and prolonged transit delays to the **Directorate of Forensic Science Laboratories (DFSL), Kalina, Mumbai**.
4. **Data Sovereignty & Cyber Security Mandates:** Relying on commercial foreign clouds or unmanaged local drives violates **CERT-In cyber security guidelines (2022)** and the **Digital Personal Data Protection Act, 2023 (DPDP Act)**.

---

## 2. Goals & Measurable Success Metrics

| Goal ID | Objective | Measurable Target | Measurement Methodology |
| :--- | :--- | :--- | :--- |
| **G-001** | Section 63 BSA Statutory Admissibility | 100% of exported digital evidence packets include a fully compliant, self-authenticating Section 63 BSA certificate. | Judicial verification checklist and automated PDF validator. |
| **G-002** | Zero Muddemal Hash Discrepancies | 100% of seized digital artifacts have dual hashes (SHA-256 + Blake3) calculated at scene seizure before Malkhana intake. | Automated intake vs. Kalina FSL lab check logs. |
| **G-003** | BNSS 105 Mandatory Search Recording Seal | Search & seizure videography files hashed and sealed in < 60 seconds from recording completion. | Client Web Crypto hashing speed and timestamp validation. |
| **G-004** | Phishing-Immune Officer Auth | 100% of Investigating Officers (IOs) authenticate via FIDO2 WebAuthn biometric sensors or hardware security tokens. | Auth audit logs showing zero password authentication endpoints. |
| **G-005** | National Data Sovereignty & CERT-In Sync | 100% data residency within Indian borders (MeitY-empaneled cloud); timestamps synchronized via NPL/NIC NTP servers. | Cloud region audit (`ap-south-1` Mumbai) and NTP drift telemetry (< 5ms). |

---

## 3. Non-Goals (Explicitly Out of Scope for MVP)

- **NG-001:** Direct bi-directional automated database sync with legacy national CCTNS (Crime and Criminal Tracking Network and Systems) or ICJS (Inter-operable Criminal Justice System) mainframes (manual CR number entry used for MVP).
- **NG-002:** Automated speech-to-text transcription of regional Marathi / Hindi / Bambaiya slang audio recordings.
- **NG-003:** Live automated facial recognition system (AFRS) scanning against police databases.
- **NG-004:** Public blockchain token transactions with cryptocurrency gas payments (strictly prohibited under Indian government IT regulations).

---

## 4. Target User Personas (Mumbai Police)

### Persona 1: Assistant Police Inspector (API) Sachin Kadam (Investigating Officer - IO)
- **Designation:** Assistant Police Inspector, Cyber Crime Police Station, Bandra Kurla Complex (BKC), Zone VIII, Mumbai.
- **Core Goals:** Seize digital evidence from financial fraud and extortion raids, execute mandatory BNSS Section 105 videography of the Panchnama, hash mobile device dumps on-site, and ensure defense cannot claim evidence was planted or altered.
- **Pain Points:** Spends nights typing paper seizure memos (Japti Panchnama); defense lawyers cross-examine him for hours on whether the laptop was connected to the internet after seizure; difficult to track when Kalina FSL will complete forensic imaging.

### Persona 2: Head Constable Ramesh Patil (Malkhana Mohrir / Evidence Property Clerk)
- **Designation:** In-charge of Muddemal Property Room, Azad Maidan Police Station, Zone I, Mumbai.
- **Core Goals:** Maintain physical and digital registry of all seized weapons, contraband, and digital devices; track transfers when an IO takes a hard drive to Kalina FSL or to the Esplanade Court (Killa Court).
- **Pain Points:** Relies on handwritten register books; fears files on seized pen drives will get corrupted or infected with malware; has no technical means to verify if a pen drive returned from the lab has the identical bits as when received.

### Persona 3: Special Public Prosecutor Adv. Meera Deshmukh (Sessions Court, Fort, Mumbai)
- **Designation:** Special Public Prosecutor representing the State of Maharashtra in Cyber & Economic Offences.
- **Core Goals:** Present digital call records, WhatsApp forensic chats, and CCTV footage to the trial judge with ironclad Section 63 BSA certificates that withstand hostile defense scrutiny.
- **Pain Points:** Judges rejecting digital evidence because the Section 65B/63 certificate lacked the device serial number or hash digest; IOs unable to produce a clear timestamped audit log of who handled the evidence during custody.

---

## 5. Top 3 User Journeys (Mumbai Police Context)

### Journey 1: Raid, Seizure, & Panchnama Hashing (API Sachin Kadam)
1. **On-Scene Seizure:** API Sachin Kadam conducts a search warrant raid at a call center in Andheri (East) regarding an extortion syndicate under CR No. `142/2026` of BKC Cyber PS.
2. **BNSS 105 Videography & Hashing:** API Kadam opens INCORRUPTA on his department-issued rugged tablet. Using his WebAuthn TouchID, he authenticates securely. He records the physical seizure of a desktop server and two OnePlus phones as mandated by BNSS Section 105.
3. **Muddemal Ingestion:** The video recording and extracted disk image are streamed through INCORRUPTA’s client-side Web Crypto engine, computing `SHA-256` and `Blake3` hashes directly on the tablet.
4. **Panchnama Details:** Sachin logs the Panchnama details, names of two independent Panch witnesses (*Panchas*), physical bag seal numbers, and GPS coordinates (Andheri East, 19.1136° N, 72.8697° E).
5. **Biometric Sealing:** Sachin touches his fingerprint sensor to digitally sign the seizure. The record is assigned Muddemal Tracking ID `MDL-142/26-01` and uploaded to the private encrypted Mumbai storage vault.

### Journey 2: Malkhana Intake & Dispatch to Kalina FSL (HC Ramesh Patil)
1. **Intake at Police Station:** API Kadam brings the physical sealed bag and digital intake token to the Azad Maidan Police Station Malkhana.
2. **Muddemal Handshake:** Malkhana Clerk HC Ramesh Patil opens the INCORRUPTA custody ledger, inspects the tamper tape number, and runs an instant integrity check on the digital file.
3. **Pristine Hash Check:** INCORRUPTA verifies the storage hash against API Kadam’s scene hash (`Match = TRUE`).
4. **Dispatch to Kalina FSL:** Two days later, Court orders forensic analysis. HC Patil initiates custody transfer to *Carrier Constable Sandeep Shinde* for transit to the Directorate of Forensic Science Laboratories (DFSL), Kalina, Santacruz (E).
5. **Dual Digital Signoff:** Both Patil and Shinde authenticate with their WebAuthn credentials, generating an immutable, chained custody transfer entry.

### Journey 3: Courtroom Trial & Section 63 BSA Certificate (Adv. Meera Deshmukh)
1. **Trial Preparation at City Civil & Sessions Court, Fort:** Prosecutor Meera Deshmukh prepares the chargesheet and trial exhibits for the trial judge in Court Room 12.
2. **One-Click Section 63 BSA Export:** Meera selects `MDL-142/26-01`. The platform runs a real-time cryptographic audit across the Merkle hash chain from the moment of API Kadam’s seizure in Andheri to the Kalina FSL report.
3. **Statutory Certificate Generation:** Meera clicks "Generate Section 63 BSA Certificate". INCORRUPTA renders the official Certificate under Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023.
4. **Judicial Presentation:** The certificate includes the CR Number, IO Badge ID, exact NPL-synchronized timestamps, device serials, SHA-256 hash, and a judicial verification QR code. The judge marks the electronic evidence as **Exhibit 14**, ruling it self-authenticating and fully admissible.

---

## 6. Functional Requirements (FR) — Mumbai Police Tailored

| ID | Description | Priority | Persona |
| :--- | :--- | :--- | :--- |
| **FR-001** | FIDO2 WebAuthn biometric login for Mumbai Police officers with badge/sevarth ID verification. | Must | All |
| **FR-002** | Case creation mapped to Mumbai Police FIR structure (CR Number, Police Station, Year, Penal Sections). | Must | Sachin, Ramesh |
| **FR-003** | Muddemal (मुद्देमाल) Property Register tracking with unique auto-generated Muddemal item numbers. | Must | Ramesh, Sachin |
| **FR-004** | Client-side streaming dual-hashing (SHA-256 + Blake3) compliant with BNSS Section 105 seizure recording. | Must | Sachin |
| **FR-005** | Direct upload to MeitY-empaneled encrypted cloud storage (AWS `ap-south-1` Mumbai / Azure Pune). | Must | Sachin, Ramesh |
| **FR-006** | Capture of mandatory Indian legal metadata: Seizure Panchnama No., Panch witness names, IO Sevarth ID. | Must | Sachin |
| **FR-007** | Automated hash verification checking scene seizure hash against Kalina FSL intake hash. | Must | Ramesh, Meera |
| **FR-008** | Append-only chained cryptographic audit log tracking all views, exports, and status changes. | Must | All |
| **FR-009** | Digital Malkhana check-in/check-out workflow with dual WebAuthn step-up biometric signatures. | Must | Ramesh, Sachin |
| **FR-010** | One-click export of statutory **Section 63 Bharatiya Sakshya Adhiniyam (BSA), 2023** PDF Certificate. | Must | Meera |
| **FR-011** | Bilingual UI toggle support: English and Marathi (मराठी) for all primary navigation and labels. | Should | Ramesh, Sachin |
| **FR-012** | Video playback dynamic watermark displaying IO Badge #, Police Station, and NPL-IST timestamp. | Should | Meera, Sachin |
| **FR-013** | Emergency Sealing of sensitive evidence (POCSO / Terrorism / Intelligence) restricted to DCP/CP. | Should | Ramesh |
| **FR-014** | Offline-capable verification bundle (JSON Merkle envelope) for air-gapped forensic lab workstations. | Could | Meera |
| **FR-015** | Kalina FSL lab receipt attachment binding formal chemical/cyber laboratory report PDF to Muddemal hash. | Could | Ramesh, Meera |

---

## 7. Non-Functional Requirements (NFR)

| ID | Category | Requirement & Target |
| :--- | :--- | :--- |
| **NFR-001** | Data Sovereignty | 100% of data, database rows, and backups must reside strictly within Indian sovereign territory (MeitY empaneled). |
| **NFR-002** | Time Synchronization | All system clocks synchronized with National Physical Laboratory (NPL) / NIC NTP servers with < 5ms drift (CERT-In mandate). |
| **NFR-003** | Performance | In-browser Web Crypto hashing throughput >= 80 MB/s on standard department laptops/tablets. |
| **NFR-004** | Security | Enforce strict PostgreSQL Row Level Security (RLS) restricting station records by Police Station and Zone. |
| **NFR-005** | Legal Compliance | Strict adherence to Section 63 BSA 2023, Section 105 BNSS 2023, and Section 79A of IT Act 2000. |
| **NFR-006** | Accessibility | Compliance with WCAG 2.2 AA and Indian Government Guidelines for Indian Government Websites (GIGW 3.0). |

---

## 8. Statutory Section 63 BSA Certificate Specification

The exported certificate must strictly adhere to the statutory mandate of **Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023**:
1. **Title:** *Certificate under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 for Admissibility of Electronic Records*.
2. **Police Station Header:** Mumbai Police Commissionerate, Name of Police Station (e.g. *Bandra Kurla Complex Cyber Police Station*), Zone, District: Mumbai, Maharashtra.
3. **FIR Reference:** CR No. [XXX/YYYY], Date of Registration, Sections under BNS 2023 / IT Act.
4. **Device & Extraction Details:** Make, Model, IMEI, Operating System, Source MAC Address, Seizure Panchnama Date.
5. **Cryptographic Integrity Block:** SHA-256 Digest (64 hex characters), Blake3 Digest, Hashing Tool (INCORRUPTA Client Web Crypto Engine v1.0).
6. **Statutory Declaration:** Official declaration by the person in lawful charge of the recording device stating that the electronic record was produced during the ordinary course of duties, that the device operated properly, and that no alteration or unauthorized interference occurred.
7. **Signatures & Verification QR:** Digital WebAuthn signature of the Investigating Officer, timestamped via NPL-IST, with an interactive verification QR code.
