# Web Accessibility Training

A hands-on training project for learning web accessibility (a11y) through a realistic e-commerce application. Write and fix Playwright tests to explore WCAG 2.1 compliance patterns.

## What's Inside

**Cosmic Goods** — a fictional shop selling whimsical products, built with plain HTML/CSS to keep the focus on accessibility patterns rather than frameworks.

```
ai-slop-shop/        # The demo e-commerce application
playwright/
  tests/             # Incomplete test stubs — your training exercises
  solution_tests/    # Reference implementations to check your work
```

## Getting Started

**Requirements:** Node.js v24 (use [nvm](https://github.com/nvm-sh/nvm): `nvm use`)

```bash
npm install
```

### Run the shop

```bash
npm run start:shop
```

Opens the app at `http://localhost:3000/src/home.html`.

### Run the tests

```bash
npm run test:playwright       # Headless
npm run test:playwright:ui    # Interactive Playwright UI
```

The test server starts automatically on port 3100.

## Training Exercises

The `playwright/tests/` directory contains test stubs. Your goal is to implement each test so it passes against the demo application or finds an accessibility issue. 
Feel free to make changes and try to fix the web shop.


## Tech Stack

- [Playwright](https://playwright.dev/) — end-to-end test framework
- [axe-core](https://www.deque.com/axe/) — automated accessibility rule engine
- [serve](https://github.com/vercel/serve) — static file server
- Vanilla HTML/CSS — no frontend framework, semantic markup focus
