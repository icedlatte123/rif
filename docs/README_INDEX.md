# RIF Website — Documentation Index & Master Navigation

Welcome to the complete documentation suite for the **Rohilkhand Incubation Foundation (RIF)** web platform. This documentation is organized into 10 structured guides in this `/docs` directory.

---

## 1. Documentation Index

| File | Description |
| :--- | :--- |
| **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** | Executive summary, goal, tech stack with versions, architecture topology, installation, run, build, and deploy steps. |
| **[FILE_MAP.md](./FILE_MAP.md)** | Full folder tree, one-line folder explanations, and an exhaustive inventory table of all 103 files with sizes and dependencies. |
| **[FILE_DETAILS.md](./FILE_DETAILS.md)** | Deep code-level breakdown of every single file in the project with purpose, code blocks, function dictionary, and break risks. |
| **[HOW_TO_CHANGE_THINGS.md](./HOW_TO_CHANGE_THINGS.md)** | Master cheat sheet table ("I want to change..." -> file, line, selector) and step-by-step customization tutorials. |
| **[WEBSITE_CODE_MAP.md](./WEBSITE_CODE_MAP.md)** | Visual-to-code mapping: Page-by-page map, feature-by-feature trace, function dictionary, and reverse lookups. |
| **[FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md)** | Interactive Mermaid sequence and architecture diagrams for system topology, navigation, and user submission flows. |
| **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** | Complete design token reference: Color palette (hex), typography scales, spacing, border radii, shadows, and breakpoints. |
| **[AUDIT_REPORT.md](./AUDIT_REPORT.md)** | Technical audit findings sorted by priority (High, Medium, Low) covering security, bugs, dead code, and exact code fixes. |
| **[CHANGELOG.md](./CHANGELOG.md)** | Baseline change log and standardized template for tracking all future code and content modifications. |
| **[README_INDEX.md](./README_INDEX.md)** | This master table of contents, quick reference guide, and verification coverage report. |

---

## 2. Which Documentation File to Open First?

* **If you want to change colors, fonts, logos, or page text:**
  👉 Open **`docs/HOW_TO_CHANGE_THINGS.md`**
* **If you want to understand which file powers a specific page on screen:**
  👉 Open **`docs/WEBSITE_CODE_MAP.md`**
* **If you want to install, run, build, or deploy the website:**
  👉 Open **`docs/PROJECT_OVERVIEW.md`**
* **If you want to fix security vulnerabilities or known bugs:**
  👉 Open **`docs/AUDIT_REPORT.md`**
* **If you want to inspect a specific file's functions and purpose:**
  👉 Open **`docs/FILE_DETAILS.md`**
* **If you want to see the architectural and user flow diagrams:**
  👉 Open **`docs/FLOW_DIAGRAMS.md`**

---

## 3. Phase 6: Verification & Coverage Report

* **Analysis Baseline Date:** 2026-11-04
* **Total Project Files Discovered:** **103 files** (excluding auto-generated dependency directories `node_modules`, `.git`, `dist`).
* **Total Files Documented:** **103 files (100.0% Coverage)**.
* **Files Skipped:** **0 files skipped.** Every single `.jsx`, `.js`, `.json`, `.css`, `.html`, `.mjs`, `.md`, `.pdf`, `.xml`, `.txt`, `.htaccess`, `_redirects`, `.webp`, `.mp4`, `.ico`, `.jpg`, and `.log` file was inspected, read, and cataloged.
* **Pages & Components Mapped:** All 31 routed pages, 11 shared components, 4 data registries, 3 client utilities, 1 CSS stylesheet, 4 backend routers, 3 config modules, 3 middleware modules, 2 business services, and 5 backend utilities are fully mapped.

### Unconfirmed Items & System Ambiguities (`UNCERTAIN`)
1. `UNCERTAIN: Payment Gateway Integration`: Multiple forms mention application fee amounts and QR codes, but no third-party payment gateway SDK (such as Razorpay or Stripe) is integrated. All payments currently rely on offline bank transfers, cheque instructions, or manual QR code scanning.
2. `UNCERTAIN: Cloudinary Production Credentials`: The repository ships without pre-configured Cloudinary API credentials. Image uploads in development will fail with a 500 error unless `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are provided in `backend/.env`.
3. `UNCERTAIN: SMTP Email Configuration`: If SMTP credentials are not configured in `backend/.env`, intern registrations at `/intern-registration` will reject submissions with a 503 error, while other form submissions will save to the database but fail to send notification emails.

