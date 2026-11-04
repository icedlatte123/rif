# RIF Website — Exhaustive File-by-File Details

This document provides a comprehensive code-level reference for every file in the project. For each file, you will find its exact purpose, breakdown of key code blocks, dictionary of all declared functions/classes/components, caution notes for editing, and risk analysis of potential breakages.

---

## 1. Root & Workspace Scripts

### `package.json`
* **Purpose:** Defines the top-level npm project scripts to orchestrate running backend and frontend services concurrently or independently.
* **Important Code Blocks:**
  * `scripts.dev`: Runs `node scripts/dev.mjs` to launch both servers in parallel.
  * `scripts.dev:backend` / `scripts.dev:frontend`: Runs the respective npm scripts within subdirectories using `--prefix`.
  * `scripts["check:backend"]`: Validates syntax across all backend JS files without starting the server.
* **Functions / Declarations:** N/A (JSON configuration).
* **Editing Caution:** Do not change `"type": "module"` or script keys without updating documentation.
* **What Could Break:** The root launcher `npm run dev` and automated CI pipelines will fail if paths or script names are altered.

### `README.md`
* **Purpose:** Developer orientation guide providing project architecture summary, local setup instructions, default ports, and feature descriptions.
* **Important Code Blocks:** Contains setup instructions, default ports (`5173`, `5001`), and private links (`/intern-registration`).
* **Editing Caution:** Keep URLs, credential notes, and setup steps aligned with actual code.
* **What Could Break:** Misleading documentation can lead to configuration errors (e.g., referencing `.env.example` when not present).

### `RIF_Website Deliverables.pdf`
* **Purpose:** Binary PDF deliverables specification containing project requirements, branding references, and expected institutional modules.
* **Editing Caution:** Binary document. Do not overwrite or delete.
* **What Could Break:** Loss of baseline contractual reference specifications.

### `scripts/dev.mjs`
* **Purpose:** Node.js ESM script that spawns both Express backend and Vite frontend as child processes with unified stdout/stderr streaming and graceful SIGINT/SIGTERM shutdown.
* **Important Code Blocks:**
  * Lines 3–8: Platform detection (`process.platform === "win32" ? "npm.cmd" : "npm"`) and child process definitions.
  * Lines 10–19: `spawn` calls with exit listeners to terminate both if one crashes.
  * Lines 21–32: `shutdown()` handler catching `SIGINT` (Ctrl+C) and `SIGTERM`.
* **Functions:**
  * `shutdown(exitCode)`: Gracefully terminates all active child worker processes.
* **Editing Caution:** On Windows, always use `npm.cmd` when spawning npm; plain `npm` throws `ENOENT`.
* **What Could Break:** Terminal hanging on exit, zombie background Node processes, or failure to launch either service.

### `.gitignore`
* **Purpose:** Specifies files and folders excluded from Git version control.
* **Important Code Blocks:** Ignores `node_modules`, `dist`, `.env`, logs, and temporary build previews.
* **Editing Caution:** Never remove `.env` from this file to prevent committing secrets.
* **What Could Break:** Accidental leakage of database connection strings, admin passwords, or Cloudinary credentials into Git repositories.

---

## 2. Backend — Configuration & Server Setup

### `backend/src/server.js`
* **Purpose:** Entry point for the backend runtime; initializes the MongoDB connection before binding the Express application to the configured network port.
* **Important Code Blocks:**
  * Lines 5–11: `startServer()` async function awaiting `connectToDatabase()` before calling `app.listen(env.port)`.
  * Lines 13–16: Uncaught startup error trap exiting the process with code 1.
* **Functions:**
  * `startServer()`: Initializes the database connection and opens the HTTP server listener.
* **Editing Caution:** Ensure `connectToDatabase()` completes before starting `app.listen()`.
* **What Could Break:** The backend server will crash on boot or accept requests before database collections are ready if connection ordering is changed.

### `backend/src/app.js`
* **Purpose:** Instantiates the Express application, configures CORS headers, enables JSON parsing (2MB limit), mounts route handlers, and binds error middleware.
* **Important Code Blocks:**
  * Lines 11–26: Dynamic CORS origin verification matching incoming `Origin` against `env.frontendOrigins`.
  * Line 28: `express.json({ limit: "2mb" })` payload parser.
  * Lines 36–39: Route hierarchy mounting: `/api` (public), `/api/auth` (auth), `/api/admin` (admin), `/api/team` (team).
  * Lines 41–42: 404 handler and error-handling middleware attachments.
