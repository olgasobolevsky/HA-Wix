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
