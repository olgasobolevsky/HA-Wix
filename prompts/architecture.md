# Prompts: ARCHITECTURE.md

Run after the scenario notes in `docs/scenarios/` are filled in from the HAR recordings.

## 1. Draft

> Read `docs/scenarios/storefront.md`, `docs/scenarios/generator.md`, `docs/scenarios/whois.md` , `docs/api-reference.md` and HAR files for the scenarios in folder `docs\har\raw`. Use only these files.
>
> The HAR files are the primary source for calls, their order, status, pages visited, response fields and tech clues; the scenario notes can miss calls and observations. Use the notes for what appeared on screen. When a note and a HAR disagree, follow the HAR and flag the gap.
> Read the HARs only with a script that prints method, route without query string, status, page and response fields. Never print headers, cookies, tokens, session values or query strings.
>
> Draft `ARCHITECTURE.md` for the four doors that answer "Can I get this name?": domain storefront, Business Name Generator, WHOIS lookup, public Domain Availability API.
>
> For each web door:
> - What it is made of (page type, framework or tech clues): from the HARs (script and service names, server headers, pages visited) and the Observations section. Any reading of the clues ("it's built with X") is an **Assumption**.
> - Which network calls it makes: method + route, in the order of the user flow, and on which page (entry page or results page).
> - What each call drives on the screen: match response fields to the screen text in the notes; where they don't match one-to-one, label it **Assumption**.
>
> Then:
> - How the doors relate to each other: shared calls, shared services, shared pages, or none. Compare routes and response fields across the HARs and notes.
> - How the doors relate to the public API: does any web door call the same service or return the same fields as `docs/api-reference.md`?
> - One Mermaid flowchart: doors → the services / routes they call → public API. Solid edges = observed; dotted edges = Assumption.
>
> Diagram styling:
> - One edge = one call. Each call is its own node (method + route); group call nodes in a subgraph per route prefix.
> - Label each edge with a short title of the action or result that triggers the call (e.g. "page load", "Search", "name taken", "show prices"), not with the call itself.
> - Give each door its own colour (entry page, results page and all its edges): storefront blue, Business Name Generator green, WHOIS orange. Call nodes grey; public API purple.
> - Use `classDef` + `class` for nodes and `linkStyle` for edges. Set the node text colour explicitly so it reads in GitHub dark mode.
> - Don't use Mermaid keywords as class or node names (e.g. `call`, `class`, `end`, `click`, `style`).
>
> Rules:
> - Every endpoint, field and relation cites its source: HAR file (e.g. `storefront-flow1`), scenario note + flow, or `docs/api-reference.md`.
> - Anything not in these files is labelled **Assumption**. Do not add endpoints, services or fields that aren't in the HARs or notes.
> - No cookies, tokens, session values or query-string IDs.
> - Keep it short: one section per door, one section for relations, one diagram.
> - Mermaid must render on GitHub.

## 2. Attack

> List every claim in `ARCHITECTURE.md` that is not directly supported by a HAR entry in `docs/har/raw/`, a line in `docs/scenarios/`, or `docs/api-reference.md`. Check HAR-backed claims against the HAR itself (read by script: method, route, status, page, response fields; never headers, cookies, tokens or query strings). Flag any claim whose cited source doesn't contain it. For each: quote the claim, say what is missing, and propose either a source, an **Assumption** label, or deletion. Don't rewrite the file.
