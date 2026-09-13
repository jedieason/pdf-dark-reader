import {
  DEFAULT_SETTINGS,
  isDark,
  normalizeSettings,
  STORAGE_KEY,
} from "./settings.mjs";

const systemTheme = matchMedia("(prefers-color-scheme: dark)");
let settings = DEFAULT_SETTINGS;
let viewerReady = false;
let previousTheme = "";

function applyTheme() {
  const enabled = isDark(settings, systemTheme.matches);
  const fullPage = enabled && settings.fullPage;
  const nextTheme = `${enabled}:${fullPage}`;

  globalThis.PDFDarkReader = { enabled, fullPage };
  document.documentElement.dataset.pdfDark = enabled ? "dark" : "light";
  document.documentElement.dataset.pdfFullPage = fullPage ? "true" : "false";
  document.documentElement.classList.remove("pdf-dark-pending");

  if (viewerReady && nextTheme !== previousTheme) {
    globalThis.PDFViewerApplication?.pdfViewer?.refresh();
  }
  previousTheme = nextTheme;
}

try {
  const stored = await chrome.storage.sync.get({
    [STORAGE_KEY]: DEFAULT_SETTINGS,
  });
  settings = normalizeSettings(stored[STORAGE_KEY]);
} catch (error) {
  console.warn("PDF Dark Reader could not load settings:", error);
}

applyTheme();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes[STORAGE_KEY]) {
    settings = normalizeSettings(changes[STORAGE_KEY].newValue);
    applyTheme();
  }
});
systemTheme.addEventListener("change", () => {
  if (settings.mode === "system") {
    applyTheme();
  }
});

await import("../content/web/viewer.mjs");
viewerReady = true;
