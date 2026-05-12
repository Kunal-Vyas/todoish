# Theme Design

Visual design tokens, color system, and typography for light and dark themes. This spec defines the design language, not pixel-accurate layouts.

---

## Design Tokens

### Colors — Light Mode

| Token                      | Value     | Usage                                           |
| -------------------------- | --------- | ----------------------------------------------- |
| `--color-bg-primary`       | `#FFFFFF` | Page background                                 |
| `--color-bg-secondary`     | `#F8F9FA` | Sidebar, card backgrounds                       |
| `--color-bg-tertiary`      | `#F1F3F5` | Input backgrounds, hover states                 |
| `--color-text-primary`     | `#1A1A2E` | Headings, body text                             |
| `--color-text-secondary`   | `#6B7280` | Labels, captions, metadata                      |
| `--color-text-tertiary`    | `#9CA3AF` | Placeholders, disabled text                     |
| `--color-border-primary`   | `#E5E7EB` | Card borders, dividers                          |
| `--color-border-secondary` | `#F3F4F6` | Subtle separators                               |
| `--color-accent`           | `#3B82F6` | Buttons, links, focus rings (user-configurable) |
| `--color-accent-hover`     | `#2563EB` | Button/link hover                               |
| `--color-danger`           | `#EF4444` | Delete actions, overdue indicators              |
| `--color-success`          | `#10B981` | Completion indicators                           |
| `--color-warning`          | `#F59E0B` | Approaching deadline                            |

### Colors — Dark Mode

| Token                      | Value     | Usage                              |
| -------------------------- | --------- | ---------------------------------- |
| `--color-bg-primary`       | `#0F0F1A` | Page background                    |
| `--color-bg-secondary`     | `#1A1A2E` | Sidebar, card backgrounds          |
| `--color-bg-tertiary`      | `#252538` | Input backgrounds, hover states    |
| `--color-text-primary`     | `#F1F5F9` | Headings, body text                |
| `--color-text-secondary`   | `#94A3B8` | Labels, captions, metadata         |
| `--color-text-tertiary`    | `#64748B` | Placeholders, disabled text        |
| `--color-border-primary`   | `#2D2D44` | Card borders, dividers             |
| `--color-border-secondary` | `#1E1E33` | Subtle separators                  |
| `--color-accent`           | `#60A5FA` | Buttons, links, focus rings        |
| `--color-accent-hover`     | `#3B82F6` | Button/link hover                  |
| `--color-danger`           | `#F87171` | Delete actions, overdue indicators |
| `--color-success`          | `#34D399` | Completion indicators              |
| `--color-warning`          | `#FBBF24` | Approaching deadline               |

### Priority Colors

| Priority | Light     | Dark      | Both  |
| -------- | --------- | --------- | ----- |
| P1       | `#EF4444` | `#F87171` | Red   |
| P2       | `#F59E0B` | `#FBBF24` | Amber |
| P3       | `#3B82F6` | `#60A5FA` | Blue  |
| P4       | `#9CA3AF` | `#6B7280` | Gray  |

### Typography

| Token         | Value                                                                |
| ------------- | -------------------------------------------------------------------- |
| `--font-sans` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', 'Consolas', monospace`               |
| `--text-xs`   | `0.75rem` / `1rem` line-height                                       |
| `--text-sm`   | `0.875rem` / `1.25rem` line-height                                   |
| `--text-base` | `1rem` / `1.5rem` line-height                                        |
| `--text-lg`   | `1.125rem` / `1.75rem` line-height                                   |
| `--text-xl`   | `1.25rem` / `1.75rem` line-height                                    |
| `--text-2xl`  | `1.5rem` / `2rem` line-height                                        |

### Spacing

| Token       | Value            |
| ----------- | ---------------- |
| `--space-1` | `0.25rem` (4px)  |
| `--space-2` | `0.5rem` (8px)   |
| `--space-3` | `0.75rem` (12px) |
| `--space-4` | `1rem` (16px)    |
| `--space-6` | `1.5rem` (24px)  |
| `--space-8` | `2rem` (32px)    |

### Radii & Shadows

| Token              | Value                        |
| ------------------ | ---------------------------- |
| `--radius-sm`      | `4px`                        |
| `--radius-md`      | `8px`                        |
| `--radius-lg`      | `12px`                       |
| `--shadow-sm`      | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md`      | `0 4px 6px rgba(0,0,0,0.07)` |
| `--shadow-dark-sm` | `0 1px 2px rgba(0,0,0,0.3)`  |
| `--shadow-dark-md` | `0 4px 6px rgba(0,0,0,0.4)`  |

## Theme Application

- All colors are defined as CSS custom properties on `:root` for light mode and `[data-theme="dark"]` for dark mode.
- The theme attribute is set on `<html>` before first paint.
- Transitions on `background-color` and `color` are `150ms ease-in-out` for smooth theme switching.
