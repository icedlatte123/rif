# RIF Website — Design System & Style Guide

This document catalogs all design tokens, color palettes, typographic hierarchies, spacing rules, border radii, shadows, and responsive breakpoints defined across the RIF web application.

---

## 1. Color Palette & Token Reference

All colors are declared as CSS Custom Properties in `frontend/src/styles/main.css` lines 1–28.

| Variable Name | Hex / Value | Semantic Role | Where Used |
| :--- | :--- | :--- | :--- |
| `--primary` | `#1f4da7` | Institutional Blue | Main brand color; primary action buttons, hero headers, links, borders |
| `--primary-deep` | `#123b8c` | Deep Navy Blue | Button hover states, active states, emphasized titles |
| `--primary-soft` | `rgba(31, 77, 167, 0.12)` | Soft Blue Tint | Tag badges, active filter tabs, category pills, subtle card highlights |
| `--accent` | `#ce2026` | Vibrant Red / Crimson | Eyebrow badges, call-to-action highlights, active dots, decorative shapes |
| `--accent-soft` | `rgba(206, 32, 38, 0.16)` | Soft Red Tint | Highlight chips, alert indicators, hover halos |
| `--red-accent` | `#ce2026` | Accent Alias | Maintained for backward compatibility across older UI modules |
| `--red-soft` | `rgba(206, 32, 38, 0.16)` | Soft Accent Alias | Maintained for backward compatibility across older UI modules |
| `--bg` | `#edf3fb` | App Canvas Background | Top body background tint, default page canvas |
| `--bg-secondary` | `#dfeafb` | Section Background Tint | Alternating section bands, sidebar backgrounds |
| `--surface` | `#ffffff` | Elevated Surface | Card containers, navigation dropdowns, modal windows, table rows |
| `--surface-solid` | `#ffffff` | Solid Pure White | Form inputs, popups, hero media backdrops |
| `--surface-soft` | `#f2f4f8` | Neutral Soft Surface | Stat card backgrounds, secondary containers, input placeholders |
| `--surface-strong` | `#e3e8ef` | Emphasized Border/Surface | Card outline borders, divider bars, table headers |
| `--text` | `#0f172a` | Primary Text (Slate 900) | Main headings, body copy, active navigation labels |
| `--text-soft` | `#4b5563` | Secondary Text (Gray 600)| Paragraph descriptions, subtitle lines, dates, metadata labels |
| `--text-faint` | `#9ca3af` | Muted Text (Gray 400) | Secondary metadata, helper text, disabled states, placeholders |
| `--line` | `rgba(15, 23, 42, 0.08)` | Subtle Divider Line | Card outlines, table borders, header bottom line |
| `--line-strong` | `rgba(15, 23, 42, 0.14)` | Strong Divider Line | Input borders, elevated card borders, modal header dividers |
| `--success` | `#0ea568` | Emerald Green | Form submission success alerts, active status chips |
| `--error` | `#c04747` | Danger Red | Validation errors, delete button actions, network failure banners |

---

## 2. Global Background Mesh & Decorative Effects

Declared in `frontend/src/styles/main.css` lines 40–88:

* **Fixed Multi-Point Radial Mesh:**
  ```css
  background:
    radial-gradient(circle at top left, rgba(129, 182, 255, 0.34), transparent 26%),
    radial-gradient(circle at 82% 12%, rgba(255, 215, 154, 0.32), transparent 22%),
    radial-gradient(circle at 50% 100%, rgba(206, 32, 38, 0.08), transparent 26%),
    linear-gradient(180deg, #f7fbff 0%, #edf4fb 38%, #e7eef8 100%);
  background-attachment: fixed;
  ```
* **Architectural Grid Matrix Overlay (`body::before`):**
  A 72px by 72px subtle architectural blueprint grid mask overlaying the canvas with 50% opacity, fading out radially towards the edges.
* **Ambient Lighting Glow (`body::after`):**
  A top-right blurred ambient glow sphere (26rem x 26rem with 18px gaussian blur) creating visual depth behind the main navigation.

---

## 3. Typography Hierarchy & Font Scales

### Font Family
* **Stack:** `Arial, "Helvetica Neue", Helvetica, sans-serif` (`main.css` line 25).
* **Base Size:** `16px` on mobile/tablet; automatically scales to `17px` on desktop viewports (`@media (min-width: 1024px)`).

### Typography Scale Table

