import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page loads with three product cards', async ({ page }) => {
  await page.goto('/home.html');

  await expect(page).toHaveTitle('Cosmic Goods — Shop');

  await expect(page.getByRole('listitem')).toHaveCount(3);
});



test.describe('axe', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/home.html');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('keyboard navigation', () => {
  const tab = (page, times = 1) =>
    Array.from({ length: times }).reduce((p) => p.then(() => page.keyboard.press('Tab')), Promise.resolve());

  test.beforeEach(async ({ page }) => {
    await page.goto('/home.html');
  });

  test('complete tab order follows DOM order', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Shop' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'About' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Cart (1)' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Browse the collection' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Gravity-Defying Mug' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Add to cart' }).nth(0)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Pocket Void' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Add to cart' }).nth(1)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Artisan Silence' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Add to cart' }).nth(2)).toBeFocused();
  });

  test('within each card, product link is focused before "Add to cart"', async ({ page }) => {
    // Tab to the first product card (5 presses: Shop, About, Cart, Browse, Mug link)
    await tab(page, 5);
    await expect(page.getByRole('link', { name: 'Gravity-Defying Mug' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Add to cart' }).nth(0)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Pocket Void' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Add to cart' }).nth(1)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Artisan Silence' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Add to cart' }).nth(2)).toBeFocused();
  });

  test('Shift+Tab moves focus backwards through the product cards', async ({ page }) => {
    // Tab to the last "Add to cart" button
    await tab(page, 10);
    await expect(page.getByRole('button', { name: 'Add to cart' }).nth(2)).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('link', { name: 'Artisan Silence' })).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Add to cart' }).nth(1)).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('link', { name: 'Pocket Void' })).toBeFocused();
  });

  test('Enter on a product link navigates to its detail page', async ({ page }) => {
    await tab(page, 5);
    await expect(page.getByRole('link', { name: 'Gravity-Defying Mug' })).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL("http://localhost:3100/product-gravity-defying-mug");
  });

  test('Enter on "Add to cart" does not navigate away from the page', async ({ page }) => {
    await tab(page, 6);
    await expect(page.getByRole('button', { name: 'Add to cart' }).first()).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL("http://localhost:3100/home");
  });
});

test.describe('font size scaling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home.html');
    // Inject styles before testing
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  });

  test('all three product cards are visible at 200% font size', async ({ page }) => {
    const cards = page.getByRole('listitem');
    await expect(cards).toHaveCount(3);

    for (const card of await cards.all()) {
      await expect(card).toBeVisible();
    }
  });

  test('product titles are not clipped at 200% font size', async ({ page }) => {
    const titles = page.getByRole('heading', { level: 3 });
    for (const title of await titles.all()) {
      const isClipped = await title.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(isClipped, `"${await title.textContent()}" is horizontally clipped`).toBe(false);
    }
  });

  test('card descriptions are not clipped at 200% font size', async ({ page }) => {
    const descs = page.locator('.card-desc');
    for (const desc of await descs.all()) {
      const isClipped = await desc.evaluate((el) => el.scrollHeight > el.clientHeight && getComputedStyle(el).overflow === 'hidden');
      expect(isClipped, 'A card description is vertically clipped with overflow hidden').toBe(false);
    }
  });

  test('"Add to cart" buttons remain visible and are not zero-sized at 200% font size', async ({ page }) => {
    const buttons = page.getByRole('button', { name: 'Add to cart' });
    await expect(buttons).toHaveCount(3);

    for (const btn of await buttons.all()) {
      await expect(btn).toBeVisible();
      const box = await btn.boundingBox();
      expect(box.width, 'Button width should be > 0').toBeGreaterThan(0);
      expect(box.height, 'Button height should be > 0').toBeGreaterThan(0);
    }
  });

  test('prices are not clipped at 200% font size', async ({ page }) => {
    const prices = page.locator('.price');
    for (const price of await prices.all()) {
      await expect(price).toBeVisible();
      const isClipped = await price.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(isClipped, 'A price is horizontally clipped').toBe(false);
    }
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
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalOverflow, 'Page requires horizontal scrolling').toBe(false);
  });

  test('all three product cards are visible', async ({ page }) => {
    const cards = page.getByRole('listitem');
    await expect(cards).toHaveCount(3);

    for (const card of await cards.all()) {
      await expect(card).toBeVisible();
    }
  });

  test('product titles are visible and not cropped', async ({ page }) => {
    for (const name of ['Gravity-Defying Mug', 'Pocket Void', 'Artisan Silence']) {
      await expect(page.getByRole('link', { name })).toBeVisible();
    }
  });

  test('"Add to cart" buttons are visible', async ({ page }) => {
    const buttons = page.getByRole('button', { name: 'Add to cart' });
    await expect(buttons).toHaveCount(3);

    for (const btn of await buttons.all()) {
      await expect(btn).toBeVisible();
    }
  });

  test('no content is clipped by overflow hidden', async ({ page }) => {
    const clippedElements = await page.evaluate(() => {
      const clipped = [];
      document.querySelectorAll('*').forEach((el) => {
        // Skip screen-reader only elements to avoid false positives
        if (el.classList.contains('sr-only')) return;

        const style = getComputedStyle(el);
        if (
          (style.overflow === 'hidden' || style.overflowX === 'hidden') &&
          el.scrollWidth > el.clientWidth
        ) {
          clipped.push(el.tagName + (el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : ''));
        }
      });
      return clipped;
    });

    expect(clippedElements, `Elements with hidden horizontal overflow: ${clippedElements.join(', ')}`).toHaveLength(0);
  });

  test('nav links are visible and do not intersect', async ({ page }) => {
    // To truly check for overlapping, we need to check their bounding boxes
    const shopLink = page.getByRole('link', { name: 'Shop' });
    const aboutLink = page.getByRole('link', { name: 'About' });
    
    await expect(shopLink).toBeVisible();
    await expect(aboutLink).toBeVisible();

    const shopBox = await shopLink.boundingBox();
    const aboutBox = await aboutLink.boundingBox();

    // Assert that the right edge of 'Shop' does not overlap the left edge of 'About'
    // (Assuming a horizontal layout. If it wraps to vertical, you'd check bottom/top edges)
    expect(shopBox.x + shopBox.width).toBeLessThanOrEqual(aboutBox.x);
  });
});
