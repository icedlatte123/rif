# RIF Website — Code & Architecture Audit Report

This audit report documents all findings identified during the exhaustive code analysis of the RIF codebase, categorized by area and sorted by priority (**HIGH**, **MEDIUM**, **LOW**).

---

## 1. High Priority Findings

---

### Finding 1.1: Default Insecure Admin Credentials & Token Secret
* **Category:** Security / Authentication
* **Priority:** **HIGH**
* **File:** `backend/src/config/env.js` (Lines 23–25)
* **Problem:**
  The backend environment reader defaults `adminPassword` to `"change-me"` and `adminTokenSecret` to `"replace-with-a-long-random-string"`. On initial startup or if `.env` is omitted, the database seeds an admin user with username `admin@rif.local` and password `change-me`, using a well-known secret to sign HMAC-SHA256 JWT tokens.
* **Why It Matters:**
  If deployed without explicitly setting `ADMIN_PASSWORD` and `ADMIN_TOKEN_SECRET` in `backend/.env`, an attacker can forge administrative JWT tokens or log in using default credentials and gain complete control over the foundation's website, content, submissions, and staff accounts.
* **Exact Fix:**
  In `backend/src/config/env.js`, check if `NODE_ENV === "production"` and throw an explicit startup error if defaults are used:
  ```javascript
  if (process.env.NODE_ENV === "production") {
    if (!process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_TOKEN_SECRET === "replace-with-a-long-random-string") {
      throw new Error("FATAL: Set a secure ADMIN_TOKEN_SECRET in production .env");
    }
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === "change-me") {
      throw new Error("FATAL: Set a secure ADMIN_PASSWORD in production .env");
    }
  }
  ```

---

### Finding 1.2: Broken Favicon URL Path in HTML Shell
* **Category:** Bugs / Web Standards
* **Priority:** **HIGH**
* **File:** `frontend/index.html` (Line 5)
* **Problem:**
  Line 5 declares:
  ```html
  <link rel="icon" type="image/x-icon" href="public/favicon.ico" />
  ```
  In Vite, assets located inside the `public/` directory are copied and served directly at the root (`/`). Specifying `href="public/favicon.ico"` causes the browser to request `http://localhost:5173/public/favicon.ico`, which returns a 404 error on all nested routes (e.g., `/leadership/board-of-directors`).
* **Why It Matters:**
  Browser tabs fail to display the official RIF favicon, cluttering server and browser console logs with 404 errors.
* **Exact Fix:**
  Change line 5 in `frontend/index.html` to:
  ```html
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  ```

---

### Finding 1.3: Intern Registration Fails with 503 If SMTP Is Unconfigured
* **Category:** Bugs / Form Logic
* **Priority:** **HIGH**
* **File:** `backend/src/services/mailer.js` (Lines 122–126) & `backend/src/routes/public-routes.js` (Line 127)
* **Problem:**
  In `mailer.js`, `sendInternRegistrationEmails` throws a 503 Service Unavailable error if SMTP is not configured:
  ```javascript
  if (!tx) {
    const error = new Error("Intern registration email is not configured. Please contact RIF directly.");
    error.statusCode = 503;
    throw error;
  }
  ```
  In contrast, other forms (`apply`, `membership`, `enquiry`) gracefully handle unconfigured email by saving the submission to MongoDB and logging a warning. If a student applies for an internship while SMTP is offline, their application is rejected on screen, even though MongoDB is fully operational.
* **Why It Matters:**
  Prospective student interns cannot submit applications unless full outgoing SMTP email infrastructure is configured.
* **Exact Fix:**
  Allow the database submission to succeed even if email fails, and log a warning:
  ```javascript
  // In backend/src/routes/public-routes.js line 128:
  try {
    await sendInternRegistrationEmails(submission);
  } catch (emailError) {
    console.warn("[mail] Could not send intern confirmation email:", emailError.message);
  }
  response.status(201).json({
    message: "Thanks for applying. RIF has received your intern registration."
  });
  ```

---

