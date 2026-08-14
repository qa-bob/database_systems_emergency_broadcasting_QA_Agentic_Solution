# Contributing

Thank you for contributing to the Emergency Broadcasting QA suite. This guide covers everything you need to add, update, or fix tests.

---

## Getting started

1. Fork the repo and clone your fork.
2. Follow the setup steps in `README.md`.
3. Create a branch: `git checkout -b feat/my-test-description`

---

## Workflow

1. **Run existing tests first** — confirm the baseline is green before you start:
   ```bash
   npm run test:smoke
   ```

2. **Inspect the live site** before writing selectors — use `WebFetch`, your browser's DevTools, or `/analyze-site` in Claude Code.

3. **Write the page object first**, then the test. Page objects live in `src/pages/`; tests live in `tests/<category>/`.

4. **Run `npm run typecheck`** and fix all TypeScript errors before committing.

5. **Run the relevant test suite** to verify your tests pass:
   ```bash
   npx playwright test --grep @yourTag
   ```

6. Open a pull request using the provided template.

---

## Page object rules

- Extend `BasePage` from `src/pages/base.page.ts`.
- All locators are `readonly Locator` properties set in the constructor.
- Methods represent user **actions** (navigate, click, fill), not assertions.
- No `expect()` calls inside page objects — assertions belong in test files.

```typescript
// Good
export class ServicesPage extends BasePage {
  readonly heroHeading: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url + '/services', { waitUntil: 'domcontentloaded' });
  }
}

// Bad — assertion inside page object
async assertHeadingVisible(): Promise<void> {
  await expect(this.heroHeading).toBeVisible(); // don't do this
}
```

---

## Test rules

- Import `test` and `expect` from `@fixtures/site.fixture`, not from `@playwright/test`.
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.
- Use `siteConfig.url` as the base URL — never hardcode `http://www.emergency-broadcasting.com`.
- Do not submit forms — interact with fields and validate without clicking submit.
- Do not use `page.waitForTimeout()` for waits longer than 500ms. Use `waitForSelector`, `waitForLoadState`, or Playwright's auto-waiting.

---

## Selector guidelines

Use selectors in this priority order:

1. **Role-based:** `page.getByRole('button', { name: /contact us/i })`
2. **Accessible label:** `page.getByLabel('Email address')`
3. **Test ID:** `page.getByTestId('hero-cta')`
4. **Text content:** `page.getByText('Get Started')`
5. **CSS with semantic class names:** `page.locator('[class*="service-card"]')`
6. **Last resort:** `page.locator('section:nth-child(2) > h2')` — document why in a comment

Avoid brittle selectors like nth-child without context, deeply nested paths, or generated class names (`css-abc123`).

---

## Visual regression

When a test uses `toHaveScreenshot()`:

- Run `npm run baseline` on the canonical machine (CI or your local setup) to capture the initial baseline.
- Commit the resulting files in `__snapshots__/` alongside your test.
- When a UI change is intentional, run `npm run baseline` again and commit the updated snapshots.

---

## Commit message format

```
<type>(<scope>): <short description>

<optional body>
```

Examples:
```
feat(functional): add tests for services page content sections
fix(forms): correct email validation selector for contact form
chore(ci): add functional test job to GitHub Actions workflow
docs(readme): update setup instructions for Windows
```

Types: `feat`, `fix`, `test`, `chore`, `docs`, `refactor`

---

## Claude Code usage

This repo is configured for Claude Code. To generate new tests or analyze the site, start a Claude Code session in the repo root:

```bash
claude
```

Then use slash commands:
- `/analyze-site` — refresh `site.config.json`
- `/generate-full-suite` — generate a complete test suite
- `/run-smoke` — run smoke tests and see a summary

See `SKILLS.md` for the full command reference and `AGENTS.md` for the agent inventory.

---

## Questions?

Open an issue using the **Test coverage request** template, or start a Claude Code session and describe what you want to test.
