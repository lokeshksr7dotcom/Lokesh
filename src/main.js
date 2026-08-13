import {
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  isValidHex,
  getRandomHex,
} from "./utils.js";

// DOM Selectors
const bgColorInput = document.getElementById("bg-color");
const bgHexInput = document.getElementById("bg-hex-input");
const bgHexDisplay = document.getElementById("bg-hex-display");
const bgError = document.getElementById("bg-error");

const fgColorInput = document.getElementById("fg-color");
const fgHexInput = document.getElementById("fg-hex-input");
const fgHexDisplay = document.getElementById("fg-hex-display");
const fgError = document.getElementById("fg-error");

const randomizeBtn = document.getElementById("randomize-btn");
const swapColorsBtn = document.getElementById("swap-colors-btn");
const copyBgBtn = document.getElementById("copy-bg-btn");
const copyFgBtn = document.getElementById("copy-fg-btn");

const liveCanvas = document.getElementById("live-canvas");
const previewPrimaryBtn = document.getElementById("preview-primary-btn");
const previewSecondaryBtn = document.getElementById("preview-secondary-btn");

const contrastRatioDisplay = document.getElementById("contrast-ratio-display");
const normalAaBadge = document.getElementById("normal-aa-badge");
const normalAaaBadge = document.getElementById("normal-aaa-badge");
const largeAaBadge = document.getElementById("large-aa-badge");
const largeAaaBadge = document.getElementById("large-aaa-badge");

const toastContainer = document.getElementById("toast-container");
const themeToggle = document.getElementById("theme-toggle");

// High Contrast / Accessible mode tracker
let highContrastMode = false;

// Initialize presets
document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const bg = btn.getAttribute("data-bg");
    const fg = btn.getAttribute("data-fg");
    updateColors(bg, fg);
    showToast(`Applied preset theme successfully!`, "success");
  });
});

/**
 * Updates application state and interface based on selected colors.
 * @param {string} bg Hex string for background
 * @param {string} fg Hex string for foreground
 */
function updateColors(bg, fg) {
  const normBg = bg.toLowerCase();
  const normFg = fg.toLowerCase();

  // Update Background controls
  bgColorInput.value = bg;
  bgHexInput.value = bg;
  bgHexDisplay.textContent = bg.toUpperCase();
  bgError.classList.add("hidden");

  // Update Foreground controls
  fgColorInput.value = fg;
  fgHexInput.value = fg;
  fgHexDisplay.textContent = fg.toUpperCase();
  fgError.classList.add("hidden");

  // Update Preview Area Styles
  liveCanvas.style.backgroundColor = bg;
  liveCanvas.style.color = fg;
  previewPrimaryBtn.style.backgroundColor = fg;
  previewPrimaryBtn.style.color = bg;
  previewSecondaryBtn.style.color = fg;
  previewSecondaryBtn.style.borderColor = fg;

  // Calculate Contrast & Update WCAG ratings
  calculateMetrics(bg, fg);

  // Update active preset visual highlights and aria-pressed attributes
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    const pBg = btn.getAttribute("data-bg").toLowerCase();
    const pFg = btn.getAttribute("data-fg").toLowerCase();
    if (pBg === normBg && pFg === normFg) {
      btn.setAttribute("aria-pressed", "true");
      btn.classList.add(
        "ring-2",
        "ring-offset-2",
        "ring-indigo-400",
        "scale-110",
      );
    } else {
      btn.setAttribute("aria-pressed", "false");
      btn.classList.remove(
        "ring-2",
        "ring-offset-2",
        "ring-indigo-400",
        "scale-110",
      );
    }
  });
}

/**
 * Triggers WCAG contrast validation metrics recalculations
 */
function calculateMetrics(bg, fg) {
  const rgbBg = hexToRgb(bg);
  const rgbFg = hexToRgb(fg);

  if (!rgbBg || !rgbFg) return;

  const lumBg = getRelativeLuminance(rgbBg);
  const lumFg = getRelativeLuminance(rgbFg);

  const ratio = getContrastRatio(lumBg, lumFg);
  const ratioString = ratio.toFixed(1) + ":1";

  // Display Ratio
  contrastRatioDisplay.textContent = ratioString;

  // Normal Text AA (Requires 4.5:1)
  updateBadge(normalAaBadge, ratio >= 4.5, "4.5:1");
  // Normal Text AAA (Requires 7.0:1)
  updateBadge(normalAaaBadge, ratio >= 7.0, "7.0:1");
  // Large Text AA (Requires 3.0:1)
  updateBadge(largeAaBadge, ratio >= 3.0, "3.0:1");
  // Large Text AAA (Requires 4.5:1)
  updateBadge(largeAaaBadge, ratio >= 4.5, "4.5:1");
}

/**
 * Updates compliance badge colors and pass/fail text.
 */
function updateBadge(badge, isPassed, requirement) {
  badge.innerHTML = "";
  if (isPassed) {
    badge.className =
      "px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5";
    badge.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
      PASS (${requirement})
    `;
  } else {
    badge.className =
      "px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5";
    badge.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      FAIL (${requirement})
    `;
  }
}

