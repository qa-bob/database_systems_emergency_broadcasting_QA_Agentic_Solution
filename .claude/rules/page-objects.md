---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

- Every page class must extend `BasePage` from `./base.page`.
- All locators are `readonly Locator` properties set in the constructor.
- Methods represent user **actions** (navigate, click, fill) — not assertions.
- Never call `expect()` inside a page object method. Assertions belong in test files.
- Never hardcode the site URL — use `this.url` or `this.config.url` inherited from `BasePage`.
- Constructors accept `(page: Page, config: SiteConfig)` — do not drop the `config` parameter.
- Use resilient, semantic selectors in priority order:
  1. `page.getByRole()`
  2. `page.getByLabel()` / `page.getByPlaceholder()`
  3. `page.getByTestId()`
  4. `page.getByText()`
  5. CSS with semantic class name fragments (`[class*="service-card"]`)
  6. Nth-child or deeply nested — document with a comment explaining why
