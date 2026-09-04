import { chromium } from 'playwright-core';
import fs from 'node:fs';

const sha = process.env.QA_SHA || 'unknown';
const site = 'https://meetlaurenbush.com';
const scenes = [
  ['hero', 'main > section:first-of-type'],
  ['person', '#person'],
  ['explain', '#explain'],
  ['create', '#create'],
  ['television', '#television'],
  ['host', '#host'],
  ['activate', '#activate'],
  ['watch', '#watch'],
  ['between-cues', '#trust'],
  ['imagination', '#imagination'],
  ['book', '#book']
];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH
});

const manifest = {
  sha,
  capturedAt: new Date().toISOString(),
  site,
  viewports: {}
};

for (const [name, width, height] of [
  ['desktop', 1440, 1000],
  ['tablet', 768, 1024],
  ['mobile', 390, 844]
]) {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const responseErrors = [];
  const requestFailures = [];
  const interactionFailures = [];

  page.on('console', msg => {
    if (msg.type() !== 'error') return;
    const loc = msg.location();
    consoleErrors.push({
      text: msg.text(),
      url: loc?.url || null,
      line: loc?.lineNumber ?? null,
      column: loc?.columnNumber ?? null
    });
  });
  page.on('pageerror', err => {
    consoleErrors.push({ text: `pageerror: ${err.message}`, url: null, line: null, column: null });
  });
  page.on('response', response => {
    if (response.status() >= 400) {
      responseErrors.push({ status: response.status(), url: response.url() });
    }
  });
  page.on('requestfailed', request => {
    requestFailures.push({
      url: request.url(),
      error: request.failure()?.errorText || 'request failed'
    });
  });

  await page.goto(`${site}/?visualqa=${sha}-${name}-${Date.now()}`, {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  await page.evaluate(() => document.fonts?.ready);

  // Interaction smoke: Proof drawer opens, closes by Escape, and returns to a closed state.
  try {
    const proofTrigger = page.locator('.proof-index-trigger').first();
    if (await proofTrigger.count()) {
      await proofTrigger.click();
      await page.waitForTimeout(120);
      const opened = await page.locator('#proof-index').getAttribute('aria-hidden');
      if (opened !== 'false') interactionFailures.push(`Proof drawer did not open; aria-hidden=${opened}`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(120);
      const closed = await page.locator('#proof-index').getAttribute('aria-hidden');
      if (closed !== 'true') interactionFailures.push(`Proof drawer did not close on Escape; aria-hidden=${closed}`);
    } else {
      interactionFailures.push('Proof trigger missing');
    }
  } catch (error) {
    interactionFailures.push(`Proof drawer interaction: ${error.message}`);
  }

  // Interaction smoke: switch Watch program, verify panel state, then restore the first program.
  try {
    const tabs = page.locator('#watch [data-watch]');
    const tabCount = await tabs.count();
    if (tabCount >= 2) {
      const second = tabs.nth(1);
      const program = await second.getAttribute('data-watch');
      await second.click();
      await page.waitForTimeout(120);
      if ((await second.getAttribute('aria-selected')) !== 'true') {
        interactionFailures.push(`Watch tab ${program} did not become selected`);
      }
      const activePanel = page.locator(`#watch [data-watch-panel="${program}"]`).first();
      if (!(await activePanel.count()) || (await activePanel.getAttribute('hidden')) !== null) {
        interactionFailures.push(`Watch panel ${program} did not become visible`);
      }
      await tabs.nth(0).click();
      await page.waitForTimeout(80);
    } else {
      interactionFailures.push('Watch tabs missing or incomplete');
    }
  } catch (error) {
    interactionFailures.push(`Watch interaction: ${error.message}`);
  }

  // Hydrate the full long page before capture so lazy media and entered states are evidence, not guesses.
  const max = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < max; y += Math.max(520, Math.floor(height * 0.72))) {
    await page.evaluate(nextY => scrollTo(0, nextY), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(500);

  await page.screenshot({ path: `qa-artifacts/${name}-full.png`, fullPage: true });
  for (const [key, selector] of scenes) {
    const loc = page.locator(selector).first();
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(180);
      await loc.screenshot({ path: `qa-artifacts/${name}-${key}.png` });
    }
  }

  const state = await page.evaluate(() => {
    const css = selector => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const style = getComputedStyle(node);
      return {
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        minHeight: style.minHeight
      };
    };
    return {
      release: document.body?.dataset?.releaseStatus || null,
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      title: document.title,
      url: location.href,
      typography: {
        nav: css('.topbar nav'),
        sectionCode: css('.section-code'),
        sourceTab: css('.source-tab')
      }
    };
  });

  state.sha = sha;
  state.consoleErrors = consoleErrors;
  state.responseErrors = responseErrors;
  state.requestFailures = requestFailures;
  state.interactionFailures = interactionFailures;
  state.horizontalOverflow = state.scrollWidth > state.width;
  manifest.viewports[name] = state;
  fs.writeFileSync(`qa-artifacts/${name}-state.json`, JSON.stringify(state, null, 2));
  await ctx.close();
}

fs.writeFileSync('qa-artifacts/manifest.json', JSON.stringify(manifest, null, 2));
await browser.close();

const failed = Object.values(manifest.viewports).some(v =>
  v.horizontalOverflow ||
  v.consoleErrors.length ||
  v.responseErrors.length ||
  v.requestFailures.length ||
  v.interactionFailures.length
);

if (failed) {
  console.error('Visual QA found a layout, browser, network, or interaction failure. Inspect the artifact manifest.');
  process.exit(1);
}
