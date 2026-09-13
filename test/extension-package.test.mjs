import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const extension = join(import.meta.dirname, "../extension");

test("the packaged service worker only imports files that exist", () => {
  const manifest = JSON.parse(readFileSync(join(extension, "manifest.json"), "utf8"));
  const background = readFileSync(join(extension, manifest.background.service_worker), "utf8");
  const imports = /importScripts\(([\s\S]*?)\);/.exec(background)?.[1];
  assert.ok(imports, "background.js should register its imported scripts");

  for (const [, script] of imports.matchAll(/"([^"]+)"/g)) {
    assert.ok(existsSync(join(extension, script)), `Missing service worker import: ${script}`);
  }
  assert.ok(existsSync(join(extension, manifest.action.default_popup)));
});
