---
name: test-plan
description: Create TEST_PLAN.md for the Wix Domains QA assignment (storefront, Business Name Generator, WHOIS, public Domain Availability API). Use when asked to create or write a test plan, test scenarios or test cases. Runs door by door with human approval gates.
---

# Test plan creation

Creates `TEST_PLAN.md` from `ARCHITECTURE.md` and the decisions in [decisions.md](decisions.md).
Sequential, human in the loop: never move past a gate without my explicit approval.

## Inputs
- `ARCHITECTURE.md` — required. If missing, stop and say so.
- [decisions.md](decisions.md) — scope, acceptance criteria, open questions, input validation, oracles.
- `docs/api-reference.md` — the only source for API route, method, headers, parameters, response fields and errors.
- `docs/domain-basics.md` — expected behaviour. Expected results must not contradict it.
- `docs/scenarios/*.md` — recorded UI flows and network calls.

## Flow
1. Read all inputs.
2. **Gate 1 — likelihood.** Propose updates to Likelihood (and so Risk / Priority) in the acceptance criteria table, each with a reason citing `ARCHITECTURE.md`. Wait for approval.
3. Create `TEST_PLAN.md` with: task description, scope with reasons, open questions with decisions, acceptance criteria table (with approved values), aspects, input validation. Copy these from [decisions.md](decisions.md) **verbatim**; change nothing except the approved likelihood / risk / priority.
4. **Gate 2 — scenarios, door by door** in this order: API, WHOIS, storefront, Business Name Generator. For each door, propose its scenarios table, then wait for approval before the next door. Flag scenarios that duplicate one from an earlier door; drop nothing without approval.
5. Write the approved scenarios into `TEST_PLAN.md`.
6. **Gate 3 — pick.** Ask which approved scenarios to detail. Write detailed test cases only for those. The rest stay in the scenarios table.

## Scenarios
- Table columns: ID, title, description (input and expected result), type (positive / negative / edge case), AC covered, door, execution type. Priority is inherited from the AC.
- 5–10 scenarios per AC, per door. Only ACs that apply to the door (AC5 = generator, AC6 = WHOIS); skipped ACs get a one-line note.
- Fewer than 5 is allowed when no more meaningful scenarios exist; say why in one line. No padding.
- Negative and edge cases are mandatory for high-priority ACs.
- Each door's scenarios include its cross-door comparisons, with the API as reference.
- Cover the aspects in [decisions.md](decisions.md): functionality, schema validation (API only), integration (only dependencies shown in `ARCHITECTURE.md`), security, concurrency (mostly "considered, not implemented").

## Execution type
- Storefront, generator, WHOIS: `UI automation` or `manual`. API: `API automation` or `manual`.
- Cross-door cases: `UI automation + API check`.
- Automate: deterministic oracle, repeatable without hand checks, few API calls.
- Manual: needs human or third-party judgement (ICANN, severity), generated output needing interpretation, one-off observations.

## IDs
- `<DOOR>-<nn>`, door = `STORE`, `GEN`, `WHOIS`, `API` (e.g. `STORE-03`). 
- Never reuse a number: a rejected scenario's number stays unused.
- A detailed test case keeps its scenario's ID.

## Detailed test cases
One block per case:
- **Header:** ID, title, description, type, AC covered, execution type.
- **Preconditions:** system state; for UI cases the page and position the test starts from.
- **Steps table:** `#`, action, expected result. One row per step (each becomes a `test.step`).
  - UI action: open page + URL, fill the domain name field, click the Search button, …, with field and button names as shown on screen (from `docs/scenarios/`).
  - API action: route, method, headers, query / body, from `docs/api-reference.md`, cited. Cookies only if the reference or a captured response shows them. The key is always written `<WIX_API_KEY>`.
  - Expected result, three tiers: exact value where deterministic; property (type / format / non-empty / equal to another door) where generated; `<TBD in exploration>` where unknown.
  - Assert what is shown, never what is absent. No page-wide "text X is not on the page" checks (e.g. "never 'Available now!'"): the same text can appear elsewhere on the page for an unrelated reason (alternatives, suggestions). Instead assert the expected outcome, scoped to the element for the searched name: the error message, the result message, or the not-available message on that name's result card (`<TBD in exploration>` if unknown). Applies to scenario descriptions and detailed steps. API responses are not affected: checking a JSON field (e.g. never `available: true`) is fine.

## Never
- Invent endpoints, fields, messages or UI labels. No source → ask how to proceed.
- Change scope, acceptance criteria or decisions on your own. Propose; I decide.
- Write expected results that contradict `docs/domain-basics.md`.
