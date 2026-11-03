# Test plan decisions (copy verbatim into TEST_PLAN.md)

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

## Acceptance criteria
Source: the task description. Domain basics are information, not requirements.
Risk = impact × likelihood. Priority = risk, unless the override rule applies (then the reason says so). Scale: H / M / L.
**Override rule:** the core business path (answering "Can I get this name?") is H priority regardless of likelihood.
Likelihood is an **Assumption** until checked against `ARCHITECTURE.md` (gate 1).

| # | Acceptance criterion | Impact | Likelihood | Risk | Priority | Reason |
|---|---|---|---|---|---|---|
| AC1 | For a valid full domain name, each door gives a clear answer: can get it, or can't | H | L | M | H | Core business value: it is the product's one promise. Override rule applies — likelihood is low because the path is heavily used, but if it breaks, nothing else matters. |
| AC2 | All doors give the same availability answer for the same name at the same moment | H | M | H | H | A wrong answer loses a sale or breaks trust at checkout; separate doors may use separate services or caches. |
| AC3 | A name in a TLD Wix doesn't sell is shown as unavailable or not purchasable | M | M | M | M | The user is told "yes" and fails later; TLD lists can drift between doors. |
| AC5 | Generator suggestions shown as available are available according to the API | M | M | M | M | A taken suggestion frustrates the user; suggestions are generated and may be pre-computed or cached. |
| AC6 | WHOIS shows a registered name as registered and an unregistered name as not registered | M | L | L | L | An information door, not a purchase path; it reads registry data directly. |

(AC4 premium and AC7 API contract were removed: Domain basics are information, not requirements.)

## Aspects
1. **Functionality** — the four doors answer "is this name available?" and the answers are consistent. Includes AC2, AC5 and input validation.
2. **Schema validation** — public API only, from `docs/api-reference.md` (not the web doors' internal calls).
3. **Integration** — only dependencies shown in `ARCHITECTURE.md`.
4. **Security** — API key cases (missing / invalid key); the key never appears in web door traffic. No brute force.
5. **Concurrency** — considered, mostly not implemented (needs purchases or parallel load). Executable slice: the same name checked several times in a row, and on two doors close together.

## Oracles
- **API** is the reference for cross-door comparisons.
- **ICANN lookup** (https://lookup.icann.org/en) — registered vs not registered only. Registered at ICANN but available on Wix → strong bug signal. Unregistered at ICANN but unavailable on Wix → usually expected (unsold TLD, reserved name). No data for many ccTLDs (e.g. `.co.il`). Manual, few lookups, never in a test loop.
- **Wix TLD list** (https://www.wix.com/domains/tld-list) — reference for AC3, and itself a consistency point.

## Open questions
- **Critical:** without an answer, no expected result can be written for at least one scenario.
- **Non-critical:** the scenario can be written with a labelled assumption, verified during exploration.

| # | Open question | Rating | Decision |
|---|---|---|---|
| Q1 | What should a door do with `GOOGLE.COM`, ` google.com `, `www.google.com`, `https://google.com`: normalize or reject? | Critical | Normalization is out of scope. Validation of invalid input is in scope. |
| Q2 | The generator takes a business name, not a domain. What is "the name" in AC1 for that door? | Critical | The generator's first suggestion (observed) is used as the name for AC1 tests. It is generated, so tests read it at run time. |
| Q3 | For a TLD Wix doesn't sell: API "unavailable" or error? Storefront "not available" or "we don't sell this"? | Non-critical | Placeholder `<error message: TBD in exploration>`. The API docs list `400 INVALID_DOMAIN` for a "missing or invalid" TLD (`docs/api-reference.md`). |
| Q4 | What does "the same moment" in AC2 mean? | Non-critical | Checks run one after another (< 1 min). **Assumption:** the test domain is not sold during the test. |
| Q5 | What should WHOIS show for invalid input or a TLD Wix doesn't sell? | Non-critical | Invalid input: placeholder `<error message: TBD in exploration>`. Unsold TLD: **Assumption:** WHOIS behaves as for any TLD (registered → redacted details, unregistered → not registered); verify in exploration. |
| Q6 | When doors disagree, which one is right? | Non-critical | Any disagreement **between Wix doors** is a bug. Severity is decided manually against a third party (another door, ICANN). Wix vs ICANN differences are not automatically bugs (see AC3). |

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
| `mybakery` (API only) | no TLD — the API requires one; storefront / generator may treat it as a keyword |
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

## Test data
- Taken: `google.com` (neutral; `wix.com` avoided as a baseline because Wix may handle its own domain specially).
- Free: a random name generated at run time.
- Unsold TLD (AC3): `<TBD in exploration>` — a real TLD in the IANA root zone that is not on the Wix TLD list.
