# Contributing

Thanks for helping make PDFs easier to read. Bug reports, tested fixes, accessibility feedback, and small documentation improvements are welcome.

## Before you start

- Check existing issues and pull requests for related work.
- For a substantial new rendering approach or user-facing feature, open an issue first so the design can be discussed.
- For a security vulnerability, follow [SECURITY.md](SECURITY.md) and do not post exploit details in a public issue.
- Be respectful and constructive; see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Local setup

The committed `extension/` folder can be loaded in Chrome immediately. For development, use Node.js 24.15 or newer and Git:

```sh
git clone https://github.com/jedieason/pdf-dark-reader.git
cd pdf-dark-reader
npm test
npm run build
```

The first build downloads a pinned PDF.js checkout into `.cache/pdfjs` and runs its Chromium build. This takes longer than the fast tests. In `chrome://extensions`, enable Developer mode, load the `extension/` folder, and click **Reload** after rebuilding.

## Where to edit

- Edit `src/` for popup, settings, and theme changes.
- Edit `scripts/build.mjs` for PDF.js renderer patch changes or packaging logic.
- Regenerate `extension/` with `npm run build`; keep the generated folder in the pull request so users can load it without building.
- Add or update a focused test when fixing a behavior that could regress. `test/extension-package.test.mjs` guards against missing background-worker imports.
- Update the README or screenshots when behavior visible to users changes.

Avoid editing generated PDF.js files directly: a rebuild overwrites them. For upstream PDF.js bugs unrelated to this extension, consider reporting the issue to [PDF.js](https://github.com/mozilla/pdf.js) as well.

## Pull request checklist

1. Explain the user-visible problem and the behavior after your change.
2. Run `npm test` and, if you changed rendering or packaging, `npm run build`.
3. Test a normal text PDF and an image-heavy PDF in Chrome when rendering changes.
4. Include before/after screenshots for visual changes and note any PDFs that still behave differently.
5. Keep the patch focused. New dependencies or permissions need a clear reason.

By submitting a contribution, you agree to license it under this repository's Apache 2.0 license and retain required third-party notices.
