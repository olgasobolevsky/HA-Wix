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
