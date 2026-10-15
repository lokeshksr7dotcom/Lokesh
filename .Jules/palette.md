# Palette's Journal

## 2026-08-08 - Initial Setup on Empty Repository

**Learning:** When starting with an empty repository, the immediate focus is to create the base user interface structure before we can apply micro-UX touches. A simple, interactive web interface utilizing modern, accessible design paradigms should be constructed to serve as the canvas for our micro-UX.
**Action:** Establish a beautifully designed, clean, responsive, and fully accessible single-page web app. Implement a cohesive color palette, clear keyboard navigation focus-visible outlines, proper ARIA labeling, form validations, loading and feedback states.

## 2026-08-13 - Power-User Keyboard Shortcuts and Preset Active Visual States

**Learning:** Keyboard shortcuts are exceptionally empowering for power-users, but they must be carefully scoped using tag-name check exclusions (e.g., bypassing shortcut execution when the active element is an input, textarea, or contenteditable) to avoid unintended activation while typing. Additionally, theme preset buttons benefit greatly from dynamic active indicator states (e.g., rings and `aria-pressed="true"`) to mirror current custom-input color values.
**Action:** Always wrap global document shortcut handlers with focus exclusions for form/input elements, and keep active buttons synchronized visually and semantically via ARIA attributes in real-time.

## 2026-08-14 - Inline Button Feedbacks and Dynamic Input Validation States

**Learning:** Adding temporary inline transition state feedbacks on Copy Actions (like a checkmark and "Copied!") provides immediate visual confirmation that completely removes user ambiguity about whether the action succeeded, especially when toast components are off-screen or overlooked. Toggling custom visual borders alongside screen-reader-visible attributes (`aria-invalid="true"/"false"`) ensures validations are fully perceivable to both sighted and assistive-technology users.
**Action:** Always pair visual invalid states (e.g., red input outlines) with corresponding semantic ARIA attributes (`aria-invalid`), and implement clear, temporary, disabled-state copy button confirmations.

## 2026-08-15 - Contextual Auto-Fix Actions & Keyboard Focus Outlines

**Learning:** When users encounter accessibility validation failures (such as failing WCAG contrast thresholds), offering a contextual, one-click "Auto-Fix" suggestion removes friction and empowers users to immediately achieve compliance rather than guessing hex values. Ensuring all interactive utility buttons maintain distinct `focus-visible` ring outlines guarantees parity for keyboard-only navigation.
**Action:** Provide contextual auto-remediation triggers when accessibility constraints fail, and verify `focus-visible` ring utility classes are consistently present on every action element.

## 2026-08-22 - Keyboard Shortcut Parity & Form Error ARIA Descriptions

**Learning:** Form input errors need explicit `aria-describedby` associations so screen readers announce validation error messages when inputs receive focus or fail validation. Global theme toggle controls also benefit from direct keyboard shortcut triggers ('T') paired with `aria-keyshortcuts` attributes for accessible power-user navigation.
**Action:** Always link form inputs to error hint element IDs via `aria-describedby`, and provide matching `aria-keyshortcuts` attributes when binding global keyboard shortcuts to action buttons.

## 2026-10-04 - Keyboard Focus Retention on Copy Feedbacks & Dynamic Hex Sync

**Learning:** Disabling action buttons during temporary feedback states (`disabled = true`) causes browsers to drop keyboard focus to `body`, breaking sequential Tab navigation for keyboard users. Utilizing `aria-disabled="true"` with `pointer-events-none` maintains the focus position, while dynamically syncing hex label text after the feedback timeout prevents stale values if colors update mid-feedback.
**Action:** Always use `aria-disabled="true"` and `pointer-events-none` instead of `disabled = true` for transient button feedback states, and re-read live value getters when restoring original button text.

## 2026-10-07 - Shortcut Toast Display Duration & Input Escape Handling

**Learning:** Shortcut help notification toasts require an extended display duration (e.g., 6000ms) so keyboard users have adequate time to read multiple shortcuts. Additionally, form text inputs must handle `Escape` key events explicitly to cancel editing and revert to valid values when global key handlers bypass input elements.
**Action:** Always provide extended display durations for information-dense help toasts and add explicit `Escape` key handlers to form text inputs.

## 2026-10-08 - Dynamic ARIA Label Syncing & Shortcut Toast Toggle State

**Learning:** Quick action buttons (like Copy BG/FG) and mode toggles must keep their `title` tooltips and screen-reader `aria-label` attributes dynamically synchronized with live color state values to prevent misleading hover descriptions. Additionally, keyboard shortcut help triggers should manage `aria-expanded` and toggle the notification toast if already visible rather than stacking duplicate toasts.
**Action:** Dynamically update both `aria-label` and `title` attributes on copy and toggle buttons whenever state changes, and use `aria-expanded` to manage shortcut help toast toggle states.

## 2026-10-15 - Shortcuts Toggle ARIA & Focus Sync

**Learning:** Toggle buttons (such as keyboard shortcut help triggers) should keep `aria-label` and `title` tooltips synchronized between open and closed states ("Show" vs "Hide") so screen readers and hover users have accurate context. Dismissing overlay toasts must also safely restore keyboard focus to the trigger button when focus was inside the toast notification.
**Action:** Always toggle `aria-label` and `title` attributes alongside `aria-expanded` on toggle buttons, and restore keyboard focus to the trigger element when toast overlays are dismissed via keyboard.
