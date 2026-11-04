# RIF Website — Complete Project File Map

## 1. Directory Structure

```text
RIF-main/
│
├── .gitignore                         # Git exclusion rules
├── package.json                       # Root workspace script runner
├── README.md                          # Quick start instructions & local setup notes
├── RIF_Website Deliverables.pdf       # Client deliverable specification document
├── scripts/
│   └── dev.mjs                        # Concurrent child process launcher for backend & frontend
│
├── backend/                           # Node.js Express REST API & Database engine
│   ├── backend-dev.err                # Standard error log from local development runs
│   ├── backend-dev.log                # Standard output log from local development runs
│   ├── package.json                   # Backend dependencies & check scripts
│   ├── package-lock.json              # Backend dependency lockfile
│   ├── data/
│   │   └── cms-data.json              # Default database seed & bundled frontend fallback dataset
│   └── src/
│       ├── app.js                     # Express app setup, CORS, JSON parsing, route mounting
│       ├── server.js                  # HTTP server listener and DB bootstrap
│       ├── config/
│       │   ├── cloudinary.js          # Cloudinary cloud image upload integration
│       │   ├── database.js            # MongoDB client connection, collections, GridFS media bucket
│       │   └── env.js                 # Environment variable reader and defaults
│       ├── middleware/
│       │   ├── auth-middleware.js     # JWT verification, admin check, and team permission gates
│       │   ├── error-handler.js       # Centralized HTTP error formatter and Multer size handling
│       │   └── not-found.js           # 404 handler for unrecognized API paths
│       ├── routes/
│       │   ├── admin-routes.js        # Protected administrative routes (content, users, logs)
│       │   ├── auth-routes.js         # Authentication endpoints for admin and team login
│       │   ├── public-routes.js       # Public endpoints for site data, assets, visits, and forms
│       │   └── team-routes.js         # Granular permission-controlled routes for staff members
│       ├── services/
│       │   ├── cms-service.js         # Core database CRUD, document normalization, and caching logic
│       │   └── mailer.js              # Nodemailer email notification service
│       └── utils/
│           ├── audit.js               # Deep object diff generator for audit logging
│           ├── password.js            # Cryptographic salt + scrypt hashing and verification
│           ├── slugify.js             # String URL slug formatter
│           ├── token.js               # Native HMAC-SHA256 JWT creation and verification
│           └── validation.js          # Payload sanitizer and required field validator
│
└── frontend/                          # Vite + React 19 Client Single Page Application (SPA)
    ├── index.html                     # HTML5 single-page host shell & meta tags
    ├── package.json                   # Frontend dependencies and build scripts
    ├── package-lock.json              # Frontend dependency lockfile
    ├── package-lock 2.json            # Duplicate lockfile artifact (redundant)
    ├── vite.config.js                 # Vite bundler configuration & React plugin setup
    ├── public/                        # Static assets served at web root
    │   ├── .htaccess                  # Apache web server rewrite rules for client-side routing
    │   ├── _redirects                 # Netlify / Cloudflare SPA rewrite rules
    │   ├── favicon.ico                # Web browser tab favicon
    │   ├── robots.txt                 # Search engine crawler instructions
    │   ├── sitemap.xml                # Search engine XML URL index
    │   ├── images/
    │   │   ├── logo.jpg               # Official primary RIF branding logo
    │   │   └── partners/              # Affiliation & compliance certification partner logos
    │   │       ├── 12a-80G-1.webp     # 12A / 80G tax exemption badge
    │   │       ├── Captur11e.webp     # Partner compliance mark
    │   │       ├── g20-logo.webp      # G20 India accreditation mark
    │   │       ├── ngo-darpan.webp    # NITI Aayog NGO Darpan badge
    │   │       ├── PngItem_2411963.webp # Udyam registration badge
    │   │       ├── startinup.webp     # StartInUP Uttar Pradesh initiative logo
    │   │       └── startup.webp       # ISO certification badge
    │   └── videos/                    # Video assets for homepage showcase
    │       ├── 1rif-hero-logo.mp4     # Alternate hero logo motion video
    │       ├── 2rif-hero-logo.mp4     # Alternate hero logo motion video
    │       ├── rif-hero-logo.mp4      # Primary hero carousel background video
    │       └── Video_Generation_With_Logo.mp4 # Focus areas spotlight looping video
    └── src/
        ├── App.jsx                    # Top-level client-side route declarations & page gates
        ├── main.jsx                   # React root mount script & global provider wrapping
        ├── api/
        │   └── client.js              # Fetch client wrapper for all public, admin, and team API calls
        ├── components/
        │   ├── Footer.jsx             # Global website footer, visitor counter, and quick links
        │   ├── Header.jsx             # Global sticky navigation bar, news ticker, mobile drawer
        │   ├── ImageCropDialog.jsx    # Standalone interactive image cropper modal with pan & zoom
        │   ├── ImageLightbox.jsx      # Modal backdrop for viewing gallery images full-screen
        │   ├── PageGate.jsx           # Dynamic route blocker respecting admin page visibility flags
        │   ├── PageHero.jsx           # Standardized internal page hero banner with QR code block
        │   ├── PolicyPage.jsx         # Structured reusable renderer for legal & policy documents
        │   ├── SectionHeading.jsx     # Reusable typography heading component for sections
        │   ├── SiteDataProvider.jsx   # React Context holding global site data, cache, and auth token
        │   ├── SiteLayout.jsx         # Global page wrapper, maintenance lock screen, scroll reveal
        │   └── SubmissionForm.jsx     # Reusable interactive form handler with QR code and status
        ├── data/
        │   ├── legalPages.js          # Default legal content templates (Privacy, Terms, Refund)
        │   ├── navigation.js          # Main navigation menu hierarchy & URL mapping
        │   ├── pageVisibility.js      # Registry of all 31 toggleable public pages
        │   └── siteFallbackData.js    # Imports seed data to serve offline fallback site content
        ├── pages/                     # Routed page view components
        │   ├── AboutPage.jsx          # Institutional overview, mission, vision, and navigation cards
        │   ├── AdminDashboardPage.jsx # Comprehensive 20-tab admin control center (208 KB monolith)
        │   ├── ApplyPage.jsx          # Incubation admission application form with fee badge
        │   ├── ContactPage.jsx        # Contact info, campus Google Map embed, and inquiry buttons
        │   ├── DocumentsPage.jsx      # Institutional documents and downloadable PDF grid
        │   ├── EnquiryPage.jsx        # General public contact and collaboration inquiry form
        │   ├── GalleryPage.jsx        # Visual photo gallery with full-screen lightbox preview
        │   ├── GovernorMessagePage.jsx # Standalone governor message page (Legacy / Unused route)
        │   ├── HomePage.jsx           # Main homepage with video slider, stats, marquee, testimonials
        │   ├── IncubateeProfilePage.jsx # Individual detailed company profile for physical incubatees
        │   ├── IncubateesPage.jsx     # Directory grid of onboard physical startup companies
        │   ├── IncubiteeFormPage.jsx  # Multi-field incubatee self-onboarding submission page
        │   ├── InternRegistrationPage.jsx # Private intake form for student internship applications
        │   ├── LeadershipMessagePage.jsx # Dynamic message viewer for Governor, CM, and VC messages
        │   ├── LeadershipPage.jsx     # Strategic leadership pillars, patron messages, board links
        │   ├── MediaCoveragePage.jsx  # Press and newspaper clippings grid with lightbox preview
        │   ├── MembershipFormPage.jsx # Membership application form with fee breakdown
        │   ├── MembershipPage.jsx     # Membership tier packages and quick inquiry form
        │   ├── MentorsPage.jsx        # Directory grid of industry mentors and advisors
        │   ├── NewsEventsPage.jsx     # Filterable list and detailed views of news & upcoming events
        │   ├── NotFoundPage.jsx       # 404 error page for unmatched browser routes
        │   ├── PrivacyPolicyPage.jsx  # Official privacy policy page rendered via PolicyPage
        │   ├── RefundPolicyPage.jsx   # Official fee refund policy rendered via PolicyPage
        │   ├── RifServicesPage.jsx    # Custom institutional incubation benefits and screening criteria
        │   ├── ServicesPage.jsx       # Structured list of incubation services and facilities
        │   ├── TeamPage.jsx           # Multi-section directory (Board, Advisory, Team, Interns)
        │   ├── TermsConditionsPage.jsx# Official terms and conditions rendered via PolicyPage
        │   ├── TestimonialsPage.jsx   # Founder testimonials showcase and public review submission
        │   ├── VirtualStartupProfilePage.jsx # Individual detailed profile for virtual startups
        │   └── VirtualStartupsPage.jsx # Directory grid of virtual incubation startup companies
        ├── styles/
        │   └── main.css               # Monolithic global stylesheet (178 KB, 7,937 lines)
        └── utils/
            ├── formatters.js          # Date, timestamp, and text casing helper utilities
            ├── media.js               # Media URL resolver with SVG fallback generator
            └── object-path.js         # Deep object path traversal (`getByPath`, `setByPath`)
```

