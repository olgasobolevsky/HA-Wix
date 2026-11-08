---
name: playwright
description: Write Playwright + TypeScript tests from the detailed test cases in TEST_PLAN.md. Use when asked to automate test cases or write Playwright tests. Optional argument - one or more test case IDs.
argument-hint: "[test case IDs]"
---

# Playwright test creation

## Project values
Read [project.md](project.md) first. It holds this project's values: ID format, execution types, feature areas and tags, test root, config, UI notes, test data and forbidden actions. If the file or any field it lists as mandatory is missing, stop and ask for the values. Don't guess them.

## Input
- No argument: every detailed test case in `TEST_PLAN.md` whose execution type `project.md` lists as automatable.
- One or more IDs: only those cases.
- Source is **only** the detailed test cases in `TEST_PLAN.md` (request data, steps, expected results). If the file is missing, or an ID has no detailed test case or isn't automatable: stop and say so. Don't improvise steps.

## Flow — one test at a time
1. Before writing, look in `tests/helpers/` and the spec file of the feature area for existing helpers and fixtures. Reuse them; add new ones only when nothing fits.
2. Write one test.
3. Run a type check if the project has a `tsconfig` (e.g. `npx tsc --noEmit`). Fix errors before running the test.
4. Run only that test, once, by filtering on its ID (e.g. `npx playwright test -g "<ID>"`). Never run the whole suite here: it spends the API call budget and slows the feedback.
5. Report, in this order:
   - the test ID and title;
   - pass / fail;
   - the bug the test would catch;
   - on a fail: the reason, the suggested fix, and the path to the trace and screenshot (never paste a trace for a test that sends a secret).
6. Stop and wait for the user's review before the next test. Rerun only when the user asks.

## Example
Shape every test like this. Names, tag and paths are placeholders.
```ts
test('AREA-01 Short title', { tag: ['@area'] }, async ({ request }) => {
  let response: APIResponse;

  await test.step('Send the request (same wording as the case)', async () => {
    response = await request.get('/path', { params: { name: testData } });
  });

  await test.step('Check the result (same wording as the case)', async () => {
    expect(response.status()).toBe(200);       // status before body
    const body = await response.json();
    expect(typeof body.field).toBe('string');  // explicit field / type check
    expect(body.state).toBe('expected');
  });
});
```

## Every test
- Title starts with the case ID and carries the project's tags.
- Each step of the case is one `test.step`, same order and wording.
- Must be able to fail. When presenting the test, name the bug it would catch.
- Respect the project's API call budget, if it defines one.
- Comparisons across feature areas use `expect.soft`, so one mismatch doesn't hide the other areas' results.
- Generate fresh data per run. Don't hard-code data whose validity depends on external state: it goes stale and the test fails with no bug.
- Never perform actions the project forbids (see `project.md`).

## Structure
- TypeScript.
- Everything Playwright lives in the project's test root (default: the repo root): `package.json`, lock file, `playwright.config.ts`, `.env` and `.env.example`, `tests/`, and the generated `node_modules/`, `test-results/`, `playwright-report/`. Paths below are relative to it.
- One spec file per feature area. A cross-area test lives in the spec of the area it starts from.
- `tests/helpers/` — shared helpers only.
- `playwright.config.ts`: `baseURL` per project. Secrets come from a git-ignored env file resolved from the config's own folder, with an example file next to it, and are set once, in config or in the authenticated fixture. Fail clearly if a required secret is missing, only when the Playwright project that needs it runs.
- One documented command runs the suite.
- One tag per feature area. Tests that span areas carry each tag.
- No retries: a retry hides a flaky test instead of showing it. On failure keep trace (`retain-on-failure`) and screenshot (`only-on-failure`).
- Traces can record request headers: never attach or commit a trace from a test that sends a secret.

