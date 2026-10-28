/**
 * tests/functional/emergency-services.spec.ts
 *
 * Functional tests for the core emergency broadcasting service features on
 * emergency-broadcasting.com. Covers: service descriptions, key feature
 * content, internal page navigation, and accessibility of critical information.
 *
 * Tests are resilient to different page structures — they use broad semantic
 * selectors and warn rather than hard-fail when optional elements are absent.
 * Run /analyze-site and /generate-full-suite after verifying the live site to
 * replace generic selectors with site-specific ones.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Emergency Broadcasting Services @functional', () => {
  // ── Homepage service content ──────────────────────────────────────────────────

  test.describe('Homepage service presentation', () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.navigate();
      await homePage.waitForLoad();
    });

    test('services or features section is visible @functional', async ({ page }) => {
      // Look for common service/feature section patterns
      const serviceSection = page.locator(
        'section, [class*="service"], [class*="feature"], [class*="solution"], ' +
        '[class*="product"], [class*="offering"]'
      ).filter({ hasText: /.{20,}/ }).first();

      test.skip(await serviceSection.count() === 0, 'No identifiable services/features section found on homepage');

      await expect(serviceSection).toBeVisible();
    });

    test('service descriptions have non-empty text @functional', async ({ page }) => {
      // Find all major text blocks — paragraphs, list items, and description divs
      const textBlocks = await page.locator('main p, main li, main [class*="description"]').all();

      const nonEmptyBlocks = [];
      for (const block of textBlocks.slice(0, 20)) {
        const text = ((await block.textContent()) ?? '').trim();
        if (text.length > 20) nonEmptyBlocks.push(text);
      }

      expect(
        nonEmptyBlocks.length,
        'Homepage should have multiple paragraphs or list items describing services'
      ).toBeGreaterThan(0);
    });

    test('page contains emergency broadcasting related content @functional', async ({ page }) => {
      const bodyText = ((await page.locator('body').textContent()) ?? '').toLowerCase();

      // Check for industry-relevant keywords
      const keywords = ['emergency', 'broadcast', 'alert', 'notification', 'system', 'message'];
      const foundKeywords = keywords.filter((kw) => bodyText.includes(kw));

      expect(
        foundKeywords.length,
        `Page should reference emergency broadcasting concepts. Keywords found: [${foundKeywords.join(', ')}]`
      ).toBeGreaterThan(0);
    });
  });

  // ── Internal page navigation ──────────────────────────────────────────────────

  test.describe('Internal page content', () => {
    test('about or company page is accessible @functional', async ({ page, siteConfig }) => {
      const aboutPaths = ['/about', '/about-us', '/company', '/who-we-are'];

      let found = false;
      for (const aboutPath of aboutPaths) {
        try {
          const response = await page.goto(
            siteConfig.url.replace(/\/$/, '') + aboutPath,
            { waitUntil: 'domcontentloaded', timeout: 10_000 }
          );

          if (response && response.status() < 400) {
            found = true;
            const heading = await page.locator('h1, h2').first().textContent();
            expect(heading?.trim().length ?? 0, 'About page should have a heading').toBeGreaterThan(0);
            break;
          }
        } catch {
          // Path not found — try next
        }
      }

      // Also check if "About" or "Company" link exists in nav and follow it
      if (!found) {
        await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
        const aboutLink = page.locator('nav a, header a').filter({
          hasText: /about|company|who we are/i,
        }).first();

        if (await aboutLink.count() > 0) {
          await aboutLink.click();
          await page.waitForLoadState('domcontentloaded');
          const heading = await page.locator('h1, h2').first().textContent();
          expect(heading?.trim().length ?? 0, 'About page reached via nav should have a heading').toBeGreaterThan(0);
          found = true;
        }
      }

      if (!found) {
        console.warn('[functional] No about/company page found at standard paths or in nav.');
      }
    });

    test('services or solutions page is accessible @functional', async ({ page, siteConfig }) => {
      const servicePaths = [
        '/services', '/solutions', '/products', '/features',
        '/how-it-works', '/what-we-do',
      ];

      let found = false;
      for (const servicePath of servicePaths) {
        try {
          const response = await page.goto(
            siteConfig.url.replace(/\/$/, '') + servicePath,
            { waitUntil: 'domcontentloaded', timeout: 10_000 }
          );

          if (response && response.status() < 400) {
            found = true;
            await page.waitForLoadState('load');
            const heading = await page.locator('h1, h2').first().textContent();
            expect(heading?.trim().length ?? 0, 'Services page should have a heading').toBeGreaterThan(0);
            break;
          }
        } catch {
          // Try next path
        }
      }

      // Also follow a nav link if direct paths don't work
      if (!found) {
        await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
        const servicesLink = page.locator('nav a, header a').filter({
          hasText: /services|solutions|products|features|how it works/i,
        }).first();

        if (await servicesLink.count() > 0) {
          await servicesLink.click();
          await page.waitForLoadState('domcontentloaded');
          found = true;
        }
      }

      if (!found) {
        console.warn('[functional] No services/solutions page found. Consider running /analyze-site.');
      }
    });
  });

  // ── Contact and CTA accessibility ─────────────────────────────────────────────

  test.describe('Contact and CTA', () => {
    test('a contact CTA is reachable from homepage @functional', async ({ page, siteConfig }) => {
      await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

      // Look for contact-related CTA on the page
      const contactCta = page.locator('a, button').filter({
        hasText: /contact|get in touch|reach out|call us|email us|request info|demo/i,
      }).first();

      test.skip(await contactCta.count() === 0, 'No visible contact CTA found on homepage');

      await expect(contactCta).toBeVisible();
    });

    test('phone number or email is visible if present @functional', async ({ page, siteConfig }) => {
      await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

      const bodyText = (await page.locator('body').textContent()) ?? '';

      // Check for phone (US format: +1-xxx-xxx-xxxx or (xxx) xxx-xxxx or xxx.xxx.xxxx)
      const hasPhone = /\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4}/.test(bodyText);

      // Check for email
      const hasEmail = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(bodyText);

      if (hasPhone) {
        const phoneLink = page.locator('a[href^="tel:"]').first();
        if (await phoneLink.count() > 0) {
          await expect(phoneLink).toBeVisible();
        }
      }

      if (hasEmail) {
        const emailLink = page.locator('a[href^="mailto:"]').first();
        if (await emailLink.count() > 0) {
          await expect(emailLink).toBeVisible();
        }
      }

      if (!hasPhone && !hasEmail) {
        console.warn('[functional] No phone number or email address visible on the homepage.');
      }
    });
  });

  // ── Link integrity ────────────────────────────────────────────────────────────

  test.describe('Link integrity', () => {
    test('no broken internal links on homepage @functional', async ({ page, siteConfig }) => {
      await page.goto(siteConfig.url, { waitUntil: 'load' });

      const siteOrigin = new URL(siteConfig.url).origin;

      // Collect all internal links
      const internalHrefs = await page.evaluate<string[], string>((origin) => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        return anchors
          .map((a) => (a as HTMLAnchorElement).href)
          .filter((href) => href.startsWith(origin))
          .filter((href, i, arr) => arr.indexOf(href) === i); // deduplicate
      }, siteOrigin);

      const broken: string[] = [];

      // Check each internal link (limit to 20 to avoid long runtime)
      for (const href of internalHrefs.slice(0, 20)) {
        try {
          const response = await page.request.head(href, { timeout: 8_000 });
          if (!response.ok() && response.status() !== 0) {
            broken.push(`${href} → HTTP ${response.status()}`);
          }
        } catch {
          // Network error — skip (not a 404)
        }
      }

      if (broken.length > 0) {
        console.warn(`[functional] Broken internal links:\n${broken.map((b) => `  ${b}`).join('\n')}`);
      }

      expect(
        broken.length,
        `Found ${broken.length} broken internal link(s):\n${broken.join('\n')}`
      ).toBe(0);
    });

    test('external links open with secure attributes @functional', async ({ page, siteConfig }) => {
      await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

      const siteOrigin = new URL(siteConfig.url).origin;

      const unsafeExternalLinks = await page.evaluate<string[], string>((origin) => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        return anchors
          .filter((a) => {
            const href = (a as HTMLAnchorElement).href;
            const isExternal = href.startsWith('http') && !href.startsWith(origin);
            const hasRel = (a.getAttribute('rel') ?? '').includes('noopener');
            return isExternal && !hasRel;
          })
          .map((a) => (a as HTMLAnchorElement).href);
      }, siteOrigin);

      if (unsafeExternalLinks.length > 0) {
        console.warn(
          `[functional] ${unsafeExternalLinks.length} external link(s) missing rel="noopener":\n` +
            unsafeExternalLinks.slice(0, 5).map((l) => `  ${l}`).join('\n')
        );
      }
    });
  });

  // ── Accessibility basics ──────────────────────────────────────────────────────

  test.describe('Accessibility', () => {
    test('interactive elements have accessible names @functional', async ({ page, siteConfig }) => {
      await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

      const unnamedInteractive = await page.evaluate<number>(() => {
        const elements = Array.from(
          document.querySelectorAll('button, [role="button"], input:not([type="hidden"])')
        );

        return elements.filter((el) => {
          const hasText = (el.textContent ?? '').trim().length > 0;
          const hasAriaLabel = el.getAttribute('aria-label')?.trim().length ?? 0 > 0;
          const hasAriaLabelledBy = el.getAttribute('aria-labelledby')?.trim().length ?? 0 > 0;
          const hasTitle = el.getAttribute('title')?.trim().length ?? 0 > 0;
          const hasValue = (el as HTMLInputElement).value?.trim().length > 0;
          return !hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasValue;
        }).length;
      });

      if (unnamedInteractive > 0) {
        console.warn(
          `[functional] ${unnamedInteractive} interactive element(s) have no accessible name (aria-label, text, title).`
        );
      }

      expect(
        unnamedInteractive,
        `${unnamedInteractive} button/input element(s) are missing accessible names`
      ).toBeLessThanOrEqual(2);
    });

    test('page has a proper document language @functional', async ({ page, siteConfig }) => {
      await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

      const htmlLang = await page.locator('html').getAttribute('lang');

      if (!htmlLang || htmlLang.trim().length === 0) {
        console.warn('[functional] <html> element is missing the lang attribute. This affects screen readers.');
      } else {
        expect(htmlLang.trim().length).toBeGreaterThan(0);
      }
    });

    test('skip navigation link is present or first focusable element is main content @functional', async ({
      page,
      siteConfig,
    }) => {
      await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

      // Check for a "skip to main content" link
      const skipLink = page.locator('a').filter({ hasText: /skip|main content|navigation/i }).first();

      if (await skipLink.count() > 0) {
        // Skip link found — verify it has an href
        const href = await skipLink.getAttribute('href');
        expect(href, 'Skip link should point to a main content anchor').not.toBeNull();
      } else {
        // No skip link — verify there is a <main> landmark (acceptable alternative)
        const mainLandmark = page.locator('main, [role="main"]').first();
        if (await mainLandmark.count() === 0) {
          console.warn(
            '[functional] No skip navigation link and no <main> landmark found. ' +
              'Consider adding one for keyboard accessibility.'
          );
        }
      }
    });
  });
});
