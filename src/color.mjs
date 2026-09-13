// Colors are changed before PDF.js paints text and vector paths. Embedded
// raster images never pass through this function and retain their colors.
const BACKGROUND = [24, 26, 27];
const FOREGROUND = [232, 230, 227];

function clamp(value, low = 0, high = 1) {
  return Math.min(high, Math.max(low, value));
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case r:
        hue = ((g - b) / delta) % 6;
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      default:
        hue = (r - g) / delta + 4;
    }
    hue = (hue * 60 + 360) % 360;
  }

  return { hue, saturation, lightness };
}

function hslToRgb(hue, saturation, lightness) {
  const chroma =
    (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = hue / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const offset = lightness - chroma / 2;
  const sectors = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second],
  ];
  return sectors[Math.floor(segment) % 6].map(value =>
    Math.round((value + offset) * 255)
  );
}

function parseRgb(color) {
  if (typeof color !== "string") {
    return null;
  }
  const hex = /^#([\da-f]{6}|[\da-f]{3})$/i.exec(color);
  if (hex) {
    const digits = hex[1].length === 3
      ? [...hex[1]].map(char => char + char).join("")
      : hex[1];
    return [0, 2, 4].map(index => parseInt(digits.slice(index, index + 2), 16));
  }
  const rgb = /^rgb\(\s*(\d{1,3})[ ,]+(\d{1,3})[ ,]+(\d{1,3})\s*\)$/i.exec(color);
  return rgb ? rgb.slice(1).map(Number).map(value => clamp(value, 0, 255)) : null;
}

function toHex(rgb) {
  return `#${rgb.map(value => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}

export function transformPdfColor(color) {
  const rgb = parseRgb(color);
  if (!rgb) {
    return color;
  }

  const { hue, saturation, lightness } = rgbToHsl(...rgb);
  const amount = Math.pow(1 - lightness, 0.85);
  if (saturation < 0.06) {
    return toHex(BACKGROUND.map((value, index) =>
      value + (FOREGROUND[index] - value) * amount
    ));
  }

  const darkLightness = 0.10 + amount * 0.80;
  const darkSaturation = clamp(saturation * 0.85, 0, 0.80);
  return toHex(hslToRgb(hue, darkSaturation, darkLightness));
}