* **Functions:**
  * `normalizeOrigin(value)`: Strips trailing slashes from origin strings for strict equality comparisons.
* **Editing Caution:** Do not place routes after `notFound` or `errorHandler`.
* **What Could Break:** CORS errors on the frontend, payload rejection for legitimate requests, or uncaught server exceptions causing unhandled rejections.

### `backend/src/config/env.js`
* **Purpose:** Loads environment variables from `backend/.env` using `dotenv` and exports a strongly typed, defaulted configuration object.
* **Important Code Blocks:**
  * Lines 7–9: Resolves the backend root path and loads `backend/.env`.
  * Lines 11–16: `splitOrigins(value)` parser splitting comma-separated URLs and stripping trailing slashes.
  * Lines 18–37: `export const env` defining ports, MongoDB URI, admin credentials, Cloudinary, and SMTP parameters.
* **Functions:**
  * `splitOrigins(value)`: Trims and sanitizes comma-separated origin strings into an array.
* **Editing Caution:** Default values (such as `change-me` password and `rif_website` DB) must be overridden in production `.env`.
* **What Could Break:** Entire backend configuration will fall back to insecure local defaults; database connections will fail if URI is incorrect.

### `backend/src/config/database.js`
* **Purpose:** Manages the MongoDB native client connection, indexes, collection accessors, GridFS bucket creation (`gallery_assets`), and automatic database seeding.
* **Important Code Blocks:**
  * Lines 31–105: `seedDatabaseIfNeeded()`: Checks for document ID `site-content` in `site_content`. If missing, seeds collections from `backend/data/cms-data.json` and creates default admin user with hashed password. If present, syncs admin credentials and ensures `heroSlider` and `gallery` arrays exist.
  * Lines 107–134: `connectToDatabase()`: Connects MongoClient, creates unique indexes on `username` and `id`, and initializes `mediaBucket`.
  * Lines 136–167: Collection getter helper functions (`getSiteContentCollection`, `getSubmissionsCollection`, etc.).
* **Functions:**
  * `loadSeedData()`: Reads and parses `backend/data/cms-data.json`.
  * `seedDatabaseIfNeeded()`: Verifies and inserts missing site content and admin users.
  * `connectToDatabase()`: Connects to MongoDB, builds indexes, and prepares GridFS.
  * `getDatabase()`: Returns initialized MongoDB database instance.
  * `getDatabaseStatus()`: Returns current connection status string ("disconnected", "connecting", "connected", "error").
  * `getSiteContentCollection()` / `getSubmissionsCollection()` / `getAdminUsersCollection()` / `getTeamUsersCollection()` / `getAuditLogsCollection()`: Collection helpers.
  * `getMediaBucket()`: Returns the initialized GridFSBucket instance for document storage.
* **Editing Caution:** Modifying collection names in `collections` will isolate existing data. Never delete the `site-content` document ID convention.
* **What Could Break:** Database queries will throw unhandled exceptions, and document uploads/downloads via GridFS will fail completely.

### `backend/src/config/cloudinary.js`
* **Purpose:** Integrates Cloudinary v2 SDK for uploading user-submitted and admin-uploaded image buffers to the cloud CDN.
* **Important Code Blocks:**
  * Lines 7–27: `ensureConfigured()`: Lazily validates Cloudinary credentials on first upload request and initializes `cloudinary.config`.
  * Lines 29–52: `uploadImageBuffer(buffer, options)`: Wraps `cloudinary.uploader.upload_stream` in a Promise and pipes buffer chunks.
* **Functions:**
  * `ensureConfigured()`: Validates that cloud name, API key, and API secret are present.
  * `uploadImageBuffer(buffer, options)`: Uploads an in-memory buffer to Cloudinary and resolves with secure URL and public ID.
* **Editing Caution:** If Cloudinary credentials are not set in `.env`, any route calling `uploadImageBuffer` will throw a 500 error.
* **What Could Break:** Incubatee profile creation with images, admin hero photo uploads, and news thumbnail uploads will fail.

---

## 3. Backend — Middleware & Utility Modules

