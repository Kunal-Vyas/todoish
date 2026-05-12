# Theming

Dark mode, light mode, and custom accent colors. Themes follow system preferences and support manual override.

**Depends on:** _(none — UI infrastructure)_

---

## Acceptance Criteria

### Mode Switching

- [ ] **AC-001: System preference detection.** On first load, the app detects `prefers-color-scheme` and applies the matching theme.
- [ ] **AC-002: Manual toggle.** A theme toggle button switches between light, dark, and system.
- [ ] **AC-003: Theme persists.** The user's theme choice is saved to local storage and applied on subsequent visits.
- [ ] **AC-004: System preference changes at runtime.** If the theme is set to "System" and the OS switches from light to dark mode, the app switches immediately without a page reload.
- [ ] **AC-005: No flash of wrong theme.** The correct theme is applied before the first paint (e.g., via a blocking script in `<head>`).

### Custom Accent Colors

- [ ] **AC-006: Choose accent color.** The user can select an accent color from a predefined palette or enter a custom hex color.
- [ ] **AC-007: Accent color applied globally.** Buttons, links, selection highlights, and focus rings use the chosen accent color.
- [ ] **AC-008: Accent color in dark mode.** The accent color remains consistent across light and dark modes.
- [ ] **AC-009: Accent color contrast.** The system warns if the chosen accent color has insufficient contrast against the background.

### Visual Consistency

- [ ] **AC-010: All UI elements themed.** No element renders with hardcoded light-only or dark-only colors. All colors come from CSS custom properties.
- [ ] **AC-011: Priority colors consistent.** The four priority colors (P1–P4) are readable in both light and dark modes.
- [ ] **AC-012: Project colors work in both modes.** Custom project colors are adjusted for readability in both themes (e.g., bright yellow in light mode might become muted gold in dark mode).
- [ ] **AC-013: Third-party component theming.** Any third-party UI components (date pickers, modals) are themed to match.

### Edge Cases

- [ ] **AC-014: High contrast mode.** If the OS high-contrast setting is enabled, the app respects it and increases contrast ratios.
- [ ] **AC-015: Reduced motion.** If the OS `prefers-reduced-motion` setting is enabled, animations and transitions are disabled.
- [ ] **AC-016: Print stylesheet.** Printed task lists use light mode, hide interactive elements, and optimize for paper.
