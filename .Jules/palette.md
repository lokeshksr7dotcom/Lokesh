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

## 2026-09-01 - Self-Healing Text Fields & Escape Cancellation

**Learning:** When users edit formatted color hex inputs, leaving an invalid value on blur creates confusion and persistent error states. Automatically falling back to the active valid hex on `blur` (self-healing) and supporting `Escape` to cancel pending text edits provides a forgiving, resilient input experience.
**Action:** Implement `Escape` key handlers on text inputs to revert edits and blur, and reset invalid input values back to known valid application state on `blur`.

## 2026-09-02 - Keyboard Focus Retention on Temporary Action Feedback States

**Learning:** Setting `disabled = true` on an actively focused button causes browsers to immediately blur the element and reset keyboard focus to `document.body`. This disrupts tab order and forces keyboard users to navigate through the entire page again after triggering an action.
**Action:** Use `aria-disabled="true"` alongside state guards instead of standard HTML `disabled` attributes on interactive elements during brief confirmation states to preserve keyboard focus position.

## 2026-09-03 - Preserving Focus Context When Conditionally Hiding Active Elements

**Learning:** Hiding an element that currently holds active user focus (e.g., hiding a contextual Auto-Fix button after resolving contrast issues) causes browsers to lose focus context and reset focus to `document.body`. This forces keyboard users to navigate back through the entire page controls from the top.
**Action:** Before conditionally hiding or removing a focused UI element, check `document.activeElement` and programmatically transfer focus to a logical neighboring interactive control.

## 2026-09-05 - Pausing Toast Auto-Dismiss Timers on Mouse Hover and Keyboard Focus

**Learning:** Fixed auto-dismiss timers on toast notifications can interrupt users attempting to read detailed notification text (such as shortcut helper toasts) or click the dismiss button. Pausing timer countdowns on mouse hover (`mouseenter`/`mouseleave`) and keyboard focus (`focusin`/`focusout`) gives users full control over notification visibility without removing automated dismissal for passive users.
**Action:** Always attach `mouseenter`, `mouseleave`, `focusin`, and `focusout` event listeners to auto-dismissing toast notifications to pause timers while active user attention is present.

## 2026-09-06 - Synchronizing ARIA Labels During Temporary UI Feedback States

**Learning:** When interactive controls specify explicit `aria-label` attributes, screen readers and assistive technologies prioritize `aria-label` over updated inner HTML content (such as changing button text from "Copy BG" to "Copied!"). Sighted users see visual state feedback, but screen reader users hear the unchanged `aria-label`, missing confirmation of the completed action.
**Action:** When providing temporary UI feedback states on elements with explicit `aria-label` attributes, temporarily update `aria-label` to reflect the action result and restore the original label upon timer completion.

## 2026-09-07 - Informative ARIA Announcements on Live Regions and Contextual Triggers

**Learning:** Live regions announcing dynamic values (like `14.3:1`) lack context for screen reader users if compliance status (e.g., "AAA Pass" or "Fail") is rendered in separate elements. Updating `aria-label` on the live region control ensures full context is announced in a single spoken statement. Furthermore, dynamic contextual action buttons (like Auto-Fix) should include explicit outcome targets in their `aria-label` and `title` (e.g. suggesting the exact hex value `#FFFFFF`) so users know the exact effect before triggering the action.
**Action:** Include comprehensive compliance context in live region `aria-label` attributes, and dynamically update action button labels with target outcome details.
