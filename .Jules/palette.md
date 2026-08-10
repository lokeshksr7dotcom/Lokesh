# Palette's Journal

## 2026-08-08 - Initial Setup on Empty Repository

**Learning:** When starting with an empty repository, the immediate focus is to create the base user interface structure before we can apply micro-UX touches. A simple, interactive web interface utilizing modern, accessible design paradigms should be constructed to serve as the canvas for our micro-UX.
**Action:** Establish a beautifully designed, clean, responsive, and fully accessible single-page web app. Implement a cohesive color palette, clear keyboard navigation focus-visible outlines, proper ARIA labeling, form validations, loading and feedback states.

## 2026-08-09 - Global Keyboard Shortcuts & Micro-UX Hints

**Learning:** Adding keyboard shortcuts (e.g., R for Randomize, S for Swap) is a fantastic power-user touch, but it requires careful element-type detection. Without filtering out text inputs or contenteditable elements, normal user typing will trigger global actions and disrupt the experience. Visual `<kbd>` elements and explicit ARIA hints must accompany these shortcuts so users discover them intuitively.
**Action:** Always filter the active element (`document.activeElement`) to ignore global shortcuts when users are editing fields. Supplement actions with clear visual cues and updated ARIA labels.

## 2026-08-10 - Smart Hue-Preserving Contrast Suggestion & Auto-Fix

**Learning:** When a color pair fails WCAG contrast compliance, simply notifying the user is helpful, but providing a delightful, instant "Auto-Fix" is an elite UX pattern. To do this gracefully, we shouldn't just reset to plain white or black. Instead, we can run a hue-preserving blending loop that moves the foreground color towards white or black in 1% increments. This preserves the original color temperature and hue characteristics while scaling luminance until it satisfies the WCAG threshold. Synchronous state updates during this flow require capturing the target color locally to avoid state-clearing race conditions in final notifications.
**Action:** Implement iterative blending algorithms to auto-correct accessibility values while respecting the user's initial design intent. Always cache transient state variables before executing full UI refreshes to prevent race conditions in toast elements.
