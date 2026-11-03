# Scenario notes: Business Name Generator

- **URL:** https://www.wix.com/tools/business-name-generator
- **Recorded on:** <date, time>
- **Browser:** <browser + version>
- **Signed in:** <yes / no>
- **Location / currency shown:** <e.g. IL / ILS>
- **HAR file (local, not committed):** <file name>

User actions are pre-filled and are **assumptions** until recorded; adjust names to what the page shows.
The generator takes a business name / keywords, not a domain (Q2), so the input is the bare label.
Never write cookies, tokens or session values here (check query strings too).

## Flow 1: taken name (`google`)

| # | User action | Call (method + route) | Status | Key response fields | What changed on screen |
|---|---|---|---|---|---|
| 1 | Open https://www.wix.com/tools/business-name-generator | | | | |
| 2 | Dismiss the cookie / consent banner (if shown) | | | | |
| 3 | Type `google` in the business name / keyword field | | | | |
| 4 | Click Generate | | | | |
| 5 | Look at the suggestions; note the first one and its availability (E5) | | | | |
| 6 | Check a suggestion's domain availability, if the page offers it (stop before cart) | | | | |

## Flow 2: free name (`<random name>`)

| # | User action | Call (method + route) | Status | Key response fields | What changed on screen |
|---|---|---|---|---|---|
| 1 | Open https://www.wix.com/tools/business-name-generator | | | | |
| 2 | Dismiss the cookie / consent banner (if shown) | | | | |
| 3 | Type `<random name>` in the business name / keyword field | | | | |
| 4 | Click Generate | | | | |
| 5 | Look at the suggestions; note the first one and its availability (E5) | | | | |
| 6 | Check a suggestion's domain availability, if the page offers it (stop before cart) | | | | |

## Optional flow 3: reserved TLD (`mybakery.test`)

| # | User action | Call (method + route) | Status | Key response fields | What changed on screen |
|---|---|---|---|---|---|
| 1 | Open https://www.wix.com/tools/business-name-generator | | | | |
| 2 | Type `mybakery.test` in the business name / keyword field | | | | |
| 3 | Click Generate | | | | |
| 4 | Look at the result | | | | |

## Observations
- Tech clues (framework, page type): 
- Consent banner (E11): 
- Anything unexpected: 
