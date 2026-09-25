# 07_RULES.md — The AI Agent's Constitution: INCORRUPTA

- **Purpose:** Define immutable operational rules, coding standards, library constraints, AI boundaries, and Definition of Done for any coding agent working on INCORRUPTA.
- **Status:** Draft v1
- **Last Updated:** 2026-09-25
- **Depends On:** None (Core Operational Standard)

---

## 1. ALWAYS (The Mandatory Do List)

1. **Read Before Executing:** Read `docs/07_RULES.md` and `docs/09_MASTER_PROMPT.md` at the start of every session before touching code.
2. **Strict Ticket Scope:** Implement ONLY the specific ticket assigned. When working on Ticket T-X, do not modify files belonging to Ticket T-Y.
3. **Write Tests Alongside Code:** Every feature or service implementation must include corresponding unit or integration tests in the same pull request/ticket.
4. **Use Established Design Tokens:** Use the exact Tailwind color tokens (`#0B0F19`, `#111827`, `#06B6D4`, `#10B981`, `#EF4444`) defined in `docs/03_UIUX.md`.
5. **Handle Errors Rigorously:** Return typed, contextual error objects; provide actionable user-facing messages; log raw technical details to internal consoles only.
6. **Enforce Type Safety:** Write 100% strictly typed TypeScript. Zero usage of `any` or loose `as unknown as X` assertions without documented justification.

---

## 2. NEVER (The Forbidden Avoid List)

1. **NEVER Write Passwords or Insecure Auth:** Never add username/password forms, plaintext tokens, or bypass WebAuthn FIDO2 verification.
2. **NEVER Bypass Row Level Security:** Never write direct bypass queries or disable RLS on any PostgreSQL table.
3. **NEVER Swallow Exceptions:** Never write empty `catch (e) {}` blocks. Every error must be handled, bubbled, or reported to user-facing UI state.
4. **NEVER Invent Packages or APIs:** Never invent non-existent npm packages, hallucinate Supabase API methods, or create undocumented endpoints.
5. **NEVER Edit Applied Migrations:** Once a database migration file is applied, never edit it. Always create a new, numbered migration file (`2026092500000X_...sql`).
6. **NEVER Expose Secrets or Stack Traces:** Never output raw stack traces or internal server error logs to the end-user UI. Never commit `.env` files.
7. **NEVER Delete or Skip Failing Tests:** Never comment out, delete, or add `.skip` to existing tests to make a build pass. Fix the underlying implementation.

---

## 3. Stack Lock: Approved & Banned Libraries

> **RULE:** You must ask for explicit user approval before running `npm install <package>` for ANY package not listed in the Approved table below.

### 3.1 Approved Libraries
| Package Name | Approved Version | Exact Purpose |
| :--- | :--- | :--- |
| `react` / `react-dom` | `^18.3.1` | Frontend UI runtime |
| `typescript` | `^5.5.4` | Static type checking |
| `vite` | `^5.4.2` | Build tool and dev server |
| `tailwindcss` | `^3.4.10` | Utility CSS framework |
| `@supabase/supabase-js` | `^2.45.3` | Supabase DB, Auth, and Storage client |
| `@simplewebauthn/browser`| `^10.0.0` | Client-side FIDO2/WebAuthn ceremonies |
| `@simplewebauthn/server` | `^10.0.0` | Server-side assertion verification in Edge Functions |
| `@noble/hashes` | `^1.4.0` | Blake3 and secondary cryptographic hash algorithms |
| `lucide-react` | `^0.439.0` | Clinical UI iconography |
| `clsx` / `tailwind-merge` | `^2.1.1` / `^2.5.2` | Conditional class composition |
| `zod` | `^3.23.8` | Runtime schema validation |
| `jspdf` | `^2.5.1` | Client-side FRE 902(14) PDF certificate generation |
| `qrcode` | `^1.5.4` | Forensic verification QR code generation |
| `vitest` | `^2.0.5` | Unit and integration test runner |
| `@testing-library/react` | `^16.0.1` | React component test utilities |
| `typescript-eslint` | `^8.55.0` | TypeScript AST parser and plugin for ESLint 9 (Approved) |

### 3.2 Banned Libraries (Do Not Install)
- **`crypto-js`:** Banned. Outdated, slow, lacks streaming, fails on large forensic files. Use native Web Crypto API.
- **`ethers` / `web3.js`:** Banned for core MVP. Public blockchain execution is rejected for legal/privacy reasons.
- **`axios`:** Banned. Use native `fetch` with TypeScript typing.
- **`lodash` / `underscore`:** Banned. Use modern ECMAScript array/object methods.
- **`moment` / `moment-timezone`:** Banned. Use native `Intl.DateTimeFormat` or lightweight date utilities.

