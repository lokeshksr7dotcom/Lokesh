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

## 2026-10-16 - Toast Dismissal Lifecycle & Escape Key ARIA Synchronization

**Learning:** Dismissing overlay notifications via global key handlers (such as `Escape`) by clearing container `innerHTML` directly bypasses individual component `onDismiss` callbacks. This leaves toggle buttons in stale ARIA states (`aria-expanded="false"` but `aria-label="Hide..."`). Triggering the component's inner dismiss action on `Escape` ensures transition animations execute, callbacks fire to synchronize `aria-label` and `title` attributes, and keyboard focus is safely restored.
**Action:** Always invoke the component's internal dismiss handler on `Escape` rather than removing DOM nodes directly, ensuring state callbacks and focus restoration logic execute.

## 2026-10-17 - Live Contrast ARIA Sync on Interactive Preview Controls & Dark Preset Ring Offsets

**Learning:** Dynamic interactive preview controls (like sample primary/secondary action buttons) benefit from real-time WCAG contrast pass/fail assessment info inside their `aria-label` and `title` tooltips, giving screen reader and hover users immediate context. Additionally, preset active buttons require explicit dark background ring offsets (`ring-offset-slate-900`) to prevent harsh white borders in dark theme UI cards.
**Action:** Always sync live assessment metadata into action element ARIA attributes/tooltips and ensure ring offset utilities match the parent background color in dark theme cards.

## 2026-10-20 - Dynamic ARIA Label & Title Sync for Native Color Pickers, Hex Inputs & Preset Active States

**Learning:** Native color picker `<input type="color">` and hex text fields often retain static ARIA labels ("Select background color"), depriving screen reader and hover users of real-time selected color values. Dynamically synchronizing `aria-label` and `title` tooltips on color inputs and appending `(Active)` indicators to active preset buttons guarantees full state parity across all input controls.
**Action:** Always sync active color hex values into `aria-label` and `title` attributes on color pickers and hex inputs, and append `(Active)` to preset button tooltips when active.

## 2026-10-21 - System Modifier Key Scoping for Shift-Dependent Keyboard Shortcuts

**Learning:** Including `e.shiftKey` in global keyboard shortcut modifier guards prematurely blocks essential triggers like `?` (which requires Shift on standard layouts) and Shift-assisted shortcut triggers. Scoping modifier exclusions strictly to system command keys (`ctrlKey`, `altKey`, `metaKey`) ensures `?` (`aria-keyshortcuts="?"`) responds reliably without intercepting browser navigation shortcuts.
**Action:** Restrict global keyboard shortcut modifier guards to system command keys (`ctrlKey`, `altKey`, `metaKey`) so Shift-dependent shortcuts like `?` function as intended.

## 2026-10-24 - Fixed-Contrast Badge Encapsulation on Dynamic Preview Canvases

**Learning:** Overlay status badges placed over dynamically user-customizable canvas elements risk severe color contrast degradation if badge text colors rely on transparent backgrounds. Encapsulating badge elements inside opaque, high-contrast container styling (`bg-slate-900/90` with `border-slate-700/80`) isolates badge text legibility from custom canvas theme shifts.
**Action:** Always encapsulate overlay status badges inside fixed-contrast dark container styles when rendering indicators over dynamic user-customizable canvas backgrounds.

## 2026-10-25 - Contrast Ratio Evaluation vs Flat Luminance Thresholds in Auto-Remediation

**Learning:** Naive relative luminance threshold checks (e.g., `lum > 0.5`) fail to pick WCAG AA-compliant foreground colors for mid-luminance backgrounds ($0.18 < L \le 0.5$, such as amber or golden yellow), causing auto-fix remediation buttons to select failing colors. Explicitly evaluating and comparing calculated contrast ratios across candidate foreground colors guarantees selecting the candidate that passes WCAG AA thresholds ($\ge 4.5:1$).
**Action:** When implementing automated accessibility remediation actions, evaluate candidate contrast ratios directly against standard foreground options rather than relying on flat luminance threshold estimates.

## 2026-10-27 - Explicit Hex Values in Action Toast Confirmation Feedback

**Learning:** Generic toast confirmation messages (e.g., "Swapped colors") lack contextual specifics, leaving assistive technology and sight-impaired users uncertain of the resulting color values unless they re-examine input fields. Including explicit hex values directly in action confirmation toasts provides instant, unambiguous feedback across all user modalities.
**Action:** Include explicit resulting state values (e.g., new BG/FG hex codes) in state-changing toast notification messages.

## 2026-10-28 - Dynamic Focus Ring Offset on Custom Canvas Preview Actions

**Learning:** When preview action buttons sit inside a dynamically customizable canvas container, hardcoded ring offset color utility classes (like `focus-visible:ring-offset-slate-900`) create awkward dark gap offsets around focused controls on light or custom theme presets. Dynamically assigning `--tw-ring-offset-color` to match the canvas background hex ensures seamless focus ring offset visual parity and contrast across all background colors.
**Action:** Dynamically assign `--tw-ring-offset-color` inline properties on action elements that sit over user-customizable dynamic canvas backgrounds.

## 2026-10-29 - Contextual Compliance Level Prefixes in WCAG Assessment Badges

**Learning:** Compliance status badges grouped inside structured cards (e.g. Normal Text AA/AAA and Large Text AA/AAA) produce ambiguous screen reader announcements and hover tooltips if their `aria-label` and `title` attributes only report generic status like "Passes requirement (4.5:1)". Including explicit compliance category prefixes (e.g., "Normal text WCAG AA: Passes requirement (4.5:1)") provides unambiguous context when badges are announced out-of-flow by screen readers.
**Action:** Always include the specific criteria or category context prefix in `aria-label` and `title` attributes on status badges within multi-metric assessment grids.
