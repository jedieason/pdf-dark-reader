import {
  DEFAULT_SETTINGS,
  isDark,
  normalizeSettings,
  STORAGE_KEY,
} from "./dark-pdf/settings.mjs";

const descriptions = {
  light: "Show PDFs in their original colors.",
  dark: "Darken text and page colors while keeping photos natural.",
  system: "Follows your device appearance.",
};

const systemTheme = matchMedia("(prefers-color-scheme: dark)");
const modeInputs = [...document.querySelectorAll('input[name="mode"]')];
const fullPageInput = document.getElementById("full-page");
const status = document.getElementById("status");
const description = document.getElementById("mode-description");
let settings = DEFAULT_SETTINGS;

function render() {
  for (const input of modeInputs) {
    input.checked = input.value === settings.mode;
  }
  fullPageInput.checked = settings.fullPage;
  const dark = isDark(settings, systemTheme.matches);
  fullPageInput.disabled = !dark;
  document.body.dataset.theme = dark
    ? "dark"
    : "light";
  status.textContent = settings.mode === "system"
    ? `Auto · ${systemTheme.matches ? "Dark" : "Light"}`
    : settings.mode === "dark" ? "On" : "Off";
  description.textContent = descriptions[settings.mode];
  document.body.classList.remove("pending");
}

async function save(next) {
  settings = normalizeSettings({ ...settings, ...next });
  render();
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
  } catch (error) {
    status.textContent = "Could not save";
    console.error("PDF Dark Reader could not save settings:", error);
  }
}

try {
  const stored = await chrome.storage.sync.get({
    [STORAGE_KEY]: DEFAULT_SETTINGS,
  });
  settings = normalizeSettings(stored[STORAGE_KEY]);
} catch (error) {
  console.warn("PDF Dark Reader could not load settings:", error);
}
render();

for (const input of modeInputs) {
  input.addEventListener("change", () => {
    if (input.checked) {
      save({ mode: input.value });
    }
  });
}
fullPageInput.addEventListener("change", () =>
  save({ fullPage: fullPageInput.checked })
);
systemTheme.addEventListener("change", render);
