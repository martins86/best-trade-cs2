import { test, expect } from '@playwright/test';

test('navegação responde em desktop, tablet e celular', async ({ page }) => {
  await page.goto('/opportunities');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('link', { name: 'Oportunidades' })).toBeVisible();

  await page.setViewportSize({ width: 768, height: 900 });
  const compactSidebar = page.locator('mat-sidenav.sidebar.compact');
  await expect(compactSidebar).toBeVisible();
  await expect(compactSidebar.locator('mat-icon').first()).toHaveText('trending_up');

  await page.setViewportSize({ width: 320, height: 760 });
  await page.getByRole('button', { name: 'Abrir navegação' }).click();
  await expect(page.locator('.brand').getByText('Best Trade CS2')).toBeVisible();
  await expect(page.getByText('CS2 Market')).toHaveCount(0);
  await expect(page.locator('mat-sidenav.sidebar').getByText('MERCADO', { exact: true })).toBeVisible();
  await expect(page.locator('mat-sidenav.sidebar').getByText('Dados demonstrativos')).toBeVisible();
  await page.getByRole('link', { name: 'Oportunidades' }).click();
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();
});

test('rota de oportunidades funciona diretamente, com barra final e após atualização', async ({ page }) => {
  await page.goto('/opportunities');
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();

  await page.goto('/opportunities/');
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();
});

test('rotas conhecidas e desconhecidas são resolvidas', async ({ page }) => {
  await page.goto('/opportunities/skin-ak');
  await expect(page).toHaveURL(/\/opportunities\/skin-ak$/);

  await page.goto('/rota-desconhecida');
  await expect(page).toHaveURL(/\/opportunities$/);
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();
});

test('marca oficial aparece no navegador e no shell', async ({ page }) => {
  await page.goto('/opportunities');
  await expect(page).toHaveTitle('Best Trade CS2');
  await expect(page.locator('.brand').getByText('Best Trade CS2')).toBeVisible();
  await expect(page.getByText('CS2 Market')).toHaveCount(0);
});
