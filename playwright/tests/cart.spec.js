import { test, expect } from '@playwright/test';

test.describe('font size scaling', () => {
  // Simulates a user who has set their browser default font size to 200%
  // by overriding the root font-size before any page styles apply.
  const injectLargeFontSize = (page) =>
    page.addStyleTag({ content: 'html { font-size: 200% !important; }' });

  test('cart table row is visible at 200% font size', async ({ page }) => {

  });

  test('item names are not clipped at 200% font size', async ({ page }) => {

  });

  test('table cells are not vertically clipped at 200% font size', async ({ page }) => {

  });

  test('"Proceed to Checkout" button is visible and not zero-sized at 200% font size', async ({ page }) => {

  });

  test('order summary totals are not clipped at 200% font size', async ({ page }) => {

  });

  test('quantity inputs are visible and not zero-sized at 200% font size', async ({ page }) => {

  });
})