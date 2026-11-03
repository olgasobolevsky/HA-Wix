 # Test plan: Wix Domains, "Can I get this name?"

## Task description
A user wants to know one thing: **"Can I get this name?"** At Wix there are four doors that answer it:

| Door | Where |
|---|---|
| Domain storefront | https://www.wix.com/domains |
| Business Name Generator | https://www.wix.com/tools/business-name-generator |
| WHOIS lookup | https://www.wix.com/domains/whois |
| Public Domain Search API | https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/introduction |

## Scope
| Decision | Reason |
|---|---|
| **In:** the availability answer on all four doors | It is the user's one question. |
| **In:** API = Domain Availability v2 only | It is the API's answer to the same question; see `docs/api-reference.md`. |
| **In:** input validation (invalid input) | Invalid input answered as "available" is a wrong answer to the question. |
| **Exploration observation only:** premium flag consistency across doors, for one known premium name | Premium is information about the system, not a requirement of the task; no AC, no automated test. |
| **Out:** input normalization (`GOOGLE.COM`, surrounding spaces, `www.`, `https://`) | No requirement defines whether a door should normalize or reject. |
| **Out:** location-dependent behaviour (prices, currency, `.co.il` offers) | Real coverage needs a VPN or proxy. |
| **Out:** API suggestion endpoints | API scope is availability only; generator suggestions are checked through the availability API instead. |
| **Out:** mobile (responsive web and native apps) | Doesn't change the answer to "Can I get this name?"; time box. |
| **Out:** anything past the search result (cart, checkout, purchase) | Assignment rule: never complete a purchase. |
| **Out:** cross-browser | Chromium only; doesn't change the answer. |
| **Out:** load and performance | Assignment rule: no load testing. |

## Open questions
- **Critical:** without an answer, no expected result can be written for at least one scenario.
- **Non-critical:** the scenario can be written with a labelled assumption, verified during exploration.

| # | Open question | Rating | Decision |
|---|---|---|---|
| Q1 | What should a door do with `GOOGLE.COM`, ` google.com `, `www.google.com`, `https://google.com`: normalize or reject? | Critical | Normalization is out of scope. Validation of invalid input is in scope. |
| Q2 | The generator takes a business name, not a domain. What is "the name" in AC1 for that door? | Critical, **answered** | The generator never answers "can I get it" for a name: no availability call or indication in flows 1–2 (`ARCHITECTURE.md` §2). So the generator is out of AC1 and covered by AC5. Its suggestions are generated, so tests read them at run time. |
| Q3 | For a TLD Wix doesn't sell: API "unavailable" or error? Storefront "not available" or "we don't sell this"? | Non-critical, **partly answered** | **Reserved TLD (`mybakery.test`), observed:** API `400 INVALID_DOMAIN`, "failed to extract root domain from mybakery.test, a tld is missing or invalid" (`docs/scenarios/api.md` row 4). Storefront: ".test domains aren’t available. Explore other options below or view available extensions." (storefront note, flow 3). **Real TLD Wix doesn't sell:** still open, placeholder `<error message: TBD in exploration>`. |
| Q4 | What does "the same moment" in AC2 mean? | Non-critical | Checks run one after another (< 1 min). **Assumption:** the test domain is not sold during the test. |
| Q5 | What should WHOIS show for invalid input or a TLD Wix doesn't sell? | Non-critical, **partly answered** | **Reserved TLD (`mybakery.test`), observed:** the entry-page check returns 400; `/domain/result/whois` gets `500 UNABLE_TO_LOOKUP_WHOIS` from `structured-domain-info/whois`, then the flow moves to the storefront's `/domain/result` with ".test domains aren’t available…" (`whois-flow3`; whois note, flow 3). **Other invalid input and real unsold TLD:** still open, placeholder `<error message: TBD in exploration>`. |
| Q6 | When doors disagree, which one is right? | Non-critical | Any disagreement **between Wix doors** is a bug. Severity is decided manually against a third party (another door, ICANN). Wix vs ICANN differences are not automatically bugs (see AC3). |

## Acceptance criteria
Source: the task description. Domain basics are information, not requirements.
Risk = impact × likelihood. Priority = risk, unless the override rule applies (then the reason says so). Scale: H / M / L.
**Override rule:** the core business path (answering "Can I get this name?") is H priority regardless of likelihood.
Likelihood was checked against `ARCHITECTURE.md` (gate 1); each Reason names the finding it rests on. What `ARCHITECTURE.md` labels **Assumption** stays an assumption here.

