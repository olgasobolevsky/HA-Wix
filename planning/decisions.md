# Planning decisions (prerequisites)

> **Frozen planning trail.** Record of the decisions made before the task clock started. Not updated after the first commit.
> Live copies: test-plan decisions → `.claude/skills/test-plan/decisions.md`; skill rules → `.claude/skills/*/SKILL.md`; agent rules → `CLAUDE.md`.

## Step 0: prerequisites (before the task clock)
1. `CLAUDE.md` — project rules (text agreed, see below).
2. Skill: test-plan creation.
3. Skill: Playwright test creation.
4. HAR recordings + scenario notes for the architecture step (I record and clean them myself).
5. `docs/domain-basics.md` — Domain basics section verbatim from the assignment (committed). `HA_description.txt` itself is not committed (public repo).
6. `docs/api-reference.md` — local copy of the Availability v2 docs (created 2026-11-02, with source URLs and open points).
7. **First thing once I have the API key — auth check (E13):** one manual call to settle which headers are needed. Key read from an env var, never typed into the command or shared.
   ```powershell
   $env:WIX_API_KEY = Read-Host "API key" -MaskInput
   curl.exe -i "https://www.wixapis.com/domain-search/v2/check-domain-availability?domain=google.com" -H "Authorization: $env:WIX_API_KEY"
   ```
   - `200` + `"available": false` → `Authorization` alone works; close E13.
   - `401` / `403` → retry with `-H "wix-account-id: <account ID>"`. Record the error status and body (feeds E14).
   - Update `docs/api-reference.md` open points with the result.
8. Prompt drafts: `prompts/architecture.md` (draft + attack) and `prompts/readme.md` (draft + attack). Committed; they are the "key prompts" for AI_LOG.

Note: time spent on prerequisites (especially HAR recording, which is part of step 1) to be stated in README / AI_LOG.

## CLAUDE.md (agreed text)
```markdown
# Rules for this repo (Wix Domains QA home assignment)

## Persona
Be critical and objective. No flattery, praise or automatic agreement.
Examine my premises, give counter-considerations, and say clearly where my logic falls short.
When a premise holds, say so in one line. Rank objections by importance; don't invent them.

## Hard rules
- Never purchase. Never go past the search result into cart or checkout; never enter payment or contact details.
- Never print, log or commit the API key (WIX_API_KEY). It lives only in a git-ignored .env.
- `.gitignore` also covers `test-results/` and `playwright-report/`: Playwright traces record API request headers, including the key. Never attach an API test trace to FINDINGS or anywhere else.
- Never commit without my explicit approval.

## Facts
Every claim about an endpoint, field or behaviour names its source:
a HAR or scenario note, a docs URL, or a response we saw.
Anything without a source is labelled **Assumption**.

## AI_LOG.md
After each task where I accept, change or reject your output, append an entry:
- **Prompt:** verbatim, or a summary if it's longer than 5 lines.
- **Outcome:** at most 20 lines; summarize the rest in one sentence.
- **My verdict:** leave blank. I fill it in (kept / changed / thrown away, and why).
Don't log small talk or clarification questions. Never write the API key or any token into the log.
```

## Test-plan skill
- **Trigger:** `/test-plan [door]`, and automatically when asked to create a test plan.
- **Output:** one `TEST_PLAN.md` (no per-door files), created by the skill once `ARCHITECTURE.md` exists. Nothing of `TEST_PLAN.md` exists before the clock.
- **Decisions reference:** scope, acceptance criteria, open questions and decisions (with reasons) live in the skill as a reference file (e.g. `.claude/skills/test-plan/decisions.md`), committed as agent configuration. The skill copies them **verbatim**; it may only propose changes to likelihood / risk / priority.
- **Skill flow (sequential, human in the loop):**
  1. Read `ARCHITECTURE.md` and the decisions reference. If `ARCHITECTURE.md` is missing, stop.
  2. Propose likelihood (and so risk / priority) updates based on the architecture → wait for my approval.
  3. Create `TEST_PLAN.md`: task description, scope + reasons, open questions + decisions (verbatim), acceptance criteria table.
  4. Door by door: propose that door's scenarios → wait for my approval → next door. Duplicates across doors (e.g. cross-door scenarios) flagged; nothing dropped without my approval.
  5. Write the approved scenarios into `TEST_PLAN.md`.
  6. Ask me which approved scenarios to detail; write detailed test cases only for those. Approved but not detailed scenarios stay in the scenarios table.
