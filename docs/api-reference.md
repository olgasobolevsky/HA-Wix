# API reference: Domain Search v2 (Availability + Suggestion)

Local copy of the facts the test plan, tests and architecture analysis rely on.
**Fetched:** Availability 2026-11-02; Suggestion 2026-11-03. Both from the `.md` versions of the pages below, via an AI fetch tool, so check against the live pages before relying on a detail.
Anything not on these pages is marked **Assumption**.

Sources, Availability v2:
- Introduction: https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/availability-v2/introduction
- Check Domain Availability: https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/availability-v2/check-domain-availability
- Error Messages: https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/availability-v2/error-messages
- Sample Flows: https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/availability-v2/sample-flows

Sources, Suggestion v2:
- About the Suggestion API: https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/suggestion-v2/about-the-suggestion-api
- Suggest Domains: https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/suggestion-v2/suggest-domains
- Error Messages: https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/suggestion-v2/error-messages

## Check Domain Availability

"Checks whether the given domain is available for purchase. You can purchase the specified domain in case the returned `availability.available` boolean is `true`. The domain is already taken when `false` is returned."

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `https://www.wixapis.com/domain-search/v2/check-domain-availability` |
| Query parameter | `domain` (required) |
| Auth | Account-level API key. Docs example: `-H 'Authorization: <AUTH>'` |

Docs example:
```
curl -X GET 'https://www.wixapis.com/domain-search/v2/check-domain-availability?domain=mydomain.com' \
  -H 'Authorization: <AUTH>'
```

