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

});


test.describe('Error Validation', () => {
  // Submitting with all required fields blank must mark every field invalid
  // and expose an error message that is programmatically associated via
  // aria-describedby so assistive technology can announce it.
  test('submitting empty form marks all required fields invalid with associated error messages', async ({ page }) => {

  });

  // Each required field must also validate on blur (before the user submits),
  // and the error must be associated via aria-describedby at that point too.
  for (const { id, errorId } of REQUIRED_FIELDS) {
    test(`#${id} shows associated error message on blur when left empty`, async ({ page }) => {

    });
  }
});
