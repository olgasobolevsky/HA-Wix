import requests

API_KEY = "<WIX_API_KEY>"  # paste the key locally; never commit it
DOMAIN = "<DOMAIN>"  # e.g. google.com

response = requests.get(
    "https://www.wixapis.com/domain-search/v2/check-domain-availability",
    params={"domain": DOMAIN},
    headers={"Authorization": API_KEY},
)

print(response.status_code)
print(response.text)