- Each door's scenarios include its cross-door comparisons, with the API as reference.
- **Inputs:** `ARCHITECTURE.md` (required), the decisions reference, the task description (question + 4 doors), Availability v2 docs (https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/availability-v2/introduction), Wix TLD list (https://www.wix.com/domains/tld-list), ICANN lookup (https://lookup.icann.org/en).
- **ICANN as oracle:** registered vs not registered only. Registered at ICANN but available on Wix → strong bug signal. Unregistered at ICANN but unavailable on Wix → usually expected. No data for many ccTLDs (e.g. `.co.il`). Manual / few calls only, never in a test loop.
- **TLD list:** also a consistency point, not just a reference.
- **Domain basics:** information about the system (what is not a bug), not requirements. Stored in `docs/domain-basics.md` (full section, verbatim from the assignment, one source line; committed). Main reference for exploration / FINDINGS triage. The test-plan skill has one line: "Expected results must not contradict `docs/domain-basics.md`."

### Acceptance criteria (source: task description)
Prioritization: risk-based, priority = impact × likelihood, one-line reason each. Scale: H / M / L.
**Override rule:** the core business path (answering "Can I get this name?") is H priority regardless of likelihood — every other check depends on it.
Values are a **proposal, to be confirmed by me**. Likelihood is an **Assumption** until `ARCHITECTURE.md` exists; revisit then.

Risk = impact × likelihood. Priority = risk, unless the override rule applies (then the reason says so).

| # | Acceptance criterion | Impact | Likelihood | Risk | Priority | Reason |
|---|---|---|---|---|---|---|
| AC1 | For a valid full domain name, each door gives a clear answer: can get it, or can't | H | L | M | H | Core business value: it is the product's one promise. Override rule applies — likelihood is low because the path is heavily used, but if it breaks, nothing else matters. |
| AC2 | All doors give the same availability answer for the same name at the same moment | H | M | H | H | A wrong answer loses a sale or breaks trust at checkout; separate doors may use separate services or caches. |
| AC3 | A name in a TLD Wix doesn't sell is shown as unavailable or not purchasable | M | M | M | M | The user is told "yes" and fails later; TLD lists can drift between doors. |
| AC5 | Generator suggestions shown as available are available according to the API | M | M | M | M | A taken suggestion frustrates the user; suggestions are generated and may be pre-computed or cached. |
| AC6 | WHOIS shows a registered name as registered and an unregistered name as not registered | M | L | L | L | An information door, not a purchase path; it reads registry data directly. |

(AC4 premium and AC7 API contract removed: Domain basics are info, not requirements.)

### Aspects
1. **Functionality** — the feature (4 doors) answers "is this name available?" and the answers are consistent. Includes AC2, AC5 and input handling.
2. **Schema validation** — public API only, from the docs (not the web doors' internal calls).
3. **Integration** — only dependencies observed in `ARCHITECTURE.md`.
4. **Security** — API key cases (missing / invalid key); key never appears in web door traffic. No brute force.
5. **Concurrency** — considered, mostly not implemented (needs purchases or parallel load). Executable slice: same name checked several times in a row / on two doors close together.

### Scope
- **In:** availability on all doors; API = Availability v2 only.
- **Exploration observation only (no AC, no automated test):** premium flag/price consistency across doors for one known premium name.
- **Out by default:** location-dependent behaviour (needs VPN/proxy), API suggestion endpoints, mobile tests (both responsive web on phone-sized screens and native apps), anything past the search result.

### Open questions
- **Critical:** without an answer, no expected result can be written for at least one scenario.
- **Non-critical:** scenario can be written with a labelled assumption, verified during exploration.
- User answers them or moves critical ones out of scope.

| # | Open question | Rating | Decision |
|---|---|---|---|
| Q1 | What should a door do with `GOOGLE.COM`, ` google.com `, `www.google.com`, `https://google.com`: normalize or reject? | Critical | Normalization is out of scope. Validation of invalid input is in scope (see "Input validation" below). |
| Q2 | The generator takes a business name, not a domain. What is "the name" in AC1 for that door? | Critical | The generator's first suggestion (observed) is used as the name for AC1 tests. It is generated, so tests read it at run time. |
| Q3 | For a TLD Wix doesn't sell: API "unavailable" or error? Storefront "not available" or "we don't sell this"? | Non-critical | Placeholder `<error message: TBD in exploration>`. |
| Q4 | What does "the same moment" in AC2 mean? | Non-critical | Checks run one after another (< 1 min). **Assumption:** the test domain is not sold during the test. |
| Q5 | What should WHOIS show for invalid input or a TLD Wix doesn't sell? | Non-critical | Invalid input: placeholder `<error message: TBD in exploration>`. Unsold TLD: **Assumption:** WHOIS behaves as for any TLD (registered → redacted details, unregistered → not registered); verify in exploration. |
| Q6 | When doors disagree, which one is right? | Non-critical | Any disagreement **between Wix doors** is a bug. Severity is decided manually against a third party (another door, ICANN). Wix vs ICANN differences are not automatically bugs (see AC3). |

### Input validation
**Rules** (RFC 1035 / RFC 1123 hostname rules):
- Label (part between dots): 1–63 characters.
- Whole name: at most 253 characters including dots.
- Allowed characters: letters `a-z` (case-insensitive), digits `0-9`, hyphen `-` (not first or last in a label); dot only as a label separator.
- Everything else is invalid: `_`, space, symbols (`! @ # $ % ^ & * ( ) + = ~ , ; : ' " ? / \ | < > [ ] { }`), empty label (`..`), leading/trailing hyphen.
- Hyphens in positions 3–4 (`ab--cd`) are reserved for IDN (`xn--`) encoding.
- Non-ASCII letters (`ä`, Hebrew, Cyrillic) are **valid** IDNs, not validation errors.
- Registries may be stricter than the RFC; a stricter door is an observation, not a bug. "Available" for a name that cannot exist is a bug.

**Representative set** — one input per rule class (equivalence partitioning). Every character in a class goes through the same rule, so one representative per class is enough:

| Input | Rule class |
|---|---|
| empty | no input |
| spaces only | no input after trimming |
| `mybakery` (API only) | no TLD — the API requires one; storefront/generator may treat it as a keyword |
| `com` / `.com` | TLD only, no label |
| `192.168.1.1` | IP address, never registrable |
| 63-character label + `.com` | label length, upper boundary (valid) |
| 64-character label + `.com` | label length, boundary + 1 (invalid) |
| `goo_gle.com` | invalid character; `_` chosen because DNS allows it elsewhere (e.g. `_dmarc`), so a validator may let it through |
| `goo gle.com` | invalid character: space inside the name |
| `goo@gle.com` | invalid character: symbol |
| `google..com` | empty label |
| `-google.com` | leading hyphen |

**API-specific boundary** (from `docs/api-reference.md`): the API limits the **whole domain** to 3–63 characters, so the API boundary pair is a 63-character and a 64-character domain (incl. TLD). A 63-character label + `.com` (67 chars) is expected to be rejected by the API. The 63 / 64 label cases still apply to the web doors. A shorter-than-3 domain (e.g. `a.b`) is an API lower-boundary case.

Not in the set: normalization cases (`GOOGLE.COM`, leading/trailing spaces, `www.`, `https://`) — out of scope.

### Execution type (suggested per case by the skill)
- Storefront, Business Name Generator, WHOIS: **UI automation** or **manual**.
- Public API: **API automation** or **manual**.
- Cross-door cases (AC2, AC5) → **UI automation + API check** (UI answer read, then the API called in the same test).
- Rule for automate vs manual —
  - Automate: deterministic oracle (known taken name, known invalid input, key cases), repeatable without hand checks, few API calls.
  - Manual: needs human or third-party judgement (ICANN, severity), generated output needing interpretation, one-off observations (premium, back-to-back checks).

### Test scenarios (gate: presented to me; the skill does not proceed until I accept them)
- Table columns: ID, title, description (input and expected result), type (positive / negative / edge case), AC covered, door, execution type. Priority is inherited from the AC.
- Count: 5–10 scenarios per AC, **per door**, no scaling by priority (I add more during review if needed).
- Only ACs that apply to the door get scenarios (e.g. AC5 = generator, AC6 = WHOIS); skipped ACs get a one-line note.
- Fewer than 5 is allowed when no more meaningful scenarios exist; the skill says why in one line. No padding.
- Combining: the skill checks for duplicates and presents them to me; nothing is removed without my approval.
- Negative and edge cases are mandatory for high-priority ACs.
- Detailed test cases are generated only for the scenarios I pick.

### Detailed test cases (only for scenarios I pick)
Format: one block per case.
- **Header:** ID, title, description (which AC it covers and how), type (positive / negative / edge case), AC covered, execution type.
- **Preconditions:** system state; for UI cases the page and position the test starts from.
- **Steps table:** `#`, action, expected result. Steps map one-to-one to `test.step` in Playwright.
  - **UI action:** each action described clearly (open page + URL, fill the domain name field, click the Search button, …), with field/button names as shown on screen.
  - **API action:** full request data: route, method, headers, body (cookies only if the docs or a captured response show them). The API key is always written `<WIX_API_KEY>`, never a real value.
  - **API source:** route, method, headers, body and response fields are taken from `docs/api-reference.md` (local copy of the Availability v2 docs, fetched 2026-11-02, with source URLs), and each API case cites it. Nothing from memory or other APIs. If the reference doesn't say → placeholder `<TBD in exploration>`.
  - The Playwright skill takes request data from the detailed test cases only, not from the docs directly (one source of truth).
  - **Expected result:** the exact fields to assert, with values, in three tiers: exact value where deterministic; property (type / format / non-empty / equal to another door) where generated; placeholder `<TBD in exploration>` where unknown.

### IDs
- Scenario ID: `<DOOR>-<nn>`, door = `STORE`, `GEN`, `WHOIS`, `API` (e.g. `STORE-03`). The AC goes in the description (and the AC column), not in the ID.
- Numbering is not reused: if a scenario is rejected, its number stays unused, so IDs stay stable.
- A detailed test case keeps its scenario's ID.
- In Playwright the ID goes in the test title, so a failure traces back to the plan.


## HAR recordings (prerequisite 4)
- Doors: storefront, Business Name Generator, WHOIS.
- Flows per door: `google.com` (taken) and a random free name (generated on the day). Optional: `.test` as a validation observation.
- Same names on every door, so the doors are comparable.
- Note E9 / E11 observations if they show up while recording.
- Raw HARs stay local (git-ignored, e.g. `docs/har/raw/`); not committed.
- Scenario note templates: `docs/scenarios/storefront.md`, `generator.md`, `whois.md` — user actions pre-filled (assumptions until recorded); I fill in: call (method + route), status, key response fields, what changed on screen.
- I extract the API calls (route, method) from the HARs into scenario notes, which are committed and cited by `ARCHITECTURE.md`. No cookies, tokens or session values in the notes (check query strings too).

## To find / verify during exploration
Collected from the decisions above. Each item feeds a placeholder, an assumption or an observation.

| # | What to find or verify | Feeds | Source of the item |
|---|---|---|---|
| E1 | A real TLD (exists in the IANA root zone, https://www.iana.org/domains/root/db) that is **not** on the Wix TLD list | AC3 scenarios (test data) | `.test` rejected as reserved (RFC 2606/6761), not "unsold" |
| E2 | Error / message for an unsold TLD: API ("unavailable" or error?) and storefront ("not available" or "we don't sell this"?) | Q3 placeholder `<error message: TBD in exploration>` | Q3 |
| E3 | WHOIS message for invalid input | Q5 placeholder | Q5 |
| E4 | WHOIS for an unsold TLD: behaves as for any TLD (registered → redacted, unregistered → not registered)? | Q5 assumption | Q5 |
| E5 | Generator: confirm the first suggestion is usable as "the name" for AC1 | Q2 decision | Q2 |
| E6 | A premium name; do the doors agree on premium flag / price? | Exploration observation (no AC) | Scope (b) |
| E7 | ~~Does Availability v2 return a premium flag or price?~~ Answered by docs: `premium` + `premiumType`, no price. Still verify whether the fields are omitted for non-premium names. | Premium comparison with the API (flag only) | `docs/api-reference.md` |
| E8 | Does the API set or need any cookies? | Detailed API test cases (cookies only if shown) | Assumption: none |
| E13 | Which header carries the key (docs conflict), and is a `wix-account-id` header needed? Check before step 4. | `automation/playwright.config.ts`, API test cases | `docs/api-reference.md` open points |
| E14 | Status and body for a missing / invalid key (not documented) | Security cases' expected results | `docs/api-reference.md` |
| E15 | API response for an over-length domain (> 63 chars total) and invalid characters — `400 INVALID_DOMAIN` or something else? | Validation scenarios (API) | `docs/api-reference.md` |
| E9 | Behaviour of each door for the validation set, incl. `.test` as a reserved-TLD edge case | Validation scenarios' expected results | Input validation |
| E10 | All `<TBD in exploration>` expected values in detailed test cases | Detailed test cases | Three-tier rule |
| E11 | Consent / cookie banner on each door (for the shared helper) | Playwright helper | Isolation rule |
| E12 | Optional: does any door handle `wix.com` specially? | Observation only | `wix.com` is Wix's own domain |

## Playwright skill (collected so far)
- **Language:** TypeScript.
- **Structure:** everything Playwright lives in `automation/` (`package.json`, lock file, `playwright.config.ts`, `.env` and `.env.example`, `tests/`, generated output). Inside it: `tests/api/` (API tests), `tests/web/` (UI tests; cross-door UI + API checks live here, since they start from the UI), `tests/helpers/` (shared helpers only, e.g. consent banner, random free name). No API client: the key comes from `.env` via `playwright.config.ts`, which fails clearly if it is missing. One spec file per door: `api.spec.ts`, `storefront.spec.ts`, `generator.spec.ts`, `whois.spec.ts`.
- **Single command:** `npm test`, run from `automation/` (documented in README).
- **Locators:** prefer role / label (`getByRole`, `getByLabel`), then visible text, then test id; CSS / XPath only as a last resort. The skill does not report or comment its locator choices.
- **Waiting:** no fixed waits (`waitForTimeout`); wait for the result element or the network response that drives it (known from the HARs).
- **UI practices:**
  - Web-first assertions: `await expect(locator).toHaveText(...)`, never `expect(await locator.textContent())`.
  - Start waiting for the response before the action (`waitForResponse` together with the click).
  - Never wait for `networkidle` (Wix pages keep firing analytics).
  - Assert on state (available / taken), not marketing copy.
  - Cross-door comparisons use `expect.soft`, so one run reports all differences.
  - A fresh random free name per run; no hard-coded "free" names.
  - `baseURL` in config; tests use relative paths.
- **API practices:**
  - Schema validation by explicit field / type assertions (TS types are compile-time only). No validator library — no extra dependencies.
  - Assert the status code before the body.
  - API key set once in config (`extraHTTPHeaders` on the `api` project), not per call. Config fails clearly if `WIX_API_KEY` is missing (only when the `api` project runs).
  - Separate `api` and `web` projects in `playwright.config.ts`; API tests launch no browser.
- **Browser:** Chromium only (cross-browser → "left out").
- **Retries:** none — every failure is visible. On failure keep trace (`retain-on-failure`) and screenshot (`only-on-failure`) as evidence.
- **Isolation:** new browser context and page per test — use Playwright's built-in `page` / `request` fixtures. No page or context shared across tests (no `beforeAll` page, no `describe.serial`); no manual `browser.newContext()` unless a test needs special settings. Each test can run alone (needed for run-by-ID). Cookie / consent banners handled in one helper.
- **Tags per door:** `@store`, `@gen`, `@whois`, `@api`. Cross-door tests carry both door tags (e.g. `@store @api`), so `--grep @api` selects every test that touches the API.
- **Input modes:**
  - no argument: all detailed test cases in `TEST_PLAN.md` with an automation execution type (UI automation, API automation, UI automation + API check);
  - one or more test case IDs (e.g. `/playwright STORE-03 API-01`).
- **One test at a time:** write one test → run it once → report pass/fail → I review it → next test. Applies in both modes. Reruns only on my request. No per-run API call report.
- **Source:** only detailed test cases from `TEST_PLAN.md`. If an ID is a scenario without a detailed test case, or its execution type is manual: stop and say so (detailing is the test-plan skill's job); don't improvise steps.
- API call budget rule (moved from CLAUDE.md), enforced as a skill rule only (no counter in code): no loops over inputs, a small fixed number of API calls per test, no bulk or parallel requests.
- Every test must be able to fail; name the bug it would catch.
