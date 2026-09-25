# 05_SECURITY.md — Security & Statutory Compliance: INCORRUPTA (Mumbai Police Edition)

- **Purpose:** Define security architecture, threat model (STRIDE), RBAC matrix, and statutory compliance tailored for the **Mumbai Police**, **Bharatiya Sakshya Adhiniyam 2023 (BSA)**, **Bharatiya Nagarik Suraksha Sanhita 2023 (BNSS)**, and **CERT-In Directions**.
- **Status:** Draft v1 (Mumbai Police Customization)
- **Last Updated:** 2026-09-25
- **Depends On:** `docs/01_PRD.md`, `docs/02_TRD.md`, `docs/04_ARCHITECTURE.md`

---

## 1. Indian Legal & Regulatory Compliance Framework

*(Notice: Applicable statutory interpretations must be verified with a qualified Indian legal advocate).*

```
┌────────────────────────────────────────────────────────────────────────┐
│               INDIAN STATUTORY & CYBER COMPLIANCE STACK                │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Statute / Authority      │ Mandatory Compliance Requirement            │
├──────────────────────────┼─────────────────────────────────────────────┤
│ **Bharatiya Sakshya**    │ Mandates conditions under which electronic  │
│ **Adhiniyam (BSA), 2023**│ records are admissible without physical     │
│ **Section 63**           │ production of the original device. Requires │
│                          │ official certificate signed by lawful person│
│                          │ in charge with cryptographic hash proof.    │
├──────────────────────────┼─────────────────────────────────────────────┤
│ **Bharatiya Nagarik**    │ Mandates compulsory audio-video electronic  │
│ **Suraksha Sanhita, 2023**│ recording of search and seizure operations,  │
│ **Section 105**          │ preparation of seizure list, and immediate  │
│                          │ forwarding to the District Magistrate.      │
├──────────────────────────┼─────────────────────────────────────────────┤
│ **Information Technology**│ Section 79A regulates Central Government    │
│ **Act, 2000**            │ notification of Examiners of Electronic     │
│                          │ Evidence (e.g. DFSL Kalina, CFSL Hyderabad).│
├──────────────────────────┼─────────────────────────────────────────────┤
│ **CERT-In Directions**   │ Requires synchronization of system clocks   │
│ **(April 28, 2022)**     │ with National Physical Laboratory (NPL) or  │
│                          │ NIC NTP servers; mandates unbroken retention│
│                          │ of ICT logs for minimum 180 days.           │
├──────────────────────────┼─────────────────────────────────────────────┤
│ **Digital Personal Data**│ Section 17 provides law enforcement         │
│ **Protection Act, 2023** │ exemptions for crime investigation while    │
│ **(DPDP Act)**           │ enforcing strict internal access controls.  │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. National Data Sovereignty Mandate

1. **Strict Geofencing (Sovereign Soil):**
   - 100% of primary databases, encrypted evidence storage buckets, Edge compute runtimes, and disaster recovery replicas must reside **physically within the territory of the Republic of India**.
   - Permitted data center regions: AWS Asia Pacific (Mumbai) `ap-south-1`, Azure Central India (Pune) / South India (Chennai), or Government MeghRaj (NIC) cloud.
   - Any egress of Criminal Justice Information (CJI) or evidence bytes outside of Indian sovereign borders is strictly prohibited.
2. **NPL / NIC Time Synchronization:**
   - Every transaction, hash timestamp, and custody transfer logs the precise time sourced from the **National Physical Laboratory (NPL), New Delhi** or National Informatics Centre (NIC) atomic time servers, maintaining drift `< 5ms`.

---

## 3. Threat Model (STRIDE) in Police Station Context

| Threat Category | Mumbai Police Attack Vector | Mitigation in INCORRUPTA |
| :--- | :--- | :--- |
| **Spoofing Identity** | Adversary attempts to access BKC Cyber PS files by phishing an Investigating Officer's credentials. | FIDO2 WebAuthn authentication bound to officer Sevarth ID and device Secure Enclave; passwords completely eliminated. |
| **Tampering with Data** | Accused bribes personnel to alter CCTV video or replace a seized pen drive with a blank drive in the Malkhana. | Ingestion SHA-256 + Blake3 calculated on scene; append-only cryptographic hash chain; storage WORM locks. |
| **Repudiation** | Investigating Officer denies taking evidence out of the Malkhana for an interrogation. | Handoff requires dual WebAuthn biometric signatures from both IO and Malkhana In-Charge in `chain_of_custody`. |
| **Information Disclosure** | An officer at Colaba PS snoops on high-profile corporate extortion cases at BKC Cyber PS. | Station & Zone Row Level Security (RLS) restricts access strictly to assigned officers and supervising ACP/DCP. |
| **Denial of Service** | Cyber attackers flood station upload portal to prevent timely filing of electronic search memos under BNSS 105. | Edge rate limiting, API token throttling, pre-signed upload URLs restricted to verified CR Numbers. |
| **Elevation of Privilege** | Malkhana clerk attempts to alter case chargesheet or delete audit records. | Database triggers reject `UPDATE`/`DELETE` on `audit_logs`; role hierarchy enforced at PostgreSQL kernel level. |

---

## 4. Authorization: Mumbai Police Station & Zone RBAC Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│               MUMBAI POLICE ROLE-BASED ACCESS CONTROL (RBAC)           │
├────────────────────┬──────────┬──────────┬──────────┬─────────┬────────┤
│ Role               │ Case     │ Muddemal │ Custody  │ Audit   │ Scope  │
│                    │ CRUD     │ Ingestion│ Transfer │ Logs    │        │
├────────────────────┼──────────┼──────────┼──────────┼─────────┼────────┤
│ CP / Addl. CP / DCP│ Full View│ R        │ R        │ Full    │ Zone / │
│                    │ & Seal   │          │          │ View    │ City   │
├────────────────────┼──────────┼──────────┼──────────┼─────────┼────────┤
│ Malkhana Mohrir    │ R        │ R/W      │ R/W/Sign │ Station │ Police │
│ (HC Ramesh Patil)  │          │          │          │ Only    │ Station│
├────────────────────┼──────────┼──────────┼──────────┼─────────┼────────┤
│ Investigating Off. │ R/W*     │ R/W*     │ R/Sign*  │ Case    │ Assigned│
│ (API Sachin Kadam) │          │          │          │ Only    │ CR Case│
├────────────────────┼──────────┼──────────┼──────────┼─────────┼────────┤
│ Public Prosecutor  │ R*       │ R*       │ R*       │ Case    │ Trial  │
│ (Adv. Deshmukh)    │          │          │          │ Only    │ Court  │
├────────────────────┼──────────┼──────────┼──────────┼─────────┼────────┤
│ DFSL Kalina Tech   │ R (Meta) │ Lab R/W  │ Sign Lab │ Lab     │ Lab    │
│                    │          │ Report   │ Receipt  │ Events  │ Tokens │
└────────────────────┴──────────┴──────────┴──────────┴─────────┴────────┘
* Restricted strictly to assigned cases within the officer's police station.
```