| # | Acceptance criterion | Impact | Likelihood | Risk | Priority | Reason |
|---|---|---|---|---|---|---|
| AC1 | For a valid full domain name, each door except the generator (see Q2) gives a clear answer: can get it, or can't | H | L | M | H | Core business value: it is the product's one promise. Override rule applies — likelihood is low because the path is heavily used, but if it breaks, nothing else matters. Storefront and WHOIS answer from `check-domain-availability`; every recorded flow got a clear answer (`ARCHITECTURE.md` §1, §3). |
| AC2 | All doors give the same availability answer for the same name at the same moment | H | L | M | H | A wrong answer loses a sale or breaks trust at checkout, so priority stays H above the risk. Likelihood is lower: in the HARs, all three web doors call the same route path, `/domain-search/v2/check-domain-availability`, and get the same body as the public API (`ARCHITECTURE.md`, Relations). **Assumption:** one service sits behind them; not proven. Remaining risk sits in routes that are not shared: the storefront's `bulk/domain-availabilities/check` for other extensions, the WHOIS double check (entry page + results page), the generator's suggestion list. |
| AC3 | A name in a TLD Wix doesn't sell is shown as unavailable or not purchasable | M | M | M | M | The user is told "yes" and fails later. TLD lists can drift between doors: the web doors load `list-tlds` (414) and the storefront `suggested-tlds` (13), and the API validates on its own (`ARCHITECTURE.md`). **Assumption:** they share one list. |
| AC5 | Every domain the generator suggests is available according to the API | M | M | M | M | The generator shows no availability, so listing a domain implies "you can get it" (`ARCHITECTURE.md` §2: no availability call in flows 1–2; generator note flow 1, step 6). A taken suggestion frustrates the user. The docs call suggestions "available for purchase" yet advise re-checking them (`docs/api-reference.md`, Suggest Domains). |
| AC6 | WHOIS shows a registered name as registered and an unregistered name as not registered | H | L | M | M | The registered / free answer comes from Wix's availability check on the entry page, not from the registry. A free name goes to the storefront's `/domain/result` page (purchase path); a taken one to `/domain/result/whois`. Registry (RDAP) data only fills in the details afterwards (`ARCHITECTURE.md` §3). A wrong "free" sends the user into the purchase path, hence impact H. Likelihood L: same check as AC1. |

(AC4 premium and AC7 API contract were removed: Domain basics are information, not requirements.)