---

## 2. One-Line Directory Descriptions

* `RIF-main/`: Workspace root holding project meta configurations and shared documentation.
* `RIF-main/docs/`: Comprehensive technical documentation, architecture maps, and audit reports.
* `RIF-main/scripts/`: Automation scripts including the multi-service concurrent development runner.
* `RIF-main/backend/`: Node.js, Express, MongoDB, and Cloudinary backend application.
* `RIF-main/backend/data/`: JSON seed data and baseline CMS defaults.
* `RIF-main/backend/src/`: Backend ES Module source code.
* `RIF-main/backend/src/config/`: Configuration modules for environment, database, and Cloudinary.
* `RIF-main/backend/src/middleware/`: Express middleware for authentication, errors, and route matching.
* `RIF-main/backend/src/routes/`: Express router endpoint handlers for public, auth, admin, and team actions.
* `RIF-main/backend/src/services/`: Business logic services for database queries, normalization, and email.
* `RIF-main/backend/src/utils/`: Helper utilities for crypto, JWT tokens, validation, slugs, and audits.
* `RIF-main/frontend/`: Vite-powered React client application.
* `RIF-main/frontend/public/`: Static web assets, videos, compliance partner logos, and server redirect rules.
* `RIF-main/frontend/public/images/`: Primary branding images and icons.
* `RIF-main/frontend/public/images/partners/`: Partner accreditations and compliance badge webp graphics.
* `RIF-main/frontend/public/videos/`: MP4 motion graphics and background videos for the homepage.
* `RIF-main/frontend/src/`: React 19 application components, styles, data, and utilities.
* `RIF-main/frontend/src/api/`: Frontend API HTTP client interfacing with backend endpoints.
* `RIF-main/frontend/src/components/`: Reusable React UI components (headers, footers, heroes, forms, dialogs).
* `RIF-main/frontend/src/data/`: Static navigation trees, default legal pages, and page visibility registries.
* `RIF-main/frontend/src/pages/`: Routed view components corresponding to each public and administrative URL.
* `RIF-main/frontend/src/styles/`: Global CSS stylesheets, design tokens, responsive breakpoints, and animations.
* `RIF-main/frontend/src/utils/`: Client-side utility functions for URL resolution, formatting, and object manipulation.

