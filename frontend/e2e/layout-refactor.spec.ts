import { test, expect } from '@playwright/test';

test('shell, tema e tabela do refactor', async ({ page }) => {
  await page.goto('/opportunities');
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Dados demonstrativos', { exact: true }).first()).toBeVisible();

  const themeButton = page.getByRole('button', { name: /tema/i });
  await themeButton.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', /(light|dark)/);

  await page.setViewportSize({ width: 320, height: 760 });
  await expect(page.getByRole('button', { name: 'Abrir navegação' })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir navegação' }).click();
  await expect(page.getByText('CS2 Market')).toBeVisible();

  const navigationIcon = page.getByRole('link', { name: 'Oportunidades' }).locator('mat-icon');
  await expect(navigationIcon).toBeVisible();
  const iconSize = await navigationIcon.evaluate(element => {
    const style = getComputedStyle(element);
    return { width: parseFloat(style.width), height: parseFloat(style.height), size: parseFloat(style.fontSize) };
  });
  expect(iconSize.width).toBeLessThanOrEqual(18);
  expect(iconSize.height).toBeLessThanOrEqual(18);
  expect(iconSize.size).toBeLessThanOrEqual(18);

  const navGap = await page.locator('mat-nav-list').first().evaluate(element => getComputedStyle(element).gap);
  expect(navGap).toBe('6px');
  await page.screenshot({ path: 'test-results/menu-mobile.png', fullPage: true });
});
