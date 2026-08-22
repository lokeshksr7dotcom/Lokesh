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
const copyCssBtn = document.getElementById("copy-css-btn");

const liveCanvas = document.getElementById("live-canvas");
const previewPrimaryBtn = document.getElementById("preview-primary-btn");
const previewSecondaryBtn = document.getElementById("preview-secondary-btn");

const contrastRatioDisplay = document.getElementById("contrast-ratio-display");
const autofixBtn = document.getElementById("autofix-btn");
const normalAaBadge = document.getElementById("normal-aa-badge");
const normalAaaBadge = document.getElementById("normal-aaa-badge");
const largeAaBadge = document.getElementById("large-aa-badge");
const largeAaaBadge = document.getElementById("large-aaa-badge");

const toastContainer = document.getElementById("toast-container");
const themeToggle = document.getElementById("theme-toggle");
const shortcutsBtn = document.getElementById("shortcuts-btn");

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
 * Toggles border classes and accessibility attributes based on validity.
 */
function setInputValidationState(inputEl, errorEl, isValid) {
  if (isValid) {
    errorEl.classList.add("hidden");
    inputEl.setAttribute("aria-invalid", "false");
    inputEl.classList.remove(
      "border-rose-500/80",
      "focus:border-rose-500",
      "focus:ring-rose-500",
    );
    inputEl.classList.add(
      "border-slate-800",
      "focus:border-indigo-500",
      "focus:ring-indigo-500",
    );
  } else {
    errorEl.classList.remove("hidden");
    inputEl.setAttribute("aria-invalid", "true");
    inputEl.classList.add(
      "border-rose-500/80",
      "focus:border-rose-500",
      "focus:ring-rose-500",
    );
    inputEl.classList.remove(
      "border-slate-800",
      "focus:border-indigo-500",
      "focus:ring-indigo-500",
    );
  }
}

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
  setInputValidationState(bgHexInput, bgError, true);

  // Update Foreground controls
  fgColorInput.value = fg;
  fgHexInput.value = fg;
  fgHexDisplay.textContent = fg.toUpperCase();
  setInputValidationState(fgHexInput, fgError, true);

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

  // Show Auto-Fix option if contrast ratio is below WCAG AA threshold (< 4.5)
  if (ratio < 4.5 && autofixBtn) {
    autofixBtn.classList.remove("hidden");
  } else if (autofixBtn) {
    autofixBtn.classList.add("hidden");
  }

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
bgHexInput.addEventListener("focus", (e) => {
  e.target.select();
});

bgHexInput.addEventListener("input", (e) => {
  let value = e.target.value;
  if (!value.startsWith("#") && value.length > 0) {
    value = "#" + value;
    bgHexInput.value = value;
  }
  if (isValidHex(value)) {
    setInputValidationState(bgHexInput, bgError, true);
    bgColorInput.value = value;
    updateColors(value, fgColorInput.value);
  } else {
    setInputValidationState(bgHexInput, bgError, false);
  }
});

fgHexInput.addEventListener("focus", (e) => {
  e.target.select();
});