### `backend/src/middleware/auth-middleware.js`
* **Purpose:** Protects administrative and staff API routes by verifying JWT tokens, decoding roles, and enforcing permission gates.
* **Important Code Blocks:**
  * Lines 4–19: `requireAuth`: Extracts `Bearer <token>` from Authorization header and verifies it via `verifyToken`.
  * Lines 21–30: `requireAdmin`: Enforces that `request.user.role === "admin"`.
  * Lines 32–40: `requireTeamPermission(permission)`: Higher-order middleware enforcing that team member possesses the required permission string in `request.user.permissions`.
* **Functions:**
  * `requireAuth(request, response, next)`: Validates JWT token and attaches `request.user`.
  * `requireAdmin(request, response, next)`: Rejects non-admin users with 403 Forbidden.
  * `requireTeamPermission(permission)`: Generates middleware to verify granular staff permissions.
* **Editing Caution:** Ensure `requireAuth` runs before checking `request.user.role`.
* **What Could Break:** Unauthorized access to private submission records or complete lockout of administrators from the dashboard.

### `backend/src/middleware/error-handler.js`
* **Purpose:** Central Express error responder converting thrown errors into formatted JSON responses.
* **Important Code Blocks:**
  * Handles Multer's `LIMIT_FILE_SIZE` error code with 400 status and friendly message.
  * Defaults unhandled errors to `error.statusCode || 500`.
* **Functions:**
  * `errorHandler(error, _request, response, _next)`: Express error responder.
* **Editing Caution:** Must always maintain 4 arguments `(error, req, res, next)` so Express recognizes it as an error handler.
* **What Could Break:** Server will hang without returning a response if an uncaught route error occurs.

### `backend/src/middleware/not-found.js`
* **Purpose:** Responds with a standardized 404 JSON message for unmapped API endpoints.
* **Functions:**
  * `notFound(_request, response)`: Emits `{ "message": "Route not found." }` with status 404.
* **Editing Caution:** Do not alter the JSON format as client-side API error handling depends on `data.message`.
* **What Could Break:** Front-end will receive HTML error pages instead of JSON, causing JSON parsing errors in the client.

### `backend/src/utils/token.js`
* **Purpose:** Native stateless JWT creation and verification using Node.js built-in `crypto` HMAC-SHA256, eliminating third-party JWT library dependencies.
* **Important Code Blocks:**
  * Lines 6–17: `signToken(payload, secret, expiresInHours = 12)`: Encodes header + payload and appends HMAC-SHA256 signature.
  * Lines 19–45: `verifyToken(token, secret)`: Validates 3-part structure, verifies signature, and checks expiration timestamp (`exp`).
* **Functions:**
  * `signToken(payload, secret, expiresInHours)`: Issues a base64url signed JWT.
  * `verifyToken(token, secret)`: Decodes and validates signature and expiration.
* **Editing Caution:** Changing `ADMIN_TOKEN_SECRET` in `.env` will immediately invalidate all active sessions.
* **What Could Break:** Admin and team authentication failures across all protected dashboard routes.

### `backend/src/utils/password.js`
* **Purpose:** Cryptographic password hashing and verification using `crypto.scryptSync` with random 16-byte salt and constant-time timingSafeEqual comparison.
* **Functions:**
  * `hashPassword(password)`: Generates `salt:hash` string using scrypt.
  * `verifyPassword(password, storedValue)`: Verifies candidate password against stored hash using `timingSafeEqual`.
* **Editing Caution:** Stored hashes follow `salt:hash` format. Do not change `KEY_LENGTH = 64`.
* **What Could Break:** Users will be unable to log in, and seeded credentials will fail verification.

### `backend/src/utils/audit.js`
* **Purpose:** Recursive deep comparison utility calculating exact field-level differences (`before` vs `after`) for admin and team activity logging.
* **Functions:**
  * `collectChanges(before, after, path, changes)`: Traverses objects and arrays to record field modifications, additions, and deletions up to 500 items.
* **Editing Caution:** Recursive function. The 500-change cap protects against infinite loops and excessive payload sizes.
* **What Could Break:** Audit logs will record incomplete or inaccurate change diffs.

### `backend/src/utils/slugify.js`
* **Purpose:** Converts human-readable text into clean, lowercase, URL-safe alphanumeric slugs.
* **Functions:**
  * `slugify(value)`: Replaces non-alphanumeric characters with hyphens.
