# AGENTS.md — AI Agent Inventory

This file documents every AI agent and automated assistant configured for this repository. It is read by Claude Code, GitHub Copilot, Cursor, and other coding agents to understand available automation capabilities.

> Claude Code reads `CLAUDE.md` (not this file) for project instructions. This file is an inventory document. `CLAUDE.md` imports `@AGENTS.md` so both are available in Claude's context.

---

## Repository Purpose

Automated Playwright + TypeScript regression test suite for **[Database Systems — Emergency Broadcasting](http://www.emergency-broadcasting.com)**. Tests cover the public-facing B2B website using the Page Object Model (POM) and OOP design patterns.

---

## Claude Code Agents

These agents are defined in `.claude/agents/` and are invoked automatically by Claude Code when the matching conditions are met, or manually via the commands listed below.

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`

**Purpose:** Crawls the live website and produces a fully-populated `site.config.json`.

**When invoked:**
- Onboarding a new company repo (first-time config generation)
- After a site redesign to verify `site.config.json` is still accurate
- When running `/analyze-site`

**Inputs:**

| Input | Required | Description |
|-------|----------|-------------|
| `url` | Yes | Site URL to analyze |
| `companyName` | No | Override for the company name |

**Output:** A complete, valid `site.config.json` with all fields populated.

**Capabilities:**
- Navigate to URLs using a headless browser context
- Extract nav items, form fields, meta tags, and heading structure
- Dismiss cookie consent banners
- Detect mobile/responsive behavior at multiple viewports
- Identify auth-gated content

---

### `test-generator`

**File:** `.claude/agents/test-generator.md`

**Purpose:** Reads `site.config.json` and generates site-specific Playwright test files for features not covered by the shared suite.

**When invoked:**
- A site has unique functionality requiring custom tests
- The shared suite's generic selectors fail for a specific page
- Writing regression tests for a discovered bug
- When running `/generate-full-suite`

**Inputs:**

| Input | Required | Description |
|-------|----------|-------------|
| `siteConfig` | Yes | Populated `site.config.json` |
| `testScenarios` | No | Description of specific scenarios |
| `pagesToTest` | No | List of specific page paths |

**Output:** TypeScript test files in `tests/custom/<scenario>.spec.ts`.

**Conventions:**
- Imports from `@fixtures/site.fixture`
- Tags all tests with appropriate `@tag` markers
- Never submits forms
- Strict TypeScript (`no implicit any`)

---

## Claude Code Slash Commands (Skills)

These commands are defined in `.claude/commands/` and invoked as `/command-name` in a Claude Code session.

| Command | File | Description |
|---------|------|-------------|
| `/analyze-site` | `analyze-site.md` | Crawl the site and update `site.config.json` |
| `/generate-full-suite` | `generate-full-suite.md` | Build a complete POM + tests from scratch |
| `/run-smoke` | `run-smoke.md` | Run smoke tests and report results |
| `/update-baseline` | `update-baseline.md` | Refresh visual regression baselines |
| `/generate-report` | `generate-report.md` | Generate a test results summary |

---

## Automated Hooks

| Hook | File | Trigger | Purpose |
|------|------|---------|---------|
| Pre-test | `.claude/hooks/pre-test.sh` | Before any test command | Verify site reachability; warn (not fail) if unavailable |

---

## Claude Code Configuration

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project instructions loaded into every Claude Code session |
| `.claude/settings.json` | Permissions, allowed commands, behavioral settings |
| `site.config.json` | Target site URL, flags (`skipForms`, `skipVisual`), expected nav items |

---

## Agent Design Principles

All agents in this repo follow these rules:

1. **No form submission** — agents interact with forms (fill, validate) but never click submit buttons.
2. **No account creation** — agents do not register accounts or enter real credentials unless `auth.required: true` in `site.config.json`.
3. **No hardcoded URLs** — agents always read the target URL from `site.config.json` or `siteConfig.url`.
4. **POM-first** — test generation agents add selectors to page objects, not directly to spec files.
5. **TypeScript strict** — generated code must pass `npx tsc --noEmit` with no errors.
6. **Real selectors** — agents fetch the live site before writing selectors; no placeholder locators.

---

## Extending This Repo

To add a new agent:

1. Create `.claude/agents/<agent-name>.md` with role, capabilities, inputs, outputs, and step-by-step instructions.
2. Create `.claude/commands/<command-name>.md` as the user-facing slash command that invokes the agent.
3. Document the agent in this `AGENTS.md` file.
4. If the agent generates test files, register any new page objects in `src/fixtures/site.fixture.ts`.
