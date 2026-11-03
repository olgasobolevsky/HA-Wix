# Scenario notes: Business Name Generator

- **URL:** https://www.wix.com/tools/business-name-generator
- **Recorded on:** 03/11/2026 time
- **Browser:** Chrome
- **Signed in:** no
- **Location / currency shown:** Israel
- **HAR file (local, not committed):** docs\har\raw\generator-flow1, docs\har\raw\generator-flow2, docs\har\raw\generator-flow3

User actions are pre-filled and are **assumptions** until recorded; adjust names to what the page shows.
The generator takes a business name / keywords, not a domain (Q2), so the input is the bare label.
Never write cookies, tokens or session values here (check query strings too).

## Flow 1: taken name (`google`)

| # | User action | Call (method + route) | Status | Key response fields | What changed on screen |
|---|---|---|---|---|---|
| 1 | Open https://www.wix.com/tools/business-name-generator | GET https://manage.wix.com/_api/wix-html-login-webapp/user/getUserDetails , GET https://www.wix.com/tools/business-name-generator/_api/v1/access-tokens?cacheBust=<redacted>  |200,200 |`{"errorCode": -15, "errorDescription": "[business][RECOVERABLE][framework security] c.w.f.s.WixSessionNotFoundException - Session not found", "success": false, "payload": null}`, `{"hs": "<redacted>", "visitorId": "<redacted>", "svSession": "<redacted>", "ctToken": "<redacted>", "mediaAuthToken": "<redacted>", "metaSiteId": "<redacted>", "apps": {"db0d9f2a-7c27-4892-ad14-3adedb06b121": {"instance": "<redacted>", "intId": 7518, "accessToken": "<redacted>"}, "e593b0bd-b783-45b8-97c2-873d42aacaf4": {...` | page with test "Business Name Generator", text area with: `<label for="textarea_comp-mmj4r8oh6" class="P3lL3X wixui-text-box__label">Describe your business</label>` and `<textarea id="textarea_comp-mmj4r8oh6" class="XXgBXC has-custom-focus wixui-text-box__input" rows="1" placeholder="e.g. I own a small catering company… " aria-required="false" aria-invalid="false" maxlength="300"></textarea>`, and button `<button aria-disabled="false" aria-label="Generate Names" data-testid="buttonElement" class="PoVCDy wixui-button wixui-primary-button-hero primary-button-hero ZhVEJq"><span class="Gf1CuA wixui-button__label">Generate Names</span></button>`|
| 2 | Dismiss the cookie / consent banner (if shown) | banner element `<div data-hook="ccsu-banner-root" class="aspXfg" role="region" aria-label="Cookie Policy Information" aria-describedby="ccsu-banner-text-container"> <p id="ccsu-banner-text-container" class="Mu3mRO" data-hook="ccsu-banner-text-container"> <span data-hook="ccsu-banner-text">We use cookies to enhance your browsing experience, personalize content and ads, and analyze our traffic. To learn more, see our <a class="eGtXp3" data-hook="ccsu-cookie-policy-link" href="https://www.wix.com/about/cookie-policy" target="_blank">Cookie Policy</a>.</span> </p> <button class="WEzN4V R0_LWY" data-hook="ccsu-banner-decline" aria-label="close"><svg viewBox="0 0 23 23" fill="currentColor" width="23" height="23"><path d="M10.9393398,12 L6,7.06066017 C5.70710678,6.76776695 5.70710678,6.29289322 6,6 C6.29289322,5.70710678 6.76776695,5.70710678 7.06066017,6 L12,10.9393398 L16.9393398,6 C17.232233,5.70710678 17.7071068,5.70710678 18,6 C18.2928932,6.29289322 18.2928932,6.76776695 18,7.06066017 L13.0606602,12 L18,16.9393398 C18.2928932,17.232233 18.2928932,17.7071068 18,18 C17.7071068,18.2928932 17.232233,18.2928932 16.9393398,18 L12,13.0606602 L7.06066017,18 C6.76776695,18.2928932 6.29289322,18.2928932 6,18 C5.70710678,17.7071068 5.70710678,17.232233 6,16.9393398 L10.9393398,12 Z"></path></svg></button> </div>` |didn't dismiss | | |
| 3 | Type `google` in the business name / keyword field |- |- |- |the text in the text area "Describe your business"  |
| 4 | Click "Generate Names" | POST https://www.wix.com/_serverless/domains-serverless-services/v1/business-names/generate with payload `{"query":"google","excluding":[],"count":9}`, POST https://www.wix.com/_serverless/domains-serverless-services/v1/suggested-tld-display-prices| 200, 200 | `{"businessNames": [{"id": "zygo", "name": "Zygo", "reasoning": "Unique and fun, perfect for connectivity aspirations."}, {"id": "quest", "name": "Quest", "reasoning": "Represents exploration and limitless potential."}, {...`, `{"displayPrices": [{"tld": "com", "pricing": {"price": "₪0.00", "originalPrice": "₪21.47", "pricingStrategy": "FREE_FIRST_YEAR", "renewalPrice": "₪90.19"}}, {"tld": "net", "pricing": {"price": "₪0.00", "originalPrice": "₪40.73", "pricingStrategy": "FREE_FIRST_YEAR", "renewalPrice": "₪78.37"}...`| shows list of suggestions for domain name |
| 5 | Look at the suggestions; note the first one | | | | first suggest element: `<div data-hook="recommendations-content-list-item-0" class="wds-box wds-box--direction-horizontal wds-box--align-space-between wds-box--vertical-align-middle wds_1_343_0-box wds_1_343_0-box--direction-horizontal wds_1_343_0-box--align-space-between wds_1_343_0-box--vertical-align-middle GglK1Z" style="padding: 16px 24px; --wds-internal-box-gap: calc(var(--wds-space-100, 6px) * 4); overflow: hidden; border-radius: 12px;">...</div>`|
| 6 | Check a suggestion's domain availability, if the page offers it (stop before cart) | | | | no indication for availiability|

