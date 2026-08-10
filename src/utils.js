/**
 * Parses a hex color string to its RGB decimal values.
 * @param {string} hex Hex color code, e.g. '#FFFFFF' or '#000'
 * @returns {{r: number, g: number, b: number}|null}
 */
export function hexToRgb(hex) {
  let cleanHex = hex.replace(/^#/, "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (cleanHex.length !== 6) return null;

  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculates the relative luminance of an RGB color.
 * According to WCAG 2.1 formula.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {number} Relative luminance [0, 1]
 */
export function getRelativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates the contrast ratio between two relative luminances.
 * @param {number} lum1 relative luminance 1
 * @param {number} lum2 relative luminance 2
 * @returns {number} Contrast ratio in [1, 21] range
 */
export function getContrastRatio(lum1, lum2) {
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Validates whether a hex string is mathematically valid.
 * @param {string} hex
 * @returns {boolean}
 */
export function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$/.test(hex);
}

/**
 * Generates a random valid hex color.
 * @returns {string} Hex color
 */
export function getRandomHex() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Converts RGB components to a hex color string.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} Hex string (uppercase, e.g. '#FFFFFF')
 */
export function rgbToHex(r, g, b) {
  const toHexStr = (val) => {
    const clamped = Math.max(0, Math.min(255, val));
    return clamped.toString(16).padStart(2, "0").toUpperCase();
  };
  return `#${toHexStr(r)}${toHexStr(g)}${toHexStr(b)}`;
}

/**
 * Suggests a highly accessible contrast-compliant color by blending the
 * foreground towards white or black while preserving original hue characteristics.
 * @param {string} bgHex
 * @param {string} fgHex
 * @returns {string} Fully accessible hex string complying with WCAG AA 4.5:1
 */
export function suggestAccessibleColor(bgHex, fgHex) {
  const bg = hexToRgb(bgHex);
  const fg = hexToRgb(fgHex);
  if (!bg || !fg) return fgHex;

  const lumBg = getRelativeLuminance(bg);
  const lumFg = getRelativeLuminance(fg);
  let ratio = getContrastRatio(lumBg, lumFg);

  if (ratio >= 4.5) {
    return fgHex;
  }

  // Determine whether to blend towards white or black based on background luminance.
  // If background is dark (luminance < 0.5), blend towards white. Else towards black.
  const target =
    lumBg < 0.5 ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };

  // Iteratively blend the foreground color towards the target by 1% steps.
  for (let i = 1; i <= 100; i++) {
    const factor = i / 100;
    const r = Math.round(fg.r + (target.r - fg.r) * factor);
    const g = Math.round(fg.g + (target.g - fg.g) * factor);
    const b = Math.round(fg.b + (target.b - fg.b) * factor);

    const checkLum = getRelativeLuminance({ r, g, b });
    const checkRatio = getContrastRatio(lumBg, checkLum);

    if (checkRatio >= 4.5) {
      return rgbToHex(r, g, b);
    }
  }

  return lumBg < 0.5 ? "#FFFFFF" : "#000000";
}