// Interactive Input Handlers (Color Picker Input)
bgColorInput.addEventListener("input", (e) => {
  const newHex = e.target.value;
  bgHexInput.value = newHex;
  bgHexDisplay.textContent = newHex.toUpperCase();
  updateColors(newHex, fgColorInput.value);
});

fgColorInput.addEventListener("input", (e) => {
  const newHex = e.target.value;
  fgHexInput.value = newHex;
  fgHexDisplay.textContent = newHex.toUpperCase();
  updateColors(bgColorInput.value, newHex);
});

// Hex Text Field Inputs with immediate client-side validations
bgHexInput.addEventListener("input", (e) => {
  let value = e.target.value;
  if (!value.startsWith("#") && value.length > 0) {
    value = "#" + value;
    bgHexInput.value = value;
  }
  if (isValidHex(value)) {
    bgError.classList.add("hidden");
    bgColorInput.value = value;
    updateColors(value, fgColorInput.value);
  } else {
    bgError.classList.remove("hidden");
  }
});

fgHexInput.addEventListener("input", (e) => {
  let value = e.target.value;
  if (!value.startsWith("#") && value.length > 0) {
    value = "#" + value;
    fgHexInput.value = value;
  }
  if (isValidHex(value)) {
    fgError.classList.add("hidden");
    fgColorInput.value = value;
    updateColors(bgColorInput.value, value);
  } else {
    fgError.classList.remove("hidden");
  }
});

// Randomizer Action: Selects an incredibly distinct, fully-accessible contrast ratio > 4.5
randomizeBtn.addEventListener("click", () => {
  let bg = getRandomHex();
  let fg = getRandomHex();
  let attempts = 0;

  // Let's retry generating until we get high contrast ratio (at least 5:1 for guaranteed standard AA pass)
  while (attempts < 15) {
    const rgbBg = hexToRgb(bg);
    const rgbFg = hexToRgb(fg);
    if (rgbBg && rgbFg) {
      const lumBg = getRelativeLuminance(rgbBg);
      const lumFg = getRelativeLuminance(rgbFg);
      const ratio = getContrastRatio(lumBg, lumFg);
      if (ratio >= 5.0) break;
    }
    bg = getRandomHex();
    fg = getRandomHex();
    attempts++;
  }

  updateColors(bg, fg);
  showToast("Generated robust contrast color palette!", "success");
});

// Color Swapper Action
swapColorsBtn.addEventListener("click", () => {
  const currentBg = bgColorInput.value;
  const currentFg = fgColorInput.value;
  updateColors(currentFg, currentBg);
  showToast("Swapped background & foreground colors!", "success");
});

// Toast Notifications System for micro-UX delightful confirmations
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border border-slate-800 bg-slate-900 text-slate-100 transition-all-custom transform translate-y-2 opacity-0 text-sm max-w-sm pointer-events-auto`;

  let icon = "";
  if (type === "success") {
    icon = `
      <span class="text-emerald-400 font-bold" aria-hidden="true">✓</span>
    `;
  }

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger entering animations
  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 10);

  // Remove toast after delay
  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, 3000);
}

// Copy Handlers utilizing Navigator Clipboard API with robust feedbacks
async function copyToClipboard(text, description) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied ${description}: ${text}`, "success");
  } catch (err) {
    showToast(`Failed to copy to clipboard: ${err.message || err}`, "error");
  }
}

copyBgBtn.addEventListener("click", () => {
  copyToClipboard(bgColorInput.value, "Background hex");
});

copyFgBtn.addEventListener("click", () => {
  copyToClipboard(fgColorInput.value, "Foreground hex");
});

// Light/High Contrast Mode Toggle
themeToggle.addEventListener("click", () => {
  highContrastMode = !highContrastMode;
  if (highContrastMode) {
    document.documentElement.classList.add("contrast-125");
    themeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    `;
    themeToggle.setAttribute(
      "aria-label",
      "Disable High Contrast Mode/Restore default theme",
    );
    showToast("High Contrast Mode Enabled", "success");
  } else {
    document.documentElement.classList.remove("contrast-125");
    themeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><circle cx="12" cy="12" r="4"/></svg>
    `;
    themeToggle.setAttribute("aria-label", "Toggle High Contrast Mode");
    showToast("High Contrast Mode Disabled", "success");
  }
});

// Global Keyboard Shortcuts for power-users
document.addEventListener("keydown", (e) => {
  // If user is typing in a form input, text field, color picker, etc., ignore shortcuts
  const activeTag = document.activeElement
    ? document.activeElement.tagName.toLowerCase()
    : "";
  if (
    activeTag === "input" ||
    activeTag === "textarea" ||
    (document.activeElement && document.activeElement.isContentEditable)
  ) {
    return;
  }

  // Ignore if any helper/modifier keys are pressed (e.g., Ctrl, Alt, Meta/Cmd, Shift)
  if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
    return;
  }

  const key = e.key.toLowerCase();
  if (key === "s") {
    e.preventDefault();
    swapColorsBtn.click();
  } else if (key === "r") {
    e.preventDefault();
    randomizeBtn.click();
  } else if (key === "b") {
    e.preventDefault();
    copyBgBtn.click();
  } else if (key === "f") {
    e.preventDefault();
    copyFgBtn.click();
  }
});

// Setup initial state
updateColors("#0F172A", "#E2E8F0");
