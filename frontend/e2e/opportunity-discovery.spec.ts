import { test, expect } from '@playwright/test';

test('lista abre comparação em modal sem trocar de rota', async ({ page }) => {
  await page.goto('/opportunities');
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();
  await expect(page.getByText('Dados fictícios')).toBeVisible();

  await page.getByRole('button', { name: /Ver detalhes de/i }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/\/opportunities$/);
  await expect(page.getByText('Dados simulados', { exact: false }).first()).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
