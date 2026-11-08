# AI log

## 2026-11-03: Scenario notes, HTML and JSON shown as code (generator.md)

**Prompt:** "I have in file docs\scenarios\generator.md some web elements I want them to display in the md file as code not as element itself" and then "yes, put also the json as code"

**Outcome:**
- Wrapped every pasted HTML element in inline code (backticks), so Markdown no longer renders it.
- The cookie banner element was spread over 6 lines and broke its table row; joined it onto one line with the markup otherwise unchanged.
- Collapsed every multi-line JSON response onto one line in backticks; request payloads put in backticks too.
- Flow 3 step 3: the five calls are separated with `<br>` inside the "Call" cell.
- Removed the duplicate DevTools "preview" paste of the `list-tlds` response and kept only the one-line version.

**My verdict:**

## 2026-11-03: Redact token prefixes (generator.md)

**Prompt:** "yes" (to replacing the truncated token values with `"<redacted>"`)

**Outcome:**
- Flow 1 step 1: replaced the shortened values of `svSession`, `ctToken`, `mediaAuthToken` and the app's `instance` and `accessToken` with `"<redacted>"`.
- Kept `visitorId` and `metaSiteId` (IDs, not credentials).
- Searched the file again afterwards; no token values left.

**My verdict:**

## 2026-11-03: Same formatting for storefront.md, and trim the hero card

**Prompt:** "do the same for docs\scenarios\storefront.md" and then "yes" (to trimming the flow 2 hero card)

**Outcome:**
- Wrapped HTML and JSON in inline code, one line per table row.
- The API calls had been pasted below the rows, outside the table; moved them into the "Call (method + route)" column, one call per line with `<br>`, with each call's status code and response next to it.
- Flow 2 step 4 hero card cut from ~18,600 to ~1,150 characters. Kept: the "Exact Match" and "Available now!" badges, domain title, feature lines, prices, info icon, and the `hero-card-cta` button. Removed: layout markup, styling and animation spans.
- Noted in the cell that `data-hook="hero-card-title"` is on a copy of the title inside a `visibility: hidden` span; the visible `<h1>` has no data-hook (source: the pasted markup).
- No tokens in this file, so nothing to redact.

**My verdict:**

## 2026-11-03: Same formatting for whois.md

**Prompt:** "do the same for docs\scenarios\whois.md"

**Outcome:**
- Same treatment: inline code, one line per row, API calls moved into the "Call" column. The file went from 158 lines (~58k tokens) to 46 lines (~13 KB).
- Trimmed three large elements (flow 1 WHOIS result, flow 2 hero card, flow 3 message row) to their visible text, data-hooks and links. Kept every value: dates, nameservers, statuses, registrar, the "—" registrant fields, the accordion titles, the ICANN link, the 5 alternatives with prices.
- Fixed the typo "mwssage"; the redirect notes now start the "What changed on screen" cell.
- Flagged as candidates for Observations or the test plan (source: the pasted markup and HAR notes in the file; not checked on the live site):
  - `structured-domain-info/whois?domain=mybakery.test` returns 500 `UNABLE_TO_LOOKUP_WHOIS` for a bad TLD, where `check-domain-availability` returns 400 `INVALID_DOMAIN`.
  - The alternatives cards use `data-hook="undefined-item-N"` / `undefined-item-N-button`.
  - The `hero-card-title` data-hook is on the hidden copy of the title, as on the storefront.
  - The heading "Explore these  great alternatives" has a double space; the title "Raw Registrar WHOIS Data " ends with a space.
- Original kept as a backup in the session scratchpad (not in the repo).

**My verdict:**


## 2026-11-03: Template for API experiments

**Prompt:** "in docs\scenarios create new file api.md I'll do some expirements with the api call and write there the results"

**Outcome:**
- Created `docs/scenarios/api.md`: header (endpoint, docs URL placeholder, auth header name, run date, client script), an experiments table (input, purpose, status, trimmed response, notes / compare with UI) with a first row for `google.com`, and an Observations section.
- Flagged that `scripts/check_availability.py` has the API key hardcoded and the file is untracked but not git-ignored.

**My verdict:**

## 2026-11-03: Draft ARCHITECTURE.md

**Prompt:** Summary of `prompts/architecture.md`: read the three scenario notes, `api-reference.md`, `api.md` and the HARs (via a script that prints no headers, cookies, tokens or query strings); draft `ARCHITECTURE.md` for the four doors (tech clues, calls in flow order, what each call drives on screen), the relations between the doors and to the public API, and one styled Mermaid flowchart; cite every claim, label the rest **Assumption**.

