---
paths:
  - "src/**/*.ts"
  - "tests/**/*.ts"
---

# TypeScript Rules

- Strict mode is enabled — do not use implicit `any`. If `any` is genuinely necessary, add a one-line comment explaining why.
- All public page object properties must be typed (e.g., `readonly heroHeading: Locator`).
- Use `type` imports for Playwright types: `import { type Page, type Locator } from '@playwright/test'`.
- Use path aliases defined in `tsconfig.json`: `@pages/`, `@fixtures/`, `@utils/`, `@types/`.
- Run `npx tsc --noEmit` before finishing any task involving `.ts` files to confirm the build is clean.
- Use `async/await` — no `.then().catch()` chains in test code.
- Interfaces over `type` aliases for object shapes (e.g., `FormFieldInfo`, `NavLinkInfo`).