## Isolation
- Built-in `page` / `request` fixtures, or custom fixtures built on them: fresh context and page per test.
- No page or context shared across tests (no `beforeAll` page, no `describe.serial`); no manual `browser.newContext()` unless a test needs special settings.
- Every test can run alone.

## Authentication (UI and API)
- Authenticate once per run, not per file or per test, and reuse the session. Log in in a setup project or global setup, save the token or `storageState`, and reuse it. Logging in before every test is slow and can trip rate limits.
- Isolation still holds: each test gets a fresh context seeded from the saved `storageState`, or a fixture that sends the saved token.
- If the token can expire during a run, refresh it in the fixture; don't log in per test. A rejected token (401) must fail the test with its status, not be retried silently.
- The saved token or state file is a secret: keep it git-ignored and never print or attach it.
- Doesn't apply when there is no login step, such as a static API key.

## UI
- Locators: role / label first (`getByRole`, `getByLabel`), then visible text, then test id; CSS / XPath only as a last resort.
- Test id: take the attribute from `project.md` (default `data-testid`) when using `getByTestId`. If `playwright.config.ts` doesn't set `testIdAttribute` to it, set it once, in the `use` block of the Playwright project that runs UI tests, before writing the first test that needs it.
- Find the element from these sources, in this order, and build the locator from the first one that identifies it, using the locator priority above:
  1. The step wording in `TEST_PLAN.md`.
  2. The project's recorded UI notes, if any (see `project.md`).
  3. A live lookup, unless `project.md` turns it off: open the page, follow the test case steps up to the element, and read its roles and accessible names with `locator.ariaSnapshot()`. Never go past the project's forbidden actions.
- Recorded attributes are a snapshot: prefer accessible names and visible text over generated class names and ids, which change between builds.
- Check recorded notes for traps, such as an attribute on a hidden copy of the element. Use the visible element.
- Element not found in `TEST_PLAN.md`, the notes or the live lookup: don't guess, stop and ask.
- Don't silence a strict-mode error with `.first()` or `.nth()` unless the test case says which item. Refine the locator instead: otherwise the test can act on the wrong element and still pass.
- No `force: true` on actions. If an element isn't actionable, report that as a finding instead of bypassing the check.
- Web-first assertions: `await expect(locator).toHaveText(...)`, never `expect(await locator.textContent())`. They retry until the state is right; the second form reads once and is flaky.
- Simulate a failing dependency only by intercepting the request with `page.route`, inside the test. It tests the page's error handling, not a real outage, and applies to browser tests only.
  - Register the route before the action that triggers the call; otherwise the real call goes through and the test proves nothing.
  - Match one URL pattern, not a broad one like `**/*`, so unrelated requests keep working.
  - Never make a real call to the failing service; the mocked response replaces it.
  - Assert exactly what the test case says the page shows. If the case leaves the expected message undefined, stop and ask; don't guess it.
- For a condition that is not an element's state (for example a value a service reports after a delay), use `expect.poll` or `toPass` with an explicit timeout. Never write a sleep loop.
- No fixed waits (`waitForTimeout`): they are either too short or waste time. Never `networkidle`: pages with polling or analytics never go idle. Start waiting for the response that drives the result (from the project's recorded notes) together with the action, so the response can't arrive before the wait starts.

## API
- Assert the status code before the body.
- Schema checks are explicit field / type assertions (TypeScript types don't check at runtime). No validator library, no new dependencies.
- Assert the required fields and their types, not exact body equality or "no extra fields", unless the test case says so. APIs add fields over time; a whole-body comparison fails on a harmless addition and hides real failures behind noise.
- Use Playwright fixtures instead of global state. Wrap the authenticated `APIRequestContext`, base URL and data factories in custom fixtures (`test.extend`), in one file, `tests/helpers/fixtures.ts`, created by the first test that needs it. Specs import `test` from it. This gives dependency injection, automatic teardown and one place to change config.
- Secrets never appear in code, logs, test titles or reports.
