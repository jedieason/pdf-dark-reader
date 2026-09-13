import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const upstreamCommit = "7ab3cb01dc9ac8c367e371d945d8b7c6488efeb6";
const upstream = resolve(
  process.argv[2] === "--pdfjs" ? process.argv[3] : join(root, ".cache/pdfjs")
);
const output = join(root, "extension");

if (process.argv[2] === "--pdfjs" && !process.argv[3]) {
  throw new Error("Usage: node scripts/build.mjs [--pdfjs /path/to/pdf.js]");
}

const env = {
  ...process.env,
  PATH: `${dirname(process.execPath)}:${process.env.PATH || ""}`,
};

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, env, stdio: "inherit" });
}

function patchFile(path, replacements) {
  let contents = readFileSync(path, "utf8");
  for (const [before, after] of replacements) {
    const first = contents.indexOf(before);
    if (first === -1) {
      if (contents.includes(after)) {
        continue;
      }
      throw new Error(`Could not find expected upstream code in ${path}: ${before.slice(0, 80)}`);
    }
    // Some new strings include the entire old string (such as imports).
    if (after.includes(before) && contents.includes(after)) {
      continue;
    }
    if (contents.indexOf(before, first + before.length) !== -1) {
      throw new Error(`Ambiguous upstream code in ${path}: ${before.slice(0, 80)}`);
    }
    contents = contents.slice(0, first) + after + contents.slice(first + before.length);
  }
  writeFileSync(path, contents);
}

if (!existsSync(join(upstream, ".git"))) {
  mkdirSync(upstream, { recursive: true });
  run("git", ["init"], upstream);
  run("git", ["remote", "add", "origin", "https://github.com/mozilla/pdf.js.git"], upstream);
  run("git", ["fetch", "--depth=1", "origin", upstreamCommit], upstream);
  run("git", ["checkout", "--detach", "FETCH_HEAD"], upstream);
}

const currentCommit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: upstream,
  encoding: "utf8",
}).trim();
if (currentCommit !== upstreamCommit) {
  throw new Error(`Expected PDF.js ${upstreamCommit}, found ${currentCommit}`);
}

mkdirSync(join(upstream, "dark-pdf"), { recursive: true });
cpSync(join(root, "src/color.mjs"), join(upstream, "dark-pdf/color.mjs"), {
  force: true,
});

patchFile(join(upstream, "src/display/canvas.js"), [
  [
    'import { MathClamp } from "../shared/math_clamp.js";',
    'import { MathClamp } from "../shared/math_clamp.js";\nimport { transformPdfColor } from "../../dark-pdf/color.mjs";',
  ],
  [
    "    dependencyTracker,\n    imagesTracker\n  ) {",
    "    dependencyTracker,\n    imagesTracker,\n    isPrinting = false\n  ) {",
  ],
  [
    "    this.pageColors = pageColors;\n\n    this._cachedScaleForStroking",
    "    this.pageColors = pageColors;\n    this.darkPdfEnabled = !isPrinting &&\n      globalThis.PDFDarkReader?.enabled === true &&\n      globalThis.PDFDarkReader?.fullPage !== true;\n\n    this._cachedScaleForStroking",
  ],
  [
    '    this.ctx.fillStyle = background || "#ffffff";',
    '    this.ctx.fillStyle = this.darkPdfEnabled ? "#181a1b" : background || "#ffffff";',
  ],
  [
    "    this.ctx.save();\n    resetCtxToDefault(this.ctx);\n    if (transform) {",
    "    this.ctx.save();\n    resetCtxToDefault(this.ctx);\n    if (this.darkPdfEnabled) {\n      this.ctx.fillStyle = this.ctx.strokeStyle =\n        transformPdfColor(\"#000000\");\n    }\n    if (transform) {",
  ],
  [
    "  #transferColor(color) {\n    return this.current.transferMapsFallback?.applyToColor(color) ?? color;\n  }",
    "  #transferColor(color) {\n    const transferred = this.current.transferMapsFallback?.applyToColor(color) ?? color;\n    return this.darkPdfEnabled ? transformPdfColor(transferred) : transferred;\n  }",
  ],
]);

patchFile(join(upstream, "src/display/api.js"), [
  [
    "          : null,\n        viewport,\n        transform,\n        background,",
    "          : null,\n        viewport,\n        transform,\n        background,\n        isPrinting: intentPrint,",
  ],
  [
    "      background,\n      dependencyTracker,\n      imagesTracker,\n    } = this.params;",
    "      background,\n      dependencyTracker,\n      imagesTracker,\n      isPrinting,\n    } = this.params;",
  ],
  [
    "      this.pageColors,\n      dependencyTracker,\n      imagesTracker\n    );",
    "      this.pageColors,\n      dependencyTracker,\n      imagesTracker,\n      isPrinting\n    );",
  ],
]);

if (!existsSync(join(upstream, "node_modules/.bin/gulp"))) {
  run("npm", ["ci"], upstream);
}
run(join(upstream, "node_modules/.bin/gulp"), ["chromium"], upstream);

rmSync(output, { recursive: true, force: true });
cpSync(join(upstream, "build/chromium"), output, { recursive: true });
mkdirSync(join(output, "dark-pdf"), { recursive: true });

for (const file of ["settings.mjs", "theme-bridge.mjs", "viewer-theme.css"]) {
  cpSync(join(root, "src", file), join(output, "dark-pdf", file));
}
for (const file of ["popup.html", "popup.css", "popup.mjs"]) {
  cpSync(join(root, "src", file), join(output, file));
}

const viewerHtml = join(output, "content/web/viewer.html");
patchFile(viewerHtml, [
  [
    '<html dir="ltr" mozdisallowselectionprint>',
    '<html dir="ltr" class="pdf-dark-pending" mozdisallowselectionprint>',
  ],
  [
    '<link rel="stylesheet" href="viewer.css" />',
    '<link rel="stylesheet" href="viewer.css" />\n    <link rel="stylesheet" href="../../dark-pdf/viewer-theme.css" />',
  ],
  [
    '<script src="viewer.mjs" type="module"></script>',
    '<script src="../../dark-pdf/theme-bridge.mjs" type="module"></script>',
  ],
]);

const manifestPath = join(output, "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
manifest.name = "PDF Dark Reader";
manifest.version = "1.0.0";
manifest.description = "Read PDFs with comfortable dark pages while preserving embedded photos and figures.";
manifest.minimum_chrome_version = "128";
manifest.action = {
  default_title: "PDF Dark Reader",
  default_popup: "popup.html",
  default_icon: {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png",
  },
};
manifest.permissions = manifest.permissions.filter(permission => permission !== "alarms");
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const backgroundPath = join(output, "background.js");
patchFile(backgroundPath, [
  [
    '  "suppress-update.js",\n  "telemetry.js"',
    '  "suppress-update.js"',
  ],
]);
rmSync(join(output, "telemetry.js"), { force: true });

for (const size of [16, 48, 128]) {
  cpSync(join(root, `assets/icon${size}.png`), join(output, `icon${size}.png`));
}

console.log(`\nReady to load in Chrome: ${output}`);
