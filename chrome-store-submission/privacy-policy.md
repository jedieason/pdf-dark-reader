# PDF Dark Reader Privacy Policy

Last updated: September 14, 2026

PDF Dark Reader is maintained by jedieason. Its purpose is to provide a customizable dark reading appearance for PDF documents in Chrome.

## Documents and network requests
PDF files are parsed and rendered in your browser. The extension does not upload document contents to the developer, and has no developer-operated document-processing server, analytics endpoint, advertising SDK, or tracking service.

When you open a web PDF, the viewer requests it from its original website. That website receives ordinary network request information and may use its existing authentication/session mechanisms. A PDF request may include the original Referer header so sites that depend on that header continue to work. Local PDFs are accessed only when Chrome's file URL access setting permits it. Following links in a PDF navigates to the destination you choose and is subject to that site's practices.

## Temporary navigation information
To load PDFs correctly, the bundled PDF.js integration observes HTTP(S) main-frame and sub-frame request metadata, temporarily keeping referrer values and whether a request used a non-GET method. This includes navigation metadata before a document is known to be a PDF. The in-memory cache expires after five minutes without further relevant activity for a tab, or when the service worker stops. A referrer may also remain associated with an open viewer in its history state and PDF-request session rule until that viewer is closed or navigated away. This information is used for PDF loading, not analytics, advertising, or developer browsing-history collection.

## Preferences and local storage
Appearance choices and standard PDF.js viewer preferences are stored through Chrome's storage APIs. Chrome may sync preferences to your signed-in profile under your browser's sync settings. The developer does not receive this synced data.

PDF.js stores recent document fingerprints and viewing state, such as reading position and zoom, in browser-local storage. These records are used to resume viewing rather than to create a developer browsing-history database. Session storage is also used for internal PDF-routing state. Settings and local viewing records remain until cleared or removed by Chrome; browser-managed cache, history, downloads, and sync retention depend on Chrome's settings. Downloaded or printed files remain wherever you choose to save them.

## Use and sharing
The extension does not sell user data, use it for advertising, use it for creditworthiness or lending, or transfer it for purposes unrelated to PDF viewing. Document handling and temporary request metadata support only the reader's functionality. Source websites and Chrome's sync services handle their respective requests under their own policies.

## Your controls
You can change reading preferences in the popup, manage Chrome sync, limit site access, enable or disable file URL access, or uninstall the extension through chrome://extensions. Restricting site access can prevent automatic PDF opening on those sites. Use Chrome's data controls to manage browser storage and history. Saved downloads are not removed by uninstalling the extension.

## Contact and changes
For questions about this policy, contact the maintainer through https://github.com/jedieason/pdf-dark-reader/issues. Do not include private PDF contents or sensitive personal information in a public issue. Policy updates will be published here with a revised date.
