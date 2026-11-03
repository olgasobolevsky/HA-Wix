# Domain basics

Source: the assignment text ("QA Engineer, Wix Domains: Home Assignment", section "Domain basics"), quoted verbatim.
Information about expected system behaviour, not requirements. Used to tell expected behaviour from bugs.

> This is context, not a list of test cases. It's here so you don't spend your time reporting expected behavior as bugs.
>
> - **Wix doesn't sell every TLD.** A TLD is the ending, like `.com` or `.co.il`. A name can be free at the registry and still not be for sale on Wix.
> - **API input formats differ.** In the API, a domain must include its TLD (`mybakery.com`), but the TLD filter is passed without the dot (`com`, not `.com`).
> - **Premium domains cost more** than the standard price for their TLD. Sometimes the higher price applies only in the first year, sometimes on renewal too.
> - **Prices, currency and some suggestions depend on where you are.** For example, a visitor in Israel may be offered `.co.il` names that a visitor elsewhere won't see.
> - **Suggestions are generated,** so they can differ between calls and between doors.
> - **WHOIS data for most registered domains is redacted** for privacy. That's normal.
> - **Availability is a point-in-time answer.** A name that's free now can be taken a minute later.
> - **To call the public API you need an account-level API key.** Create a free Wix account, then generate a key at https://manage.wix.com/account/api-keys. Your key is a secret.
