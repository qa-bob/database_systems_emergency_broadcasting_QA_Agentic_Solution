# SKILLS.md — Slash Commands & Skills

This file documents every Claude Code skill (slash command) available in this repository. Skills are invoked by typing `/command-name` in a Claude Code session.

Skills are defined as markdown files in `.claude/commands/`. They load on demand — only when you invoke them — and do not consume context window space during normal work.

---

## Available Skills

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

**What it does:** Navigates to the site in `site.config.json`, inspects its structure, and outputs a fully-populated `site.config.json`.

**When to use:**
- Before running `/generate-full-suite` on a new repo
- After a site redesign to refresh nav items, forms, and feature flags
- To audit the current `site.config.json` for accuracy

**Steps performed:**
1. Reads `site.config.json` for the current URL
2. Fetches the homepage (and follows redirects)
3. Extracts: page title, meta description, nav links, form presence, H1/H2 structure, meta viewport
4. Tries `/contact`, `/contact-us`, `/get-in-touch` to find contact forms
5. Assesses responsiveness at 390px viewport
6. Outputs a complete JSON block + issues checklist

**Output:**
```json
{
  "name": "...",
  "url": "...",
  "description": "...",
  "industry": "...",
  "hasContactForm": true,
  "expectedNavItems": ["Home", "Services", "Contact"],
  "viewports": ["desktop", "mobile", "tablet"],
  "skipVisual": false,
  "skipForms": false,
  "auth": { "required": false, "loginUrl": "", "username": "", "password": "" }
}
```

---

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

**What it does:** Analyzes the live website and generates a complete Playwright + TypeScript POM test suite.

**When to use:**
- First time setting up tests for a site
- After a major site redesign that breaks existing selectors
- To expand test coverage with site-specific scenarios

**Steps performed:**
1. Reads `site.config.json`
2. Fetches the homepage and all discovered pages
3. Plans page object classes (one per page/section)
4. Writes page object files to `src/pages/`
5. Updates `src/fixtures/site.fixture.ts`
6. Writes test files across all categories (smoke, navigation, forms, functional, visual, responsive)
7. Updates `site.config.json` with discovered values
8. Runs `npx tsc --noEmit` and fixes any errors

**Output:** Full set of `.ts` test files + updated page objects. Reports pages analyzed, classes created, test count, and any inaccessible pages.

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

**What it does:** Runs the `@smoke` test suite and reports results in a structured summary.

**When to use:**
- Quick sanity check that the site is up and serving correctly
- After a deployment or config change
- As a pre-flight before running the full suite

**What it reports:**
- Pass/fail count
- Any failing test names + error messages
- HTTP status of the homepage
- Console errors found (if any)
- Load time measurement

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

**What it does:** Re-captures visual regression snapshots for all `@visual` tests.

**When to use:**
- After an intentional design change (new brand colors, layout update, etc.)
- When `@visual` tests are failing due to known/expected UI changes
- When setting up visual regression on a new machine

**Important:** Run this only after confirming the current UI is correct. Captured baselines are committed to `__snapshots__/` and serve as the ground truth for future comparisons.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

**What it does:** Reads the latest Playwright JSON results from `test-results/results.json` and generates a human-readable summary.

**When to use:**
- After running the full test suite
- To share a test status summary with stakeholders
- In CI to produce a condensed report alongside the HTML artifact

**Output format:**
- Overall pass/fail/skip counts
- Per-category breakdown (`@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`)
- List of failing tests with their error messages
- Flaky test summary (tests that passed on retry)

---

## Skill Conventions

When writing or updating skills:

1. **File location:** `.claude/commands/<kebab-case-name>.md`
2. **Format:** Start with a one-line description, then `## Usage`, `## What this command does` (numbered steps), `## Output format`, and `## Handling edge cases`.
3. **Idempotent:** Skills should produce the same result when run twice — they overwrite, not append.
4. **No side effects outside the repo:** Skills do not push to remote, send messages, or submit forms.
5. **Always validate output:** Any skill that generates TypeScript must run `npx tsc --noEmit` at the end.

---

## Adding a New Skill

1. Create `.claude/commands/<name>.md` following the conventions above.
2. Add an entry to this `SKILLS.md` file.
3. If the skill involves a reusable agent, add the agent definition to `.claude/agents/<name>.md` and document it in `AGENTS.md`.
4. Test the skill by invoking `/<name>` in a Claude Code session.
