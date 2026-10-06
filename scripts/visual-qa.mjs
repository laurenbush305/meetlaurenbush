import { chromium, webkit } from 'playwright';
import fs from 'node:fs';

const sha = process.env.QA_SHA || 'unknown';
const site = 'https://meetlaurenbush.com';
const viewports = [
  ['desktop', 1440, 1000],
  ['laptop', 1024, 900],
  ['tablet', 768, 1024],
  ['mobile430', 430, 900],
  ['mobile390', 390, 844],
  ['mobile360', 360, 800]
];
const fullWidthNames = viewports.map(v => v[0]);
const routes = [
  {
    key: 'home', path: '/', viewportNames: fullWidthNames,
    scenes: [['hero','.v2-hero'],['about','#engine'],['work','#work'],['live','.v2-live'],['depth','.v2-depth'],['book','#book']]
  },
  {
    key: 'casting', path: '/casting-sheet.html', viewportNames: fullWidthNames,
    scenes: [['hero','.casting-hero'],['doors','.door-section'],['range','.range-section'],['files','#selected-files'],['operator','.operator-section'],['booking','.booking-section']]
  },
  { key:'project-scrambled', path:'/project-scrambled-up.html', viewportNames:['desktop','mobile390'], scenes:[['hero','.project-hero'],['evidence','.project-evidence'],['close','.project-close']] },
  { key:'project-finance', path:'/project-finance-explainer.html', viewportNames:['desktop','mobile390'], scenes:[['hero','.project-hero'],['evidence','.project-evidence'],['close','.project-close']] },
  { key:'project-wimpb', path:'/project-pickleball-bag.html', viewportNames:['desktop','mobile390'], scenes:[['hero','.project-hero'],['evidence','.project-evidence'],['close','.project-close']] },
  { key:'project-montis', path:'/project-dear-diary-montis.html', viewportNames:['desktop','mobile390'], scenes:[['hero','.project-hero'],['evidence','.project-evidence'],['close','.project-close']] },
  { key:'project-centerline', path:'/project-honcho-centerline.html', viewportNames:['desktop','mobile390'], scenes:[['hero','.project-hero'],['evidence','.project-evidence'],['close','.project-close']] }
];

const manifest = { sha, capturedAt: new Date().toISOString(), site, browsers: {} };

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
    const benignAbort = /(ERR_ABORTED|aborted|cancelled|canceled)/i.test(error) && ['media','image'].includes(request.resourceType());
    if (!benignAbort) diagnostics.requestFailures.push({ url: request.url(), error, resourceType: request.resourceType() });
  });
  return diagnostics;
};

const testHomeInteractions = async page => {
  const failures = [];
  if (!(await page.locator('.v2-hero a[href^="mailto:"]').first().count())) failures.push('Homepage booking mailto link missing');
  if (!(await page.locator('a[href="casting-sheet.html"]').first().count())) failures.push('Homepage casting-sheet link missing');
  if (!(await page.locator('a[href="project-finance-explainer.html"]').first().count())) failures.push('Homepage finance explainer project link missing');
  if (!(await page.locator('.v2-live-current a[href="https://www.dirtysouthtrivia.com/"]').count())) failures.push('Homepage Dirty South Trivia live-work credit missing');
  const workCards = page.locator('#work .v2-work-card');
  const count = await workCards.count();
  if (count !== 4) failures.push(`Homepage expected 4 selected-work cards; found ${count}`);
  for (let i=0;i<count;i++) if (!(await workCards.nth(i).getAttribute('href'))) failures.push(`Homepage selected-work card ${i+1} has no href`);
  return failures;
};

