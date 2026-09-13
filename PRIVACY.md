# Privacy

PDF Dark Reader runs in Chrome. It requests broad URL access because a PDF can be served from any site, and the extension needs to recognize and open those PDF responses in its viewer. Access to `file://` PDFs is optional and must be enabled separately in Chrome.

The extension stores your selected appearance mode and full-page preference in `chrome.storage.sync`. Chrome may sync that setting with your signed-in browser profile. PDF.js may also store standard viewer preferences in browser storage.

PDF bytes are retrieved from the URL or local file you open and rendered in Chrome. This project does not include an analytics endpoint, advertising SDK, or server that receives PDF contents. The upstream PDF.js extension's telemetry script is removed from this build.

The extension may still connect to the original site to retrieve a web PDF, just as a PDF viewer must. Printing and downloading are handled by PDF.js and Chrome. Review Chrome's browser and sync settings for the controls over browser-managed data.
