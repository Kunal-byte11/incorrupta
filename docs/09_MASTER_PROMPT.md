# 09_MASTER_PROMPT.md — Master Agent Execution Prompt: INCORRUPTA

> **INSTRUCTION FOR USER:** Copy and paste the block below into any fresh AI coding agent session to initiate or resume development of INCORRUPTA.

```markdown
================================================================================
                    INCORRUPTA AGENT EXECUTION SESSION PROMPT
================================================================================

### CURRENT STATUS BLOCK
- **Project:** INCORRUPTA (Mumbai Police Digital Evidence & Muddemal Management)
- **Current Phase:** Phase 1 (Sevarth ID WebAuthn Auth & Database Schema)
- **Last Completed Ticket:** T-004 (Mumbai Police PostgreSQL Schema Migration)
- **Next Ticket to Execute:** T-005 (WebAuthn Relying Party Edge Functions)
- **Blockers:** None

---

### 1. MANDATORY READING ORDER
Before writing any code or modifying any file, you MUST read the documentation pack in this exact sequence:
1. `docs/07_RULES.md` — The AI Agent's Constitution (Coding standards, approved libraries, AI boundaries)
2. `docs/01_PRD.md` — Product Requirements Document (Vision, personas, user journeys, FRs, NFRs)
3. `docs/02_TRD.md` — Technical Requirements Document (Stack, performance budgets, folder structure)
4. `docs/03_UIUX.md` — Design & UI Specification (Exact hex colors, components, screen specs)
5. `docs/04_ARCHITECTURE.md` — Architecture & Schema (DDL, API contracts, sequence diagrams)
6. `docs/05_SECURITY.md` — Security Specification (STRIDE threat model, WebAuthn, RLS, privacy)
7. `docs/06_TICKETS.md` — Ticket Backlog (Find the next TODO ticket and read its exact criteria)
8. `docs/08_PHASES.md` — Development Phases & Phase Gates (Verify current phase objectives)

---

### 2. STRICT WORKING PROTOCOL
For every assigned ticket, execute these steps in strict sequence:
1. **Identify the Ticket:** Select the single next `TODO` ticket in the current phase from `docs/06_TICKETS.md`.
2. **Restate the Plan:** Output a brief plan containing **5 bullets or fewer** outlining what files you will create/modify.
3. **Implement ONLY That Ticket:** Write the code strictly required for that ticket. Never touch unrelated files or invent features.
4. **Write Tests:** Create unit or integration tests satisfying the ticket's Given/When/Then acceptance criteria.
5. **Verify Quality:** Run `npm run typecheck`, `npm run lint`, and `npm run test`. All checks must pass with zero errors.
6. **Update Documentation:** Change the ticket's status from `TODO` to `DONE` in `docs/06_TICKETS.md` and append a one-line changelog summary.
7. **Report & Stop:** Output a structured Ticket Completion Report and STOP. Do not proceed to the next ticket without acknowledgment.

---

### 3. PHASE GATES & TRANSITIONS
- When all tickets in the current phase are marked `DONE`:
  1. Execute the phase's **Testable Exit Criteria** specified in `docs/08_PHASES.md`.
  2. Run the **Demo Script** for that phase.
  3. Report the exit verification results to the user.
  4. **HALT AND WAIT:** Do not start the next phase until the user explicitly responds: *"Approved, start Phase N"*.

---

### 4. CONFLICT & UNCERTAINTY RULE
If you encounter any contradiction between documents, an ambiguous requirement, or an unexpected technical edge case:
- **STOP IMMEDIATELY.**
- Do not guess, assume, or invent solutions.
- State the contradiction or ambiguity clearly in 2-3 sentences.
- Propose a concrete documentation fix and ask the user for confirmation.

---

### 5. RESUME INSTRUCTIONS FOR A FRESH SESSION
If this is a fresh conversation or context has been reset:
1. Inspect `docs/06_TICKETS.md` to identify the first ticket with status `TODO`.
2. Cross-reference `docs/08_PHASES.md` to identify which phase that ticket belongs to.
3. Update the STATUS BLOCK at the top of this prompt.
4. Announce: *"Resuming INCORRUPTA development at [Phase X], Ticket [T-00Y: Title]".*
5. Proceed with Step 2 (Restate Plan in 5 bullets).
================================================================================
```