**Outcome:**
- Wrote a HAR reader script in the session scratchpad (not in the repo). It prints method, route with IDs masked, status, page and response field paths. Of the headers it prints only `server` / `via`.
- The HARs hold fetch/XHR only (no document or script entries), so the tech clues are limited. All three entry pages load Thunderbolt / Velo / `access-tokens` (**Assumption:** pages built in the Wix site editor); the results pages under `/domain/result*` do not.
- Main findings from the HARs:
  - WHOIS runs `check-domain-availability` on its entry page, then goes to `/domain/result/whois` (taken / invalid) or the storefront's `/domain/result` (free).
  - The browser calls `rdap.verisign.com` and `rdap.markmonitor.com` directly, then posts the RDAP JSON to `structured-domain-info/parse-rdap`.
  - For a taken name the storefront makes 3 `bulk/domain-availabilities/check` calls of 60 domains each.
- Public API vs. web: `check-domain-availability` has the same path and the same body for the same inputs (`api.md` vs. the HARs). `suggest-domains` returns the documented fields. `premiumType: "UNKNOWN_PREMIUM_TYPE"` is not in the docs enum.
- Mismatch on screen: the `TRUSTED_AND_RELIABLE` label is shown as "Great Alternative" (whois-flow1 vs. the flow 1 note).
- Listed the gaps between the notes and the HARs (calls and pages missing from the notes; the WHOIS flow 3 redirect order; a leftover page in `whois-flow1`).
- Mermaid: 37 edges, colour per door, grey call nodes, purple public API, dotted = Assumption. It was not rendered locally.

**My verdict:**

## 2026-11-03: Redact IDs in generator.md

**Prompt:** "apply fix for : generator.md flow 1, step 1 still has real visitorId and metaSiteId values and a cacheBust query string. …"

**Outcome:**
- `docs/scenarios/generator.md` flow 1, step 1: replaced the values of `cacheBust`, `visitorId`, `metaSiteId` and `hs` with `<redacted>`.
- Scanned all the scenario notes and `ARCHITECTURE.md` for UUIDs and session or token values. Two kinds of ID are left:
  - the `apps` keys in generator.md: **Assumption:** these are Wix app definition IDs, the same for every visitor; their `instance` and `accessToken` were already redacted;
  - an SVG `clipPath` id in storefront.md.

**My verdict:**

## 2026-11-03: Proposed decisions.md changes from ARCHITECTURE.md

**Prompt:** "Considering ARCHITECTURE.md finding, what should be updated in test-plan desicions .claude\skills\test-plan\decisions.md ? Propose changes with reasoning"

**Outcome:** Proposal only, in chat; `decisions.md` not edited.
- Likelihoods re-rated against ARCHITECTURE.md (gate 1):
  - AC2 likelihood M→L, risk H→M, since all doors share one availability route; the remaining risk moves to the bulk check, the WHOIS double check and the generator's suggestion list.
  - AC5 reworded: the generator shows no availability, so a suggestion counts as an implied "available".
  - AC6 reason corrected: the WHOIS registered / free routing comes from the Wix availability check, not from RDAP.
- Q2: open question on what AC1 means for the generator. Q3 / Q5: reserved-TLD behaviour filled in from the HARs and api.md.
- Oracles: the public API isn't independent of the web doors, so ICANN / RDAP stays the independent oracle.
- Schema: `UNKNOWN_PREMIUM_TYPE` treated as a doc gap.
- Integration: dependency list taken from ARCHITECTURE.md.
- Test data: WHOIS free name ends on the storefront results page.
- Concurrency: the WHOIS double check is a free consistency point.

**My verdict:**

## 2026-11-03: Apply decisions.md changes (items 1–7)

**Prompt:** User's answers to the proposal: (1) same route is an assumption; keep AC2 at H priority, change the reason, lower the likelihood; (2) reword AC5; (3) agree on AC6; (4) Option A for Q2; (5) fill in Q3 / Q5 and mark them answered; (6) leave the API as oracle; (7) do it.

**Outcome:**
- Gate 1 line: likelihood checked against ARCHITECTURE.md; what ARCHITECTURE.md labels Assumption stays one.
- AC1: the generator is excluded (see Q2).
- AC2: H / L / M / **H**. The priority stays above the risk because of the impact. The reason cites the shared route path, labels "one service" as an Assumption and names the routes that are not shared.
- AC5: reworded to "every domain the generator suggests is available according to the API", with a new reason.
- AC6: H / L / M / M. The reason now says the answer comes from the Wix check, not the registry.
- Q2 answered (Option A). Q3 and Q5 partly answered with the observed reserved-TLD behaviour; real unsold TLDs are still open.
- Validation row `mybakery`: added the observed 400.
- Not changed: Oracles (item 6), items 8–12 (no decision given).

