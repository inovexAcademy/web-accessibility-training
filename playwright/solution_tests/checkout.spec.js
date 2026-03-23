import { test, expect } from '@playwright/test';

const LABELED_FIELDS = [
  { labelFor: 'email',        inputId: 'email',         labelText: 'Email address' },
  { labelFor: 'first-name',   inputId: 'first-name',    labelText: 'First name' },
  { labelFor: 'last-name',    inputId: 'last-name',     labelText: 'Last name' },
  { labelFor: 'address',      inputId: 'address',       labelText: 'Street address' },
  { labelFor: 'city',         inputId: 'city',          labelText: 'City' },
  { labelFor: 'postal',       inputId: 'postal',        labelText: 'Postal code' },
  { labelFor: 'country',      inputId: 'country',       labelText: 'Country' },          
  { labelFor: 'order-notes',  inputId: 'order-notes',   labelText: 'Any special instructions?' }, 
  { labelFor: 'card-number',  inputId: 'card-number',   labelText: 'Card number' },
  { labelFor: 'expiry',       inputId: 'expiry',        labelText: 'Expiry date' },
  { labelFor: 'cvv',          inputId: 'cvv',           labelText: 'Security code' },
  { labelFor: 'name-on-card', inputId: 'name-on-card',  labelText: 'Name on card' },
];

const REQUIRED_FIELDS = [
  { id: 'email',        errorId: 'email-error' },
  { id: 'first-name',   errorId: 'first-name-error' },
  { id: 'last-name',    errorId: 'last-name-error' },
  { id: 'address',      errorId: 'address-error' },
  { id: 'city',         errorId: 'city-error' },
  { id: 'postal',       errorId: 'postal-error' },
  { id: 'country',      errorId: 'country-error' },
  { id: 'card-number',  errorId: 'card-number-error' },
  { id: 'expiry',       errorId: 'expiry-error' },
  { id: 'cvv',          errorId: 'cvv-error' },
  { id: 'name-on-card', errorId: 'name-on-card-error' },
];

test.describe('Explicit Labeling', () => {
  // Clicking a <label for="x"> must move focus to the associated control.
  // This proves the for/id association is correct — a broken or missing `for`
  // attribute would leave focus on the label itself (or nowhere).
  for (const { labelFor, inputId, labelText } of LABELED_FIELDS) {
    test(`clicking "${labelText}" label focuses #${inputId}`, async ({ page }) => {
      await page.goto('/checkout.html');

      // Click the label element directly (not the input) to exercise the association
      await page.locator(`label[for="${labelFor}"]`).click();

      await expect(page.locator(`#${inputId}`)).toBeFocused();
    });
  }

  const RADIO_OPTIONS = [
    { name: 'Standard', id: 'shipping-standard' },
    { name: 'Express', id: 'shipping-express' },
    { name: 'Overnight', id: 'shipping-overnight' }
  ];

  for (const { name, id } of RADIO_OPTIONS) {
    test(`clicking "${name}" shipping label focuses #${id}`, async ({ page }) => {
      await page.goto('/checkout.html');

      const label = page.locator(`label[for="${id}"]`);
      const radio = page.locator(`#${id}`);

      await label.click();

      await expect(radio).toBeFocused();
    });
  }
});


test.describe('Error Validation', () => {
  // Submitting with all required fields blank must mark every field invalid
  // and expose an error message that is programmatically associated via
  // aria-describedby so assistive technology can announce it.
  test('submitting empty form marks all required fields invalid with associated error messages', async ({ page }) => {
    await page.goto('/checkout.html');

    await page.locator('button[type="submit"]').click();

    for (const { id, errorId } of REQUIRED_FIELDS) {
      const input    = page.locator(`#${id}`);
      const errorEl  = page.locator(`#${errorId}`);

      await expect(input).toHaveAttribute('aria-invalid', 'true');

      await expect(errorEl).not.toBeEmpty();

      const describedBy = await input.getAttribute('aria-describedby');
      expect(
        describedBy,
        `#${id} aria-describedby must include "${errorId}"`
      ).toContain(errorId);
    }
  });

  // Each required field must also validate on blur (before the user submits),
  // and the error must be associated via aria-describedby at that point too.
  for (const { id, errorId } of REQUIRED_FIELDS) {
    test(`#${id} shows associated error message on blur when left empty`, async ({ page }) => {
      await page.goto('/checkout.html');

      // Focus then immediately blur without entering a value
      await page.locator(`#${id}`).focus();
      await page.keyboard.press('Tab');

      const input   = page.locator(`#${id}`);
      const errorEl = page.locator(`#${errorId}`);

      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(errorEl).not.toBeEmpty();

      const describedBy = await input.getAttribute('aria-describedby');
      expect(
        describedBy,
        `#${id} aria-describedby must include "${errorId}"`
      ).toContain(errorId);
    });
  }
});
