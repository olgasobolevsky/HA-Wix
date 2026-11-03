# Scenario notes: Domain Availability API (public)

- **Endpoint:** `GET https://www.wixapis.com/domain-search/v2/check-domain-availability?domain=<name>`
- **Docs:** <!-- paste the docs URL -->
- **Auth:** `Authorization: <API key>` header (key lives only in `.env`; never paste it here)
- **Run on:** <!-- date / time -->
- **Client:** `scripts/check_availability.py` (Python `requests`)

Never write the API key, tokens or full request headers here.

## Experiments

| # | Input (`domain=`) | Purpose | Status | Response body (trimmed) | Notes / compare with UI |
|---|---|---|---|---|---|
| 1 | `google.com` | taken name |200 |{"availability":{"domain":"google.com","available":false,"premium":false,"premiumType":"UNKNOWN_PREMIUM_TYPE"}} | \the call sent with
    params={"domain": DOMAIN},
    headers={"Authorization": API_KEY}|
| 2 | `sdfsjgghg.com`| random name - free domain |200 | {"availability":{"domain":"sdfsjgghg.com","available":true,"premium":false,"premiumType":"UNKNOWN_PREMIUM_TYPE"}} | |
| 3 | `sdfsjgghg`| without tld |400 | {"message":"INVALID_DOMAIN","details":{"validationError":{"fieldViolations":[{"field":"domain","description":"failed to extract root domain from sdfsjgghg, a tld is missing or invalid"}]}}} | |
| 4 |`mybakery.test`| reserved tld |400 | {"message":"INVALID_DOMAIN","details":{"validationError":{"fieldViolations":[{"field":"domain","description":"failed to extract root domain from mybakery.test, a tld is missing or invalid"}]}}} | |
## Observations

- 
