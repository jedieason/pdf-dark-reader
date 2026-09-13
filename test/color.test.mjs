import assert from "node:assert/strict";
import test from "node:test";
import { transformPdfColor } from "../src/color.mjs";

test("neutral paper and text become comfortable dark colors", () => {
  assert.equal(transformPdfColor("#ffffff"), "#181a1b");
  assert.equal(transformPdfColor("#000000"), "#e8e6e3");
});

test("hued vectors remain in their original color family", () => {
  const blue = transformPdfColor("#0066cc");
  const red = transformPdfColor("#cc0000");
  assert.match(blue, /^#[0-9a-f]{6}$/);
  assert.match(red, /^#[0-9a-f]{6}$/);
  const blueRgb = [1, 3, 5].map(index => parseInt(blue.slice(index, index + 2), 16));
  const redRgb = [1, 3, 5].map(index => parseInt(red.slice(index, index + 2), 16));
  assert.ok(blueRgb[2] > blueRgb[0]);
  assert.ok(redRgb[0] > redRgb[2]);
});

test("unsupported canvas styles are left unchanged", () => {
  assert.equal(transformPdfColor("transparent"), "transparent");
  assert.equal(transformPdfColor("currentColor"), "currentColor");
});
