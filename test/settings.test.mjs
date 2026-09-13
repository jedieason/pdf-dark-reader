import assert from "node:assert/strict";
import test from "node:test";
import { isDark, normalizeSettings } from "../src/settings.mjs";

test("saved settings are validated", () => {
  assert.deepEqual(normalizeSettings({ mode: "unknown", fullPage: 1 }), {
    mode: "system",
    fullPage: false,
  });
});

test("system follows the device while explicit modes override it", () => {
  assert.equal(isDark({ mode: "system" }, true), true);
  assert.equal(isDark({ mode: "system" }, false), false);
  assert.equal(isDark({ mode: "dark" }, false), true);
  assert.equal(isDark({ mode: "light" }, true), false);
});
