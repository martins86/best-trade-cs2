import { test, expect } from '@playwright/test';

test('lista abre detalhe em modal e mantém o shell', async ({ page }) => {
  await page.goto('/opportunities');
  const detailButton = page.getByRole('button', { name: /Ver detalhes de/i }).first();
  await detailButton.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/crédito não sacável|estimativa em dinheiro de CSFloat/i)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(detailButton).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();
});
