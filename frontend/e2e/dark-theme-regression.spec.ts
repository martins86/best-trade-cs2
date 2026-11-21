import { test, expect } from '@playwright/test';

test('tema escuro permanece na lista e no detalhe', async ({ page }) => {
  await page.goto('/opportunities');
  await page.evaluate(() => localStorage.setItem('cs2mm-theme', 'dark'));
  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const iconsLoaded = await page.evaluate(() => document.fonts.check('24px "Material Icons"'));
  expect(iconsLoaded).toBe(true);
  const firstIcon = page.locator('mat-icon').first();
  await expect(firstIcon).toBeVisible();
  const iconFamily = await firstIcon.evaluate(element => getComputedStyle(element).fontFamily);
  expect(iconFamily.toLowerCase()).toContain('material');
  const tableText = page.locator('table').locator('td').first();
  await expect(tableText).toBeVisible();
  const tableColor = await tableText.evaluate(element => getComputedStyle(element).color);
  expect(tableColor).not.toBe('rgb(0, 0, 0)');

  await page.getByRole('button', { name: /Ver detalhes de/i }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('dialog')).toBeVisible();

  const comparison = page.locator('.comparison');
  await expect(comparison).toBeVisible();
  const comparisonBackground = await comparison.evaluate(element => getComputedStyle(element).backgroundColor);
  expect(comparisonBackground).not.toBe('rgb(255, 255, 255)');
  const comparisonColor = await comparison.evaluate(element => getComputedStyle(element).color);
  expect(comparisonColor).not.toBe('rgb(0, 0, 0)');

});
