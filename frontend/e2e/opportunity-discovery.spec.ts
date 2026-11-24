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

test('jornada completa filtra, compara, identifica crédito Steam e não oferece ações financeiras', async ({ page }) => {
  await page.goto('/opportunities');

  await page.getByLabel('Buscar skin').fill('AWP');
  await page.getByLabel('Direção').selectOption('csfloat-to-steam');
  await page.getByLabel('Liquidez mínima').selectOption('medium');

  await expect(page.getByText('AWP | Asiimov (Field-Tested)', { exact: true })).toBeVisible();
  const detailButton = page.getByRole('button', { name: /Ver detalhes de/i }).first();
  await detailButton.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('CSFloat → Steam', { exact: true })).toBeVisible();
  await expect(dialog.getByText(/crédito não sacável/i)).toBeVisible();
  await expect(dialog.getByText(/Dados simulados/i)).toBeVisible();
  await expect(dialog.getByRole('button', { name: /comprar|vender|sacar|conectar/i })).toHaveCount(0);

  await page.keyboard.press('Escape');
  await expect(detailButton).toBeFocused();
  await expect(page.getByLabel('Buscar skin')).toHaveValue('AWP');
  await expect(page.getByLabel('Direção')).toHaveValue('csfloat-to-steam');
});