### Request: `domain`
- "Domain name. Must include the TLD. For example, `my-new-domain.com`."
- "Only alphanumeric characters, hyphens, and dots are supported."
- **Min 3, max 63 characters** — for the whole domain, not per label (stricter than RFC 1035's 63 per label / 253 total).
- Validation: `format HOSTNAME`.

### Response: `CheckDomainAvailabilityResponse`
| Field | Type | Description (from docs) |
|---|---|---|
| `availability` | object (`DomainAvailability`) | Information about the domain's availability. |
| `availability.domain` | string (hostname) | Domain name including TLD. |
| `availability.available` | boolean | `true` = can be purchased; `false` = already taken. |
| `availability.premium` | boolean | Whether the domain has a higher price due to its perceived value or demand. |
| `availability.premiumType` | enum | `FIRST_YEAR_ONLY` (only the initial price is premium) or `FIRST_YEAR_AND_RENEWAL` (initial and renewal prices are premium). Set "in case the domain is premium". |

No price or currency in the response.

### Errors (documented)
| HTTP status | Error code | Message | Troubleshooting |
|---|---|---|---|
| `INVALID_ARGUMENT (400)` | `INVALID_DOMAIN` | Failed to extract root domain from `<domain>`, or TLD is missing or invalid. | Include a domain name and supported TLD, separated by a dot, e.g. `my-new-domain.com`. |

Not documented: errors for a missing / invalid API key (401 / 403?), over-length or invalid-character input, rate limits → `<TBD in exploration>`.

## Suggest Domains

"Suggests domains that are available for purchase, based on the provided `query` input. You may use this endpoint to get inspired and then call Check Domain Availability to check whether a specific variation of the suggestions is also available for purchsase." (typo as on the page)

"Important: This call requires an account level API key and cannot be authenticated with the standard authorization header." Same wording as Check Domain Availability.

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `https://www.wixapis.com/domain-search/v2/suggest-domains` |
| Required | `query` |
| Auth | Account-level API key. Docs example: `-H 'Authorization: <AUTH>'` |

Docs example:
```
curl -X GET \
'https://www.wixapis.com/domain-search/v2/suggest-domains?query=my%20stunning%20domain&paging.limit=4&tlds=com&tlds=love' \
-H 'Authorization: <AUTH>'
```

### Request: query parameters
| Parameter | Type | Rules (from docs) |
|---|---|---|
| `query` (required) | string | "Input to base your domain suggestions on. May include letters, numbers, spaces, dots, and hyphens. Must not include the TLD." **Min 1, max 100 characters.** |
| `tlds` | array of string | Without the dot (`com`, not `.com`). **Max 10 TLDs**, each max 63 characters. "Not all TLDs can be connected to Wix sites. Supported TLDS include `com`, `net`, and `org`." Repeated param in the example: `tlds=com&tlds=love`. |
| `paging.limit` | integer | Max number of domains to return. Description says "Min: `0` Max: `50`", validation says minimum 1, maximum 50. No default stated. |
| `paging.cursor` | string | Cursor from the previous response's `pagingMetadata`; not needed for the first request. Max length 10000. |
| `maxLength` | integer | Max characters for the domain name, excluding the TLD. **Min 3, max 63, default 63.** |
| `limit` | integer | **Deprecated**: "This field will be removed on March 1, 2025. Use `paging.limit` instead." Min 1, max 20, default 10. |

### Response: `SuggestDomainsResponse`
| Field | Type | Description (from docs) |
|---|---|---|
| `suggestions[]` | array (`DomainSuggestion`) | "List of suggested available domains." |
| `suggestions[].domain` | string (hostname) | Suggested domain name including TLD. |
| `suggestions[].premium` | boolean | Whether the domain has a higher price due to its perceived value or demand. |
| `pagingMetadata.count` | integer | Number of domains returned in the response. |
| `pagingMetadata.cursors.next` / `.prev` | string | Cursors to the next / previous page. "Returned if cursor paging is used." |
| `pagingMetadata.hasNext` | boolean | `true` if there are more results after this page. |

No price, currency or `premiumType` in the response.

### Errors (documented)
| HTTP status | Error code | Message | Troubleshooting |
|---|---|---|---|
| `INVALID_ARGUMENT (400)` | `INVALID_QUERY` | Query `<query>` has invalid characters. Only alphanumeric values, hyphens, dots, and spaces are supported. | Use only alphanumeric values, hyphens, dots, and spaces. |
| `INVALID_ARGUMENT (400)` | `INVALID_TLD_FORMAT` | At least one element of the `tlds` array has an invalid format. | TLDs must not include the dot, e.g. `com`, not `.com`. |
| `INVALID_ARGUMENT (400)` | `TLD_NOT_SUPPORTED` | Unsupported TLDs `<tlds>` found. | Use supported TLDs such as `com`, `net`, and `org`. |

Not documented: errors for a missing / invalid API key, over-length `query` (> 100), `tlds` over 10, `paging.limit` out of range, `maxLength` out of range, an invalid cursor, rate limits → `<TBD in exploration>`.

## Open points (not on these pages)
- **Auth wording conflict:** the page says the call "requires an account level API key and cannot be authenticated with the standard authorization header", yet the example uses `Authorization: <AUTH>`. Verify which header carries the key.
- **Assumption:** account-level calls may also need a `wix-account-id` header. Not on these pages; check the API key docs (https://manage.wix.com/account/api-keys / Wix API key auth docs) before writing tests.
- **Assumption:** the premium fields may be omitted (rather than `false` / null) for non-premium domains. Verify from a real response.
- **Suggest Domains, `paging.limit` range:** the page says "Min: `0`" in the description but "minimum 1" in validation. No default is stated for `paging.limit`, only for the deprecated `limit` (10). Check what the API does with 0 and with no limit.
- **Suggest Domains, deprecated `limit`:** the stated removal date (March 1, 2025) has passed, but the field is still on the page. **Assumption:** it may be ignored or rejected now; verify.
- **Suggest Domains, "available":** the page says suggestions are "available for purchase", yet also suggests calling Check Domain Availability on them. **Assumption:** a suggestion may not be available at the moment of purchase; check by calling Check Domain Availability on returned suggestions.
- **Suggest Domains, `query` content:** "May include … dots" but "Must not include the TLD". The page doesn't say what happens with `query=google.com`; verify.