* **What Could Break:** Corrupted item IDs in CMS collections and broken detail page URLs.

### `backend/src/utils/validation.js`
* **Purpose:** Sanitizes incoming request bodies by trimming whitespace and enforces required fields.
* **Functions:**
  * `sanitizePayload(payload)`: Recursively trims strings and array elements.
  * `requireFields(payload, fields)`: Verifies presence of non-empty values or throws a 400 Bad Request error.
* **What Could Break:** Incomplete submissions entering database or unhandled null-reference errors.

---

## 4. Backend — Routes & Business Services

### `backend/src/routes/auth-routes.js`
* **Purpose:** Provides authentication routes for both the primary Admin user and granular Team staff users.
* **Routes:**
  * `POST /api/auth/login`: Admin login using username and password; returns JWT token and user info.
  * `POST /api/auth/team-login`: Team member login checking `active !== false`; returns token with permission array.
* **Editing Caution:** Always normalize incoming usernames using `.trim().toLowerCase()`.
* **What Could Break:** Complete lockout of administrators and staff members from the CMS.

### `backend/src/routes/public-routes.js`
* **Purpose:** Exposes all unauthenticated public endpoints for site content, visit tracking, GridFS media downloads, and form submissions.
* **Routes:**
  * `GET /api/health`: Service health check returning database status.
  * `GET /api/site`: Retrieves full normalized site content for public display.
  * `POST /api/visits`: Atomic counter increment for footer visitor tracking.
  * `GET /api/assets/:assetId`: Streams stored PDF and DOCX files from MongoDB GridFS with immutable caching headers.
  * `POST /api/forms/apply`: Receives incubation applications.
  * `POST /api/forms/membership`: Receives membership registration requests.
  * `POST /api/forms/intern`: Receives intern applications and triggers mandatory confirmation emails.
  * `POST /api/forms/enquiry`: Receives general public inquiries.
  * `POST /api/forms/incubatee`: Multipart or JSON endpoint handling new startup onboarding with photo uploads.
  * `POST /api/forms/incubatee-profile`: Direct incubatee profile intake.
  * `POST /api/forms/testimonial`: Public submission of website testimonials.
* **Editing Caution:** File size limits are enforced by Multer (6MB for images).
* **What Could Break:** Public form submissions failing, images failing to upload, or broken document download links.

### `backend/src/routes/admin-routes.js`
* **Purpose:** Provides complete CRUD capabilities for site sections, team permissions, audit logs, and file uploads (protected by `requireAdmin`).
* **Routes:**
  * `GET /api/admin/content`: Returns complete admin CMS content.
  * `PUT /api/admin/content/:section`: Updates a designated CMS section with deep audit tracking.
  * `GET /api/admin/submissions`: Fetches all form submissions grouped by type (`apply`, `membership`, `enquiry`).
  * `DELETE /api/admin/submissions/:type/:id`: Deletes a submission entry.
  * `GET /api/admin/team-permissions`: Returns list of available staff permissions.
  * `GET /api/admin/team-users` / `POST` / `PATCH` / `DELETE`: Full team user management with temporary password generator.
  * `POST /api/admin/team-users/:id/reset-password`: Resets a staff user's password.
  * `GET /api/admin/audit-logs`: Retrieves latest 300 audit events.
  * `POST /api/admin/uploads/image` / `gallery-image`: Uploads image to Cloudinary.
  * `POST /api/admin/uploads/document`: Uploads PDF/DOCX to MongoDB GridFS.
* **What Could Break:** CMS updates failing, inability to manage team members, or broken file upload capabilities in the admin dashboard.

### `backend/src/routes/team-routes.js`
* **Purpose:** Exposes granular permission-restricted endpoints for team members with restricted roles (`requireTeamPermission`).
* **Routes:**
  * `GET /api/team/me`: Returns current logged-in team profile and permissions.
  * `POST /api/team/change-password`: Self-service password change enforcing 10+ character length.
  * `GET /api/team/content`: Fetches CMS data.
  * `PUT /api/team/content/:section`: Updates a specific section matching user's permissions.
  * `GET /api/team/submissions` / `DELETE`: Manages submissions if user has `submissions` permission.
  * `POST /api/team/uploads/image` / `document`: Uploads assets if user has `uploads` permission.
* **What Could Break:** Staff unable to perform designated administrative tasks.