| Element / Class | Desktop Size | Mobile Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `h1` (Page Title) | `2.75rem` (44px) | `2.1rem` (33px) | 800 (Bold) | `1.15` | Main page hero titles, homepage headline |
| `h2` (Section Heading) | `2.0rem` (32px) | `1.6rem` (25px) | 700 (Bold) | `1.25` | Section headings, modal titles |
| `h3` (Card Title) | `1.35rem` (22px) | `1.2rem` (19px) | 600 (Semi) | `1.3` | Card headers, person names, service titles |
| `h4` (Subsection) | `1.1rem` (18px) | `1.05rem` (17px)| 600 (Semi) | `1.4` | Small module headings, QR card titles |
| `.section-eyebrow` | `0.85rem` (14px) | `0.8rem` (13px) | 700 (Bold) | `1.0` | Uppercase category tag above titles |
| Body Text (`p`) | `1.05rem` (17px) | `1.0rem` (16px) | 400 (Regular)| `1.6` | Standard descriptive copy and paragraphs |
| `.detail-line` / Meta | `0.9rem` (14.5px)| `0.85rem` (13.5px)| 500 (Med) | `1.4` | Founder role, company sector, date stamps |
| Button Label | `0.98rem` (16px) | `0.92rem` (15px)| 600 (Semi) | `1.0` | Interactive buttons and navigation links |

---

## 4. Spacing System & Layout Containers

* **Header Height:** Fixed at `--header-height: 82px` (`main.css` line 3).
* **Page Width Constraint:** All standard sections are bound by `.section` with maximum width `1280px` and responsive auto-centering margins.
* **Vertical Spacing Scale:**
  * Small: `0.5rem` (8px) — chip padding, icon margins.
  * Medium: `1.0rem` (16px) — standard card padding on mobile, form field gaps.
  * Large: `1.5rem` (24px) — standard desktop card padding, grid gaps.
  * XL: `2.5rem` (40px) — distance between subsection modules.
  * 2XL: `4.5rem` (72px) — vertical padding between major page sections (`.section { padding: 4.5rem 1.5rem; }`).

---

## 5. Border Radii & Elevation Shadows

### Border Radii (`main.css` lines 21–24)
* `--radius-sm: 10px;`: Small buttons, category chips, form inputs, avatar initials.
* `--radius-md: 14px;`: Secondary cards, timeline boxes, media thumbnails.
* `--radius-lg: 20px;`: Primary content cards, feature spotlights, pricing cards.
* `--radius-xl: 26px;`: Hero containers, modal dialogs, full-width section shells.
* `border-radius: 999px;`: Pill badges, slider navigation dots, rounded action tags.

### Elevation Shadows (`main.css` lines 19–20)
* `--shadow-md: 0 14px 34px rgba(15, 23, 42, 0.1);`: Standard card rest state, dropdown menus.
* `--shadow-lg: 0 24px 64px rgba(15, 23, 42, 0.14);`: Card hover state, modal dialogs, floating action drawer.

---

## 6. Responsive Breakpoints

Declared throughout `frontend/src/styles/main.css`:

| Breakpoint | Target Screen Size | Architectural UI Adaptation |
| :--- | :--- | :--- |
| `max-width: 1360px` | Laptops / Smaller Desktops | Card grid spacing tightens; hero padding scales down |
| `max-width: 1240px` | Small Desktops | Navigation items compress; ticker width adjusts |
| `max-width: 1080px` | Landscape Tablets | Multi-column grids collapse from 4 columns to 2 columns |
| `max-width: 960px` | Tablets | Desktop header hides; Mobile hamburger toggle activates; drawer enabled |
| `max-width: 720px` | Large Mobile Phones | 3-column and 2-column cards collapse to 1 single full-width column |
| `max-width: 640px` | Standard Mobile Phones | Modal dialogs take 95% viewport width; hero buttons stack vertically |
| `max-width: 600px` | Compact Mobile Phones | Form input pairs stack into single-column rows |
| `prefers-reduced-motion`| Accessibility / Low Power | Scroll reveal animations and infinite marquee transitions disable instantly |

---

## 7. Reusable Component Styling Inventory

1. **Buttons (`.button`):**
   * Primary: Solid `--primary` background with white text, subtle hover lift (`translateY(-2px)`), and focus outline.
   * Ghost: Transparent background with `--primary` outline border (`.button-ghost`).
   * Small: Compact padding for secondary actions (`.button-small`).
2. **Section Headings (`.section-heading`):**
   * Centered or left-aligned typography block combining `.section-eyebrow`, `h2`, and `.section-description`.
3. **Profile Cards (`.profile-content-card`):**
   * Rounded avatar image shell (`.profile-image-shell`), initials fallback circle, name, designation, and social icon links.
4. **Interactive Form Shells (`.form-shell`):**
   * Two-column split layout pairing an informational sidebar (application fee badge, screening criteria, payment QR code) with an interactive form grid.
5. **Image Lightbox Modal (`.image-lightbox`):**
   * Backdrop filter blur (`backdrop-filter: blur(8px)`) with pure black translucent background (`rgba(0, 0, 0, 0.88)`).

