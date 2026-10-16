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