---

## 3. Comprehensive File Inventory Table (All 103 Files)

| Path | Type | Purpose | Page / Section Controlled | Depends On | Used By | Size |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `.gitignore` | Config | Git exclusions | Source control | None | Git | 83 B |
| `package.json` | JSON | Root npm scripts | Project build & dev | npm | Developers / CI | 350 B |
| `README.md` | Markdown | Project guide & notes | Documentation | None | Developers | 2,809 B |
| `RIF_Website Deliverables.pdf` | PDF | Deliverables spec | Project deliverables | None | Project team | 131,167 B |
| `scripts/dev.mjs` | Node.js | Concurrent dev launcher | Root `npm run dev` | `child_process` | `package.json` | 853 B |
| `backend/backend-dev.err` | Log | Standard error log | Dev environment | Node dev | Developer debugging | 0 B |
| `backend/backend-dev.log` | Log | Standard output log | Dev environment | Node dev | Developer debugging | 146 B |
| `backend/package.json` | JSON | Backend config & deps | Backend runtime | npm | Node / npm | 1,141 B |
| `backend/package-lock.json` | JSON | Backend dependency lock | Dependencies | npm | npm | 54,319 B |
| `backend/data/cms-data.json` | JSON | Seed database & offline copy | All site content & defaults | None | `database.js`, `siteFallbackData.js` | 48,409 B |
| `backend/src/app.js` | JS | Express app setup & CORS | All `/api/*` endpoints | `express`, `cors`, routes | `server.js` | 1,207 B |
| `backend/src/server.js` | JS | Server bootstrapper | HTTP port listener | `app.js`, `database.js`, `env.js` | Backend start | 429 B |
| `backend/src/config/cloudinary.js`| JS | Cloudinary image uploader | Image asset uploads | `cloudinary`, `env.js` | `admin-routes`, `public-routes`, `team-routes` | 1,249 B |
| `backend/src/config/database.js`| JS | MongoDB connection & GridFS | Database queries & bucket | `mongodb`, `env.js`, `password.js` | Backend routes & services | 5,712 B |
| `backend/src/config/env.js` | JS | Env variable reader | Configuration | `dotenv` | Entire backend | 1,580 B |
| `backend/src/middleware/auth-middleware.js`| JS | JWT authentication gate | Protected API routes | `env.js`, `token.js` | `admin-routes`, `team-routes` | 1,121 B |
| `backend/src/middleware/error-handler.js`| JS | Central error handler | Global error response | None | `app.js` | 362 B |
| `backend/src/middleware/not-found.js`| JS | 404 handler | Unmatched API routes | None | `app.js` | 122 B |
| `backend/src/routes/admin-routes.js`| JS | Full admin API endpoints | `/api/admin/*` | `cms-service`, `database`, `auth-middleware` | `app.js` | 10,324 B |
| `backend/src/routes/auth-routes.js` | JS | Login API endpoints | `/api/auth/login`, `/api/auth/team-login` | `database`, `password`, `token` | `app.js` | 2,126 B |
| `backend/src/routes/public-routes.js`| JS | Public data & form submit | `/api/site`, `/api/forms/*`, `/api/assets/*`| `cms-service`, `database`, `mailer` | `app.js` | 7,841 B |
| `backend/src/routes/team-routes.js` | JS | Staff team API endpoints | `/api/team/*` | `cms-service`, `auth-middleware`, `audit` | `app.js` | 6,549 B |
| `backend/src/services/cms-service.js`| JS | CMS business logic & CRUD | Content storage & normalization | `database.js`, `slugify.js`, `mailer.js` | Backend routes | 24,235 B |
| `backend/src/services/mailer.js` | JS | Nodemailer email service | Form alert notifications | `nodemailer`, `env.js` | `public-routes`, `cms-service` | 4,565 B |
| `backend/src/utils/audit.js` | JS | Deep object diff logger | Admin & team audit tracking | None | `admin-routes`, `team-routes` | 1,658 B |
| `backend/src/utils/password.js` | JS | Scrypt password hashing | User authentication | `crypto` | `database`, `auth-routes`, `team-routes` | 732 B |
| `backend/src/utils/slugify.js` | JS | Text to URL slug | Item ID normalization | None | `cms-service.js` | 158 B |
| `backend/src/utils/token.js` | JS | HMAC-SHA256 JWT tokens | Stateless auth sessions | `crypto` | `auth-routes`, `auth-middleware` | 1,166 B |
| `backend/src/utils/validation.js` | JS | Input sanitization | Form validation | None | `public-routes.js` | 708 B |
| `frontend/index.html` | HTML | HTML shell & metadata | Browser entrance shell | `src/main.jsx` | Web Browser | 1,204 B |
| `frontend/package.json` | JSON | Frontend config & deps | Frontend build | Vite, React | npm / Vite | 608 B |
| `frontend/package-lock.json` | JSON | Frontend lockfile | Dependencies | npm | npm | 60,993 B |
| `frontend/package-lock 2.json` | JSON | Redundant duplicate lock | None (Duplicate) | None | Unused | 60,967 B |
| `frontend/vite.config.js` | JS | Vite bundler config | Dev server & build | `vite`, `@vitejs/plugin-react` | Vite CLI | 312 B |
| `frontend/public/.htaccess` | Apache | URL rewrite rules | Apache hosting routing | Apache `mod_rewrite`| Apache server | 370 B |
| `frontend/public/_redirects` | Netlify | SPA redirect rule | Netlify hosting routing | Netlify | Netlify / Pages | 19 B |
| `frontend/public/favicon.ico` | Image | Browser favicon | Browser tab | None | `index.html` | 2,686 B |
| `frontend/public/images/logo.jpg` | Image | RIF institution logo | Header branding & cards | None | `Header.jsx`, etc. | 89,545 B |
| `frontend/public/images/partners/12a-80G-1.webp` | Image | 12A/80G tax status logo | Homepage partner marquee | None | `HomePage.jsx` | 38,116 B |
| `frontend/public/images/partners/Captur11e.webp` | Image | Compliance partner logo | Homepage partner marquee | None | `HomePage.jsx` | 4,738 B |
| `frontend/public/images/partners/g20-logo.webp` | Image | G20 India summit logo | Homepage partner marquee | None | `HomePage.jsx` | 21,644 B |
| `frontend/public/images/partners/ngo-darpan.webp` | Image | NITI Aayog NGO Darpan logo | Homepage partner marquee | None | `HomePage.jsx` | 13,080 B |
| `frontend/public/images/partners/PngItem_2411963.webp`| Image | Udyam registration logo | Homepage partner marquee | None | `HomePage.jsx` | 64,848 B |
| `frontend/public/images/partners/startinup.webp` | Image | StartInUP Govt logo | Homepage partner marquee | None | `HomePage.jsx` | 13,964 B |
| `frontend/public/images/partners/startup.webp` | Image | ISO certification logo | Homepage partner marquee | None | `HomePage.jsx` | 46,432 B |
| `frontend/public/robots.txt` | Text | Crawler indexing rules | SEO crawler access | None | Search engine bots | 84 B |
| `frontend/public/sitemap.xml` | XML | Site URL sitemap | SEO site indexing | None | Search engines | 5,184 B |
| `frontend/public/videos/1rif-hero-logo.mp4` | Video | Hero motion logo (Alt 1) | Alternative hero video | None | Video repository | 1,360,494 B |
| `frontend/public/videos/2rif-hero-logo.mp4` | Video | Hero motion logo (Alt 2) | Alternative hero video | None | Video repository | 1,477,032 B |
| `frontend/public/videos/rif-hero-logo.mp4` | Video | Hero carousel video | Homepage top slider | None | `HomePage.jsx` | 488,929 B |
| `frontend/public/videos/Video_Generation_With_Logo.mp4`| Video | Focus areas loop video | Homepage focus areas | None | `HomePage.jsx` | 249,513 B |
| `frontend/src/main.jsx` | JSX | React entry script | Application root | React, `App.jsx`, `main.css` | `index.html` | 462 B |
| `frontend/src/App.jsx` | JSX | Router route definition | SPA routing & PageGates | `react-router-dom`, Pages | `main.jsx` | 6,274 B |
| `frontend/src/api/client.js` | JS | Frontend API HTTP client | All server communications | `fetch` API | Frontend components | 5,435 B |
| `frontend/src/components/Footer.jsx` | JSX | Global footer & visitor count | Bottom of all public pages | `SiteDataProvider`, `client.js` | `SiteLayout.jsx` | 4,757 B |
| `frontend/src/components/Header.jsx` | JSX | Global sticky header & nav | Top of all public pages | `navigation.js`, `SiteDataProvider` | `SiteLayout.jsx` | 11,417 B |
| `frontend/src/components/ImageCropDialog.jsx` | JSX | Image crop modal dialog | Public incubatee form crop | Canvas API | `IncubiteeFormPage.jsx` | 9,706 B |
| `frontend/src/components/ImageLightbox.jsx` | JSX | Full-screen image modal | Gallery & Media preview | `react-dom` Portal | `GalleryPage`, `MediaCoverage` | 1,432 B |
| `frontend/src/components/PageGate.jsx` | JSX | Visibility gatekeeper | Route blocking for disabled pages | `SiteDataProvider` | `App.jsx` | 852 B |
| `frontend/src/components/PageHero.jsx` | JSX | Internal page hero banner | Top header banner of pages | `SiteDataProvider`, `media.js` | Public Pages | 5,312 B |
| `frontend/src/components/PolicyPage.jsx` | JSX | Standard legal policy shell | Privacy, Terms, Refund | `PageHero.jsx` | Legal Pages | 2,319 B |
| `frontend/src/components/SectionHeading.jsx` | JSX | Section title typography | Section header blocks | None | Public Pages | 360 B |
| `frontend/src/components/SiteDataProvider.jsx` | JSX | Global state & cache context | App-wide data distribution | `client.js`, `siteFallbackData.js` | `main.jsx`, components | 2,897 B |
| `frontend/src/components/SiteLayout.jsx` | JSX | Layout & maintenance shell | Global layout & scroll reveal | `Header`, `Footer`, `react-router-dom` | `App.jsx` | 7,151 B |
| `frontend/src/components/SubmissionForm.jsx` | JSX | Multi-field form component | Apply, Enquiry, Membership | `client.js`, `media.js` | Form Pages | 8,623 B |
| `frontend/src/data/legalPages.js` | JS | Default legal policies | Legal content fallback | None | Legal Pages, `AdminDashboard` | 7,647 B |
| `frontend/src/data/navigation.js` | JS | Navigation hierarchy tree | Header & mobile navigation | None | `Header.jsx` | 1,636 B |
| `frontend/src/data/pageVisibility.js` | JS | Page visibility registry | Admin visibility controls | None | `PageGate`, `AdminDashboard` | 2,750 B |
| `frontend/src/data/siteFallbackData.js` | JS | Offline fallback dataset | Offline resilience | `cms-data.json` | `SiteDataProvider.jsx` | 250 B |
| `frontend/src/pages/AboutPage.jsx` | JSX | About RIF overview page | `/about` | `PageHero`, `SiteDataProvider` | `App.jsx` | 3,163 B |
| `frontend/src/pages/AdminDashboardPage.jsx`| JSX | 20-tab CMS control panel | `/admin`, `/team-panel` | `client.js`, `SiteDataProvider` | `App.jsx` | 208,807 B |
| `frontend/src/pages/ApplyPage.jsx` | JSX | Incubation application form | `/apply` | `SubmissionForm`, `SiteDataProvider`| `App.jsx` | 13,314 B |
| `frontend/src/pages/ContactPage.jsx` | JSX | Contact info & map embed | `/contact` | `PageHero`, `SiteDataProvider` | `App.jsx` | 4,083 B |
| `frontend/src/pages/DocumentsPage.jsx` | JSX | Official documents list | `/documents` | `SiteDataProvider`, `client.js` | `App.jsx` | 1,557 B |
| `frontend/src/pages/EnquiryPage.jsx` | JSX | General enquiry form | `/enquiry` | `SubmissionForm`, `SiteDataProvider`| `App.jsx` | 1,503 B |
| `frontend/src/pages/GalleryPage.jsx` | JSX | Photo gallery with lightbox | `/gallery` | `ImageLightbox`, `SiteDataProvider` | `App.jsx` | 3,207 B |
| `frontend/src/pages/GovernorMessagePage.jsx`| JSX | Legacy governor message | Not mounted in router | `SiteDataProvider`, `media.js` | Unused | 4,388 B |
| `frontend/src/pages/HomePage.jsx` | JSX | Main landing page | `/` | `SectionHeading`, `SiteDataProvider`| `App.jsx` | 21,304 B |
| `frontend/src/pages/IncubateeProfilePage.jsx`| JSX | Detailed startup profile | `/incubatees/:incubateeId` | `SiteDataProvider`, `media.js` | `App.jsx` | 14,165 B |
| `frontend/src/pages/IncubateesPage.jsx` | JSX | Directory of incubatees | `/incubatees` | `PageHero`, `SiteDataProvider` | `App.jsx` | 3,308 B |
| `frontend/src/pages/IncubiteeFormPage.jsx`| JSX | Incubatee registration form | `/incubatee-register` | `ImageCropDialog`, `client.js` | `App.jsx` | 8,952 B |
| `frontend/src/pages/InternRegistrationPage.jsx`| JSX | Student intern intake form | `/intern-registration` | `SubmissionForm.jsx` | `App.jsx` | 1,815 B |
| `frontend/src/pages/LeadershipMessagePage.jsx`| JSX | Leadership messages reader | `/leadership/message-from-*` | `SiteDataProvider`, `media.js` | `App.jsx` | 6,613 B |
| `frontend/src/pages/LeadershipPage.jsx` | JSX | Leadership & pillars page | `/leadership` | `PageHero`, `SectionHeading` | `App.jsx` | 10,187 B |
| `frontend/src/pages/MediaCoveragePage.jsx`| JSX | Press & news clips gallery | `/media-coverage` | `ImageLightbox`, `SiteDataProvider` | `App.jsx` | 2,693 B |
| `frontend/src/pages/MembershipFormPage.jsx`| JSX | Membership registration | `/membership-register` | `SubmissionForm`, `SiteDataProvider`| `App.jsx` | 6,670 B |
| `frontend/src/pages/MembershipPage.jsx` | JSX | Membership tiers & query | `/membership-plans` | `client.js`, `SiteDataProvider` | `App.jsx` | 5,958 B |
| `frontend/src/pages/MentorsPage.jsx` | JSX | Mentors directory grid | `/mentors` | `PageHero`, `SiteDataProvider` | `App.jsx` | 1,619 B |
| `frontend/src/pages/NewsEventsPage.jsx` | JSX | News & event lists & details | `/news-events`, `/news-events/:type/:id` | `PageHero`, `formatters.js` | `App.jsx` | 8,937 B |
| `frontend/src/pages/NotFoundPage.jsx` | JSX | 404 error page | Unmatched client routes (`*`) | `react-router-dom` | `App.jsx` | 432 B |
| `frontend/src/pages/PrivacyPolicyPage.jsx`| JSX | Privacy policy viewer | `/privacy-policy` | `PolicyPage`, `legalPages.js` | `App.jsx` | 658 B |
| `frontend/src/pages/RefundPolicyPage.jsx` | JSX | Fee refund policy viewer | `/refund-policy` | `PolicyPage`, `legalPages.js` | `App.jsx` | 654 B |
| `frontend/src/pages/RifServicesPage.jsx` | JSX | RIF benefits & screening | `/rif-services` | `SiteDataProvider`, `media.js` | `App.jsx` | 7,222 B |
| `frontend/src/pages/ServicesPage.jsx` | JSX | Structured services grid | `/services` | `PageHero`, `SiteDataProvider` | `App.jsx` | 1,282 B |
| `frontend/src/pages/TeamPage.jsx` | JSX | Board, Advisors, Team, Interns | `/team/*`, `/leadership/*` | `PageHero`, `SectionHeading` | `App.jsx` | 7,729 B |
| `frontend/src/pages/TermsConditionsPage.jsx`| JSX | Terms & conditions viewer | `/terms-and-conditions` | `PolicyPage`, `legalPages.js` | `App.jsx` | 666 B |
| `frontend/src/pages/TestimonialsPage.jsx` | JSX | Testimonials & submission | `/testimonials` | `PageHero`, `client.js` | `App.jsx` | 5,632 B |
| `frontend/src/pages/VirtualStartupProfilePage.jsx`| JSX | Virtual startup profile | `/virtual-startups/:startupId` | `SiteDataProvider`, `media.js` | `App.jsx` | 13,839 B |
| `frontend/src/pages/VirtualStartupsPage.jsx`| JSX | Virtual startups directory | `/virtual-startups` | `PageHero`, `SiteDataProvider` | `App.jsx` | 3,343 B |
| `frontend/src/styles/main.css` | CSS | Monolithic global stylesheet | Entire site visual appearance | CSS Custom Properties | `main.jsx` | 178,683 B |
| `frontend/src/utils/formatters.js` | JS | Date and string formatting | Data display formatting | `Intl.DateTimeFormat` | Components & Pages | 620 B |
| `frontend/src/utils/media.js` | JS | Media URL resolution & SVG | Image rendering & fallbacks | `API_ORIGIN` | Components & Pages | 1,896 B |
| `frontend/src/utils/object-path.js` | JS | Deep object getter & setter | CMS state manipulation | None | `AdminDashboardPage` | 378 B |

