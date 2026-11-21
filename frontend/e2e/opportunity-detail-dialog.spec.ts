import { test, expect } from '@playwright/test';

test('modal preserva rota, tema e fecha por Escape em diferentes larguras', async ({ page }) => {
  await page.goto('/opportunities');
  await page.evaluate(() => localStorage.setItem('cs2mm-theme', 'dark'));
  await page.reload();

  for (const width of [1440, 768, 320]) {
    await page.setViewportSize({ width, height: 760 });
    const detailButton = page.getByRole('button', { name: /Ver detalhes de/i }).first();
    await detailButton.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\/opportunities$/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const dialogSurface = page.locator('.opportunity-detail-dialog-panel .mat-mdc-dialog-surface');
    await expect(dialogSurface).toBeVisible();
    await expect.poll(() => dialogSurface.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(29, 34, 43)');
    const bounds = await dialogSurface.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(760);
    const backdrop = page.locator('.opportunity-detail-backdrop.cdk-overlay-backdrop-showing');
    await expect(backdrop).toBeVisible();
    await expect.poll(() => backdrop.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0.62)');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(detailButton).toBeFocused();
  }
});

test('modal identifica os dois sentidos simulados', async ({ page }) => {
  await page.goto('/opportunities');
  for (const [direction, label] of [
    ['steam-to-csfloat', 'Steam → CSFloat'],
    ['csfloat-to-steam', 'CSFloat → Steam'],
  ]) {
    await page.getByLabel('Direção').selectOption(direction);
    const detailButton = page.getByRole('button', { name: /Ver detalhes de/i }).first();
    await detailButton.click();
    await expect(page.getByRole('dialog').getByText(label, { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(detailButton).toBeFocused();
  }
});

test('modal herda tema claro e fecha pelo backdrop escurecido', async ({ page }) => {
  await page.goto('/opportunities');
  await page.evaluate(() => localStorage.setItem('cs2mm-theme', 'light'));
  await page.reload();
  await page.getByRole('button', { name: /Ver detalhes de/i }).first().click();

  const surface = page.locator('.opportunity-detail-dialog-panel .mat-mdc-dialog-surface');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => surface.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 255, 255)');
  const backdrop = page.locator('.opportunity-detail-backdrop.cdk-overlay-backdrop-showing');
  await expect.poll(() => backdrop.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0.62)');
  await backdrop.click({ position: { x: 8, y: 8 } });
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('preserva filtros e ordenação e permite operar a modal por teclado', async ({ page }) => {
  await page.goto('/opportunities');
  await page.evaluate(() => localStorage.setItem('cs2mm-theme', 'dark'));
  await page.reload();
  const search = page.getByLabel('Buscar skin');
  const direction = page.getByLabel('Direção');
  const sort = page.getByLabel('Ordenar');
  await search.fill('AWP');
  await direction.selectOption('steam-to-csfloat');
  await sort.selectOption('result');

  const detailButton = page.getByRole('button', { name: /Ver detalhes de/i }).first();
  await detailButton.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/\/opportunities$/);
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(detailButton).toBeFocused();

  await expect(search).toHaveValue('AWP');
  await expect(direction).toHaveValue('steam-to-csfloat');
  await expect(sort).toHaveValue('result');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('respeita movimento reduzido ao abrir a modal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/opportunities');
  await page.getByRole('button', { name: /Ver detalhes de/i }).first().click();

  const surface = page.locator('.opportunity-detail-dialog-panel .mat-mdc-dialog-surface');
  await expect(surface).toBeVisible();
  await expect.poll(() => surface.evaluate(element => getComputedStyle(element).transitionDuration)).toMatch(/^(0s|0ms)$/);
});