### `backend/src/services/cms-service.js`
* **Purpose:** Central data management engine containing section schemas, normalization pipelines, and MongoDB database operations.
* **Key Components & Functions:**
  * `editableSections`: Whitelist of 19 editable CMS keys.
  * `defaultSiteSettings` / `defaultHomepageCta` / `defaultLeadershipContent` / `defaultFormsMeta`: Fallback baseline objects.
  * `getPublicSiteData()`: Fetches `site-content` document and passes it through all normalization functions.
  * `incrementVisitCount()`: Atomic MongoDB `$inc` update for visitor counter.
  * `updateSection(section, value)`: Validates section against whitelist, normalizes data, and saves to MongoDB.
  * `createSubmission(type, payload)`: Generates UUID, stores submission in MongoDB, and triggers email notifications.
  * `createIncubateeProfile(payload)`: Inserts new profile at the front of `incubatees` array.
  * `createHomepageTestimonial(payload)`: Inserts new testimonial into `homepage.testimonials`.
  * `getSubmissions()`: Retrieves and buckets submissions into `apply`, `membership`, and `enquiry`.
  * `deleteSubmission(type, id)`: Deletes submission document by ID.
* **Editing Caution:** Any new section added to the website must be registered in `editableSections`.
* **What Could Break:** Data corruption, missing defaults causing frontend render errors, or failed updates.

### `backend/src/services/mailer.js`
* **Purpose:** Asynchronous email dispatching service powered by Nodemailer.
* **Functions:**
  * `sendSubmissionEmails(type, submission)`: Sends notification to `NOTIFY_ADMIN_EMAIL` and confirmation to applicant.
  * `sendInternRegistrationEmails(submission)`: Sends intern application email. Fails with 503 if SMTP is unconfigured.
  * `sendIncubateeProfileEmails(profile)`: Sends new incubatee profile alerts.
* **Editing Caution:** `sendInternRegistrationEmails` strictly requires functional SMTP settings; other forms fail silently if unconfigured.
* **What Could Break:** Intern registration throwing 503 errors or administrators missing important application inquiries.

---

## 5. Frontend — App Shell, State, & Routing

### `frontend/index.html`
* **Purpose:** HTML5 document shell hosting the Single Page Application, meta tags, and root mounting div.
* **Important Code Blocks:**
  * Line 5: `<link rel="icon" type="image/x-icon" href="public/favicon.ico" />` *(Note: Contains path bug — should be `/favicon.ico`)*.
  * Lines 7–21: SEO meta tags, OpenGraph properties (`og:title`, `og:description`, `og:url`), and canonical URL (`https://rifmjpru.com/`).
  * Line 24: `<div id="root"></div>`.
  * Line 25: `<script type="module" src="/src/main.jsx"></script>`.
* **What Could Break:** Favicon 404 error, missing OpenGraph preview on social sharing, or blank page if `#root` is modified.

### `frontend/src/main.jsx`
* **Purpose:** Application bootstrapper; mounts the React application tree inside `React.StrictMode` with `BrowserRouter` and `SiteDataProvider`.
* **Important Code Blocks:**
  * Imports `main.css` globally.
  * Wraps `<App />` with `<SiteDataProvider>` and `<BrowserRouter>`.
* **What Could Break:** Routing context loss or global data access exceptions throughout child components.

### `frontend/src/App.jsx`
* **Purpose:** Defines all client-side routes, nested layouts, and page visibility gates.
* **Important Code Blocks:**
  * Helper `gated(pageKey, element)` wrapping components in `<PageGate>`.
  * Route definitions for all 31 public pages, redirect routes (`/intern-register` -> `/intern-registration`), and administrative panels (`/admin`, `/team-panel`).
* **What Could Break:** Broken navigation links, missing routes resulting in 404 pages, or unauthenticated route exposure.

### `frontend/src/components/SiteDataProvider.jsx`
* **Purpose:** React Context provider managing site-wide CMS data, local storage caching, live data refreshing, and authentication tokens.
* **Functions:**
  * `readCachedSiteData()`: Retrieves previously stored JSON data from `localStorage` under `rif-site-data-cache`.
  * `refreshSiteData()`: Fetches `/api/site`; gracefully falls back to cache or bundled `createSiteFallbackData()`.
  * `useSiteData()`: Custom hook exposing `siteData`, `setSiteData`, `status`, `error`, `authToken`, and `setAuthToken`.
