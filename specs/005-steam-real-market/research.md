# Research: Dados reais da Steam no front-end

## Decision: usar o endpoint público de busca do Steam Community Market

The public search rendering endpoint accepts app id, offset, page size and sorting parameters:

`/market/search/render/?appid=730&start=0&count=20&search_descriptions=0&sort_column=popular&sort_dir=desc&norender=1&currency=7`

The response includes `success`, `start`, `pagesize`, `total_count`, `results`, and each result includes `name`, `hash_name`, `sell_listings`, `sell_price`, `sell_price_text`, `asset_description.appid`, and `asset_description.market_hash_name`.

Rationale:

- It provides one paged CS2 market search and a lowest-price amount in the search result.
- It exposes `sell_listings` as a commercial listing signal.
- It avoids HTML scraping.

Alternatives considered:

- Steam Web API market endpoints: often require a developer key or do not expose the same public paged search.
- HTML scraping: fragile and unsuitable for stable parsing.
- Backend/database: outside this feature scope.

## Decision: use an approved edge gateway for browser CORS

The public Steam Community response observed directly does not include a browser CORS allow-origin header. Direct browser fetch is therefore not guaranteed on GitHub Pages.

Rationale:

- The domain layer must not invent fictional fallback data for real-market failures.
- An approved edge gateway can forward the public endpoint and controlled CORS headers without a database or account authentication.
- A public third-party proxy should not become a production dependency.

Alternatives considered:

- Direct browser fetch: possible in some environments, but not reliable.
- Public third-party proxy: fast prototype, poor operational ownership.
- Angular dev proxy: valid only for local development, not GitHub Pages.

## Decision: cache successful Steam pages in memory for five minutes

Successful pages remain in memory for 5 minutes. Manual refresh bypasses cache. Failed responses are not cached as successful market data.

Rationale:

- Five minutes balances freshness with pressure on the public Steam endpoint.
- Memory-only cache disappears on reload, matching the requested scope.

## Decision: sort with Steam popular ordering and use its lowest price

The search request uses `sort_column=popular&sort_dir=desc`. The UI uses `sell_listings` as the visible commercial listing signal and `sell_price` as the lowest-price amount.

Rationale:

- The response already exposes both values.
- The UI must not invent another popularity formula.

## Resolved unknowns

- Pagination: page offsets use 20-item increments and duplicates are removed by market hash name.
- Currency: preserve the minor-unit amount and Steam currency code for the requested locale.
- API access: require an approved edge gateway for production; no API key or credentials in the browser.
- Popularity: use Steam popular sorting plus `sell_listings`, not guaranteed sales or executed transactions.
