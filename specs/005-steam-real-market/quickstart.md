# Quickstart: Dados reais da Steam no front-end

## Prerequisites

- Node.js and npm supported by Angular 22.
- Network access to Steam or to an approved edge gateway.
- No Steam account, backend, database or API key for this feature.

## Local commands

```bash
cd frontend
npm ci
npm start
```

Open the Steam real-market view and confirm that the first page contains no fixtures.

## Validation scenarios

1. Confirm no more than 20 valid Steam items on the first page.
2. Confirm origin Steam, market hash name, lowest price and collection time.
3. Navigate next and previous without duplicate market hash names.
4. Revisit a page in the same session and confirm memory cache reuse.
5. Reload and confirm old market data is absent.
6. Block Steam access and confirm error plus retry with no simulated fallback.
7. Return malformed items and confirm invalid entries are omitted.
8. Navigate quickly and confirm stale responses do not replace the current page.
9. Confirm no purchase, sale, withdrawal, account connection or financial registration action exists.

## Automated validation

```bash
cd frontend
npm test
npx playwright test
npm run build
```