## Aspects
1. **Functionality** — the four doors answer "is this name available?" and the answers are consistent. Includes AC2, AC5 and input validation.
2. **Schema validation** — public API only, from `docs/api-reference.md` (not the web doors' internal calls).
3. **Integration** — only dependencies shown in `ARCHITECTURE.md`. Failure scenarios, one per web door, are simulated by failing the call in the browser (Playwright `page.route`: abort / 503). This tests the page's error handling, not a real backend outage.
   - Storefront and WHOIS: `check-domain-availability` fails → the door must not show the name as available, nor send the user on toward purchase.
   - WHOIS: the external RDAP servers, `parse-rdap` or `structured-domain-info/whois` fail → no invented registration data, and the name is not shown as unregistered. The observed `500 UNABLE_TO_LOOKUP_WHOIS` (`whois-flow3`) is the real-world case.
   - Generator (optional): `suggest-domains` fails.
   - Expected error text: `<TBD in exploration>`. Public API: out; we can't make the real service fail.
4. **Security** — API key cases (missing / invalid key); the key never appears in web door traffic. No brute force.
5. **Concurrency** — considered, mostly not implemented (needs purchases or parallel load). Executable slice: the same name checked several times in a row, and on two doors close together.

## Input validation
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
| `mybakery` (API only) | no TLD — the API requires one (observed: `400 INVALID_DOMAIN`, `docs/scenarios/api.md` row 3); storefront / generator may treat it as a keyword |
| `com` / `.com` | TLD only, no label |
| `192.168.1.1` | IP address, never registrable |
| 63-character label + `.com` | label length, upper boundary (valid) |
| 64-character label + `.com` | label length, boundary + 1 (invalid) |
| `goo_gle.com` | invalid character; `_` chosen because DNS allows it elsewhere (e.g. `_dmarc`), so a validator may let it through |
| `goo gle.com` | invalid character: space inside the name |
| `goo@gle.com` | invalid character: symbol |
| `google..com` | empty label |
| `-google.com` | leading hyphen |
| `mybakery.test` | reserved TLD (RFC 2606 / 6761) — exists nowhere, not an "unsold" TLD |

**API-specific boundary** (`docs/api-reference.md`): the API limits the **whole domain** to 3–63 characters. API boundary pair: a 63-character and a 64-character domain (incl. TLD). A 63-character label + `.com` (67 chars) is expected to be rejected by the API. A domain shorter than 3 characters is the lower boundary. The 63 / 64 label cases still apply to the web doors.

## Scenarios

Priority is inherited from the AC. Observed responses are cited from `docs/scenarios/api.md` (row numbers) and HARs via `ARCHITECTURE.md`.

**Taken-message check** (used wherever a scenario expects the "name is taken" message): the result message for the searched name contains the searched name and at least one of `registered` / `taken` / `unavailable` (case-insensitive, scoped to the message element). The exact wording is not asserted: it differs between doors ("is registered" on WHOIS, "is already registered" on the storefront; scenario notes, flow 1) and varies over time (user observation, not yet in the notes).

### API door

AC5 and AC6 skipped: they apply to the generator and WHOIS only.

| ID | Title | Description (input → expected) | Type | AC | Execution |
|---|---|---|---|---|---|
| API-01 | Taken name | `google.com` → 200; `availability.domain` = `google.com`, `available: false` (observed, `api.md` row 1) | positive | AC1 | API automation |
| API-02 | Free name | Random name generated at run time + `.com` → 200; `available: true`; `domain` echoes the input (observed, `api.md` row 2) | positive | AC1 | API automation |
| API-03 | Response schema | Responses of API-01/02 match `docs/api-reference.md`: `domain` hostname string, `available` and `premium` boolean, `premiumType` enum. `UNKNOWN_PREMIUM_TYPE` accepted and logged as a doc gap (`api.md` rows 1–2; `ARCHITECTURE.md` "Doc gap") | positive | AC1 | API automation |
| API-04 | Missing `domain` | No / empty `domain` → 400, message `domain is not a valid hostname,domain must not be empty`; `fieldViolations` `FORMAT` (`HOSTNAME`) and `REQUIRED_FIELD` (observed, `api.md` row 5) | negative | AC1 | API automation |
| API-05 | No TLD | `mybakery` → `400 INVALID_DOMAIN`, "failed to extract root domain from mybakery, a tld is missing or invalid" (observed with `sdfsjgghg`, `api.md` row 3) | negative | AC1 | API automation |
| API-06 | Not a registrable name | `com`, `.com`, `192.168.1.1` → error, never `available: true`. Code `<TBD in exploration>`; **Assumption:** `INVALID_DOMAIN` | negative | AC1 | API automation |
| API-07 | Length boundary (API: 3–63 for the whole domain) | 63-character domain incl. TLD → 200 with boolean `available`. 64-character domain → error `<TBD in exploration>`. 63-character label + `.com` (67) → error (`decisions` Input validation, API-specific boundary) | edge | AC1 | API automation |
| API-08 | Invalid characters and structure | `goo_gle.com`, `goo gle.com`, `goo@gle.com`, `google..com`, `-google.com` → 400, message `domain is not a valid hostname`, `fieldViolations[0].violatedRule` = `FORMAT` (observed, `api.md` row 6; **Assumption:** same for every input in the set) | negative | AC1 | API automation |
| API-09 | IDN (non-ASCII) | `bäckerei.com` → a valid answer or a validation error. Docs allow "only alphanumeric characters, hyphens, and dots", so rejection = stricter than RFC: observation, not a bug | edge | AC1 | manual |
| API-10 | Answer vs. ICANN | Names from API-01/02 checked at lookup.icann.org. Registered at ICANN but `available: true` → strong bug signal (Oracles) | positive | AC1 | manual |
| API-11 | Reserved TLD | `mybakery.test` → `400 INVALID_DOMAIN`, "failed to extract root domain from mybakery.test, a tld is missing or invalid" (observed, `api.md` row 4) | edge | AC3 | API automation |
| API-12 | Real TLD Wix doesn't sell | Random name + unsold TLD (test data `<TBD in exploration>`) → error or `available: false`, never `available: true` (Q3) | negative | AC3 | manual → API automation once the TLD is known |
| API-14 | Same name, repeated | `google.com` and the free name, each 5 times in a row → same answer every time (concurrency slice; Q4) | edge | AC2 | API automation |
| API-15 | Missing API key | No `Authorization` header → error, no `availability` in the body. Status `<TBD in exploration>` (not documented, `api-reference.md`) | negative | Security | API automation |
| API-16 | Invalid API key | `Authorization: invalid` → error, no `availability` in the body. Status `<TBD in exploration>` | negative | Security | API automation |

API-13 removed (duplicate of API-02); its number stays unused.
AC3: 2 scenarios. The API faces only three TLD cases (sold = API-02, unsold, nonexistent).
AC2: 1 scenario. The API is the reference; cross-door comparisons are in the other doors' tables.
Concurrency beyond API-14: considered, not implemented. A name changing owner between checks needs a purchase.

### WHOIS door

AC5 skipped: it applies to the generator only. Screen text from `docs/scenarios/whois.md`; pages and calls from `ARCHITECTURE.md` §3. Entry page: `/domains/whois`, field "Enter a domain name or URL", button "Search Domains".

| ID | Title | Description (input → expected) | Type | AC | Execution |
|---|---|---|---|---|---|
| WHOIS-01 | Taken name | `google.com` → page `/domain/result/whois`; taken-message check passes (seen: "google.com is registered. Explore some great alternatives below.", whois note, flow 1) | positive | AC1, AC6 | UI automation |
| WHOIS-02 | Free name | Random name + `.com` → page `/domain/result` (the storefront's); the hero card for that name shows the "Available now!" badge and the "Make It Yours" button (whois note, flow 2; `whois-flow2`) | positive | AC1, AC6 | UI automation |
| WHOIS-03 | Invalid input | Data-driven, one input per rule class (Input validation): empty, spaces only, `mybakery`, `com`, `192.168.1.1`, `goo_gle.com`, `goo gle.com`, `goo@gle.com`, `google..com`, `-google.com` → for each, an error message for that input `<TBD in exploration>` | negative | AC1 | UI automation |
| WHOIS-07 | Label length boundary | 63-character label + `.com` → a clear answer (registered or available). 64-character label + `.com` → error `<TBD in exploration>` | edge | AC1 | UI automation |
| WHOIS-08 | Availability call fails | `check-domain-availability` made to fail on the entry page (`page.route`, 503) → the page shows an error state `<TBD in exploration>` (Integration aspect) | edge | AC1 | UI automation |
| WHOIS-09 | Taken: WHOIS vs. API | `google.com`: taken-message check passes on WHOIS; API `available: false` | positive | AC2 | UI automation + API check |
| WHOIS-10 | Free: WHOIS vs. API | Random name: WHOIS lands on the hero card with "Available now!"; API `available: true` | positive | AC2 | UI automation + API check |
| WHOIS-11 | WHOIS double check | One search makes two `check-domain-availability` calls, on the entry page and on the results page (`ARCHITECTURE.md` §3) → both return the same `available` value | edge | AC2 | UI automation |
| WHOIS-13 | Reserved TLD | `mybakery.test` → ends on `/domain/result` with ".test domains aren’t available. Explore other options below or view available extensions." (whois note, flow 3; `whois-flow3`); API returns `400 INVALID_DOMAIN` (`api.md` row 4) | edge | AC2, AC3 | UI automation + API check |
| WHOIS-14 | TLD Wix doesn't sell | One unsold TLD (test data `<TBD in exploration>`), two names: a random one → a not-available message `<TBD in exploration>`, and the API returns an error or `available: false` for the same name, never `available: true`; a registered one → shown as registered, not as available (Q3, Q5 open) | negative | AC3, AC6 | manual → UI automation |
| WHOIS-18 | Registry lookup fails | `google.com`; the external RDAP servers, `parse-rdap` or `structured-domain-info/whois` made to fail (`page.route`) → page `/domain/result/whois`; taken-message check still passes (Integration aspect; real-world case `500 UNABLE_TO_LOOKUP_WHOIS`, `whois-flow3`) | edge | AC6 | UI automation |

Removed, numbers stay unused: WHOIS-04..06 (merged into WHOIS-03), WHOIS-12 (same 400 on both sides as API-08), WHOIS-15..17 (registration details: out of scope, the scope is the availability answer), WHOIS-19 (merged into WHOIS-14). WHOIS-18 kept in reduced form: only the registered answer is checked, not the details area.
AC3: 2 scenarios. Sold TLDs are covered by WHOIS-01 / -02.
AC6: 4 scenarios (WHOIS-01, -02, -14, -18). Registration details are out of scope, so only the registered / not-registered answer remains.

### Storefront door

AC5 and AC6 skipped: they apply to the generator and WHOIS only. Screen text from `docs/scenarios/storefront.md`; pages and calls from `ARCHITECTURE.md` §1. Entry page: `/domains`, field "Type the domain you want", button "Search Domains". Results page: `/domain/result`.

| ID | Title | Description (input → expected) | Type | AC | Execution |
|---|---|---|---|---|---|
| STORE-01 | Taken name | `google.com` → taken-message check passes (seen: "google.com is already registered. Explore some great alternatives below.", storefront note, flow 1) | positive | AC1 | UI automation |
| STORE-02 | Free name | Random name + `.com` → the hero card for that name shows the "Available now!" badge and the "Make It Yours" button (storefront note, flow 2) | positive | AC1 | UI automation |
| STORE-03 | Invalid input | Data-driven, one input per rule class (Input validation): empty, spaces only, `mybakery`, `com`, `192.168.1.1`, `goo_gle.com`, `goo gle.com`, `goo@gle.com`, `google..com`, `-google.com` → for each, an error message for that input `<TBD in exploration>`. `mybakery` may be treated as a keyword search instead: `<TBD in exploration>` | negative | AC1 | UI automation |
| STORE-04 | Label length boundary | 63-character label + `.com` → a clear answer (taken or available). 64-character label + `.com` → error `<TBD in exploration>` | edge | AC1 | UI automation |
| STORE-05 | Availability call fails | `check-domain-availability` made to fail on `/domain/result` (`page.route`, 503) → an error state for that name `<TBD in exploration>` (Integration aspect) | edge | AC1 | UI automation |
| STORE-07 | Taken: storefront vs. API | `google.com`: taken-message check passes on the storefront; API `available: false` | positive | AC2 | UI automation + API check |
| STORE-08 | Free: storefront vs. API | Random name: the hero card shows "Available now!"; API `available: true` | positive | AC2 | UI automation + API check |
| STORE-09 | Other extensions vs. API | For a taken name the storefront checks ~180 other extensions in bulk (`bulk/domain-availabilities/check`, 3 × 60, `ARCHITECTURE.md` §1). What the page shows for them is `<TBD in exploration>` (**Assumption** in `ARCHITECTURE.md`). For a sample of 3 extensions, the answer shown matches a single API check | edge | AC2 | manual |
| STORE-10 | Reserved TLD | `mybakery.test` → ".test domains aren’t available. Explore other options below or view available extensions." (storefront note, flow 3); API returns `400 INVALID_DOMAIN` (`api.md` row 4) | negative | AC2, AC3 | UI automation + API check |
| STORE-11 | Real TLD Wix doesn't sell | Random name + unsold TLD (test data `<TBD in exploration>`) → a not-available message `<TBD in exploration>`, and the API returns an error or `available: false` for the same name, never `available: true` (Q3 open) | negative | AC3 | manual → UI automation |

Removed, numbers stay unused: STORE-06 (second way to the same answer), STORE-12 (other extensions in sold TLDs; depends on STORE-09's exploration), STORE-13 (API key in web traffic: the web doors never had the key).
AC2: 4 scenarios (STORE-07..10). AC3: 2 scenarios; sold TLDs are covered by STORE-01 / -02.

### Business Name Generator door

AC1 skipped: excluded by Q2 (the generator never answers for a single name). AC2 skipped: the generator shows no availability, so there is nothing to compare between doors; its comparison with the API is AC5. AC6 skipped: WHOIS only.
Screen text from `docs/scenarios/generator.md`; pages and calls from `ARCHITECTURE.md` §2. Entry page: `/tools/business-name-generator`, text area "Describe your business", button "Generate Names". Results page: `/domain/result/bng`.
**Suggestion check** (used below): the first 10 suggested domains shown (`recommendations-content-list-item-N`), or all of them if fewer than 10 are shown, are read at run time; each returns `available: true` from the API. The page requests 10 (`suggest-domains`, `paging.limit=10`, generator note flow 2; 10 returned in every generator HAR).

| ID | Title | Description (input → expected) | Type | AC | Execution |
|---|---|---|---|---|---|
| GEN-01 | Famous-brand keyword | `google`, click "Generate Names" → a list of domain suggestions (generator note, flow 1); suggestion check passes | positive | AC5 | UI automation + API check |
| GEN-02 | Realistic description | `I own a small catering company` (the field's placeholder text) → suggestion check passes | positive | AC5 | UI automation + API check |
| GEN-04 | Input that is a domain with a reserved TLD | `mybakery.test` → a list of suggestions (generator note, flow 3); none of the first 10 ends in `.test`; suggestion check passes | edge | AC3, AC5 | UI automation + API check |
| GEN-06 | Empty description | Click "Generate Names" with the field empty → `<TBD in exploration>` | negative | AC5 | UI automation |
| GEN-07 | Symbols only | `@@@ ###` → `<TBD in exploration>`; if suggestions appear, suggestion check passes | negative | AC5 | UI automation + API check |
| GEN-08 | Suggestion call fails | `suggest-domains` made to fail (`page.route`, 503) → an error or empty state `<TBD in exploration>` (Integration aspect, optional) | edge | AC5 | UI automation |

Removed, numbers stay unused:
- GEN-03 (suggestions only in TLDs Wix sells). **Assumption:** a suggestion in an unsold TLD is caught by the suggestion check, because the API does not return `available: true` for an unsold TLD. Holds only if API-12 confirms it; if not, GEN-03 comes back.
- GEN-05 (300-character input limit): `maxlength="300"` is markup, not a requirement, and input length doesn't change whether a suggested domain is available.

AC3: 1 scenario. The generator gets a TLD only when the description itself looks like a domain.

## Detailed test cases

### API door

#### API-01 Taken name
- **Description:** a registered name is reported as not available. **Type:** positive. **AC:** AC1. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability; this header alone worked in `docs/scenarios/api.md` rows 1–6).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - `google.com` is registered (ICANN lookup).

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=google.com` with header `Authorization: <WIX_API_KEY>` | Status `200` |
| 2 | Read the body | `availability.domain` = `"google.com"`; `availability.available` = `false` (`api.md` row 1) |

#### API-02 Free name
- **Description:** an unregistered name is reported as available. **Type:** positive. **AC:** AC1. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability; this header alone worked in `api.md` rows 1–6).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - Random free name: 16 random lowercase letters generated at run time + `.com`. **Assumption:** not registered (chance negligible). Never regenerated on a `false` answer, which would hide a bug.

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=<random name>.com` with header `Authorization: <WIX_API_KEY>` | Status `200` |
| 2 | Read the body | `availability.domain` = the input; `availability.available` = `true` (`api.md` row 2) |

#### API-03 Response schema
- **Description:** the response matches the documented schema. **Type:** positive. **AC:** AC1. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - Random free name: 16 random lowercase letters generated at run time + `.com`. **Assumption:** not registered.

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=google.com` with header `Authorization: <WIX_API_KEY>` | Status `200` |
| 2 | Validate the body | Top level has `availability` (object). `availability.domain`: string, valid hostname. `availability.available`: boolean. `availability.premium`: boolean. `availability.premiumType`: one of `FIRST_YEAR_ONLY` or `FIRST_YEAR_AND_RENEWAL` (`api-reference.md`), or `UNKNOWN_PREMIUM_TYPE`. The last is observed (`api.md` rows 1–2) but not in the docs; it is logged as a doc gap and does not fail the test |
| 3 | `GET …/check-domain-availability?domain=<random name>.com` with header `Authorization: <WIX_API_KEY>` | Status `200` |
| 4 | Validate the body | As step 2 |

#### API-04 Missing `domain`
- **Description:** a request without a domain is rejected. **Type:** negative. **AC:** AC1. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, header `Authorization: <WIX_API_KEY>`. `domain` is required (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability` with no query parameters, header `Authorization: <WIX_API_KEY>` | Status `400` |
| 2 | Read the body | `message` = `"domain is not a valid hostname,domain must not be empty"`. `details.validationError.fieldViolations` contains `{field: "domain", violatedRule: "FORMAT", data.type: "HOSTNAME"}` and `{field: "domain", violatedRule: "REQUIRED_FIELD"}`. No `availability` field (`api.md` row 5) |
| 3 | `GET …/check-domain-availability?domain=` (empty value), header `Authorization: <WIX_API_KEY>` | Same as steps 1–2. **Assumption:** row 5 doesn't say which of the two forms was sent |

#### API-05 No TLD
- **Description:** a name without a TLD is rejected. **Type:** negative. **AC:** AC1. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=mybakery` with header `Authorization: <WIX_API_KEY>` | Status `400` |
| 2 | Read the body | `message` = `"INVALID_DOMAIN"`; `fieldViolations[0].field` = `"domain"`; `fieldViolations[0].description` = `"failed to extract root domain from mybakery, a tld is missing or invalid"` (pattern observed with `sdfsjgghg`, `api.md` row 3); no `availability` field |

#### API-06 Not a registrable name
- **Description:** a TLD alone or an IP address is rejected. **Type:** negative. **AC:** AC1. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=com` with header `Authorization: <WIX_API_KEY>` | Status `400`; no `availability` field; `message` `<TBD in exploration>` (**Assumption:** `INVALID_DOMAIN`) |
| 2 | Same request with `domain=.com` | As step 1 |
| 3 | Same request with `domain=192.168.1.1` | As step 1 |

#### API-07 Length boundary
- **Description:** the API's limit of 63 characters for the whole domain. **Type:** edge. **AC:** AC1. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>`. `domain` is 3–63 characters for the whole domain (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - Labels are random lowercase letters generated at run time.

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=<59-letter label>.com` (63 characters in total) with header `Authorization: <WIX_API_KEY>` | Status `200`; `availability.available` is a boolean |
| 2 | Same request with `domain=<60-letter label>.com` (64 characters) | Status `400`; no `availability` field; `message` `<TBD in exploration>` |
| 3 | Same request with `domain=<63-letter label>.com` (67 characters) | As step 2 |

#### API-08 Invalid characters and structure
- **Description:** names that break hostname rules are rejected. **Type:** negative. **AC:** AC1. **Execution:** API automation (data-driven).
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - The client URL-encodes `domain` (space → `%20`, `@` → `%40`).

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=goo_gle.com` with header `Authorization: <WIX_API_KEY>` | Status `400`; `message` = `"domain is not a valid hostname"`; `fieldViolations[0].violatedRule` = `"FORMAT"`, `data.type` = `"HOSTNAME"`; no `availability` field (`api.md` row 6) |
| 2 | Same request with `domain=goo gle.com` | As step 1 |
| 3 | Same request with `domain=goo@gle.com` | As step 1 |
| 4 | Same request with `domain=google..com` | As step 1 |
| 5 | Same request with `domain=-google.com` | As step 1 |

**Assumption:** `api.md` row 6 records one input, not which one; the same body is expected for all five.

#### API-09 IDN (non-ASCII)
- **Description:** records how the API treats an internationalised name. **Type:** edge. **AC:** AC1. **Execution:** manual.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>`. The docs say "Only alphanumeric characters, hyphens, and dots are supported" (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - The client sends `domain` as UTF-8, percent-encoded.

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=bäckerei.com` with header `Authorization: <WIX_API_KEY>` | Either status `200` with a boolean `availability.available`, or a `400` validation error; record which. A rejection is stricter than the RFC: an observation, not a bug |
| 2 | If step 1 returned 400: same request with the punycode form of the same name, computed at run time with an IDNA library | Status `200` with a boolean `availability.available` `<TBD in exploration>`; record it |

#### API-10 Answer vs. ICANN
- **Description:** the API's answer agrees with the registry for a taken name and a free name. **Type:** positive. **AC:** AC1. **Execution:** manual.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - Random free name: 16 random lowercase letters generated at run time + `.com`.
  - Browser access to https://lookup.icann.org/en.

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=google.com` with header `Authorization: <WIX_API_KEY>` | Status `200`; `availability.available` = `false` |
| 2 | Look up `google.com` at https://lookup.icann.org/en | Shown as registered; agrees with step 1 |
| 3 | `GET …/check-domain-availability?domain=<random name>.com` with header `Authorization: <WIX_API_KEY>` | Status `200`; `availability.available` = `true` |
| 4 | Look up `<random name>.com` at https://lookup.icann.org/en | Not found / not registered; agrees with step 3. If ICANN shows it as registered while the API says `available: true`, that's a strong bug signal |

#### API-11 Reserved TLD
- **Description:** a reserved TLD is rejected. **Type:** edge. **AC:** AC3. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - `.test` is reserved (RFC 2606 / 6761).

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=mybakery.test` with header `Authorization: <WIX_API_KEY>` | Status `400` |
| 2 | Read the body | `message` = `"INVALID_DOMAIN"`; `fieldViolations[0].field` = `"domain"`; `fieldViolations[0].description` = `"failed to extract root domain from mybakery.test, a tld is missing or invalid"`; no `availability` field (`api.md` row 4) |

#### API-12 Real TLD Wix doesn't sell
- **Description:** a name in a TLD that exists but that Wix doesn't sell is not reported as available. **Type:** negative. **AC:** AC3. **Execution:** manual, then API automation once the TLD is known.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - An unsold TLD is chosen: in the IANA root zone and not on https://www.wix.com/domains/tld-list (test data `<TBD in exploration>`).
  - Random name: 16 random lowercase letters generated at run time.

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=<random name>.<unsold TLD>` with header `Authorization: <WIX_API_KEY>` | Either status `400` (`message` `<TBD in exploration>`) or status `200` with `availability.available` = `false`. Never `available: true` (Q3) |
| 2 | Record the outcome | Decides whether GEN-03 comes back (Business Name Generator door) |

#### API-14 Same name, repeated
- **Description:** repeated checks of the same name give the same answer. **Type:** edge. **AC:** AC2. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain`, header `Authorization: <WIX_API_KEY>` (`docs/api-reference.md`, Check Domain Availability).
  - `WIX_API_KEY` is read from the git-ignored `.env`. It is never printed, logged or attached (`CLAUDE.md`).
  - Random free name: 16 random lowercase letters generated at run time + `.com`. **Assumption:** not registered, and not bought during the test (Q4).

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=google.com` with header `Authorization: <WIX_API_KEY>`, 5 times in a row with no delay | Every response: status `200`, `availability.available` = `false` |
| 2 | Same request with `domain=<random name>.com`, 5 times in a row with no delay | Every response: status `200`, `availability.available` = `true`. All 10 calls finish within 1 minute (Q4) |

#### API-15 Missing API key
- **Description:** a request without a key gets no answer. **Type:** negative. **AC:** Security aspect. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain` (`docs/api-reference.md`, Check Domain Availability). The docs don't describe the error for a missing key.
  - No key is used.

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=google.com` with no `Authorization` header | Status `<TBD in exploration>` (**Assumption:** 401 or 403); no `availability` field |

#### API-16 Invalid API key
- **Description:** a request with an invalid key gets no answer. **Type:** negative. **AC:** Security aspect. **Execution:** API automation.
- **Preconditions:**
  - Endpoint: `GET https://www.wixapis.com/domain-search/v2/check-domain-availability`, query parameter `domain` (`docs/api-reference.md`, Check Domain Availability). The docs don't describe the error for an invalid key.
  - The real key is not used.

| # | Action | Expected result |
|---|---|---|
| 1 | `GET …/check-domain-availability?domain=google.com` with header `Authorization: invalid-key` | Status `<TBD in exploration>` (**Assumption:** 401 or 403); no `availability` field |

### WHOIS door

#### WHOIS-01 Taken name
- **Description:** a registered name is reported as registered. Input `google.com` → the WHOIS results page with the taken message. **Type:** positive. **AC:** AC1, AC6. **Execution:** UI automation.
- **Preconditions:**
  - Chromium, signed out, new browser context (no cookies), as in the recordings (`docs/scenarios/whois.md` header: signed in "no").
  - `google.com` is registered (ICANN lookup).
  - The cookie banner may be shown. It is left open: it didn't block the recorded flow (whois note, flow 1, step 2).
  - Start: https://www.wix.com/domains/whois, top of the page.
  - Never click anything past the result (no "Get It" on alternative cards); never go to cart or checkout (`CLAUDE.md`).
  - **Taken-message check:** the result message for the searched name contains the searched name and at least one of `registered` / `taken` / `unavailable`. Case-insensitive, scoped to the message element; the exact wording is not asserted.

| # | Action | Expected result |
|---|---|---|
| 1 | Open https://www.wix.com/domains/whois | The page loads with the text "Free WHOIS lookup", the text field "Enter a domain name or URL" and the "Search Domains" button (whois note, flow 1, step 1) |
| 2 | Fill the "Enter a domain name or URL" field with `google.com` | The field shows `google.com` |
| 3 | Click "Search Domains" | The URL path becomes `/domain/result/whois` (`ARCHITECTURE.md` §3; `whois-flow1`) |
| 4 | Read the result message: the text that contains the searched name in bold | Taken-message check passes for `google.com`. Wording seen: "google.com is registered. Explore some great alternatives below." (whois note, flow 1, step 4) |

#### WHOIS-02 Free name
- **Description:** an unregistered name is reported as available. Input: a random name → the storefront results page with the hero card for that name. **Type:** positive. **AC:** AC1, AC6. **Execution:** UI automation.
- **Preconditions:**
  - Chromium, signed out, new browser context (no cookies), as in the recordings (`docs/scenarios/whois.md` header: signed in "no").
  - Random free name: 16 random lowercase letters generated at run time + `.com`. **Assumption:** not registered (chance negligible). Never regenerated on a "taken" answer, which would hide a bug.
  - The cookie banner may be shown. It is left open: it didn't block the recorded flow (whois note, flow 2, step 2).
  - Start: https://www.wix.com/domains/whois, top of the page.
  - Never click "Make It Yours" or anything past the result; never go to cart or checkout (`CLAUDE.md`).

| # | Action | Expected result |
|---|---|---|
| 1 | Open https://www.wix.com/domains/whois | The page loads with the text field "Enter a domain name or URL" and the "Search Domains" button (whois note, flow 1, step 1) |
| 2 | Fill the "Enter a domain name or URL" field with `<random name>.com` | The field shows `<random name>.com` |
| 3 | Click "Search Domains" | The URL path becomes `/domain/result` (the storefront's results page), with the searched name in the `q` query parameter (whois note, flow 2, step 4; `whois-flow2`) |
| 4 | Find the hero card: the card whose visible `<h1>` heading equals `<random name>.com` | Shown. The visible `<h1>` has no data-hook; `data-hook="hero-card-title"` sits on a hidden copy and is not used (whois note, flow 2, step 4) |
| 5 | Read the badges on that hero card | The "Available now!" badge is shown (whois note, flow 2, step 4) |
| 6 | Read the call-to-action button on that hero card (`data-hook="hero-card-cta"`) | The "Make It Yours" button is shown and enabled. It is not clicked |
