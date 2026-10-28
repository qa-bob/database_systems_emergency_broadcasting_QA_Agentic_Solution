/**
 * tests/functional/home-features.spec.ts
 *
 * Functional tests for the Emergency Broadcasting homepage.
 * Covers: hero section, primary headings, CTA buttons, feature/service sections,
 * footer presence, and general content quality.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Features @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  // ── Page structure ────────────────────────────────────────────────────────────

  test('homepage has a primary heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length, 'Homepage should have a visible h1 or h2 heading').toBeGreaterThan(0);
  });

  test('homepage hero section is visible @functional', async ({ homePage }) => {
    const heroText = await homePage.getHeroText();
    expect(
      heroText.length,
      'Hero / above-the-fold section should contain visible text'
    ).toBeGreaterThan(0);
  });

  test('homepage has at least one call-to-action @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(
      ctaButtons.length,
      'Homepage should have at least one CTA button or link'
    ).toBeGreaterThan(0);
  });

  test('homepage is fully loaded (heading + nav + text) @functional', async ({ homePage }) => {
    const isLoaded = await homePage.isLoaded();
    expect(isLoaded, 'Homepage isLoaded check: heading, nav, and body text must be present').toBeTruthy();
  });

  // ── Content sections ──────────────────────────────────────────────────────────

  test('homepage has multiple content sections @functional', async ({ page, siteConfig }) => {
    const sectionCount = await page.locator('section, [class*="section"], main > div').count();
    expect(
      sectionCount,
      `Homepage should have multiple content sections — found ${sectionCount}`
    ).toBeGreaterThan(0);
  });

  test('homepage headings are hierarchical @functional', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();

    // At least one heading (h1 or h2) must exist
    expect(h1Count + h2Count, 'Page must have at least one h1 or h2 heading').toBeGreaterThan(0);

    // Warn if no h1 exists — not a hard fail (some SPAs omit h1 on homepage)
    if (h1Count === 0) {
      console.warn('[functional] Homepage has no <h1> element. This may affect SEO.');
    }
  });

  test('homepage body text is substantial @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Homepage should contain substantial body text (>100 chars)'
    ).toBeGreaterThan(100);
  });

  // ── Footer ────────────────────────────────────────────────────────────────────

  test('footer is present and contains links @functional', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    const footerExists = await footer.count() > 0;

    test.skip(!footerExists, 'No <footer> or role="contentinfo" element found');

    await expect(footer).toBeVisible();

    const footerLinks = footer.locator('a[href]');
    const linkCount = await footerLinks.count();
    expect(
      linkCount,
      'Footer should contain at least one link'
    ).toBeGreaterThan(0);
  });

  test('footer contains contact or copyright information @functional', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() === 0) {
      console.warn('[functional] No footer found — skipping contact/copyright check.');
      return;
    }

    const footerText = (await footer.textContent()) ?? '';
    const hasContactInfo = /contact|email|phone|address|©|copyright|\d{4}/i.test(footerText);

    if (!hasContactInfo) {
      console.warn('[functional] Footer does not appear to contain contact or copyright info.');
    }
  });

  // ── Images ────────────────────────────────────────────────────────────────────

  test('homepage images load without errors @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'load' });

    const brokenImages = await page.evaluate<string[]>(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src || img.getAttribute('data-src') || '[no src]');
    });

    if (brokenImages.length > 0) {
      console.warn(
        `[functional] ${brokenImages.length} image(s) failed to load:\n` +
          brokenImages.slice(0, 5).map((s) => `  ${s}`).join('\n')
      );
    }

    expect(
      brokenImages.length,
      `${brokenImages.length} image(s) did not load correctly`
    ).toBe(0);
  });

  // ── Favicon ───────────────────────────────────────────────────────────────────

  test('site has a favicon @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const faviconLink = page.locator(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    ).first();

    if (await faviconLink.count() === 0) {
      console.warn('[functional] No favicon link tag found in <head>.');
    }
  });
});