* **Editing Caution:** Never remove fallback dataset imports; they prevent white-screen crashes if backend is offline.
* **What Could Break:** Entire website showing blank screens if context fails to initialize.

### `frontend/src/components/SiteLayout.jsx`
* **Purpose:** Master layout component rendering `Header`, `Outlet`, `Footer`, status banners, maintenance mode lock screen, and IntersectionObserver scroll reveal animations.
* **Components / Functions:**
  * `MaintenanceShell`: Full-screen lock display shown when `siteSettings.maintenanceMode === true` (except on `/admin`).
  * `SiteLayout`: Layout container observing elements with `.reveal-ready` and toggling `.reveal-visible`.
* **What Could Break:** Navigation header and footer disappearing, animations not firing, or inability to lock/unlock site during maintenance.

### `frontend/src/components/PageGate.jsx`
* **Purpose:** Conditional wrapper checking whether a given page is enabled in `siteData.pageVisibility`. Displays a friendly "Page Unavailable" card if disabled.
* **What Could Break:** Pages remaining accessible even when explicitly disabled in the admin dashboard.

---

## 6. Frontend — Shared Components

### `frontend/src/components/Header.jsx`
* **Purpose:** Sticky site header with RIF branding, desktop multi-level dropdown navigation, live news/event scrolling ticker, and responsive slide-out mobile drawer.
* **Functions:**
  * `isGroupActive(item)`: Checks if current browser path matches top-level or child navigation items.
  * `closeMobileNav()`: Resets all mobile drawer open states.
* **What Could Break:** Navigation menu broken on mobile devices or news ticker disappearing.

### `frontend/src/components/Footer.jsx`
* **Purpose:** Global site footer displaying university address, Google Maps link, quick links, legal policies, credit notice, and animated visitor counter.
* **Functions:**
  * Visitor counter effect calling `api.recordVisit()` once per session using `sessionStorage` key `rif_visit_counted`.
* **What Could Break:** Visitor count failing to update or layout breaking on mobile screens.

### `frontend/src/components/PageHero.jsx`
* **Purpose:** Standardized hero section for internal pages supporting editable title, eyebrow, description, call-to-action buttons, hero image, and QR code connect card.
* **Functions:**
  * `getPublicPanel(panelKey, panel)`: Filters out admin placeholder copy if present.
* **What Could Break:** Internal pages rendering without header banners or broken QR connect links.

### `frontend/src/components/SubmissionForm.jsx`
* **Purpose:** Generalized multi-field interactive form renderer supporting text, email, tel, select, textarea, custom payment badges, and QR codes.
* **Functions:**
  * `DummyQrCode({ title })`: SVG-generated QR code graphic placeholder.
  * `handleChange(name, value)` / `handleSubmit(event)`: Manages local form state, client-side validation, and API submission.
* **What Could Break:** Public inquiries, membership requests, and incubation applications failing to submit.

### `frontend/src/components/PolicyPage.jsx`
* **Purpose:** Reusable layout renderer for legal documents (Privacy Policy, Terms & Conditions, Refund Policy) with dynamic placeholder replacement (`{organisationName}`, `{contactEmail}`, `{location}`).
* **Functions:**
  * `PolicyPage`: Renders policy sections and summary notices.
  * `buildPolicyContent(overrides)`: Utility helper merging default policy structures.
* **What Could Break:** Legal pages rendering with raw placeholder tokens or unformatted sections.

### `frontend/src/components/ImageLightbox.jsx`
* **Purpose:** Accessible modal portal (`createPortal`) allowing visitors to click and view high-resolution gallery and media images full screen with keyboard Escape key dismissal.
* **What Could Break:** Inability to zoom/preview gallery images or page scroll remaining locked after closing.

### `frontend/src/components/ImageCropDialog.jsx`
* **Purpose:** Interactive canvas-based modal enabling founders to crop and adjust aspect ratio (zoom and pan) for profile picture uploads before submission.
* **Functions:**
  * `getImagePlacement(...)` / `drawCroppedCanvas(...)`: Calculates canvas draw dimensions and offsets.
* **What Could Break:** Distorted profile pictures or errors during incubatee self-registration.

### `frontend/src/components/SectionHeading.jsx`
* **Purpose:** Typography heading component rendering standardized eyebrow, h2 title, and description.
* **What Could Break:** Inconsistent heading styling across content sections.