**My verdict:**

## 2026-11-03: Integration failure scenarios in decisions.md

**Prompt:** "9. Integration - note to the test-plan to add scenario for: WHOIS depends on outside RDAP servers, also worth to add scenarios for each door when the api is down. WDYT?", then "add it".

**Outcome:**
- Agreed. Proposed scoping both around one failure: a door saying "available" when it couldn't actually check.
- The outage is faked in the browser with Playwright `page.route`. This tests the page's error handling, not a real backend outage.
- Public API left out: we can't make the real service fail.
- Added to `decisions.md` → Aspects → 3. Integration:
  - Storefront and WHOIS: `check-domain-availability` fails.
  - WHOIS: the RDAP servers, `parse-rdap` or `structured-domain-info/whois` fail; the observed 500 from `whois-flow3` is the real-world case.
  - Generator: `suggest-domains` fails (optional).
  - Error text `<TBD in exploration>`.

**My verdict:**

## 2026-11-03: TEST_PLAN.md: gate 1 and API door

**Prompt:** "create test-plan" (test-plan skill), then "approve" (gate 1), then API door feedback: verified responses for API-04 and API-08; "API-13 - should be removed looks redundant as API-02".

**Outcome:**
- Gate 1: AC1 and AC3 values unchanged. Their reasons in `decisions.md` now cite `ARCHITECTURE.md`.
- `TEST_PLAN.md` created. Six sections copied verbatim from `decisions.md` by a script. Oracles and Test data not copied (not in the skill's list); asked the user.
- API door: 15 scenarios written (API-01..12, 14..16). API-13 dropped; the number stays unused.
- API-04 and API-08 expected results set from the user's verified responses. Recorded as `api.md` rows 5–6. The API-08 input is not recorded, so "same for every input" is marked Assumption.

**My verdict:**

## 2026-11-03: TEST_PLAN.md: WHOIS door

**Prompt:** WHOIS review over two turns. Asked why WHOIS-06 and WHOIS-11 exist; remove WHOIS-12; WHOIS-15/16/17 out of scope; WHOIS-19 looks like WHOIS-01; "show me your comments before you change". Then: merge 04–06 as suggested, keep WHOIS-11, remove WHOIS-18, merge WHOIS-19.

**Outcome:**
- Explained 06 (invalid input on a page that routes by the answer) and 11 (two checks per search; listed in the AC2 reason).
- Explained that 19 differs from 01: a registered name in an unsold TLD.
- Wrote 10 WHOIS scenarios: 01, 02, 03 (data-driven invalid input), 07, 08, 09, 10, 11, 13 (tagged AC2+AC3 to keep an AC2 negative), 14 (unsold TLD with two names, AC3+AC6).
- Removed numbers listed with reasons in the plan.
- Flagged: removing WHOIS-18 leaves the WHOIS RDAP bullet in the Integration aspect (decisions.md and TEST_PLAN.md) without a scenario.

**My verdict:**

## 2026-11-03: Taken-message check

**Prompt:** "STORE-01 - should take in consideration that the message shown may not be the same. It should check that google.com in the message and some key words [registered, taken, unavailable]. I saw it in my observatins", then "lets apply it to all that kind of checks".

**Outcome:**
- Added a "Taken-message check" rule at the top of the Scenarios section in `TEST_PLAN.md`: the message contains the searched name plus one keyword, case-insensitive, scoped to the message element.
- WHOIS-01, -09 and -18 now use the rule.
- In the storefront table (not yet approved or written), STORE-01, -06 and -07 will use it.
- The source for "the wording varies" is the user's observation; it's not yet recorded in the scenario notes.

**My verdict:**

## 2026-11-03: TEST_PLAN.md: Storefront door

**Prompt:** Storefront review: write out the STORE-03 data set; STORE-06 redundant; STORE-09 out of scope; STORE-12 similar to STORE-02; drop STORE-13; "discuss before you edit". Then: keep STORE-09 as manual, write out the API-11 / API-12 references in place, don't add STORE-14.

**Outcome:**
- Pushed back on STORE-09: the AC2 reason names the bulk check. It is kept as manual.
- Explained that STORE-12 differs from STORE-02 but depends on STORE-09; dropped.
- Flagged that dropping STORE-13 leaves the "key never in web traffic" security clause without a scenario. No answer yet; aspect text unchanged.
- Wrote the storefront table: STORE-01..05, 07..11.
- Wrote out the API references in place in WHOIS-13/14 and STORE-10/11.

**My verdict:**

## 2026-11-03: TEST_PLAN.md: Business Name Generator door

**Prompt:** GEN review: check the first 10 suggestions in GEN-01, -02 and -04; GEN-03 assumed covered ("if available and suggested, it should be a Wix TLD"); GEN-05 maybe not needed; "lets discuss". Then "apply".

**Outcome:**
- Added a "Suggestion check" rule: the first 10 suggestions shown (or all, if fewer) must be `available: true` in the API. The page requests 10 per HAR.
- GEN-03 dropped. The user's reasoning is recorded as an Assumption tied to API-12 (Q3), with a condition to bring GEN-03 back.
- GEN-05 dropped: `maxlength` is markup, not a requirement.
- Written: GEN-01, 02, 04, 06, 07, 08. AC3 has 1 scenario.
- Gate 2 complete for all four doors.

**My verdict:**

## 2026-11-03: Detailed API test cases

**Prompt:** "detail all the API scenarios" (gate 3).

**Outcome:**
- Added "Detailed test cases → API door" to `TEST_PLAN.md`: 15 cases (API-01..12, 14..16). Each has preconditions and a steps table, with expected results cited from `api.md` rows 1–6 and `api-reference.md`.
- Common block: request, auth header, key handling, URL encoding, random free name.
- `<TBD in exploration>` or Assumption: API-06 / 07 / 15 / 16 error codes, and API-04's form of the missing domain.
- Fixed a misplaced sentence: an earlier edit had moved the tail of the WHOIS AC6 line to the end of the file.

**My verdict:**

## 2026-11-03: Self-contained API test cases

**Prompt:** "I don't want 'Common to all API cases', each detaile test case should hold all the details needed for test"

**Outcome:**
- Removed the shared block. Each of the 15 API cases now states its own endpoint, auth header, key handling, encoding and random-name rule in Preconditions, and spells out the full request in its steps.
- API-10 rewritten to run its own API calls (4 steps) instead of depending on API-01 / API-02.

**My verdict:**

## 2026-11-03: Detailed WHOIS-01, WHOIS-02

**Prompt:** "add details to test cases: WHOIS-01, WHOIS-02"

**Outcome:**
- Added "Detailed test cases → WHOIS door" with two self-contained UI cases. Labels, URLs and hooks come from `whois.md` flows 1–2 and the HARs via `ARCHITECTURE.md`.
- WHOIS-01: 4 steps. The taken-message check is restated inside the case.
- WHOIS-02: 6 steps. The hero card is found by its visible `<h1>` (the `hero-card-title` hook is on a hidden copy); asserts the "Available now!" badge and the "Make It Yours" button without clicking it.
- The cookie banner is left open, as in the recordings.

**My verdict:**

## 2026-11-03: Playwright project and API-01

**Prompt:** "init the playwright project and automate API-01" (playwright skill, arg API-01)

**Outcome:**
- `automation/`: npm project with `@playwright/test` 1.56.1 and `@types/node`. `npm test` runs `playwright test`.
- `playwright.config.ts`:
  - Loads `automation/.env` with Node's `process.loadEnvFile` (no dotenv).
  - Projects `api-setup` (fails clearly when `WIX_API_KEY` is missing), `api` (baseURL `https://www.wixapis.com`, key via `extraHTTPHeaders`) and `web` (Chromium, `https://www.wix.com`).
  - No retries; trace retain-on-failure, screenshot only-on-failure.
- `tests/api/api.spec.ts`: API-01, 2 steps worded as in the plan. Status asserted before the body.
- Run once: passed (api-setup + API-01, 3.4 s).

**My verdict:**

## 2026-11-03: Automate API-02

**Prompt:** "automate also the API-02"

**Outcome:**
- Added `tests/helpers/random-name.ts`: `randomLabel()`, 16 random lowercase letters from `node:crypto`, fresh per call.
- Added API-02 to `tests/api/api.spec.ts`: `<random>.com` → status 200, then `domain` equals the input and `available` is `true`. Steps worded as in the plan.
- Run once (`-g API-02`): passed.

**My verdict:**

## 2026-11-03: FINDINGS.md table

**Prompt:** "Lets work on FINDINGS.md - Iwant to add the a table with number, door, stesps to reproduce, Actual resuls, expected result, Severity and priority"

**Outcome:**
- Created `FINDINGS.md` with the requested columns, plus an Evidence column (the assignment asks for evidence).
- Five findings, all low severity, none a wrong availability answer:
  - F1: WHOIS `structured-domain-info/whois` 500 for `.test` (L/M).
  - F2: undocumented `UNKNOWN_PREMIUM_TYPE` (L/M).
  - F3: undocumented validation errors `FORMAT` / `REQUIRED_FIELD` (L/M).
  - F4: `getUserDetails` 404 on page-relative path (L/L).
  - F5: `undefined-item-N` data-hooks (L/L).
- Added a short defence of each severity / priority, and an Observations section (label mismatch, duplicate checks, hidden `hero-card-title`).
- Corrected F4 after re-checking the HAR summary: only `manage.wix.com` returns 200 on WHOIS.

**My verdict:**

## 2026-11-03: FINDINGS.md trimmed

**Prompt:** "leave only 2 first findings and remove all the explanations besides the table"

**Outcome:** `FINDINGS.md` reduced to the title and the table with F1 (WHOIS 500) and F2 (`UNKNOWN_PREMIUM_TYPE`). The intro, the severity / priority reasons and the Observations section were removed.

**My verdict:**

## 2026-11-03: FINDINGS.md: results-page search risk

**Prompt:** "Add also consern about this: as found in eploratory , the pages with reslts (suggestions) have their own serach for domain availiability and the concern is that it is not tested by the test plan produces"

**Outcome:**
- Added F3 (risk) to the table: the results pages have their own domain search; `TEST_PLAN.md` covers only searches from the entry pages.
- Severity H (a wrong answer there loses a sale), priority M. Same call is marked Assumption.
- Evidence is the user's exploratory observation; it isn't recorded in `docs/scenarios/` or the HARs.

**My verdict:**

## 2026-11-03: F3 priority raised

**Prompt:** "remove the Assumption and make the priority high cause it is missing coverage for functionality under test by this test plan"

**Outcome:** F3 in `FINDINGS.md`: removed the Assumption sentence about the call it uses; priority M → H.

**My verdict:**

## 2026-11-03: README.md draft

**Prompt:** `prompts/readme.md`, summarised: draft README from TEST_PLAN, FINDINGS, ARCHITECTURE, package.json, the config and the tests. Sections: time spent (ask), how to run, what is automated and why (ask why), another week (ask), quality strategy in exactly 5 lines, repo map. No generic advice, no keys.

**Outcome:**
- Drafted `README.md`.
- Run commands come from `package.json` and `playwright.config.ts`: `npm ci`, `npx playwright install chromium`, `.env` from `.env.example`, `npm test`, `npm test -- --grep @api`.
- Automated cases: API-01, API-02.
- 5-line strategy, each line tied to a repo file.
- Repo map: one row per top-level item.
- Placeholders left for time spent, why these tests, and another week; asked the user.

**My verdict:**

## 2026-11-03: README time spent

**Prompt:** "Time spent - 5 hours preparations and prerequisites, 3 our the task"

**Outcome:** README section 1 filled in: the task about 3 hours, prerequisites about 5 hours. The placeholder was removed.

**My verdict:**

## 2026-11-03: README: what is automated and why

**Prompt:** "About what was automated: only 2 tests due to luck of time. API test as was asked in assignment first"

**Outcome:**
- README section 3 filled in: two cases for lack of time; the API first because the assignment requires it and it's the reference for cross-door checks; API-01 / 02 are the basic taken / free answers.
- Added an honest line that no web door is automated yet, with WHOIS-01 / 02 as next.
- Flagged the assignment's "at least one web door" requirement.

**My verdict:**

## 2026-11-03: README section 3 trimmed

**Prompt:** "remove the last 2 points"

**Outcome:** Removed the "API-01 / 02 are the basic answers" and "no web door yet" lines from README section 3.

**My verdict:**

## 2026-11-03: README: another week

**Prompt:** "What I'd do with another week: 1. clear out the open questions and assumptions in architecture.md and test-plan.md. 2. Include in test plan missing coverage for availiability check on results page. 3. Find missind data for tests, like TLD that Wix doesn't sell 3. Make the test plan skill reusable and not specific to one task."

**Outcome:** README section 4 written as four items, each linked to repo files: ARCHITECTURE / TEST_PLAN assumptions; FINDINGS F3; unsold-TLD data for API-12 / WHOIS-14 / STORE-11; the test-plan skill. Renumbered the duplicate 3 → 4. No TODOs left.

**My verdict:**

## 2026-11-03: README strategy line 2 removed

**Prompt:** "remove 2. from Quality strategy for Wix Domains, in 5 lines"

**Outcome:** Removed strategy line 2 (test where the doors don't share the check) and renumbered to 4 lines; the heading still says "in 5 lines" (flagged).

**My verdict:**

## 2026-11-03: README strategy heading

**Prompt:** "no, remove the 5 lines wording"

**Outcome:** README section 5 heading is now "Quality strategy for Wix Domains".

**My verdict:**

## 2026-11-03: README strategy line 4 removed

**Prompt:** "remove also 4"

**Outcome:** Removed strategy line 4 (docs vs. behaviour drift as findings); section 5 now has 3 lines.

**My verdict:**

## 2026-11-08: Playwright skill: failure analysis

**Prompt:** "add in 3. if fail analyze the reason for the failure and suggest the fix." (about the "Flow — one test at a time" list in the playwright skill)

**Outcome:** `.claude/skills/playwright/SKILL.md` flow step 3 now reads: "Report pass / fail. If it fails, analyze the reason for the failure and suggest the fix."

**My verdict:**

## 2026-11-08: Playwright skill made general

**Prompt:** "I want to rewrite the Playwright skill to be general, not specific to this task. Show me the specific instructions in the skill one by one and suggeststion how to generalize it". Then: "The tests should come from the TEST_PLAN.md. You are right about ids"; "show me an example of project.md"; asked how the skill finds elements by role or label; "add it" (live lookup).

**Outcome:**
- Listed 21 specific instructions with a generic rule for each, in the approved plan.
- `.claude/skills/playwright/SKILL.md` is now generic. `TEST_PLAN.md` stays as the fixed test source.
- New `.claude/skills/playwright/project.md` holds this repo's values: ID format, execution types, areas and tags, `automation/`, config, API call budget, UI notes, test data, forbidden actions. Same split as `test-plan/decisions.md`.
- Added: read `project.md` first; a live element lookup with `locator.ariaSnapshot()` as the third locator source (on for this repo); a generic rule against attaching or committing traces from tests that send a secret.
- `project.md` config values checked against `automation/playwright.config.ts` and `package.json`.
- The live lookup has not been exercised yet; no test code changed and Playwright was not run.

**My verdict:**

## 2026-11-08: project.md: mandatory and additional fields

**Prompt:** "about project.md - add comment with what are mandatory and what are additional fields that should be in this file"

**Outcome:**
- Added an HTML comment at the top of `.claude/skills/playwright/project.md`, under the intro line.
- Mandatory: the fields `SKILL.md` has no default for (case ID format, automatable types, feature areas, run command, Playwright projects, secrets or "none", forbidden actions or "none").
- Additional: not automatable types, cross-area rules, test root, helpers, API call budget, UI notes, live lookup, test data and state.

**My verdict:**

## 2026-11-08: Playwright skill: stop on missing mandatory fields

**Prompt:** "yes add the rule" (stop and ask when a mandatory field in `project.md` is missing)

**Outcome:** `.claude/skills/playwright/SKILL.md`, "Project values": the skill now stops and asks if `project.md` or any field it lists as mandatory is missing.

**My verdict:**

## 2026-11-08: Playwright skill: readability fixes

**Prompt:** "apply fixes:" followed by the "What to fix" list from my review of the skill (7 points: misplaced rules, no example, vague step 2, no report format, missing pre-checks, awkward wording, few reasons).

**Outcome:**
- `.claude/skills/playwright/SKILL.md` rewritten; the technical gaps from the review (failure mocking, `testIdAttribute`, API depth, strict mode, async state, fixture and auth details) were not part of the list and are not added.
- Moved "fresh data", "assert on state", `expect.soft` and "forbidden actions" from UI to "Every test".
- Added a short example test (tag, `test.step`, status before body, field / type check).
- Flow is now 6 steps: check for existing helpers, write, type check, run only that test by ID, report in a fixed order, stop and wait.
- Reworded the locator source list and "my review" to "the user's review".
- Added a reason to: no retries, state assertions, `expect.soft`, fresh data, web-first assertions, no fixed waits, no `networkidle`, generated ids.
- The example was not run; `tsc` and `-g` commands are examples and not checked against this repo.

**My verdict:**

## 2026-11-08: Playwright skill: remove "assert on state" rule

**Prompt:** "This instructions should be removed. The detailed test case should define what exactly needs to be asserted." (about "Assert on state, not marketing copy")

**Outcome:** Removed that line from "Every test" in `.claude/skills/playwright/SKILL.md`. What to assert is now defined only by the detailed test case.

**My verdict:**

## 2026-11-08: Playwright skill: failure mocking rule

**Prompt:** Went over the technical coverage gaps of the skill ("lets go over the Teschnical coverage issues"), asked for item 1 to be explained, then "add rule 1" (simulate a failing dependency with `page.route`).

**Outcome:**
- Added to the UI section of `.claude/skills/playwright/SKILL.md`: simulate failures only with `page.route` inside the test, for browser tests only.
- Four sub-rules: register the route before the action; match one URL pattern; never make a real call to the failing service; assert what the case says, and stop and ask if the expected message is undefined.
- The other five gaps (test id attribute, API depth, strict-mode and force traps, async state, fixtures and authentication details) are not added yet; the per-file login question is still open.
- The rule was not exercised: no test uses it yet.

**My verdict:**

## 2026-11-08: Test id attribute in project.md

**Prompt:** "about 2. - the test-id attribute should be defined in project.md. In project.md description should be instrustion about this", then "the instruction in the skill should say to take the test-id as defined in project.md"

**Outcome:**
- `.claude/skills/playwright/project.md`: the header comment lists "Test id attribute" as an additional field (default `data-testid`), with the instruction to set `testIdAttribute` once in config. The UI notes now have one line: "Test id attribute: `data-hook`" (my first, longer draft was rejected; this short one was chosen).
- Why `data-hook` is the likely value (source: `docs/scenarios/*.md`): 12 app-level elements carry it (cookie banner, hero card, accordion, alternatives); the 3 `data-testid` values are component internals (`stylablebutton-label`, `stylablebutton-icon`, `buttonContent`, `buttonElement`).
- `.claude/skills/playwright/SKILL.md`, UI section: one line to take the test id attribute from `project.md` (default `data-testid`). My first draft also told the skill to set `testIdAttribute` in config; you asked for the simpler wording.
- `automation/playwright.config.ts` is not changed, so `testIdAttribute` is not set there yet; no web test exists.

**My verdict:**

## 2026-11-08: Skill sets testIdAttribute in the config

**Prompt:** "so the skill needs to set it in the /playwright.config.ts if it isn't set"

**Outcome:** `.claude/skills/playwright/SKILL.md`, UI section: if `playwright.config.ts` doesn't set `testIdAttribute` to the attribute from `project.md`, the skill sets it once in the `use` block of the Playwright project that runs UI tests, before the first test that needs it. The config itself is not changed yet.

**My verdict:**

## 2026-11-08: Skill: tolerate extra response fields

**Prompt:** "rule 1" (from the proposed API depth rules: tolerate extra fields; clean up created data)

**Outcome:** `.claude/skills/playwright/SKILL.md`, API section: assert the required fields and their types, not exact body equality or "no extra fields", unless the case says so, with the reason. The cleanup rule was not added.

**My verdict:**

## 2026-11-08: Skill: strict-mode and force rules

**Prompt:** "first 2" (from the proposed rules: no `.first()` / `.nth()` to silence strict mode; no `force: true`; no `test.only` / `page.pause`)

**Outcome:** `.claude/skills/playwright/SKILL.md`, UI section: no `.first()` / `.nth()` to silence a strict-mode error unless the case says which item; no `force: true`, report a non-actionable element as a finding. The `test.only` / `page.pause` rule was not added.

**My verdict:**

## 2026-11-08: Skill: async state rule

**Prompt:** "add 5" (the async state rule)

**Outcome:** `.claude/skills/playwright/SKILL.md`, UI section: for a condition that is not an element's state, use `expect.poll` or `toPass` with an explicit timeout; never a sleep loop. The plan has no eventual-consistency case, so no test uses it yet.

**My verdict:**

## 2026-11-08: Skill: fixtures and authentication details

**Prompt:** "once per run" (answer to: log in once per run or once per file; item 6 of the technical coverage gaps)

**Outcome:**
- `.claude/skills/playwright/SKILL.md`, Authentication: login is once per run, not per file or per test. Added that each test still gets a fresh context seeded from the saved `storageState` (or a fixture that sends the saved token), and that an expiring token is refreshed in the fixture, with a 401 failing the test with its status.
- API: the fixtures live in `tests/helpers/fixtures.ts`, created by the first test that needs it; specs import `test` from it.
- No effect on this repo yet: the API uses a static key, and API-01 / API-02 still use the built-in `request` fixture.

**My verdict:**

## 2026-11-08: Rewrite API-01 to the new skill rules

**Prompt:** "lets rewrite the tests according to all new rules in skill"

**Outcome:**
- Followed the skill's one-test-at-a-time flow: only API-01 is rewritten; API-02 waits for review.
- New `automation/tests/helpers/fixtures.ts`: `test.extend` with a `checkDomain(domain)` fixture that wraps the endpoint path on the authenticated `request` context. Auth header and base URL stay in `playwright.config.ts`, which the skill allows.
- `automation/tests/api/api.spec.ts`: API-01 uses `checkDomain`. Steps keep the plan's wording, status asserted before the body, body checked with `toMatchObject`, so extra response fields don't fail the test. `test` and `expect` now come from the fixtures file; API-02 is unchanged otherwise and still has its own `CHECK` constant.
- Run once (`-g "API-01"`): passed (api-setup + API-01, 2.4 s). No `tsconfig`, so no type check. The test was not made to fail, so "must be able to fail" is argued, not shown.

**My verdict:**

## 2026-11-08: Create tsconfig.json

**Prompt:** "create tsconfig.json"

**Outcome:**
- New `automation/tsconfig.json`: ES2022, `module: node16`, strict, `esModuleInterop`, `skipLibCheck`, `noEmit`, `types: ["node"]`; includes `playwright.config.ts` and `tests`.
- First draft used `moduleResolution: node`; the latest TypeScript rejected it (TS5108), so it is replaced by `module: node16`.
- Checked with a temporary TypeScript (`npx -p typescript tsc -p automation --noEmit`): exit 0, no errors.
- `typescript` is not a devDependency; `package.json` and the lock file are unchanged. Playwright was not rerun after adding the file.

**My verdict:**

## 2026-11-08: Add TypeScript as a dev dependency

**Prompt:** "add it, but it changes package.json and the lock file" (add `typescript` as a dev dependency)

**Outcome:**
- `npm --prefix automation install --save-dev typescript`: `typescript` `^7.0.2` added to `automation/package.json` devDependencies; `automation/package-lock.json` updated.
- The lock file grew by about 378 lines: it lists 20 platform packages (`@typescript/typescript-<os>-<cpu>`) next to `typescript`, though npm installed only the 2 for this machine.
- Type check with the local TypeScript (`tsc -p automation --noEmit`): exit 0, no errors.
- Nothing is committed.

**My verdict:**

## 2026-11-08: Rewrite API-02 to the new skill rules

**Prompt:** "lets change the second test according to new instructions"

**Outcome:**
- `automation/tests/helpers/fixtures.ts`: added a `freeDomain` fixture (16 random lowercase letters + `.com`, fresh per test) built on `randomLabel()`.
- `automation/tests/api/api.spec.ts`: API-02 uses `checkDomain` and `freeDomain`, same step wording as the plan, status before body, body checked with `toMatchObject`. The spec no longer has its own endpoint constant or the `randomLabel` import.
- Type check (`tsc -p automation --noEmit`): exit 0. Run once (`-g "API-02"`): passed (api-setup + API-02, 2.2 s).
- Not shown: that the test fails on a wrong answer. The name is never regenerated after a `false` answer, as the plan requires.

**My verdict:**

## 2026-11-08: API-02 step title shows the generated name

**Prompt:** "add in the title of the step instead of<random name> the value of freeDomain"

**Outcome:** `automation/tests/api/api.spec.ts`: the API-02 step 1 title now contains the `freeDomain` value instead of `<random name>.com`, so the report shows the name that was checked. The `<WIX_API_KEY>` placeholder stays; the key is never in the title. Type check exit 0; run once, passed (2.2 s).

**My verdict:**

## 2026-11-08: Playwright skill: fixtures and reused authentication

**Prompt:** "Add some more api instructions: 1. Use Playwright fixtures instead of global state. Wrap the authenticated APIRequestContext, base URL and data factories in custom fixtures. This gives you dependency injection, automatic teardown and one place to change config. 2. Authenticate once and reuse the session. Log in in a setup project or global setup, save the token or storageState, and reuse it. Logging in before every test is slow and can trip rate limits. (this can be general, not only api?) 3." (item 3 was empty)

**Outcome:**
- `.claude/skills/playwright/SKILL.md`, API section: added rule 1, with the fixtures in one file in `tests/helpers/`.
- New "Authentication (UI and API)" section: rule 2, placed outside API because `storageState` also serves browser tests.
- Added two points to rule 2: the saved state file is a secret, and the rule doesn't apply without a login step (static API key).
- Reconciled two existing lines: Isolation now allows custom fixtures built on the built-in ones; secrets are set once "in config or in the authenticated fixture".
- Existing tests were not changed.

**My verdict:**
