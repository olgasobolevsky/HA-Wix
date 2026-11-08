# Playwright skill: project values (Wix Domains)

The generic rules are in [SKILL.md](SKILL.md). This file holds only the values for this repo. To reuse the skill elsewhere, rewrite this file.

<!--
Fields in this file

Mandatory (SKILL.md has no default for these):
- Case ID format
- Automatable execution types
- Feature areas: name, tag and spec file for each
- Command that runs the suite
- Playwright projects: name, browser and base URL for each
- Secrets: variable name and where it is set, or "none"
- Forbidden actions, or "none"

Additional (leave out if not needed):
- Not automatable execution types (anything not listed as automatable is treated the same)
- Cross-area rules: tagging example, which spec a cross-area test goes in
- Test root (default: the repo root)
- Shared helpers list
- API call budget
- UI notes: location, attributes to read, comment rule, generated names to avoid, known traps
- Test id attribute (default: `data-testid`): the attribute `getByTestId` reads. Set it when the app marks elements with another attribute (e.g. `data-hook`). The Playwright config then sets `testIdAttribute` to it once, and `getByTestId` matches only that attribute, so list here which elements still carry the other one.
- Live lookup (default: on)
- Test data and state: state names, how fresh data is generated
-->

## Test cases
- Case ID format: `<AREA>-<NN>`, e.g. `STORE-03`, `API-01`.
- Automatable execution types: `UI automation`, `API automation`, `UI automation + API check`.
- Not automatable: `manual`.

## Feature areas (doors)
| Area | Tag | Spec file |
|---|---|---|
| Storefront | `@store` | `tests/web/storefront.spec.ts` |
| Business Name Generator | `@gen` | `tests/web/generator.spec.ts` |
| WHOIS | `@whois` | `tests/web/whois.spec.ts` |
| Public API | `@api` | `tests/api/api.spec.ts` |

- Cross-door tests carry both tags (e.g. `@store @api`).
- Cross-door UI + API checks live in the web file of the door they start from.

## Layout and commands
- Test root: `automation/`. Nothing Playwright-related at the repo root.
- Run: `npm test`, from `automation/`.
- Shared helpers in `tests/helpers/`: consent banner, random free name.

## Config
| Playwright project | Browser | Base URL |
|---|---|---|
| `api` | none | `https://www.wixapis.com` |
| `web` | Chromium only | `https://www.wix.com` |

- Secret: `WIX_API_KEY`, from `automation/.env` (`.env.example` next to it).
- Set once via `extraHTTPHeaders` on the `api` project.
- `api-setup` fails clearly if the key is missing and runs only together with `api`.

## API call budget
No loops over inputs, a small fixed number of API calls per test, no bulk or parallel requests.

## UI notes
- Location: `docs/scenarios/*.md` (the HTML pasted per step).
- Attributes to read: label text, placeholder, `aria-label`, `role`, `data-testid`, `data-hook`.
- Test id attribute: `data-hook`.
- Don't reference scenario files in test comments. A comment may explain a non-obvious locator (e.g. markup without a role) without naming its source.
- Generated, don't use: class names `wds_1_343_0-*`, `StylableButton…`, `has-custom-focus`; ids `input_comp-…`, `textarea_comp-…`.
- Known trap: `data-hook="hero-card-title"` sits on a hidden copy of the title (`docs/scenarios/storefront.md` F2). Use the visible element.
- Live lookup: on.

## Test data and state
- States to assert: available / taken.
- A fresh random free domain name per run. No hard-coded "free" names.

## Forbidden actions
Never go past the search result: no add to cart, no checkout.