---

## 7. Frontend — Routed Pages

### `frontend/src/pages/HomePage.jsx`
* **Purpose:** Primary public landing page featuring motion video hero slider, interactive testimonial carousel, focus area chips, animated affiliation logo marquee, journey timeline, and latest news/events rail.
* **Functions:**
  * `goToSlide(index)` / `goToTestimonial(index)`: Controls slider navigation.
  * `renderRifHeroTitle(title)`: Formats "Rohilkhand Incubation Foundation" into prominent styled initials.
* **What Could Break:** Hero video not autoplaying, testimonial slider locking up, or logo marquee failing to loop smoothly.

### `frontend/src/pages/AboutPage.jsx`
* **Purpose:** Institutional about page displaying university mission, vision, leadership portal cards, and incubatee showcase prompts.
* **What Could Break:** Broken navigation to leadership and documents sections.

### `frontend/src/pages/LeadershipPage.jsx`
* **Purpose:** Comprehensive leadership hub featuring official messages from the Governor, Chief Minister, and Vice Chancellor, along with strategic leadership pillars.
* **What Could Break:** Text truncation errors or missing leadership messages.

### `frontend/src/pages/LeadershipMessagePage.jsx`
* **Purpose:** Dedicated full-page viewer for reading complete letters and signed official messages from state patrons (Governor, Chief Minister, Vice Chancellor).
* **What Could Break:** Blank letters or missing signed message images.

### `frontend/src/pages/GovernorMessagePage.jsx`
* **Purpose:** Legacy standalone governor message page.
* **Status:** **Unused / Dead Code.** Replaced by `LeadershipMessagePage.jsx` in `App.jsx`.
* **What Could Break:** None (not mounted in router).

### `frontend/src/pages/TeamPage.jsx`
* **Purpose:** Dynamic multi-directory component rendering Board of Directors, Advisory Board, Core Team, and Student Interns depending on `sectionKey`.
* **What Could Break:** Team members or interns disappearing from their respective navigation views.

### `frontend/src/pages/IncubateesPage.jsx` & `IncubateeProfilePage.jsx`
* **Purpose:** Searchable directory and individual profile showcases for physical startups incubated at RIF, including social links, founder bios, and photo galleries.
* **What Could Break:** 404 errors when clicking startup cards or broken external website links.

### `frontend/src/pages/VirtualStartupsPage.jsx` & `VirtualStartupProfilePage.jsx`
* **Purpose:** Directory and individual profile showcases for startups participating in RIF's virtual incubation program.
* **What Could Break:** Startup profiles not loading or broken links.

### `frontend/src/pages/MentorsPage.jsx`
* **Purpose:** Grid showcase of industry mentors, domain experts, and corporate advisors supporting RIF founders.
* **What Could Break:** Mentor avatars breaking or missing company tags.

### `frontend/src/pages/ServicesPage.jsx` & `RifServicesPage.jsx`
* **Purpose:** Detail the physical facilities, lab equipment, legal support, incubation benefits, and formal 3-step screening criteria for applicants.
* **What Could Break:** Formatting issues in eligibility lists or missing benefit icons.

### `frontend/src/pages/MembershipPage.jsx` & `MembershipFormPage.jsx`
* **Purpose:** Presentation of membership tiers (Student, Startup, Corporate) and multi-step registration form with fee calculations.
* **What Could Break:** Fee calculations displaying incorrectly or membership inquiries failing to submit.

### `frontend/src/pages/NewsEventsPage.jsx`
* **Purpose:** Filterable listing and detail view for foundation press releases, workshops, hackathons, and announcements with downloadable attachments.
* **What Could Break:** Broken event links or missing PDF attachments.

### `frontend/src/pages/GalleryPage.jsx` & `MediaCoveragePage.jsx`
* **Purpose:** Photo gallery and press coverage clipping showcases with full-screen lightbox image preview triggers.
* **What Could Break:** Images failing to open in full screen or layout overlapping on mobile.

### `frontend/src/pages/DocumentsPage.jsx`
* **Purpose:** Central repository of official foundation brochures, bylaws, and compliance certificates with direct links to GridFS download URLs.
* **What Could Break:** 404 errors on document download links.

### `frontend/src/pages/TestimonialsPage.jsx`
* **Purpose:** Full directory of founder and partner testimonials with an interactive public review submission form.
* **What Could Break:** New testimonials failing to submit or display.

