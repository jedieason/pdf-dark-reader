# Validation — September 14, 2026

- Existing Node test suite: 6 tests passed (color conversion, settings, packaged service-worker dependencies).
- Extension ZIP: CRC/integrity check passed; manifest.json is at the root; required popup, background, and icon paths exist.
- Summary: 83 characters, within the 132-character limit.
- Every packaged .js, .mjs, and .wasm file is byte-identical to the ready-to-load repository extension. No upstream rebuild was performed.
- Brand refresh: added the yellow mascot at 16/32/48/128px, synchronized popup source and packaged UI, and rebuilt both promotional graphics. The store-only 128px icon has listing padding. Extension icons are byte-identical across the repo and upload ZIP.
- Image checks: four RGB 1280×800 screenshots, RGB 440×280 small promotion, RGB 1400×560 marquee, RGBA 128×128 store icon and 32×32 icon. All final listing images were visually inspected.
- Screenshots use the repository's existing real Chrome captures of a project-owned synthetic PDF. Viewer images are scaled/cropped or arranged together in HTML. The refreshed popup is rendered from current extension markup with static System/light state; this run did not capture a new installed-extension session. The side-by-side popup layout is a listing composition, not a new product panel.
- Code review covered manifest permissions, routing, referrer handling, theme storage, PDF.js preferences/history, and bundled runtime resources. This is a submission preparation review, not a comprehensive security audit or Chrome Web Store approval.
- Live installation, web/local PDF loading, scans, print preview, and cross-tab switching still need the manual smoke test in CHROMEWEBSTORE.md. Existing screenshots and unit tests do not prove every PDF/site workflow works.
- Repository homepage/support/privacy URLs could not be confirmed publicly accessible. Publish the policy and verify links while signed out before submission.
- No dashboard submission, hosting deployment, account registration, or external publication was performed.

## Reproduce from the repository root

```sh
node scripts/generate-icons.mjs
node scripts/prepare-store.mjs
python3 scripts/package-store.py
node --test test/*.test.mjs
```

The asset renderer needs Playwright and Chrome. Override PLAYWRIGHT_PATH with the installed Playwright package path and CHROME_PATH with your Chrome executable if different from this machine. It uses a temporary browser profile. HTML asset sources are in asset-sources/. The ZIP checksum is in SHA256SUMS.txt.
