---
paths:
  - "tests/**/*.spec.ts"
---

# Test File Rules

- Import `test` and `expect` from `@fixtures/site.fixture`, not from `@playwright/test` directly.
- Tag every `test()` with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.
- Use `siteConfig.url` as the base URL — never hardcode `http://www.emergency-broadcasting.com` or any other URL.
- Never submit forms: interact with fields and validate, but do not click submit buttons with intent to send data.
- Never use `page.waitForTimeout()` for waits longer than 500ms. Use `waitForSelector`, `waitForLoadState`, or Playwright's built-in auto-waiting.
- Tests must be independent — no shared state between tests in the same describe block.
- Use `test.skip()` with a descriptive message rather than commenting out failing tests.
