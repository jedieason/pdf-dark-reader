export const STORAGE_KEY = "pdfDarkReaderSettings";
export const DEFAULT_SETTINGS = Object.freeze({
  mode: "system",
  fullPage: false,
});

export function normalizeSettings(value) {
  return {
    mode: ["light", "dark", "system"].includes(value?.mode)
      ? value.mode
      : DEFAULT_SETTINGS.mode,
    fullPage: value?.fullPage === true,
  };
}

export function isDark(settings, systemDark) {
  return settings.mode === "dark" ||
    (settings.mode === "system" && systemDark);
}