---

## 4. Code Style, Naming, & Module Boundaries

- **File Naming:**
  - React components: `PascalCase.tsx` (e.g. `EvidenceGrid.tsx`)
  - Utilities and hooks: `camelCase.ts` (e.g. `streamHasher.ts`, `useWebAuthn.ts`)
  - Database migrations: `YYYYMMDDHHMMSS_description.sql`
- **Module Boundaries:**
  - UI components in `src/components/` must never make direct Supabase SQL calls; they must consume services from `src/services/` or hooks from `src/hooks/`.
  - Cryptographic operations must remain isolated inside `src/lib/crypto/`.
  - All database entity shapes must be imported from `src/types/database.ts`.

---

## 5. Error Handling Standard

1. **Typed Errors:** Define explicit error types:
   ```typescript
   export type ForensicsError = 
     | { code: 'HASH_MISMATCH'; baseline: string; computed: string }
     | { code: 'WEBAUTHN_REJECTED'; reason: string }
     | { code: 'UNAUTHORIZED_CASE_ACCESS'; caseId: string }
     | { code: 'STORAGE_UPLOAD_FAILED'; status: number };
   ```
2. **User Notifications:** Display human-readable, non-technical explanations in toast notifications (e.g., "Verification Alert: The stored file hash does not match the ingestion record.").
3. **Context Logging:** Log failures to `console.error` with timestamp, component name, and sanitized error context.

---

## 6. Testing & Quality Rules

- Every ticket must contain tests exercising the acceptance criteria.
- Unit tests live adjacent to the code (e.g. `streamHasher.test.ts`) or in `tests/unit/`.
- Run `npm run test` and `npm run typecheck` before considering any ticket complete.
- Minimum line coverage target for cryptographic and utility code is **80%**.

---

## 7. Git & Version Control Rules

- **Branch Naming:** `feat/T-00X-short-description` or `fix/T-00X-short-description`.
- **Commit Messages:** Follow Conventional Commits:
  - `feat(ingestion): implement client-side chunked SHA-256 streaming (T-009)`
  - `fix(webauthn): resolve challenge origin domain mismatch (T-005)`
  - `test(security): add RLS cross-case leakage test suite (T-018)`
- **No Force Pushes:** Never execute `git push --force` on main or shared branches.

---

## 8. AI Agent Boundaries & Permissions

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI AGENT BOUNDARIES MATRIX                      │
├───────────────────────────────────┬────────────────────────────────────┤
│ WHAT THE AGENT CAN DO FREELY      │ ACTIONS REQUIRING USER APPROVAL    │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Read any project document.      │ • Installing ANY new npm package.  │
│ • Create and edit files within the│ • Modifying database schema DDL.   │
│   current ticket's scope.         │ • Deleting existing project files. │
│ • Run test, lint, and build tools.│ • Changing public API contracts.   │
│ • Write unit and integration tests│ • Modifying `.env` or CI configs.  │
│ • Update ticket status in docs.   │ • Refactoring unrelated modules.   │
└───────────────────────────────────┴────────────────────────────────────┘
```

> **WHEN UNCERTAIN:** Stop work immediately, state the ambiguity clearly, and ask the user for confirmation. Never guess.

---

## 9. Definition of Done (DoD) Checklist

A ticket is strictly **DONE** when and only when:
- [ ] Code implements all acceptance criteria in the ticket description.
- [ ] TypeScript compiles cleanly with zero errors (`tsc --noEmit`).
- [ ] Linter passes with zero warnings (`npm run lint`).
- [ ] Unit and integration tests for the ticket pass (`npm run test`).
- [ ] No banned libraries or unapproved dependencies were introduced.
- [ ] No hardcoded secrets, passwords, or temporary mock bypasses remain.
- [ ] Ticket status is updated to `DONE` in `docs/06_TICKETS.md` with a one-line changelog summary.

---

## 10. How to Report Progress After Each Ticket

Upon completing any ticket, the agent must output a structured status summary:
```markdown
### Ticket Completion Report: [T-00X: Title]
- **Status:** COMPLETED
- **Files Created/Modified:**
  - `src/lib/crypto/streamHasher.ts` (Implemented chunked Web Crypto stream)
  - `tests/unit/streamHasher.test.ts` (Added 4 unit test cases)
- **Tests Execution:** 4 passed, 0 failed, 100% test pass rate.
- **Definition of Done Check:** All 7 DoD criteria verified.
- **Next Ticket in Queue:** T-00(X+1)
```
