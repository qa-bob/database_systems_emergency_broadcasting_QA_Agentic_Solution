# Database Systems — Emergency Broadcasting QA

Playwright + TypeScript regression test suite for [Database Systems — Emergency Broadcasting](http://www.emergency-broadcasting.com), built with the **Page Object Model (POM)** and **Object-Oriented Programming (OOP)** patterns, and automated by Claude Code agents.

---

## Purpose

This repository provides automated GUI, functional, and regression test coverage for **emergency-broadcasting.com** — a B2B emergency alerting and broadcasting platform. Tests run without account creation or form submission and cover every discoverable feature of the public-facing website.

---

## Development Environment Setup

### Prerequisites

| Tool | Minimum version | Install |
|------|----------------|---------|
| Node.js | 18 LTS | [nodejs.org](https://nodejs.org) |
| npm | 9+ | bundled with Node |
| Git | any | [git-scm.com](https://git-scm.com) |
| Claude Code | latest | `irm https://claude.ai/install.ps1 \| iex` (Windows) or `curl -fsSL https://claude.ai/install.sh \| bash` |

### Install

```bash
# 1. Clone the repo
git clone <repo-url>
cd database_systems_emergency_broadcasting_QA_Agentic_Solution

# 2. Install npm dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium

# 4. (Optional) Install all browsers for cross-browser runs
npx playwright install
```

### Run tests

```bash
npm test                    # All tests (desktop + mobile + tablet)
npm run test:smoke          # Smoke tests only (@smoke)
npm run test:navigation     # Navigation tests (@navigation)
npm run test:forms          # Form tests (@forms)
npm run test:visual         # Visual regression (@visual)
npm run test:responsive     # Responsive layout (@responsive)

npx playwright test --grep @functional   # Functional tests
npx playwright test --headed             # Headed (visible browser)
npm run report                           # Open HTML report
npm run baseline                         # Update visual snapshots
npm run typecheck                        # TypeScript type check
npm run lint                             # ESLint
```

### Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SITE_URL` | value from `site.config.json` | Override the target URL at runtime |
| `CI` | unset | Set to `1` in CI — enables retries, stricter workers |

---

## Architecture

### Design patterns

The suite applies two core patterns:

**Page Object Model (POM):** Every page or major section has its own TypeScript class in `src/pages/`. Locators and user actions live in the page object; assertions live in test files. This separation keeps tests readable and isolates selector maintenance.

**Object-Oriented Programming (OOP):** All page classes extend `BasePage` (`src/pages/base.page.ts`), which provides shared navigation helpers, screenshot utilities, and layout checks. Subclasses add page-specific locators and methods.

### Project structure

```
site.config.json               # Target site URL, flags, expected nav items
playwright.config.ts           # Playwright projects: desktop, mobile, tablet
global-setup.ts                # Reachability check before suite runs

src/
  pages/
    base.page.ts               # BasePage — shared helpers for all pages
    home.page.ts               # HomePage
    navigation.page.ts         # NavigationPage
    contact.page.ts            # ContactFormPage
    <feature>.page.ts          # One class per additional discovered page
  fixtures/
    site.fixture.ts            # Custom test fixtures exposing page objects
  utils/
    link-checker.ts            # HTTP link reachability helpers
    visual-helper.ts           # Cookie-banner dismissal, screenshot helpers
  types/
    site-config.types.ts       # SiteConfig interface + JSON loader

tests/
  smoke/
    site-availability.spec.ts  # @smoke — availability, title, console errors
  navigation/
    nav-links.spec.ts          # @navigation — links, routing, mobile menu
  forms/
    contact-form.spec.ts       # @forms — fields, validation, accessibility
  functional/
    home-features.spec.ts      # @functional — homepage content & CTAs
    emergency-services.spec.ts # @functional — core service features
  visual/
    visual-regression.spec.ts  # @visual — screenshot regression
  responsive/
    layout.spec.ts             # @responsive — viewport layout checks

.claude/
  agents/
    site-analyzer.md           # Agent: crawl site → populate site.config.json
    test-generator.md          # Agent: generate site-specific test files
  commands/
    analyze-site.md            # /analyze-site slash command
    generate-full-suite.md     # /generate-full-suite slash command
    run-smoke.md               # /run-smoke slash command
    update-baseline.md         # /update-baseline slash command
    generate-report.md         # /generate-report slash command
  hooks/
    pre-test.sh                # Pre-test: verify site reachability
  settings.json                # Claude Code permissions & behavior

.github/
  workflows/
    playwright.yml             # GitHub Actions CI pipeline
  ISSUE_TEMPLATE/
    bug_report.md              # Bug report template
    feature_request.md         # Feature request / test coverage request
  PULL_REQUEST_TEMPLATE.md     # PR checklist
  CONTRIBUTING.md              # Contributor guide
  CODEOWNERS                   # Code ownership assignments
```

---

## Test Categories

| Tag | Folder | What it covers |
|-----|--------|----------------|
| `@smoke` | `tests/smoke/` | Site loads, HTTP 200, title present, no console errors |
| `@navigation` | `tests/navigation/` | Nav links, mobile menu, logo, broken links |
| `@forms` | `tests/forms/` | Form fields, validation, labels, accessibility |
| `@functional` | `tests/functional/` | Business logic, content sections, CTAs, features |
| `@visual` | `tests/visual/` | Screenshot regression at desktop/mobile/tablet |
| `@responsive` | `tests/responsive/` | No overflow, readable text, alt attributes |

---

## Claude Code Integration

This repo is configured for [Claude Code](https://code.claude.com) agentic execution. Claude reads `CLAUDE.md` for project instructions and `AGENTS.md` for the agent inventory.

### Slash commands (invoke in Claude Code session)

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Crawl the live site and update `site.config.json` |
| `/generate-full-suite` | Build a complete POM + test suite from scratch |
| `/run-smoke` | Run smoke tests and summarize results |
| `/update-baseline` | Refresh visual regression snapshots |
| `/generate-report` | Generate a test results summary |

### Agents

| Agent | Purpose |
|-------|---------|
| `site-analyzer` | Discovers site structure, nav, forms, and fills `site.config.json` |
| `test-generator` | Generates site-specific test files in `tests/custom/` |

See `AGENTS.md` for full agent documentation and `SKILLS.md` for skill/command documentation.

---

## Contributor Rules

### Adding tests

1. Read `site.config.json` first — use `siteConfig.url` as the base URL, never hardcode it.
2. Fetch the live site with `WebFetch` (or a browser) before writing selectors — use real DOM attributes, not guesses.
3. Add the page object to `src/pages/<name>.page.ts` (extend `BasePage`).
4. Register the page object in `src/fixtures/site.fixture.ts`.
5. Write tests in the correct `tests/<category>/` folder, tagged with `@<category>`.
6. Run `npm run typecheck` before opening a PR.

### Rules to follow

- **Never** submit forms in tests — interact with fields and validate only.
- **Never** hardcode base URLs — use `siteConfig.url` or Playwright's `baseURL`.
- **Never** put `expect()` assertions inside page object methods.
- **Never** use `page.waitForTimeout()` — use Playwright's auto-waiting or `waitForSelector`.
- **Do not** use the `any` type without an explicit comment justifying it.
- **One file per feature area** in `tests/functional/`.

### Page object conventions

```typescript
// src/pages/my-feature.page.ts
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class MyFeaturePage extends BasePage {
  readonly heroHeading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /get started/i }).first();
  }

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

### Pull request checklist

See `.github/PULL_REQUEST_TEMPLATE.md` for the full PR checklist.

---

## CI/CD

GitHub Actions runs the full test suite on every push to `main` and on every pull request. See `.github/workflows/playwright.yml`. The HTML report is uploaded as a workflow artifact named `playwright-report`.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot find module '@pages/...'` | Check `tsconfig.json` path aliases; run `npm run typecheck` |
| Tests timeout on CI | Increase `timeout` in `playwright.config.ts`; check `CI` env var is set |
| Visual tests fail after site redesign | Run `npm run baseline` to update snapshots, then commit `__snapshots__/` |
| Site returns 5xx in global-setup | Site is temporarily down — the suite will still run and collect results |
| `site.config.json` stale | Run `/analyze-site` in a Claude Code session to refresh it |
