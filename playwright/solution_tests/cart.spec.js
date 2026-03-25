import { test, expect } from '@playwright/test';

test.describe('font size scaling', () => {
  // Simulates a user who has set their browser default font size to 200%
  // by overriding the root font-size before any page styles apply.
  const injectLargeFontSize = (page) =>
    page.addStyleTag({ content: 'html { font-size: 200% !important; }' });

  test('cart table row is visible at 200% font size', async ({ page }) => {
    await page.goto('/cart.html');
    await injectLargeFontSize(page);

    const row = page.getByRole('row').filter({ has: page.getByRole('cell') });
    await expect(row).toBeVisible();
  });

  test('item names are not clipped at 200% font size', async ({ page }) => {
    await page.goto('/cart.html');
    await injectLargeFontSize(page);

    const names = page.locator('.item-name');
    for (const name of await names.all()) {
      const isClipped = await name.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(isClipped, `"${await name.textContent()}" is horizontally clipped`).toBe(false);
    }
  });

  test('table cells are not vertically clipped at 200% font size', async ({ page }) => {
    await page.goto('/cart.html');
    await injectLargeFontSize(page);

    const cells = page.getByRole('cell');
    for (const cell of await cells.all()) {
      const isClipped = await cell.evaluate(
        (el) => el.scrollHeight > el.clientHeight && getComputedStyle(el).overflow === 'hidden'
      );
      expect(isClipped, 'A table cell is vertically clipped with overflow hidden').toBe(false);
    }
  });

  test('"Proceed to Checkout" button is visible and not zero-sized at 200% font size', async ({ page }) => {
    await page.goto('/cart.html');
    await injectLargeFontSize(page);

    const btn = page.getByRole('link', { name: 'Proceed to Checkout' });
    await expect(btn).toBeVisible();

    const box = await btn.boundingBox();
    expect(box.width, 'Checkout button width should be > 0').toBeGreaterThan(0);
    expect(box.height, 'Checkout button height should be > 0').toBeGreaterThan(0);
  });

  test('order summary totals are not clipped at 200% font size', async ({ page }) => {
    await page.goto('/cart.html');
    await injectLargeFontSize(page);

    const rows = page.locator('.summary-row');
    for (const row of await rows.all()) {
      const isClipped = await row.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(isClipped, 'A summary row is horizontally clipped').toBe(false);
    }
  });

  test('quantity inputs are visible and not zero-sized at 200% font size', async ({ page }) => {
    await page.goto('/cart.html');
    await injectLargeFontSize(page);

    const inputs = page.getByRole('spinbutton');
    for (const input of await inputs.all()) {
      await expect(input).toBeVisible();
      const box = await input.boundingBox();
      expect(box.width, 'Quantity input width should be > 0').toBeGreaterThan(0);
      expect(box.height, 'Quantity input height should be > 0').toBeGreaterThan(0);
    }
  });
})