### Finding 1.4: Missing Rate Limiting on Public Endpoints
* **Category:** Security / Denial of Service
* **Priority:** **HIGH**
* **File:** `backend/src/app.js` (Lines 28–39)
* **Problem:**
  There is no rate limiting (e.g. `express-rate-limit`) applied to public submission endpoints (`/api/forms/*`) or authentication routes (`/api/auth/login`, `/api/auth/team-login`).
* **Why It Matters:**
  Attackers or automated spam bots can flood form endpoints with thousands of submissions, exhausting database storage, consuming Cloudinary quotas, and launching brute-force password guessing attacks against administrative accounts.
* **Exact Fix:**
  Install `express-rate-limit` in backend and apply strict rate limiters:
  ```bash
  npm --prefix backend install express-rate-limit
  ```
  In `backend/src/app.js`:
  ```javascript
  import rateLimit from "express-rate-limit";
  
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: "Too many login attempts. Please try again later." } });
  const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: "Too many submissions from this IP. Please wait." } });
  
  app.use("/api/auth/login", authLimiter);
  app.use("/api/forms", formLimiter);
  ```

---

## 2. Medium Priority Findings

---

### Finding 2.1: Dead Code — Unused `GovernorMessagePage.jsx` Component
* **Category:** Dead Code / Maintenance
* **Priority:** **MEDIUM**
* **File:** `frontend/src/pages/GovernorMessagePage.jsx` (Lines 1–90) & `frontend/src/App.jsx` (Line 18)
* **Problem:**
  `GovernorMessagePage.jsx` is imported in `App.jsx` at line 18, but is never referenced in any `<Route>`. Route `/leadership/message-from-governor` instead uses `LeadershipMessagePage` with `messageKey="governorMessage"`.
* **Why It Matters:**
  Unused code creates developer confusion and increases maintenance overhead.
* **Exact Fix:**
  Remove `import GovernorMessagePage from "./pages/GovernorMessagePage.jsx";` from `frontend/src/App.jsx` line 18, and archive or delete `GovernorMessagePage.jsx`.

---

### Finding 2.2: Redundant Duplicate File `package-lock 2.json`
* **Category:** Repository Hygiene
* **Priority:** **MEDIUM**
* **File:** `frontend/package-lock 2.json` (60,967 bytes)
* **Problem:**
  The frontend directory contains both `package-lock.json` and `package-lock 2.json`. The latter is an orphaned artifact created by accidental duplicate copy-pasting (often macOS Finder duplication).
* **Why It Matters:**
  Increases repository size and may cause ambiguity when reviewing dependency diffs.
* **Exact Fix:**
  Safely delete `frontend/package-lock 2.json`.

---

### Finding 2.3: Monolithic Admin Dashboard Component Without Code Splitting
* **Category:** Performance / Architecture
* **Priority:** **MEDIUM**
* **File:** `frontend/src/pages/AdminDashboardPage.jsx` (208,807 bytes, 4,934 lines) & `frontend/src/App.jsx` (Line 7)
* **Problem:**
  `AdminDashboardPage.jsx` contains almost 5,000 lines of code and 20 administrative sub-panels bundled into one component. In `App.jsx`, it is imported statically (`import AdminDashboardPage from "./pages/AdminDashboardPage.jsx"`).
* **Why It Matters:**
  Every regular visitor loading the public homepage must download the heavy administrative dashboard code, increasing bundle size and slowing down page load times.
* **Exact Fix:**
  Use `React.lazy` and `Suspense` in `frontend/src/App.jsx`:
  ```javascript
  import { lazy, Suspense } from "react";
  const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage.jsx"));
  
  // Wrap admin routes in Suspense:
  <Route element={<Suspense fallback={<div className="loading-spinner">Loading Admin...</div>}><AdminDashboardPage /></Suspense>} path="/admin" />
  ```

---

### Finding 2.4: Missing `.env.example` Templates
* **Category:** Developer Experience
* **Priority:** **MEDIUM**
* **File:** `README.md` (Lines 31–32)
* **Problem:**
  `README.md` instructs developers to run:
  ```bash
  cp backend/.env.example backend/.env
  cp frontend/.env.example frontend/.env
  ```
  However, neither `backend/.env.example` nor `frontend/.env.example` exists in the repository.
