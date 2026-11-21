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
  await expect(page.getByText('CS2 Market')).toBeVisible();
  await page.getByRole('link', { name: 'Oportunidades' }).click();
  await expect(page.getByRole('heading', { name: 'Oportunidades simuladas' })).toBeVisible();
});
