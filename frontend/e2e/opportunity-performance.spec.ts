import { test, expect } from '@playwright/test';

test('filtros locais respondem dentro da meta', async ({ page }) => {
  await page.goto('/opportunities');
  await expect.poll(() => page.locator('table tbody tr').count()).toBeGreaterThan(0);
  expect(await page.locator('table tbody tr').count()).toBeLessThanOrEqual(200);
  const select = page.getByLabel('Liquidez mínima');
  const durations: number[] = [];
  for (let index = 0; index < 30; index += 1) {
    const duration = await page.evaluate(async (value) => {
      const element = document.querySelectorAll('select')[1] as HTMLSelectElement;
      const start = performance.now();
      element.value = value;
      element.dispatchEvent(new Event('change'));
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      return performance.now() - start;
    }, index % 2 === 0 ? 'medium' : '');
    await expect(select).toBeVisible();
    durations.push(duration);
  }
  durations.sort((a, b) => a - b);
  expect(durations[Math.ceil(durations.length * 0.95) - 1]).toBeLessThanOrEqual(200);
});
