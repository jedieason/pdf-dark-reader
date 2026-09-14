import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'chrome-store-submission');
const req = createRequire(import.meta.url);
const { chromium } = req(process.env.PLAYWRIGHT_PATH || '/Users/jedieason/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true});
const page = await browser.newPage({deviceScaleFactor:1});
const data = async p => 'data:image/png;base64,'+(await readFile(resolve(root,p))).toString('base64');
let popupHtml = await readFile(resolve(root,'extension/popup.html'),'utf8');
popupHtml = popupHtml.replace('<link rel="stylesheet" href="popup.css" />', `<style>${await readFile(resolve(root,'extension/popup.css'),'utf8')}</style>`).replace('<script src="popup.mjs" type="module"></script>','').replace('class="pending"','data-theme="light"').replace('src="icon48.png"',`src="${await data('assets/icon48.png')}"`).replace('value="system"','value="system" checked').replace('id="full-page"','id="full-page" disabled');
await page.setViewportSize({width:320,height:400});
await page.setContent(popupHtml);
await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
await page.screenshot({path:resolve(root,'docs/popup-preview.png')});
const [dark,light,popup,icon]=await Promise.all(['docs/viewer-preview.png','docs/light-preview.png','docs/popup-preview.png','assets/logo.png'].map(data));
await mkdir(resolve(out,'asset-sources'),{recursive:true});
await mkdir(resolve(out,'store-assets'),{recursive:true});
async function render(name,w,h,body,transparent=false){
  const html=`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${transparent?'transparent':'#181a1b'};color:#fff8fb;font-family:Arial,sans-serif}h1,p{margin:0} .label{font-size:20px;font-weight:600;color:#ffe6a1}</style>${body}`;
  await writeFile(resolve(out,'asset-sources',name+'.html'),html);
  await page.setViewportSize({width:w,height:h}); await page.setContent(html); await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode()))); await page.screenshot({path:resolve(out,'store-assets',name+'.png'),omitBackground:transparent});
}
await render('store-icon-128',128,128,`<img src="${icon}" style="position:absolute;width:102px;height:102px;left:13px;top:13px">`,true);
await render('icon32',32,32,`<img src="${icon}" width="32" height="32">`,true);
for(const [n,src] of [['01',dark],['02',light]]) await render('screenshot-'+n,1280,800,`<img src="${src}" style="display:block;width:1280px;height:1280px;max-width:none">`);
await render('screenshot-03',1280,800,`<img src="${dark}" style="position:absolute;width:960px;height:960px;left:0;top:0"><img src="${popup}" style="position:absolute;right:0;top:0;width:320px;height:400px"><div style="position:absolute;right:24px;top:446px;width:272px"><h1 style="font-size:30px;line-height:1.15">Your reading<br>appearance.</h1><p style="font-size:19px;line-height:1.6;margin-top:24px;color:#d5d0c4">Light, Dark, or System.<br>Full-page mode for scans.</p></div>`);
await render('screenshot-04',1280,800,`<div style="display:flex;height:58px;align-items:center"><div class="label" style="width:50%;padding-left:30px">Light · original colors</div><div class="label" style="padding-left:30px">Dark · raster colors preserved</div></div><img src="${light}" style="position:absolute;left:0;top:58px;width:640px;height:640px"><img src="${dark}" style="position:absolute;left:640px;top:58px;width:640px;height:640px"><p style="position:absolute;bottom:35px;left:30px;font-size:23px;color:#ffe6a1">The same PDF. A different reading appearance.</p>`);
// The supplied mascot is the shared focal point of both promotional formats.
await render('promo-small-440x280',440,280,`<div style="height:100%;background:radial-gradient(ellipse at 88% 40%,#514015 0,#181a1b 65%)"><div style="position:absolute;left:26px;top:30px;color:#ffd044;font-size:11px;letter-spacing:2px">PDF DARK READER</div><h1 style="position:absolute;left:26px;top:78px;font-size:39px;line-height:1.06;letter-spacing:-1px">Bright ideas.<br>Dark pages.</h1><p style="position:absolute;left:27px;bottom:31px;font-size:13px;color:#d5d0c4">A calmer way to read PDFs.</p><img src="${icon}" style="position:absolute;right:-12px;top:61px;width:206px;height:206px;object-fit:contain"></div>`);
await render('promo-marquee-1400x560',1400,560,`<div style="height:100%;background:radial-gradient(ellipse at 80% 48%,#514015 0,#181a1b 65%)"><p style="position:absolute;left:80px;top:68px;font-size:19px;letter-spacing:4px;color:#ffd044">PDF DARK READER</p><h1 style="position:absolute;left:76px;top:154px;font-size:86px;letter-spacing:-4px;line-height:1.04">Bright ideas.<br>Dark pages.</h1><p style="position:absolute;left:80px;top:381px;font-size:25px;color:#d5d0c4">A calmer way to read PDFs.</p><p style="position:absolute;left:80px;top:461px;font-size:16px;color:#b8b4a9">Dark reading · Original photo colors · Made for Chrome</p><img src="${icon}" style="position:absolute;left:850px;top:35px;width:480px;height:480px;object-fit:contain"></div>`);
await cp(resolve(out,'store-assets/promo-marquee-1400x560.png'),resolve(root,'docs/brand-hero.png'));
await browser.close();
const policy=await readFile(resolve(out,'privacy-policy.md'),'utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
await writeFile(resolve(out,'privacy-policy.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PDF Dark Reader Privacy Policy</title><style>body{max-width:760px;margin:60px auto;padding:0 24px;font:17px/1.7 system-ui;color:#241c21}h1,h2{line-height:1.25}h2{margin-top:36px}</style>'+policy.split('\n\n').map(p=>p.startsWith('# ')?'<h1>'+esc(p.slice(2))+'</h1>':p.startsWith('## ')?'<h2>'+esc(p.slice(3))+'</h2>':'<p>'+esc(p).replaceAll('https://github.com/jedieason/pdf-dark-reader/issues','<a href="https://github.com/jedieason/pdf-dark-reader/issues">GitHub support</a>')+'</p>').join('\n')+'</html>');
console.log('Rendered store assets and policy HTML.');
