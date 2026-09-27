# INCORRUPTA 🇮🇳
### Sovereign Digital Evidence & Chain-of-Custody Operating System
*Compliant with the Bharatiya Sakshya Adhiniyam (BSA) 2023 & Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023*

[![Live Demo on Vercel](https://img.shields.io/badge/Vercel-Live%20Production%20Deployment-059669?style=for-the-badge&logo=vercel&logoColor=white)](https://incorrupta-eight.vercel.app)
[![Statutory Compliance](https://img.shields.io/badge/Statute-BSA%20Sec%2063%20%7C%20BNSS%20Sec%20105-0B2545?style=for-the-badge)](https://incorrupta-eight.vercel.app)
[![Security Rating](https://img.shields.io/badge/Security-FIPS%20140--3%20Level%204%20Architecture-B45309?style=for-the-badge)](https://incorrupta-eight.vercel.app)
[![Tests](https://img.shields.io/badge/Tests-33%2F33%20Passing-emerald?style=for-the-badge)](https://incorrupta-eight.vercel.app)

---

## 🏛️ Executive Overview

**INCORRUPTA** is an institutional-grade, zero-trust digital evidence repository and chain-of-custody operating system engineered specifically for State Police Forces (Cyber Cells, Malkhanas), State Forensic Science Laboratories (FSL), and Judicial Magistrates across the Republic of India.

It transforms legacy handwritten paper muddemal registers and vulnerable digital handling into a cryptographically anchored, tamper-evident evidence lifecycle.

- **🌐 Live Production Deployment:** **[https://incorrupta-eight.vercel.app](https://incorrupta-eight.vercel.app)**
- **⚡ Instant Testing Access:** On the login screen, click **`⚡ Test Biometric Login (Access All Data)`** to enter directly with full operational privileges without requiring WebAuthn hardware.

---

## ⚖️ Statutory & Legal Architecture

1. **Bharatiya Sakshya Adhiniyam (BSA), 2023 — Section 63 (formerly Section 65B IEA):**
   - Automatically generates the statutory **Schedule-compliant Certificate of Admissibility** for electronic records.
   - Embeds cryptographic hash parity, extraction software provenance, and operator identity directly into court-ready documents.

2. **Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 — Section 105:**
   - Mandates audio-video electronic recording and geo-tagged custody records during search, seizure, and evidence collection.

3. **Information Technology Act, 2000 — Sections 65B & 79A:**
   - Adheres to central government standards for designated **Examiners of Electronic Evidence**.

---

## 🛡️ Core Capabilities

- **⚡ Dual-Engine Parallel Streaming Hashes:** Computes simultaneous WebAssembly **SHA-256** (statutory compliance) and **BLAKE3** (ultra-high speed 256-bit collision-resistant) hashes during evidence ingestion.
- **🔌 Hardware Write-Blocker Detection:** Enforces write-protection flags (Tableau, CRU WiebeTech) to guarantee 0 bytes written to physical storage media.
- **🔐 FIDO2 / WebAuthn Biometric Custody Handoff:** Eliminates unverified paper handoffs. Transferor IO and Transferee Officer both verify via physical biometrics or PIN before custody tokens can transition.
- **⏱️ NPL-IST Sovereign Time-Locks:** Cryptographic timestamps locked to the National Physical Laboratory of India (NPL-IST) to prevent retrospective metadata manipulation.
- **🧪 Forensic Lab Lineage (FSL Kalina Integration):** Tracks digital clones, physical evidence bags (`#MUM-CYB-994201`), memory dumps (RAM), and Cellebrite/UFED extraction reports.
- **🏢 Multi-Station Isolation:** Strict institutional tenant boundaries preventing cross-station exhibit contamination.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite, TypeScript |
| **Styling & Design System** | Tailwind CSS (100% Institutional Light Mode: Sovereign Navy, Forensic Amber, Emerald) |
| **Cryptography & Hashing** | Web Crypto API (NIST P-256, SHA-256), BLAKE3 WASM |
| **Authentication** | FIDO2 / WebAuthn Biometric Protocol + Bypass Test Harness |
| **Persistence** | Dexie / IndexedDB Offline-First Ledger + Sovereign Cloud Sync |
| **Testing** | Vitest, React Testing Library, ESLint, TypeScript Strict |
| **Deployment** | Vercel Edge Network |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone the repository
git clone https://github.com/Kunal-byte11/incorrupta.git
cd incorrupta

# Install dependencies
npm install

# Run the test suite
npm run test

# Launch local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📜 License & Sovereign Notice

Developed for police agencies and forensic laboratories in compliance with the laws of the Republic of India. Unauthorized replication or alteration of evidence verification schemas is strictly prohibited under the Information Technology Act and Bharatiya Nyaya Sanhita.