const testCastingInteractions = async page => {
  const failures = [];
  const fileLinks = page.locator('#selected-files .file-link');
  const count = await fileLinks.count();
  if (count !== 4) failures.push(`Casting sheet expected 4 selected-file links; found ${count}`);
  for (let i=0;i<count;i++) if (!(await fileLinks.nth(i).getAttribute('href'))) failures.push(`Casting selected-file link ${i+1} has no href`);
  if (!(await page.locator('#selected-files a[href="project-finance-explainer.html"]').count())) failures.push('Casting finance explainer project link missing');
  if (!(await page.locator('.casting-current-live[href="https://www.dirtysouthtrivia.com/"]').count())) failures.push('Casting Dirty South Trivia current-live credit missing');
  if (!(await page.locator('.dirty-south-credit').count())) failures.push('Casting Dirty South Trivia additional credit missing');
  if (!(await page.locator('.credit').filter({ hasText: 'Team Trivia' }).count())) failures.push('Casting prior Team Trivia live-host receipt missing');
  const castingText = await page.locator('body').innerText();
  if (/\bmoderator\b|\bmoderation\b/i.test(castingText)) failures.push('Casting currently claims moderator/moderation without public proof');
  if (!(await page.locator('.booking-section a[href^="mailto:"]').first().count())) failures.push('Casting booking mailto link missing');
  const doors = await page.locator('.door-section .door').count();
  if (doors !== 4) failures.push(`Casting sheet expected 4 primary assignment rows; found ${doors}`);
  return failures;
};

const testProjectInteractions = async page => {
  const failures = [];
  if (!(await page.locator('.project-back[href*="casting-sheet"]').first().count())) failures.push('Project back-to-casting link missing');
  if (!(await page.locator('.project-close a[href^="mailto:"]').first().count())) failures.push('Project booking mailto link missing');
  if (!(await page.locator('link[rel~="icon"]').count())) failures.push('Project favicon link missing');
  return failures;
};

const testInternalAnchors = async page => {
  return await page.evaluate(async () => {
    const failures = [];
    const anchors = Array.from(document.querySelectorAll('a[href*="#"]'));
    for (const anchor of anchors) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') continue;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || !url.hash || url.hash === '#') continue;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) continue;
      if (url.pathname === location.pathname) {
        if (!document.getElementById(id)) failures.push(`Broken fragment target: ${href}`);
        continue;
      }
      try {
        const response = await fetch(url.pathname, { cache:'no-store' });
        if (!response.ok) { failures.push(`Fragment target page failed: ${href} (${response.status})`); continue; }
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html,'text/html');
        if (!doc.getElementById(id)) failures.push(`Broken cross-page fragment target: ${href}`);
      } catch (err) {
        failures.push(`Fragment target check failed: ${href} (${String(err)})`);
      }
    }
    return failures;
  });
};

const captureState = async (page, browserName) => await page.evaluate(browserName => {
  const css = selector => {
    const node=document.querySelector(selector); if(!node) return null; const style=getComputedStyle(node);
    return {fontSize:style.fontSize,lineHeight:style.lineHeight,minHeight:style.minHeight,backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage};
  };
  const resources = performance.getEntriesByType('resource');
  const totalTransferBytes = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  const maxResource = resources.reduce((best, r) => (r.transferSize || 0) > (best.transferSize || 0) ? {name:r.name, transferSize:r.transferSize || 0} : best, {name:null,transferSize:0});
  const metaText = Array.from(document.head.querySelectorAll('meta')).map(m => m.content || '').join(' ');
  return {
    browser:browserName,
    release:document.body?.dataset?.releaseStatus||null,
    width:innerWidth,
    scrollWidth:document.documentElement.scrollWidth,
    height:document.documentElement.scrollHeight,
    title:document.title,
    url:location.href,
    favicon:document.querySelector('link[rel~="icon"]')?.href||null,
    themeColor:document.querySelector('meta[name="theme-color"]')?.content||null,
    legacySeasonZeroMetadata:/Season Zero|LBTV/i.test(metaText),
    performance:{resourceCount:resources.length,totalTransferBytes,maxResource},
    typography:{nav:css('.topbar nav'),sectionCode:css('.section-code'),sourceTab:css('.source-tab'),homeLabel:css('.v2-section-label')},
    surfaces:{homeHero:css('.v2-hero'),homeWork:css('.v2-work'),castingHero:css('.casting-hero'),projectHero:css('.project-hero'),projectEvidence:css('.project-evidence')}
  };
}, browserName);

