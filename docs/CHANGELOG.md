# RIF Website — Change Log

This file tracks all modifications, updates, architectural refactorings, and bug fixes applied to the RIF web platform.

---

## Change History Table

| Date | File Changed | What Changed | Why |
| :--- | :--- | :--- | :--- |
| **2026-11-05** | `frontend/src/pages/GalleryPage.jsx` | Replaced flat gallery item grid with event albums displaying stacked cover cards, photo-count badge, scale-from-origin album modal with staggered photos, scroll lock, portaled dialog, and fullscreen lightbox integration. | Group related event photos into cohesive albums with smooth interactive transitions while maintaining backward compatibility with legacy single-photo entries. |
| **2026-11-05** | `frontend/src/pages/AdminDashboardPage.jsx` | Added `GalleryAlbumsEditor` and `handleAlbumImagesUpload` handler supporting multi-file image uploading, immediate saving, cover photo management, and album deletion with `InlineConfirmButton`. | Allow administrators to create event albums, batch-upload photos, and select or change cover photos directly from the CMS admin dashboard. |
| **2026-11-05** | `frontend/src/styles/main.css` | Added styles and cubic-bezier keyframe animations for `.album-*` (grid, stacked card effect, modal backdrop, scale-from-origin popup, staggered photo reveal, responsive columns) and `.album-admin-*` photo grid. | Provide polished photo-stack visual presentation, smooth pop-up and close animations, mobile responsiveness, and clean administrative album photo management. |
| **2026-11-04** | *Full Project Workspace* | **Baseline: Initial comprehensive project analysis & documentation suite created** in `/docs` covering inventory, architecture, code maps, flow diagrams, design system, and code audit. | To provide complete institutional transparency, change instructions, and technical audit findings for the RIF web platform. |
| *YYYY-MM-DD* | *path/to/file* | *Describe what was changed...* | *Describe why the change was made...* |

---

## How to Record Future Changes

Whenever you modify any code, style, or configuration file in this project:
1. Open this file (`docs/CHANGELOG.md`).
2. Add a new row directly under the header row in the table above with:
   * **Date:** Today's date (`YYYY-MM-DD`).
   * **File Changed:** Exact relative path of the file you modified (e.g., `frontend/src/styles/main.css`).
   * **What Changed:** A concise explanation of the change (e.g., "Updated primary blue color from `#1f4da7` to `#104595`").
   * **Why:** The reason for the change (e.g., "Updated to match official university brand guidelines").
3. Update any relevant sections in `docs/HOW_TO_CHANGE_THINGS.md` and `docs/WEBSITE_CODE_MAP.md` if selectors, routes, or behaviors were altered.