## Flow 2: free name (`sdfsjgghg`)

| # | User action | Call (method + route) | Status | Key response fields | What changed on screen |
|---|---|---|---|---|---|
| 1 | Open https://www.wix.com/tools/business-name-generator | same as in flow 1 | | | |
| 2 | Dismiss the cookie / consent banner (if shown) |same as in flow 1 | | |
| 3 | Type `sdfsjgghg` in the business name / keyword field |same as in flow 1 | | | |
| 4 | Click Generate | POST https://www.wix.com/_serverless/domains-serverless-services/v1/business-names/generate payload: `{"query":"sdfsjgghg","excluding":[],"count":9}`, POST https://www.wix.com/_serverless/domains-serverless-services/v1/suggested-tld-display-prices, GET https://www.wix.com/domain-search/v2/suggest-domains?query=Jumblify&paging.limit=10 |200, 200, 200 |`{"businessNames": [{"id": "jumblify", "name": "Jumblify", "reasoning": "Inventive and playful, evokes curiosity and excitement."}, {"id": "vibrant", "name": "Vibrant", "reasoning": "Simple yet powerful; stands out in any market."}...`, `{"displayPrices": [{"tld": "com", "pricing": {"price": "₪0.00", "originalPrice": "₪21.47", "pricingStrategy": "FREE_FIRST_YEAR", "renewalPrice": "₪90.19"}}, {...`, `{"suggestions": [{"domain": "jumblify.co.il", "premium": false}, {"domain": "thejumblify.com", "premium": false}...` | list of domain suggestions|
| 5 | Look at the suggestions; note the first one and its availability (E5) | | | | first suggestion element `<div data-hook="recommendations-content-list-item-0" class="wds-box wds-box--direction-horizontal wds-box--align-space-between wds-box--vertical-align-middle wds_1_343_0-box wds_1_343_0-box--direction-horizontal wds_1_343_0-box--align-space-between wds_1_343_0-box--vertical-align-middle GglK1Z" style="padding: 16px 24px; --wds-internal-box-gap: calc(var(--wds-space-100, 6px) * 4); overflow: hidden; border-radius: 12px;"><div class="wds-box wds-box--direction-horizontal wds-box--align-left wds_1_343_0-box wds_1_343_0-box--direction-horizontal wds_1_343_0-box--align-left" style="--wds-internal-box-gap: calc(var(--wds-space-100, 6px) * 3);">...</div>` |
| 6 | Check a suggestion's domain availability, if the page offers it (stop before cart) | same as flow 1| | | |

## Optional flow 3: reserved TLD (`mybakery.test`)

| # | User action | Call (method + route) | Status | Key response fields | What changed on screen |
|---|---|---|---|---|---|
| 1 | Open https://www.wix.com/tools/business-name-generator | same as flow 1 | | | |
| 2 | Type `mybakery.test` in the business name / keyword field | same as flow 1 | | | |
| 3 | Click Generate | list of calls:<br>POST https://www.wix.com/_serverless/domains-serverless-services/v1/business-names/generate payload: `{"query":"mybakery.test","excluding":[],"count":9}` response: 200 `{"businessNames": [{"id": "bakerya", "name": "Bakerya", "reasoning": "Inventive twist on traditional bakery delights."}...`<br>POST https://www.wix.com/_serverless/domains-serverless-services/v1/suggested-tld-display-prices payload: `{}` response: 200 `{"displayPrices": [{"tld": "com", "pricing": {"price": "₪0.00", "originalPrice": "₪21.47", "pricingStrategy": "FREE_FIRST_YEAR", "renewalPrice": "₪90.19"}}...`<br>GET https://www.wix.com/_serverless/premium-domains-serverless/domain-tlds/list-tlds response: 200 `{tlds: [,…], geoFilteringDisabled: false}`<br>GET https://www.wix.com/_api/user-domains/v1/user_domains/mybakery.test?domainName=mybakery.test response: 401 `{"message": "request is un-authenticated", "details": {"applicationError": {"code": "DOMAINS_UNAUTHENTICATED", "description": "UNAUTHENTICATED: Identity Context Validation failure"}}}`<br>GET https://www.wix.com/domain-search/v2/check-domain-availability?domain=mybakery.test response: 400 `{"message": "INVALID_DOMAIN", "details": {"validationError": {"fieldViolations": [{"field": "domain", "description": "failed to extract root domain from mybakery.test, a tld is missing or invalid"}]}}}` | | | |
| 4 | Look at the result | | | | list of suggestions|

## Observations
- Tech clues (framework, page type): 
- Consent banner (E11): 
- Anything unexpected: 
