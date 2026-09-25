# 00_INDEX.md — Master Documentation Index: INCORRUPTA (Mumbai Police Edition)

- **Project:** INCORRUPTA (Secure Digital Evidence & Muddemal Custody Management for Mumbai Police)
- **Status:** Complete Documentation Pack (v1.0 - Mumbai Police Edition)
- **Last Updated:** 2026-09-25
- **Depends On:** None

---

## 1. Table of Contents & Document Purposes

| Document | File Path | One-Line Purpose |
| :--- | :--- | :--- |
| **00_INDEX** | `docs/00_INDEX.md` | Master directory, reading order, ID conventions, Mumbai Police glossary, and assumptions. |
| **01_PRD** | `docs/01_PRD.md` | Product vision, Mumbai Police personas (API Kadam, HC Patil, Adv. Deshmukh), statutory laws (BSA 2023, BNSS 2023). |
| **02_TRD** | `docs/02_TRD.md` | Technical stack decisions, sovereign Indian cloud hosting (`ap-south-1`), NPL-IST time sync, and CI/CD. |
| **03_UIUX** | `docs/03_UIUX.md` | Mumbai Police navy/gold visual theme, bilingual Marathi (मराठी) support, and screen-by-screen layouts. |
| **04_ARCHITECTURE** | `docs/04_ARCHITECTURE.md`| Indian criminal justice schema (CR No, Muddemal No, Panchnama, Sevarth ID), DDL, and API contracts. |
| **05_SECURITY** | `docs/05_SECURITY.md` | STRIDE threat model, Section 63 BSA compliance, BNSS 105 videography, and CERT-In directions. |
| **06_TICKETS** | `docs/06_TICKETS.md` | Actionable engineering tickets (T-001 to T-019) covering Mumbai Police schema, Malkhana custody, and BSA certificates. |
| **07_RULES** | `docs/07_RULES.md` | The AI agent's operational constitution: approved/banned libraries, error handling, and boundaries. |
| **08_PHASES** | `docs/08_PHASES.md` | Sequential execution phases (0 to 6), milestones, testable exit gates, and Mumbai Police demo scripts. |
| **09_MASTER_PROMPT** | `docs/09_MASTER_PROMPT.md`| Copy-pasteable session prompt for AI coding agents with strict working protocols. |
| **CLAUDE.md** | `/CLAUDE.md` | Root instruction file directing agents to read rules and master prompt before executing work. |
| **AGENTS.md** | `/AGENTS.md` | Universal agent entry point enforcing strict phase-and-ticket adherence. |

---

## 2. Domain & Police Glossary (Mumbai Police & Indian Law)

- **Bharatiya Sakshya Adhiniyam, 2023 (BSA):** Modern Indian evidence law replacing the Indian Evidence Act, 1872. Section 63 governs the admissibility of electronic records.
- **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS):** Modern Indian criminal procedure code replacing CrPC, 1973. Section 105 mandates audio-video recording of search and seizure operations.
- **Bharatiya Nyaya Sanhita, 2023 (BNS):** Modern penal code replacing the Indian Penal Code (IPC), 1860.
- **CR Number (Crime Register Number / FIR No.):** Authoritative First Information Report registration number (e.g. `CR No. 142/2026`).
- **Muddemal (मुद्देमाल):** Official legal term used in Maharashtra police and court administration for seized case property/evidence.
- **Malkhana (मालखाना):** Police station secure storage vault managed by the Malkhana Mohrir (Property Clerk).
- **Panchnama (पंचनामा):** Official seizure memo prepared on-site in the presence of two independent respectable witnesses (*Panchas*).
- **DFSL Kalina (न्यायवैद्यक विज्ञान प्रयोगशाळा):** Directorate of Forensic Science Laboratories, Kalina, Santacruz (East), Mumbai.
- **Sevarth ID (सेवार्थ आयडी):** Official employee identification code issued to Maharashtra Government and Police personnel.
- **NPL-IST (National Physical Laboratory - Indian Standard Time):** Atomic clock synchronization required under CERT-In guidelines (UTC+05:30).

---

## 3. Collected List of Assumptions (Mumbai Police Edition)

- **[ASSUMPTION 1 — Biometric Devices]:** Mumbai Police Investigating Officers (IOs) and Malkhana staff operate rugged departmental laptops/tablets equipped with biometric TouchID or USB FIDO2 tokens (YubiKey).
- **[ASSUMPTION 2 — Sovereign Indian Cloud Hosting]:** Primary database and encrypted storage execute in MeitY-empaneled Indian data centers (AWS Asia Pacific Mumbai `ap-south-1` or Azure Central India Pune).
- **[ASSUMPTION 3 — Section 63 BSA Admissibility]:** Sessions Courts (Fort, Dindoshi, Mazgaon) and the Bombay High Court accept cryptographically verifiable Section 63 BSA digital certificates as satisfying self-authentication.
- **[ASSUMPTION 4 — Dual-Language UI]:** The interface provides instantaneous toggling between English and Marathi (मराठी) to accommodate both cyber specialists and station property staff.
- **[ASSUMPTION 5 — Separation of Station Jurisdictions]:** Station and Zone boundaries are strictly enforced via PostgreSQL Row Level Security (RLS) to prevent unauthorized cross-station snooping.
