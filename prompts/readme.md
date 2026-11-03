# Prompts: README.md

Run at wrap-up, after `TEST_PLAN.md`, `FINDINGS.md` and the tests exist.

## 1. Draft

> Read `TEST_PLAN.md`, `FINDINGS.md`, `ARCHITECTURE.md`, `package.json`, `playwright.config.ts` and the tests in `tests/`. Use only these files.
>
> Draft `README.md` with these sections, in this order:
>
> 1. **Time spent** — leave the placeholder `<total time: I fill this in>`. Add one line: prerequisites (rules, skills, HAR recordings, API reference) were prepared before the first commit; `<prerequisite time: I fill this in>`.
> 2. **How to run the tests** — from a fresh clone: install, install Chromium, create `.env` with `WIX_API_KEY`, then the single command `npm test`. Also how to run one door by tag (`--grep @api`). Take commands only from `package.json` and `playwright.config.ts`.
> 3. **What is automated and why** — which test cases from `TEST_PLAN.md` are automated (by ID), which web door(s), and why these and not others. Use the execution-type rule and priorities from `TEST_PLAN.md`.
> 4. **What I'd do with another week** — prioritized list. Start from the "Out" items in the scope table of `TEST_PLAN.md`, the open `<TBD in exploration>` items and `FINDINGS.md`.
> 5. **Quality strategy for Wix Domains, in 5 lines** — exactly 5 lines.
> 6. **Repo map** — one line per top-level file / folder.
>
> Rules:
> - Every line refers to something in the repo or something observed. No generic QA advice.
> - Never include the API key or any token.
> - Keep it to one screen per section.

## 2. Attack

> Go through the README line by line. Flag: (a) any line I couldn't defend with a concrete example from this repo, (b) any command that doesn't match `package.json` / `playwright.config.ts`, (c) any claim about coverage that the tests don't support. Don't rewrite; list the lines and why.
