# Scenario notes: WHOIS lookup

- **URL:** https://www.wix.com/domains/whois
- **Recorded on:** <date, time>
- **Browser:** <browser + version>
- **Signed in:** <yes / no>
- **Location / currency shown:** <e.g. IL / ILS>
- **HAR file (local, not committed):** <file name>

User actions are pre-filled and are **assumptions** until recorded; adjust names to what the page shows.
Never write cookies, tokens or session values here (check query strings too).

## Flow 1: taken name (`google.com`)

| # | User action | Call (method + route) | Status | Key response fields | What changed on screen |
|---|---|---|---|---|---|
| 1 | Open https://www.wix.com/domains/whois | | | | |
| 2 | Dismiss the cookie / consent banner (if shown) | | | | |
| 3 | Type `google.com` in the domain field | | | | |
| 4 | Click Search / Lookup | | | | |
| 5 | Look at the result (registered? redacted fields?) | | | | |

## Flow 2: free name (`<random name>.com`)

| # | User action | Call (method + route) | Status | Key response fields | What changed on screen |
|---|---|---|---|---|---|
| 1 | Open https://www.wix.com/domains/whois | | | | |
| 2 | Dismiss the cookie / consent banner (if shown) | | | | |
| 3 | Type `<random name>.com` in the domain field | | | | |
| 4 | Click Search / Lookup | | | | |
| 5 | Look at the result (shown as not registered?) | | | | |

## Optional flow 3: reserved TLD (`mybakery.test`)

| # | User action | Call (method + route) | Status | Key response fields | What changed on screen |
|---|---|---|---|---|---|
| 1 | Open https://www.wix.com/domains/whois | | | | |
| 2 | Type `mybakery.test` in the domain field | | | | |
| 3 | Click Search / Lookup | | | | |
| 4 | Look at the result | | | | |

## Observations
- Tech clues (framework, page type): 
- Consent banner (E11): 
- Anything unexpected: 
