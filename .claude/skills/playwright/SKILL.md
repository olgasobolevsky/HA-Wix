---
name: playwright
description: Write Playwright + TypeScript tests for the Wix Domains QA assignment from the detailed test cases in TEST_PLAN.md. Use when asked to automate test cases or write Playwright tests. Optional argument - one or more test case IDs (e.g. STORE-03 API-01).
argument-hint: "[test case IDs]"
---

# Playwright test creation

## Input
- No argument: every detailed test case in `TEST_PLAN.md` with execution type `UI automation`, `API automation` or `UI automation + API check`.
- One or more IDs: only those cases.
- Source is **only** the detailed test cases in `TEST_PLAN.md` (request data, steps, expected results). If an ID has no detailed test case, or its execution type is `manual`: stop and say so. Don't improvise steps.

## Flow — one test at a time
1. Write one test.
2. Run it once.
3. Report pass / fail.
4. Wait for my review before the next test. Rerun only when I ask.

## Every test
- Title starts with the case ID (e.g. `STORE-03 ...`) and carries door tags.
- Each step of the case is one `test.step`, same order and wording.
- Must be able to fail. When presenting the test, name the bug it would catch.
- API call budget: no loops over inputs, a small fixed number of API calls per test, no bulk or parallel requests.

## Structure
- TypeScript.
- Everything Playwright lives in `automation/` at the repo root: `package.json`, lock file, `playwright.config.ts`, `.env` and `.env.example`, `tests/`, and the generated `node_modules/`, `test-results/`, `playwright-report/`. Nothing Playwright-related at the repo root. Paths below are relative to `automation/`.
- `tests/api/api.spec.ts`; `tests/web/storefront.spec.ts`, `generator.spec.ts`, `whois.spec.ts` (cross-door UI + API checks live in the web file of the door they start from).
- `tests/helpers/` — shared helpers only (consent banner, random free name).
- `playwright.config.ts`: `api` project (no browser) and `web` project (Chromium only); `baseURL`; key from `automation/.env` (resolved from the config's own folder; `.env.example` next to it) set once via `extraHTTPHeaders` on the `api` project, failing clearly if `WIX_API_KEY` is missing (only when the `api` project runs).
- Single command: `npm test`, run from `automation/`.
- Tags per door: `@store`, `@gen`, `@whois`, `@api`. Cross-door tests carry both (e.g. `@store @api`).
- No retries. On failure keep trace (`retain-on-failure`) and screenshot (`only-on-failure`).

## Isolation
- Built-in `page` / `request` fixtures: fresh context and page per test.
- No page or context shared across tests (no `beforeAll` page, no `describe.serial`); no manual `browser.newContext()` unless a test needs special settings.
- Every test can run alone.

## UI
- Locators: role / label first (`getByRole`, `getByLabel`), then visible text, then test id; CSS / XPath only as a last resort.
- Locator source: the step wording in `TEST_PLAN.md` first. If it doesn't pin down the element, look up the recorded element in `docs/scenarios/*.md` (the HTML pasted per step: label text, placeholder, `aria-label`, `role`, `data-testid`, `data-hook`) and build the locator from it, still in the order above. Don't reference scenario files in test comments; a comment may explain a non-obvious locator (e.g. markup without a role) without naming its source.
  - Recorded attributes are a snapshot: prefer accessible names and visible text over generated class names (`wds_1_343_0-*`, `StylableButton…`, `has-custom-focus`) and generated ids (`input_comp-…`, `textarea_comp-…`).
  - Check the recording notes for traps, e.g. a `data-hook` that sits on a hidden copy of the element (`hero-card-title` in `docs/scenarios/storefront.md` F2): use the visible element.
  - Neither `TEST_PLAN.md` nor `docs/scenarios/` has the element → don't guess; stop and ask.
- Web-first assertions: `await expect(locator).toHaveText(...)`, never `expect(await locator.textContent())`.
- No fixed waits (`waitForTimeout`) and never `networkidle`. Start waiting for the response that drives the result (from `docs/scenarios/`) together with the action.
- Assert on state (available / taken), not marketing copy.
- Cross-door comparisons use `expect.soft`.
- A fresh random free name per run; no hard-coded "free" names.
- Never go past the search result: no add to cart, no checkout.

## API
- Assert the status code before the body.
- Schema checks are explicit field / type assertions (TypeScript types don't check at runtime). No validator library, no new dependencies.
- The key never appears in code, logs, test titles or reports.
