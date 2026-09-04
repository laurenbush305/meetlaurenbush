import { chromium } from 'playwright-core';
import fs from 'node:fs';

const sha = process.env.QA_SHA || 'unknown';
const site = 'https://meetlaurenbush.com';
const viewports = [
  ['desktop', 1440, 1000],
  ['tablet', 768, 1024],
  ['mobile', 390, 844]
];
const routes = [
  {
    key: 'home', path: '/', viewportNames: ['desktop', 'tablet', 'mobile'],
    scenes: [['hero','main > section:first-of-type'],['person','#person'],['explain','#explain'],['create','#create'],['television','#television'],['host','#host'],['activate','#activate'],['watch','#watch'],['between-cues','#trust'],['imagination','#imagination'],['book','#book']]
  },
  {
    key: 'casting', path: '/casting-sheet.html', viewportNames: ['desktop', 'tablet', 'mobile'],
    scenes: [['hero','.casting-hero'],['doors','.door-section'],['range','.range-section'],['files','#selected-files'],['operator','.operator-section'],['booking','.booking-section']]
  },
  { key:'project-scrambled', path:'/project-scrambled-up.html', viewportNames:['desktop','mobile'], scenes:[['hero','.project-hero'],['evidence','.project-evidence'],['notes','.project-notes'],['close','.project-close']] },
  { key:'project-wimpb', path:'/project-pickleball-bag.html', viewportNames:['desktop','mobile'], scenes:[['hero','.project-hero'],['evidence','.project-evidence'],['notes','.project-notes'],['close','.project-close']] },
  { key:'project-montis', path:'/project-dear-diary-montis.html', viewportNames:['desktop','mobile'], scenes:[['hero','.project-hero'],['evidence','.project-evidence'],['notes','.project-notes'],['close','.project-close']] },
  { key:'project-centerline', path:'/project-honcho-centerline.html', viewportNames:['desktop','mobile'], scenes:[['hero','.project-hero'],['evidence','.project-evidence'],['notes','.project-notes'],['close','.project-close']] }
];

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
const manifest = { sha, capturedAt: new Date().toISOString(), site, routes: {} };

const attachDiagnostics = page => {
  const diagnostics = { consoleErrors: [], responseErrors: [], requestFailures: [] };
  page.on('console', msg => {
    if (msg.type() !== 'error') return;
    const loc = msg.location();
    diagnostics.consoleErrors.push({ text: msg.text(), url: loc?.url || null, line: loc?.lineNumber ?? null, column: loc?.columnNumber ?? null });
  });
  page.on('pageerror', err => diagnostics.consoleErrors.push({ text: `pageerror: ${err.message}`, url: null, line: null, column: null }));
  page.on('response', response => {
    if (response.status() >= 400) diagnostics.responseErrors.push({ status: response.status(), url: response.url() });
  });
  page.on('requestfailed', request => {
    const error = request.failure()?.errorText || 'request failed';
    const normalPartialMediaAbort = error === 'net::ERR_ABORTED' && request.resourceType() === 'media';
    if (!normalPartialMediaAbort) diagnostics.requestFailures.push({ url: request.url(), error, resourceType: request.resourceType() });
  });
  return diagnostics;
};

const testHomeInteractions = async page => {
  const failures = [];
  try {
    const proofTrigger = page.locator('.proof-index-trigger').first();
    if (!(await proofTrigger.count())) failures.push('Proof trigger missing');
    else {
      await proofTrigger.click(); await page.waitForTimeout(120);
      if ((await page.locator('#proof-index').getAttribute('aria-hidden')) !== 'false') failures.push('Proof drawer did not open');
      await page.keyboard.press('Escape'); await page.waitForTimeout(120);
      if ((await page.locator('#proof-index').getAttribute('aria-hidden')) !== 'true') failures.push('Proof drawer did not close on Escape');
    }
  } catch (error) { failures.push(`Proof drawer interaction: ${error.message}`); }
  try {
    const tabs = page.locator('#watch [data-watch]');
    if ((await tabs.count()) < 2) failures.push('Watch tabs missing or incomplete');
    else {
      const second = tabs.nth(1); const program = await second.getAttribute('data-watch');
      await second.click(); await page.waitForTimeout(120);
      if ((await second.getAttribute('aria-selected')) !== 'true') failures.push(`Watch tab ${program} did not become selected`);
      const activePanel = page.locator(`#watch [data-watch-panel="${program}"]`).first();
      if (!(await activePanel.count()) || (await activePanel.getAttribute('hidden')) !== null) failures.push(`Watch panel ${program} did not become visible`);
      await tabs.nth(0).click();
    }
  } catch (error) { failures.push(`Watch interaction: ${error.message}`); }
  return failures;
};

