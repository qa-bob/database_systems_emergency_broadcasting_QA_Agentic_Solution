---
name: Bug report
about: A test is failing, flaky, or producing incorrect results
title: "[Bug] "
labels: bug
assignees: ''
---

## Failing test

<!-- Full test name including describe block and test title, e.g.:
     "Navigation @navigation > all nav links are reachable (no 404s) @navigation" -->

**Test file:** `tests/<category>/<filename>.spec.ts`
**Test name:**

## Expected behavior

<!-- What should the test assert? -->

## Actual behavior

<!-- What is the test doing instead? Paste the error message. -->

```
<error output here>
```

## Steps to reproduce

1. Run `npm run test:<category>` (or paste the exact `npx playwright test` command)
2.

## Environment

- OS:
- Node.js version (`node --version`):
- Playwright version (`npx playwright --version`):
- Branch / commit:
- Site URL tested against:

## Additional context

<!-- Screenshots, Playwright traces, HTML report excerpts, etc. -->
