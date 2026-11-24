# Contract: Steam market page query

## Request

- `appid=730`
- `start=<page offset>`
- `count=<provider-compatible page size>`
- `search_descriptions=0`
- `sort_column=popular`
- `sort_dir=desc`
- `norender=1`
- `currency=<request currency>`

## Response

```json
{
  "success": true,
  "start": 0,
  "pagesize": 20,
  "total_count": 13367,
  "results": [
    {
      "name": "AK-47 | Example",
      "hash_name": "AK-47 | Example",
      "sell_listings": 250,
      "sell_price": 1234,
      "sell_price_text": "$12.34",
      "asset_description": {
        "appid": 730,
        "market_hash_name": "AK-47 | Example"
      }
    }
  ]
}
```

## Normalization

- Return at most 20 valid unique items per UI page.
- Use `market_hash_name` or `hash_name` as stable identity.
- Use `sell_price` as `lowestPriceMinor`.
- Use `sell_listings` as the commercial listing signal.
- Reject missing app id, identity or invalid integer values.
- The numeric minor-unit value is the source for display and calculations.

## Error types

- `transport-error`
- `rate-limited`
- `invalid-response`
- `not-found`
- `unknown`
