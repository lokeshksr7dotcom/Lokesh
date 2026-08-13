# Palette's Journal

## 2026-08-08 - Initial Setup on Empty Repository

**Learning:** When starting with an empty repository, the immediate focus is to create the base user interface structure before we can apply micro-UX touches. A simple, interactive web interface utilizing modern, accessible design paradigms should be constructed to serve as the canvas for our micro-UX.
**Action:** Establish a beautifully designed, clean, responsive, and fully accessible single-page web app. Implement a cohesive color palette, clear keyboard navigation focus-visible outlines, proper ARIA labeling, form validations, loading and feedback states.

## 2026-08-13 - Power-User Keyboard Shortcuts and Preset Active Visual States
**Learning:** Keyboard shortcuts are exceptionally empowering for power-users, but they must be carefully scoped using tag-name check exclusions (e.g., bypassing shortcut execution when the active element is an input, textarea, or contenteditable) to avoid unintended activation while typing. Additionally, theme preset buttons benefit greatly from dynamic active indicator states (e.g., rings and `aria-pressed="true"`) to mirror current custom-input color values.
**Action:** Always wrap global document shortcut handlers with focus exclusions for form/input elements, and keep active buttons synchronized visually and semantically via ARIA attributes in real-time.
