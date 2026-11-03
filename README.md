# Wix Domains QA: "Can I get this name?"

## 1. Time spent

- The task (test plan, architecture, findings, automation, wrap-up): about 3 hours.
- Prerequisites (rules, skills, HAR recordings, API reference) were prepared before the first commit: about 5 hours.

## 2. How to run the tests

From a fresh clone (Node.js installed):

```sh
cd automation
npm ci                                # install dependencies from package-lock.json
npx playwright install chromium       # browser for the web project
cp .env.example .env                  # then set WIX_API_KEY=<your account-level API key>
npm test                              # runs every project: api-setup, api, web
```

Run one door by tag:

```sh
npm test -- --grep @api               # also @store, @whois, @gen
```

- `.env` is git-ignored. Without `WIX_API_KEY` the run stops at the `api-setup` check with a clear message.
- On failure, the trace and screenshot are kept in `automation/test-results/` and the HTML report in `automation/playwright-report/`. Open the report with `npx playwright show-report`. API traces contain the key in the request headers, so never share them.

## 3. What is automated and why

| Test case (`TEST_PLAN.md`) | File |
|---|---|
| API-01 Taken name | `automation/tests/api/api.spec.ts` |
| API-02 Free name | `automation/tests/api/api.spec.ts` |

- Only two cases are automated, for lack of time.
- The API came first: the assignment requires covering the public API, and the API is the reference for every cross-door check in `TEST_PLAN.md`.
## 4. What I'd do with another week

1. Resolve the open questions and assumptions: the **Assumption** labels in `ARCHITECTURE.md`, and the open questions and `<TBD in exploration>` expected results in `TEST_PLAN.md`.
2. Add test plan coverage for the availability search on the results pages (`FINDINGS.md` F3).
3. Find the missing test data, such as a real TLD that Wix doesn't sell (needed by API-12, WHOIS-14, STORE-11).
4. Make the test-plan skill (`.claude/skills/test-plan/`) reusable, not specific to this task.

## 5. Quality strategy for Wix Domains

1. One question, four doors. The public API is the reference, and every web door's answer is compared with it (`TEST_PLAN.md` AC2).
2. Automate what has a deterministic oracle: the API contract and taken / free per door. Keep generated output and third-party checks (ICANN) manual.
3. When a dependency fails (the availability call, RDAP), no door may present the name as available (`TEST_PLAN.md` Integration aspect).

## 6. Repo map

| Path | What |
|---|---|
| `TEST_PLAN.md` | Scope, acceptance criteria, scenarios per door, detailed test cases |
| `ARCHITECTURE.md` | Pages and network calls of each door, how the doors relate to the public API (from HARs) |
| `FINDINGS.md` | Findings and risks with severity and priority |
| `AI_LOG.md` | Prompts, AI output and my verdict for each AI-assisted task |
| `CLAUDE.md` | Rules for the AI assistant in this repo |
| `automation/` | Playwright + TypeScript project: config, `tests/api`, `tests/helpers`, `.env.example` |
| `docs/` | API reference copy, domain basics, recorded scenario notes; raw HARs are git-ignored |
| `planning/` | Working notes and decisions |
| `prompts/` | Prompts used for the architecture and README drafts |
| `scripts/` | `check_availability.py`: one-off API call used for exploration (`docs/scenarios/api.md`) |
| `.claude/` | Skills for the test plan and the Playwright tests, with test-plan decisions |
| `.gitignore` | Keeps `.env`, HARs, Playwright output and the assignment text out of git |
