import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page loads with three product cards', async ({ page }) => {
  await page.goto('/home.html');

  await expect(page).toHaveTitle('Cosmic Goods — Shop');

  await expect(page.getByRole('listitem')).toHaveCount(3);
});



test.describe('axe', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {

  });
});

test.describe('keyboard navigation', () => {
  // Helper function so you don't have to type so many keyboard press commands
  const tab = (page, times = 1) =>
    Array.from({ length: times }).reduce((p) => p.then(() => page.keyboard.press('Tab')), Promise.resolve());

  test.beforeEach(async ({ page }) => {
    await page.goto('/home.html');
  });

  test('complete tab order follows DOM order', async ({ page }) => {

  });

  test('within each card, product link is focused before "Add to cart"', async ({ page }) => {
    // Tab to the first product card (5 presses: Shop, About, Cart, Browse, Mug link)

  });

  test('Shift+Tab moves focus backwards through the product cards', async ({ page }) => {
    // Tab to the last "Add to cart" button

  });

  test('Enter on a product link navigates to its detail page', async ({ page }) => {

  });

  test('Enter on "Add to cart" does not navigate away from the page', async ({ page }) => {

  });
});

test.describe('font size scaling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home.html');
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  });

  test('all three product cards are visible at 200% font size', async ({ page }) => {

  });

  test('product titles are not clipped at 200% font size', async ({ page }) => {

  });

  test('card descriptions are not clipped at 200% font size', async ({ page }) => {

  });

  test('"Add to cart" buttons remain visible and are not zero-sized at 200% font size', async ({ page }) => {

  });

  test('prices are not clipped at 200% font size', async ({ page }) => {

  });
})

test.describe('Reflow (WCAG 1.4.10)', () => {
  // 1. Set the viewport for the entire describe block
  test.use({ viewport: { width: 320, height: 256 } });

  // 2. Navigate once before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/home.html');
  });

  test('page has no horizontal scrollbar at 320px width', async ({ page }) => {

  });

  test('all three product cards are visible', async ({ page }) => {

  });

  test('product titles are visible and not cropped', async ({ page }) => {

  });

  test('"Add to cart" buttons are visible', async ({ page }) => {

  });

  test('no content is clipped by overflow hidden', async ({ page }) => {

  });

  test('nav links are visible and do not intersect', async ({ page }) => {
    // To truly check for overlapping, we need to check their bounding boxes

  });
});
