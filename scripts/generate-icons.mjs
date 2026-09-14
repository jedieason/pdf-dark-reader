/** Resize the production logo without redrawing the mascot. */
import { createRequire } from 'node:module';
import { readFile, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/Users/jedieason/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  const page = await browser.newPage();
  const source = 'data:image/png;base64,' + (await readFile(root + 'assets/logo.png')).toString('base64');
  for (const size of [16, 32, 48, 128]) {
    const png = await page.evaluate(async ({source, size}) => {
      const image = new Image(); image.src = source; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d'); ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, size, size);
      return canvas.toDataURL('image/png').split(',')[1];
    }, {source, size});
    await writeFile(root + `assets/icon${size}.png`, Buffer.from(png, 'base64'));
    await cp(root + `assets/icon${size}.png`, root + `extension/icon${size}.png`);
  }
} finally { await browser.close(); }