const testCastingInteractions = async page => {
  const failures = [];
  const fileLinks = page.locator('#selected-files .file-link');
  const count = await fileLinks.count();
  if (count < 4) failures.push(`Casting sheet expected 4 selected-file links; found ${count}`);
  for (let i=0;i<count;i++) if (!(await fileLinks.nth(i).getAttribute('href'))) failures.push(`Casting selected-file link ${i+1} has no href`);
  if (!(await page.locator('.booking-section a[href^="mailto:"]').first().count())) failures.push('Casting booking mailto link missing');
  if ((await page.locator('.range-section .range-frame').count()) !== 5) failures.push('Casting range mosaic must contain exactly 5 public-safe frames');
  return failures;
};

const testProjectInteractions = async page => {
  const failures = [];
  if (!(await page.locator('.project-back[href*="casting-sheet"]').first().count())) failures.push('Project back-to-casting link missing');
  if (!(await page.locator('.project-close a[href^="mailto:"]').first().count())) failures.push('Project booking mailto link missing');
  if (!(await page.locator('link[rel~="icon"]').count())) failures.push('Project favicon link missing');
  return failures;
};

for (const route of routes) {
  manifest.routes[route.key] = {};
  for (const [name,width,height] of viewports.filter(v => route.viewportNames.includes(v[0]))) {
    const ctx = await browser.newContext({ viewport:{width,height}, colorScheme:'light' });
    const page = await ctx.newPage();
    const diagnostics = attachDiagnostics(page);
    const prefix = route.key === 'home' ? name : `${route.key}-${name}`;

    await page.goto(`${site}${route.path}?visualqa=${sha}-${route.key}-${name}-${Date.now()}`, { waitUntil:'networkidle', timeout:60000 });
    await page.evaluate(() => document.fonts?.ready);

    const interactionFailures = route.key === 'home' ? await testHomeInteractions(page) : route.key === 'casting' ? await testCastingInteractions(page) : await testProjectInteractions(page);

    const max = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y=0; y<max; y+=Math.max(520,Math.floor(height*.72))) {
      await page.evaluate(nextY => scrollTo(0,nextY), y); await page.waitForTimeout(80);
    }
    await page.evaluate(() => scrollTo(0,0)); await page.waitForTimeout(350);

    await page.screenshot({ path:`qa-artifacts/${prefix}-full.png`, fullPage:true });
    for (const [key,selector] of route.scenes) {
      const loc=page.locator(selector).first();
      if (await loc.count()) { await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(120); await loc.screenshot({ path:`qa-artifacts/${prefix}-${key}.png` }); }
    }

    const state = await page.evaluate(() => {
      const css = selector => {
        const node=document.querySelector(selector); if(!node) return null; const style=getComputedStyle(node);
        return {fontSize:style.fontSize,lineHeight:style.lineHeight,minHeight:style.minHeight,backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage};
      };
      return {
        release:document.body?.dataset?.releaseStatus||null,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,title:document.title,url:location.href,
        favicon:document.querySelector('link[rel~="icon"]')?.href||null,themeColor:document.querySelector('meta[name="theme-color"]')?.content||null,
        typography:{nav:css('.topbar nav'),sectionCode:css('.section-code'),sourceTab:css('.source-tab')},surfaces:{castingHero:css('.casting-hero'),castingRange:css('.range-section'),projectHero:css('.project-hero'),projectEvidence:css('.project-evidence')}
      };
    });
    Object.assign(state,diagnostics,{sha,interactionFailures,horizontalOverflow:state.scrollWidth>state.width});
    manifest.routes[route.key][name]=state;
    fs.writeFileSync(`qa-artifacts/${prefix}-state.json`,JSON.stringify(state,null,2));
    await ctx.close();
  }
}

fs.writeFileSync('qa-artifacts/manifest.json',JSON.stringify(manifest,null,2));
await browser.close();

const states=Object.values(manifest.routes).flatMap(route=>Object.values(route));
const failed=states.some(v=>v.horizontalOverflow||v.consoleErrors.length||v.responseErrors.length||v.requestFailures.length||v.interactionFailures.length);
if(failed){console.error('Visual QA found a layout, browser, network, or interaction failure. Inspect the artifact manifest.');process.exit(1);}
