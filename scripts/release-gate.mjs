import { chromium, webkit } from 'playwright';
import fs from 'node:fs';

const site = 'https://meetlaurenbush.com';
const sha = process.env.QA_SHA || 'unknown';
const chromePath = process.env.CHROME_PATH;
const output = 'release-artifacts';
fs.mkdirSync(output, { recursive: true });

const pages = [
  ['home','/'],
  ['casting','/casting-sheet.html'],
  ['scrambled','/project-scrambled-up.html'],
  ['wimpb','/project-pickleball-bag.html'],
  ['montis','/project-dear-diary-montis.html'],
  ['centerline','/project-honcho-centerline.html']
];

const chromeWidths = [
  ['desktop',1440,1000],
  ['laptop',1024,900],
  ['tablet',768,1024],
  ['wide-mobile',430,932],
  ['mobile',390,844],
  ['small-mobile',360,800]
];
const webkitWidths = [
  ['desktop',1440,1000],
  ['tablet',768,1024],
  ['mobile',390,844]
];
const visualChromeWidths = new Set(['laptop','wide-mobile','small-mobile']);
const visualWebkitWidths = new Set(['desktop','mobile']);

const results = { sha, site, generatedAt:new Date().toISOString(), chrome:{}, webkit:{}, performance:{} };

function diagnostics(page) {
  const state = { consoleErrors:[], responseErrors:[], requestFailures:[] };
  page.on('console', msg => {
    if (msg.type() !== 'error') return;
    const loc = msg.location();
    state.consoleErrors.push({ text:msg.text(), url:loc?.url||null, line:loc?.lineNumber??null });
  });
  page.on('pageerror', err => state.consoleErrors.push({ text:`pageerror: ${err.message}`, url:null }));
  page.on('response', r => { if (r.status() >= 400) state.responseErrors.push({status:r.status(),url:r.url()}); });
  page.on('requestfailed', req => {
    const error = req.failure()?.errorText || 'request failed';
    if (error === 'net::ERR_ABORTED' && req.resourceType() === 'media') return;
    state.requestFailures.push({url:req.url(),error,resourceType:req.resourceType()});
  });
  return state;
}

async function inspectPage(browser, engine, pageKey, path, widthName, width, height, capture) {
  const ctx = await browser.newContext({ viewport:{width,height}, colorScheme:'light', reducedMotion:'no-preference' });
  const page = await ctx.newPage();
  const diag = diagnostics(page);
  await page.goto(`${site}${path}?releaseqa=${sha}-${engine}-${pageKey}-${widthName}-${Date.now()}`, {waitUntil:'networkidle',timeout:60000});
  await page.evaluate(() => document.fonts?.ready);

  const state = await page.evaluate(() => {
    const rect = sel => {
      const el=document.querySelector(sel); if(!el) return null; const r=el.getBoundingClientRect();
      return {x:r.x,y:r.y,width:r.width,height:r.height};
    };
    const links=[...document.querySelectorAll('header a, header button')].filter(el => getComputedStyle(el).display !== 'none');
    const navOverlaps = [];
    for(let i=0;i<links.length;i++) for(let j=i+1;j<links.length;j++) {
      const a=links[i].getBoundingClientRect(), b=links[j].getBoundingClientRect();
      if(a.width && b.width && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) navOverlaps.push([links[i].textContent.trim(),links[j].textContent.trim()]);
    }
    const navEntry=performance.getEntriesByType('navigation')[0];
    const resources=performance.getEntriesByType('resource');
    return {
      release:document.body?.dataset?.releaseStatus||null,
      title:document.title,
      viewport:{width:innerWidth,height:innerHeight},
      scrollWidth:document.documentElement.scrollWidth,
      scrollHeight:document.documentElement.scrollHeight,
      horizontalOverflow:document.documentElement.scrollWidth > innerWidth,
      navOverlaps,
      topbar:rect('.topbar'),
      mainFirst:rect('main > section:first-of-type'),
      favicon:document.querySelector('link[rel~="icon"]')?.href||null,
      themeColor:document.querySelector('meta[name="theme-color"]')?.content||null,
      timing:navEntry ? {domContentLoaded:navEntry.domContentLoadedEventEnd,load:navEntry.loadEventEnd,duration:navEntry.duration} : null,
      transfer:{count:resources.length,transferSize:resources.reduce((s,r)=>s+(r.transferSize||0),0),decodedBodySize:resources.reduce((s,r)=>s+(r.decodedBodySize||0),0)}
    };
  });
  Object.assign(state,diag);

  if(pageKey==='home') {
    try {
      const proof=page.locator('.proof-index-trigger').first();
      if(await proof.count()) { await proof.click(); await page.waitForTimeout(80); state.proofOpens=(await page.locator('#proof-index').getAttribute('aria-hidden'))==='false'; await page.keyboard.press('Escape'); }
      const tabs=page.locator('#watch [data-watch]');
      if(await tabs.count()>=2){ await tabs.nth(1).click(); await page.waitForTimeout(80); state.watchSwitches=(await tabs.nth(1).getAttribute('aria-selected'))==='true'; }
    } catch(e){ state.interactionError=e.message; }
  }

  if(capture) {
    await page.evaluate(() => scrollTo(0,0)); await page.waitForTimeout(150);
    await page.screenshot({path:`${output}/${engine}-${pageKey}-${widthName}-full.png`,fullPage:true});
  }

  await ctx.close();
  return state;
}