---

## 5. Evidence Envelope Encryption Standards

```
1. [Seized Raw Digital Media] (CCTV / Mobile Dump / Video)
       │
       ▼
2. Web Crypto API generates 256-bit AES-GCM Data Encryption Key (DEK).
       │
       ├──► Client Encrypts File ──► [Ciphertext Blob]
       │                                     │
       ▼                                     ▼
3. Master Key Encryption Key (KEK)      Compute SHA-256 of Raw File
   (Managed via MeitY KMS)                   │
   encrypts DEK ──► [Encrypted DEK]          ▼
       │                                Upload to S3 WORM Bucket
       ▼                                (AWS ap-south-1 Mumbai)
   Store Encrypted DEK in PostgreSQL
   (Protected by RLS in Mumbai DB)
```

---

## 6. Security Acceptance Checklist per Phase

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MUMBAI POLICE SECURITY ACCEPTANCE GATES              │
├─────────┬──────────────────────────────────────────────────────────────┤
│ Phase 0 │ [ ] Data residency verified: Cloud region set to ap-south-1. │
│         │ [ ] Zero hardcoded secrets in repository.                    │
├─────────┼──────────────────────────────────────────────────────────────┤
│ Phase 1 │ [ ] WebAuthn biometric login verified with Sevarth ID.       │
│         │ [ ] Cloned passkey assertion rejected with HTTP 401.         │
├─────────┼──────────────────────────────────────────────────────────────┤
│ Phase 2 │ [ ] Police station isolation verified: Colaba PS officer     │
│         │     cannot read BKC Cyber PS records.                        │
├─────────┼──────────────────────────────────────────────────────────────┤
│ Phase 3 │ [ ] BNSS Section 105 search video hashes match 100% on scene.│
│         │ [ ] Storage bucket blocks public Internet reads.             │
├─────────┼──────────────────────────────────────────────────────────────┤
│ Phase 4 │ [ ] Muddemal custody transfer requires dual biometric signs. │
│         │ [ ] Modifying historical audit log breaks hash chain test.   │
├─────────┼──────────────────────────────────────────────────────────────┤
│ Phase 5 │ [ ] Section 63 BSA PDF certificate contains valid QR proof   │
│         │     and complete statutory declaration without data leak.    │
└─────────┴──────────────────────────────────────────────────────────────┘
```
