import { test, expect } from '@playwright/test';

test('tema alterna, persiste e mantém rótulos acessíveis', async ({ page }) => {
  await page.goto('/opportunities');
  await page.evaluate(() => localStorage.setItem('cs2mm-theme', 'dark'));
  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Ativar tema claro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Ativar tema escuro' })).toBeFocused();

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