async function runEngine(engine,browser,widths,captureWidths){
  const bucket=results[engine];
  for(const [pageKey,path] of pages){
    bucket[pageKey]={};
    for(const [widthName,width,height] of widths){
      const capture=captureWidths.has(widthName) && (pageKey==='home'||pageKey==='casting'||widthName==='small-mobile'||(engine==='webkit'&&widthName==='mobile'));
      bucket[pageKey][widthName]=await inspectPage(browser,engine,pageKey,path,widthName,width,height,capture);
    }
  }
}

const chrome = await chromium.launch({headless:true,executablePath:chromePath});
await runEngine('chrome',chrome,chromeWidths,visualChromeWidths);
await chrome.close();

const wk = await webkit.launch({headless:true});
await runEngine('webkit',wk,webkitWidths,visualWebkitWidths);
await wk.close();

// Performance budget is observational because no historical numeric budget was defined.
// Record cold-navigation timing and transfer data from the 1440 Chrome run and flag obvious regressions.
for(const [pageKey] of pages){
  const p=results.chrome[pageKey].desktop;
  results.performance[pageKey]={timing:p.timing,transfer:p.transfer};
}

const states=[...Object.values(results.chrome),...Object.values(results.webkit)].flatMap(page=>Object.values(page));
const failures=[];
for(const s of states){
  if(s.horizontalOverflow) failures.push(`overflow ${s.title} ${s.viewport.width}`);
  if(s.navOverlaps?.length) failures.push(`nav overlap ${s.title} ${s.viewport.width}: ${JSON.stringify(s.navOverlaps)}`);
  if(s.consoleErrors?.length) failures.push(`console ${s.title} ${s.viewport.width}: ${JSON.stringify(s.consoleErrors)}`);
  if(s.responseErrors?.length) failures.push(`response ${s.title} ${s.viewport.width}: ${JSON.stringify(s.responseErrors)}`);
  if(s.requestFailures?.length) failures.push(`request ${s.title} ${s.viewport.width}: ${JSON.stringify(s.requestFailures)}`);
  if(s.interactionError) failures.push(`interaction ${s.title}: ${s.interactionError}`);
  if(s.proofOpens===false) failures.push(`proof drawer failed ${s.viewport.width}`);
  if(s.watchSwitches===false) failures.push(`watch switch failed ${s.viewport.width}`);
}
results.failures=failures;
fs.writeFileSync(`${output}/release-gate.json`,JSON.stringify(results,null,2));
fs.writeFileSync(`${output}/performance-summary.json`,JSON.stringify(results.performance,null,2));

if(failures.length){
  console.error(failures.join('\n'));
  process.exit(1);
}
