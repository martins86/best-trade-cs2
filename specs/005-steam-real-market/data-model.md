# Data model: Dados reais da Steam no front-end

## SteamMarketItem

| Field | Type | Rule |
|---|---|---|
| `marketHashName` | string | Required CS2 market identity. |
| `name` | string | Required display name. |
| `appId` | integer | Must equal 730. |
| `sellListings` | integer or null | Commercial listing signal; cannot be negative. |
| `lowestPriceMinor` | integer or null | Lowest returned price in minor currency units. |
| `currencyCode` | string | Currency used for the search. |
| `collectedAt` | ISO 8601 | Time the successful response was received. |
| `source` | enum | Always `steam`. |

Validation:

- Identity and app id are required.
- Missing or invalid prices are omitted from the lowest-price view.
- Negative listing or price values are invalid.

## SteamMarketPage

| Field | Type | Rule |
|---|---|---|
| `offset` | integer | Multiple of 20. |
| `items` | list | Maximum 20 valid items. |
| `totalCount` | integer or null | Total count returned by Steam. |
| `hasMore` | boolean | Indicates another offset may exist. |
| `collectedAt` | ISO 8601 | Time of successful collection. |
| `status` | enum | `success`, `loading`, `error`, or `empty`. |

## SteamCacheEntry

| Field | Type | Rule |
|---|---|---|
| `offset` | integer | Cached page key. |
| `page` | SteamMarketPage | Successful page reused by the session. |
| `expiresAt` | ISO 8601 | Five-minute TTL by default. |

## SteamQueryResult

| Field | Type | Rule |
|---|---|---|
| `status` | enum | `success`, `loading`, `error`, or `empty`. |
| `page` | SteamMarketPage or null | Present for success. |
| `errorCode` | string or null | Stable UI-safe error classification. |
| `retryable` | boolean | Whether retry is offered. |