### `frontend/src/pages/ContactPage.jsx`
* **Purpose:** Direct contact details, campus address, and embedded interactive Google Map.
* **What Could Break:** Map embed failing to load or broken email/phone links.

### `frontend/src/pages/ApplyPage.jsx`
* **Purpose:** Formal startup incubation application form collecting venture details, traction metrics, problem statements, and application fee info.
* **What Could Break:** Critical founder applications failing to reach the backend database.

### `frontend/src/pages/EnquiryPage.jsx`
* **Purpose:** General purpose public inquiry and collaboration intake form.
* **What Could Break:** Inquiries not being saved to the database.

### `frontend/src/pages/IncubiteeFormPage.jsx`
* **Purpose:** Self-onboarding form for accepted startups to submit company details, founder photos, and gallery images.
* **What Could Break:** Image cropping failures or submission errors.

### `frontend/src/pages/InternRegistrationPage.jsx`
* **Purpose:** Private intake form for student internship applications across operations, outreach, and technical roles.
* **What Could Break:** 503 error on submission if backend SMTP settings are unconfigured.

### `frontend/src/pages/PrivacyPolicyPage.jsx`, `TermsConditionsPage.jsx`, `RefundPolicyPage.jsx`
* **Purpose:** Legal policy pages rendered dynamically via `PolicyPage`.
* **What Could Break:** Missing legal terms or broken contact links.

### `frontend/src/pages/NotFoundPage.jsx`
* **Purpose:** Friendly 404 error page displayed when visitors navigate to an invalid route.
* **What Could Break:** Visitors getting stuck on invalid URLs without a link back to home.

---

## 8. Frontend — Admin Control Monolith & Global Stylesheet

### `frontend/src/pages/AdminDashboardPage.jsx` (208 KB Monolith)
* **Purpose:** Massive, comprehensive administrative control panel containing 20 management tabs for full content editing, staff user management, submission tracking, and audit logging.
* **Key Sub-Components Declared Internally:**
  * `InputField` / `ObjectEditor` / `CollectionEditor`: Dynamic form input generators.
  * `PageVisibilityEditor`: Toggle switchboard for all 31 public pages.
  * `PageHeroPanelEditor`: Banner and QR code customizer for each page.
  * `LeadershipMessageEditor`: Customizer for Governor, CM, and VC letters.
  * `AdminDialog`: Modal container for creating and editing records.
  * `PillarsEditor` / `DocumentsEditor` / `ProfileCollectionEditor`: Specialized section editors.
  * `MediaCollectionEditor`: Upload manager for gallery and hero slides.
  * `NewsEventsCollectionEditor`: News and event post creator with attachments.
  * `SubmissionTable`: Filterable, downloadable table of applicant submissions.
  * `TeamAccessPanel`: Staff account creator and permission assignment grid.
  * `AuditPanel`: Real-time searchable activity log of all administrative changes.
* **Editing Caution:** **HIGH RISK FILE.** This single file exceeds 4,900 lines of code. Always back up before editing. Test thoroughly after modifying any shared sub-component.
* **What Could Break:** Admin dashboard crash, loss of CMS updating capabilities, or corrupted data payloads sent to backend.

### `frontend/src/styles/main.css` (178 KB Monolith)
* **Purpose:** Complete global design system stylesheet spanning 7,937 lines, defining CSS custom properties, responsive breakpoints, layout grids, card styles, and animations.
* **Key Code Sections:**
  * Lines 1–28: `:root` CSS custom properties (colors, typography, shadows, border radii).
  * Lines 40–90: Global body background mesh gradient and dot grid pseudo-elements.
  * Lines 100–350: Button styles, typography scales, and focus rings.
  * Lines 400–1200: Navigation header, dropdown menus, and mobile drawer styles.
  * Lines 1500–2800: Homepage slider, marquee, testimonials, and video spotlight styles.
  * Lines 3000–5500: Public card grids, profiles, tables, and form controls.
  * Lines 5500–7937: Admin dashboard panels, modal dialogs, and responsive media queries.
* **Editing Caution:** Large stylesheet with cascading selectors. Test UI thoroughly on mobile and desktop after making changes.
* **What Could Break:** Global layout breakage, broken responsive layouts, or overlapping elements.