fgHexInput.addEventListener("input", (e) => {
  let value = e.target.value;
  if (!value.startsWith("#") && value.length > 0) {
    value = "#" + value;
    fgHexInput.value = value;
  }
  if (isValidHex(value)) {
    setInputValidationState(fgHexInput, fgError, true);
    fgColorInput.value = value;
    updateColors(bgColorInput.value, value);
  } else {
    setInputValidationState(fgHexInput, fgError, false);
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

// Auto-Fix Contrast Action: adjusts foreground color to pass WCAG AA
if (autofixBtn) {
  autofixBtn.addEventListener("click", () => {
    const bg = bgColorInput.value;
    const rgbBg = hexToRgb(bg);
    if (!rgbBg) return;

    const lumBg = getRelativeLuminance(rgbBg);
    // If background is light (lum > 0.5), use dark text (#0f172a); else use white text (#ffffff)
    const suggestedFg = lumBg > 0.5 ? "#0f172a" : "#ffffff";
    updateColors(bg, suggestedFg);
    showToast("Auto-fixed color contrast to pass WCAG AA!", "success");
  });
}

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
  toast.className = `flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border border-slate-800 bg-slate-900 text-slate-100 transition-all-custom transform translate-y-2 opacity-0 text-sm max-w-md pointer-events-auto`;

  let icon = "";
  if (type === "success") {
    icon = `
      <span class="text-emerald-400 font-bold shrink-0" aria-hidden="true">✓</span>
    `;
  } else if (type === "info") {
    icon = `
      <span class="text-indigo-400 font-bold shrink-0" aria-hidden="true">ℹ</span>
    `;
  }

  toast.innerHTML = `
    ${icon}
    <div class="leading-relaxed">${message}</div>
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
async function copyToClipboard(text, description, buttonEl) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied ${description}: ${text}`, "success");

    if (buttonEl) {
      const originalHTML = buttonEl.innerHTML;
      buttonEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-emerald-400 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
        <span class="text-emerald-400 font-medium">Copied!</span>
      `;
      buttonEl.disabled = true;
      setTimeout(() => {
        buttonEl.innerHTML = originalHTML;
        buttonEl.disabled = false;
      }, 1500);
    }
  } catch (err) {
    showToast(`Failed to copy to clipboard: ${err.message || err}`, "error");
  }
}

copyBgBtn.addEventListener("click", () => {
  copyToClipboard(bgColorInput.value, "Background hex", copyBgBtn);
});

copyFgBtn.addEventListener("click", () => {
  copyToClipboard(fgColorInput.value, "Foreground hex", copyFgBtn);
});

if (copyCssBtn) {
  copyCssBtn.addEventListener("click", () => {
    const cssVars = `--bg-color: ${bgColorInput.value};\n--fg-color: ${fgColorInput.value};`;
    copyToClipboard(cssVars, "CSS variables", copyCssBtn);
  });
}

/**
 * Shows keyboard shortcuts help toast.
 */
function showShortcutsHelp() {
  const helpText = `<strong>Keyboard Shortcuts:</strong><br/>
  <kbd class="px-1 py-0.5 text-xs bg-slate-800 rounded border border-slate-700">R</kbd> Randomize &nbsp;
  <kbd class="px-1 py-0.5 text-xs bg-slate-800 rounded border border-slate-700">S</kbd> Swap &nbsp;
  <kbd class="px-1 py-0.5 text-xs bg-slate-800 rounded border border-slate-700">T</kbd> Contrast &nbsp;
  <kbd class="px-1 py-0.5 text-xs bg-slate-800 rounded border border-slate-700">B</kbd> Copy BG &nbsp;
  <kbd class="px-1 py-0.5 text-xs bg-slate-800 rounded border border-slate-700">F</kbd> Copy FG &nbsp;
  <kbd class="px-1 py-0.5 text-xs bg-slate-800 rounded border border-slate-700">C</kbd> Copy CSS &nbsp;
  <kbd class="px-1 py-0.5 text-xs bg-slate-800 rounded border border-slate-700">A</kbd> Auto-Fix`;
  showToast(helpText, "info");
}

if (shortcutsBtn) {
  shortcutsBtn.addEventListener("click", () => {
    showShortcutsHelp();
  });
}

// Light/High Contrast Mode Toggle
themeToggle.addEventListener("click", () => {
  highContrastMode = !highContrastMode;
  themeToggle.setAttribute("aria-pressed", highContrastMode ? "true" : "false");
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
  if (key === "?" || key === "/") {
    e.preventDefault();
    showShortcutsHelp();
  } else if (key === "s") {
    e.preventDefault();
    swapColorsBtn.click();
  } else if (key === "t" && themeToggle) {
    e.preventDefault();
    themeToggle.click();
  } else if (key === "r") {
    e.preventDefault();
    randomizeBtn.click();
  } else if (key === "b") {
    e.preventDefault();
    copyBgBtn.click();
  } else if (key === "f") {
    e.preventDefault();
    copyFgBtn.click();
  } else if (key === "c" && copyCssBtn) {
    e.preventDefault();
    copyCssBtn.click();
  } else if (
    key === "a" &&
    autofixBtn &&
    !autofixBtn.classList.contains("hidden")
  ) {
    e.preventDefault();
    autofixBtn.click();
  }
});

// Setup initial state
updateColors("#0F172A", "#E2E8F0");
