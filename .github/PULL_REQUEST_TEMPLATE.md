## Summary

<!-- One or two sentences describing what this PR adds, changes, or fixes. -->

## Type of change

- [ ] New test(s)
- [ ] Updated test(s) / selector fix
- [ ] New page object
- [ ] Updated page object
- [ ] Bug fix (failing test now passes)
- [ ] Infrastructure / config change
- [ ] Documentation update

## Test coverage

<!-- Which test category/categories does this PR touch? -->

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

## Checklist

- [ ] `npm run typecheck` passes (no TypeScript errors)
- [ ] `npm run lint` passes
- [ ] Tests use `siteConfig.url` — no hardcoded base URLs
- [ ] No `expect()` calls inside page object methods
- [ ] No `page.waitForTimeout()` calls (use Playwright auto-waiting)
- [ ] No form submission in tests
- [ ] New page objects are registered in `src/fixtures/site.fixture.ts`
- [ ] Selectors are based on real DOM attributes (fetched from live site)
- [ ] Visual baseline updated if UI changed (`npm run baseline`)

## Testing notes

<!-- Describe how you verified the tests work. Include any edge cases or known flakiness. -->