* **Why It Matters:**
  New developers setting up the project have no reference template for required environment variable names and defaults.
* **Exact Fix:**
  Create `backend/.env.example` and `frontend/.env.example` containing clean, commented variable lists without secret values.

---

### Finding 2.5: Missing Dynamic Routes in `sitemap.xml`
* **Category:** SEO
* **Priority:** **MEDIUM**
* **File:** `frontend/public/sitemap.xml`
* **Problem:**
  `sitemap.xml` only lists top-level static routes. Dynamic venture profiles (`/incubatees/:id`), virtual startup profiles (`/virtual-startups/:id`), and individual news/event articles (`/news-events/:type/:id`) are absent.
* **Why It Matters:**
  Search engines will fail to crawl and index detailed venture showcase pages and news releases.
* **Exact Fix:**
  Implement an automated or admin-triggered sitemap generator that appends all active startup IDs and news slugs to `sitemap.xml`.

---

## 3. Low Priority Findings

---

### Finding 3.1: Duplicate `ImageCropDialog` Implementations
* **Category:** Code Quality / Duplication
* **Priority:** **LOW**
* **Files:** `frontend/src/components/ImageCropDialog.jsx` (249 lines) & `frontend/src/pages/AdminDashboardPage.jsx` (Lines 1650–1750)
* **Problem:**
  The canvas crop logic is implemented twice: once as an exported reusable component in `components/ImageCropDialog.jsx` (used by `IncubiteeFormPage.jsx`), and again as an inline component inside `AdminDashboardPage.jsx`.
* **Why It Matters:**
  Bug fixes or enhancements made to one cropper will not reflect in the other.
* **Exact Fix:**
  Import `ImageCropDialog` from `../components/ImageCropDialog.jsx` inside `AdminDashboardPage.jsx` and delete the duplicate declaration.

---

### Finding 3.2: Large Video Assets Stored in Public Repository
* **Category:** Performance / Storage
* **Priority:** **LOW**
* **Files:** `frontend/public/videos/1rif-hero-logo.mp4` (1.36 MB) & `2rif-hero-logo.mp4` (1.48 MB)
* **Problem:**
  The `frontend/public/videos/` directory contains four video files totaling over 3.5 MB. However, only `rif-hero-logo.mp4` and `Video_Generation_With_Logo.mp4` are referenced by `HomePage.jsx`. `1rif-hero-logo.mp4` and `2rif-hero-logo.mp4` are unreferenced alternates.
* **Why It Matters:**
  Increases the Git repository size and build payload.
* **Exact Fix:**
  Move unreferenced video files to an external media archive or delete them from the production web bundle.

---

### Finding 3.3: Missing Width and Height Attributes on Partner Logos
* **Category:** Performance / Core Web Vitals
* **Priority:** **LOW**
* **File:** `frontend/src/pages/HomePage.jsx` (Line 345)
* **Problem:**
  The partner logos rendered inside the affiliations marquee lack explicit `width` and `height` attributes:
  ```jsx
  <img alt={copyIndex === 0 ? partner.label : ""} src={partner.src} />
  ```
* **Why It Matters:**
  Can cause Cumulative Layout Shift (CLS) as images load on slower mobile connections.
* **Exact Fix:**
  Add standard dimensions or aspect-ratio styles:
  ```jsx
  <img alt={copyIndex === 0 ? partner.label : ""} src={partner.src} width="160" height="70" loading="lazy" />
  ```

---

### Finding 3.4: Empty File `backend/backend-dev.err`
* **Category:** Repository Hygiene
* **Priority:** **LOW**
* **File:** `backend/backend-dev.err` (0 bytes)
* **Problem:**
  An empty 0-byte log file left behind by development server redirection.
* **Why It Matters:**
  Harmless, but clutters the directory.
* **Exact Fix:**
  Add `*.err` and `*.log` to `.gitignore` and delete `backend/backend-dev.err`.

