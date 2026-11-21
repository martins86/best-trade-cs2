import { test, expect } from '@playwright/test';

test('lista para comparação em sentido com saldo Steam', async ({ page }) => {
  await page.goto('/opportunities');
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();
  await expect(page.getByText('Dados fictícios')).toBeVisible();
  await page.getByRole('link', { name: 'Ver comparação' }).first().click();
  await expect(page.getByText('Dados simulados', { exact: false }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Voltar às oportunidades' })).toBeVisible();
});
