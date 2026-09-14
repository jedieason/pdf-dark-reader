# PDF Dark Reader — Chrome Web Store submission

## Upload
Upload **pdf-dark-reader-1.0.0.zip** only. Do not upload the complete submission folder. The ZIP contains manifest.json at its root. Version: 1.0.0; minimum Chrome: 128. If 1.0.0 was previously uploaded, increment the manifest version and rebuild the ZIP first.

## Product name
PDF Dark Reader

## Summary (83 characters)
Read PDFs with comfortable dark pages while preserving embedded photos and figures.

## Detailed description — copy this section
PDF Dark Reader turns bright PDF pages into a calmer reading experience in Chrome. Its photo-safe dark mode changes ordinary text and solid vector colors while leaving embedded raster images in their original colors.

CHOOSE YOUR APPEARANCE
• Light: read PDFs in their original colors.
• Dark: use dark pages and light text.
• System: follow your device’s light or dark appearance.
• Change your preference from the extension popup; open PDF tabs update automatically.

READ SCANNED DOCUMENTS
For image-only scans that remain bright, enable Full-page mode. This inverts the whole page, including photos and figures. Leave it off when you want embedded images to keep their original colors.

FAMILIAR PDF TOOLS
Built on Mozilla PDF.js, the reader includes search, zoom, text selection, download, and printing. Dark appearance changes are for reading; printing and downloading preserve original document colors.

GET STARTED
Open a direct PDF link in Chrome, then click the PDF Dark Reader toolbar icon to choose an appearance. To read PDFs from your computer, enable “Allow access to file URLs” in the extension’s Details page at chrome://extensions.

PRIVACY
PDFs are rendered in your browser. There are no analytics, ads, or project servers receiving your documents. Web PDFs are fetched from their original websites. Appearance and viewer preferences may sync through Chrome; reading positions are stored locally. Temporary request information is used to load PDFs correctly.

PLEASE NOTE
Light mode still uses the PDF Dark Reader viewer. Patterns, gradients, and some annotations may keep their original colors. Some embedded PDFs need to be opened directly in a tab. Full-page mode also changes image colors. Requires Chrome 128 or newer.

## Listing fields
- Primary language: English
- Category: Accessibility (select the matching category/subcategory offered by the dashboard)
- Price: Free; no sign-in, subscription, or purchase required by the extension
- Homepage candidate: https://github.com/jedieason/pdf-dark-reader
- Support candidate: https://github.com/jedieason/pdf-dark-reader/issues
- Privacy policy candidate AFTER publishing the supplied policy: https://github.com/jedieason/pdf-dark-reader/blob/main/PRIVACY.md
- Promotional video: leave blank; optional

The URLs are based on the configured repository, not confirmed public endpoints. Publish the supplied privacy-policy.md as the repository's PRIVACY.md (or host privacy-policy.html elsewhere), confirm the repository branch and all links in a signed-out browser, then enter the working URLs. Do not paste an unpublished URL.

## Single purpose — copy
Provide a customizable dark reading appearance for PDF documents opened in Chrome, including an optional full-page inversion mode for scanned PDFs.

## Permission justifications — copy each into its matching field

### storage
Saves the user's Light, Dark, or System appearance choice and full-page preference in Chrome sync storage, along with standard PDF.js viewer preferences. Chrome may sync these preferences according to the user's browser settings. Session storage also records PDF routing initialization state.

### tabs
Uses the sending tab's URL to check the parent origin before embedding sensitive local PDFs, routes affected tabs to the PDF viewer, and opens the extension Details page when the user needs to enable file URL access. It does not export a browsing history to the developer.

### webNavigation
Handles navigation to local PDFs when file access is not yet enabled so the viewer can explain how to grant access, and recovers extension-viewer navigation failures by opening the correct viewer URL.

### webRequest
Observes main-frame and sub-frame HTTP(S) request metadata to temporarily retain the Referer header and whether navigation used a non-GET request. PDF.js uses this information to load PDFs correctly on websites that require the original referrer and to avoid incorrectly re-fetching submitted documents. This request metadata is not sent to developer servers.

### declarativeNetRequestWithHostAccess
Registers PDF response routing rules to open supported PDFs in the bundled viewer, includes exceptions needed for downloading or unsupported request flows, and applies a session rule preserving the original Referer header for the viewer's PDF request when required by the source website.

### Host permissions: <all_urls>
PDFs can be hosted at arbitrary URLs, including endpoints without a .pdf suffix and documents embedded in frames. Broad host access lets PDF.js detect and route supported PDF responses and retrieve those documents from their original source. Content scripts detect PDF embeds on HTTP, HTTPS, and permitted file pages. Local file access is separately controlled by Chrome's Allow access to file URLs setting. A fixed domain allowlist would prevent automatic reading of PDFs on other websites.

## Remote code
Select: No, I am not using remote code.

Explanation if requested: JavaScript, PDF.js workers, and WebAssembly resources are bundled in the extension ZIP. The wasm-unsafe-eval CSP allowance supports bundled WebAssembly. Loading a remote PDF retrieves document data, not remotely hosted extension code. PDF.js document scripting is disabled by default. The build script fetches pinned upstream source at build time; it is not part of the installed extension's runtime.

## Data usage
Recommended answers for this build: do not check the personal information, health, financial/payment, authentication, personal communications, location, web history, user activity, or website content COLLECTION boxes. The extension does not collect these categories for the developer or transmit them to an analytics/service backend. PDF content and request metadata are handled for local viewing; source-server requests and Chrome-managed preference sync are described in the policy. This is not a claim that the extension never accesses document content or navigation metadata.

Certify the three statements in the dashboard: data is not sold/transferred to third parties outside approved use cases; data is not used/transferred for purposes unrelated to the single purpose; data is not used/transferred to determine creditworthiness or for lending. These answers are based on the inspected 1.0.0 code and must be revisited if data flows change.

## Reviewer instructions — copy
No account, payment, or credentials are needed. Install the extension in Chrome 128 or newer. Open a direct PDF URL. The PDF should open in the bundled PDF.js viewer. Pin PDF Dark Reader and open its popup. Choose Dark to darken the page and ordinary text while retaining raster image colors. Choose Light to restore original colors, or System to follow the device theme. Open another PDF tab and confirm switching modes updates it too. For an image-only scan, enable Full-page mode; the entire page, including images, should invert. To test a local file, enable Allow access to file URLs in the extension Details page, then open a local PDF. Check search, zoom, download, and print preview; original colors should be retained for printing/download. Some patterned/vector-heavy pages have documented limitations.

## Distribution — proposed launch settings
Public; all available regions. These are suggested settings, not an action already taken. Complete any developer-account contact, identity, payment/registration, two-step verification, and trader-status fields using your actual account details. No identity, address, email, or legal status has been invented.

## Image upload order
1. screenshot-01.png — dark PDF viewer
2. screenshot-02.png — original/light PDF viewer
3. screenshot-03.png — actual appearance controls alongside the viewer
4. screenshot-04.png — light/dark comparison with unchanged raster colors

All are 1280×800 PNGs composed from repository screenshots of the actual extension and its synthetic demo document. Four are supplied to avoid inventing a fifth workflow. Promotional images: promo-small-440x280.png (required), promo-marquee-1400x560.png (optional). Store icon: store-icon-128.png.

## Official references checked September 14, 2026
- Package preparation: https://developer.chrome.com/docs/webstore/prepare
- Images and sizes: https://developer.chrome.com/docs/webstore/images
- Permissions, single purpose, remote code, and disclosure: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- Listing guidance: https://developer.chrome.com/docs/webstore/best-listing