async function runBrowser(browserName, browser, browserRoutes, screenshot=true) {
  manifest.browsers[browserName] = {};
  for (const route of browserRoutes) {
    manifest.browsers[browserName][route.key] = {};
    const allowed = browserName === 'webkit' ? ['desktop','mobile390'] : route.viewportNames;
    for (const [name,width,height] of viewports.filter(v => allowed.includes(v[0]))) {
      const ctx = await browser.newContext({ viewport:{width,height}, colorScheme:'light' });
      const page = await ctx.newPage();
      const diagnostics = attachDiagnostics(page);
      const prefixBase = route.key === 'home' ? name : `${route.key}-${name}`;
      const prefix = browserName === 'webkit' ? `webkit-${prefixBase}` : prefixBase;

      await page.goto(`${site}${route.path}?visualqa=${sha}-${browserName}-${route.key}-${name}-${Date.now()}`, { waitUntil:'networkidle', timeout:60000 });
      await page.evaluate(() => document.fonts?.ready);

      const interactionFailures = route.key === 'home' ? await testHomeInteractions(page) : route.key === 'casting' ? await testCastingInteractions(page) : await testProjectInteractions(page);
      interactionFailures.push(...await testInternalAnchors(page));

      const max = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y=0; y<max; y+=Math.max(520,Math.floor(height*.72))) {
        await page.evaluate(nextY => scrollTo(0,nextY), y); await page.waitForTimeout(browserName === 'webkit' ? 110 : 80);
      }
      await page.evaluate(() => scrollTo(0,0)); await page.waitForTimeout(350);

      if (screenshot) {
        await page.screenshot({ path:`qa-artifacts/${prefix}-full.png`, fullPage:true });
        for (const [key,selector] of route.scenes) {
          const loc=page.locator(selector).first();
          if (await loc.count() && await loc.isVisible()) {
            await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(120);
            await loc.screenshot({ path:`qa-artifacts/${prefix}-${key}.png` });
          }
        }
      }

      const state = await captureState(page,browserName);
      Object.assign(state,diagnostics,{sha,interactionFailures,horizontalOverflow:state.scrollWidth>state.width});
      state.performanceBudgetExceeded = state.performance.totalTransferBytes > 20 * 1024 * 1024;
      manifest.browsers[browserName][route.key][name]=state;
      fs.writeFileSync(`qa-artifacts/${prefix}-state.json`,JSON.stringify(state,null,2));
      await ctx.close();
    }
  }
}

const chrome = await chromium.launch({ headless:true, executablePath:process.env.CHROME_PATH });
await runBrowser('chromium', chrome, routes, true);
await chrome.close();

const safariLike = await webkit.launch({ headless:true });
await runBrowser('webkit', safariLike, routes.filter(r => ['home','casting'].includes(r.key)), true);
await safariLike.close();

fs.writeFileSync('qa-artifacts/manifest.json',JSON.stringify(manifest,null,2));

const states=Object.values(manifest.browsers).flatMap(browserRoutes =>
  Object.values(browserRoutes).flatMap(route => Object.values(route))
);
const failed=states.some(v =>
  v.horizontalOverflow ||
  v.consoleErrors.length ||
  v.responseErrors.length ||
  v.requestFailures.length ||
  v.interactionFailures.length ||
  v.legacySeasonZeroMetadata ||
  v.performanceBudgetExceeded
);
if(failed){
  console.error('Visual QA found a layout, metadata, browser, network, interaction, anchor, or performance failure. Inspect the artifact manifest.');
  process.exit(1);
}
