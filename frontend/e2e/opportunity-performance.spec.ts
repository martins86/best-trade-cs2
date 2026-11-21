import { test, expect } from '@playwright/test';

test('filtros locais respondem dentro da meta', async ({ page }) => {
  await page.goto('/opportunities');
  const select = page.getByLabel('Liquidez mínima');
  const durations: number[] = [];
  for (let index = 0; index < 30; index += 1) {
    const start = await page.evaluate(() => performance.now());
    await select.selectOption(index % 2 === 0 ? 'medium' : '');
    await expect(page.locator('app-opportunity-list-page')).toBeVisible();
    durations.push((await page.evaluate(() => performance.now())) - start);
  }
  durations.sort((a, b) => a - b);
  expect(durations[Math.ceil(durations.length * 0.95) - 1]).toBeLessThanOrEqual(200);
});
