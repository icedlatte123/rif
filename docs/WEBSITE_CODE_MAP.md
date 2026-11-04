# RIF Website — Code Map (What I See → Which Code Makes It)

This document provides a granular visual-to-code mapping of the entire website.

---

## Part 1: Page-by-Page & Section-by-Section Map

---

### Page 1: Homepage (`/`)
* **File:** `frontend/src/pages/HomePage.jsx`
* **Route:** `/`
* **Files Loaded:** `Header.jsx`, `Footer.jsx`, `main.css`, `SiteDataProvider.jsx`, `rif-hero-logo.mp4`, `Video_Generation_With_Logo.mp4`, partner webp images, `logo.jpg`.

#### Section 1.1: Global Header & Live Ticker
* **What the User Sees:** White sticky header bar with RIF logo, live scrolling news/event ticker above, navigation links (Home, About Us dropdown, Gallery & Documents dropdown, Services dropdown, Startup dropdown, Contact Us), and "Enquiry" button.
* **HTML Element / Class:** `Header.jsx` lines 88–265: `<header className="site-header">`, `<nav className="site-nav">`, `<div className="news-ticker">`.
* **CSS:** `frontend/src/styles/main.css` lines 420–750 (`.site-header`, `.desktop-nav`, `.nav-group`, `.dropdown-menu`, `.news-ticker-track`).
* **JavaScript:** `Header.jsx` lines 18–80 (`isGroupActive`, `closeMobileNav`, `useState` for dropdowns).
* **Backend / API:** `GET /api/site` (retrieves `siteData.news` and `siteData.events`).
* **Data Source:** MongoDB `site_content.news` and `site_content.events`.
* **To Change the Text:** Edit News & Events in Admin Dashboard, or edit `navigation.js`.
* **To Change the Look:** Edit `main.css` line 420 (`.site-header`).
* **To Change the Behavior:** Edit `Header.jsx` lines 25–45.

#### Section 1.2: Hero Video & Image Slider
* **What the User Sees:** Full-width media slider showing the RIF motion graphic video with left/right navigation arrows, pagination dots, and alternating uploaded hero slides.
* **HTML Element / Class:** `HomePage.jsx` lines 185–252: `<section className="home-slider-shell">`, `<div className="home-slider-stage">`, `<video className="home-slide-video">`, `<div className="slider-dots">`.
* **CSS:** `main.css` lines 1500–1750 (`.home-slider-shell`, `.home-slide`, `.home-slide-video`, `.slider-arrow`, `.slider-dot`).
* **JavaScript:** `HomePage.jsx` lines 105–140 (`goToSlide()`, `activeSlide` state, `getSlideObjectPosition()`).
* **Backend / API:** Video is served locally from `frontend/public/videos/rif-hero-logo.mp4`; image slides come from `GET /api/site` (`siteData.heroSlider`).
* **To Change the Text:** Admin Dashboard -> Homepage -> Hero Slider.
* **To Change the Look:** Edit `main.css` lines 1520–1580 (`.home-slider-stage`).
* **To Change the Behavior:** Edit `HomePage.jsx` lines 110–120 (`goToSlide`).

#### Section 1.3: Hero Copy & Rocket Launch Graphic
* **What the User Sees:** Animated institutional intro: "Rohilkhand Incubation Foundation" with highlighted letters, mission statement, "Send Enquiry" and "Explore Membership" buttons, plus focus area chips with mini looping video.
* **HTML Element / Class:** `HomePage.jsx` lines 255–310: `<section className="hero-grid home-copy-shell">`, `<div className="home-copy-launch-bg">`, `<span className="home-copy-cloud">`.
* **CSS:** `main.css` lines 1780–2050 (`.home-copy-shell`, `.home-copy-launch-bg`, `.home-copy-cloud`, `.rif-hero-title-initial`).
* **JavaScript:** `HomePage.jsx` lines 40–58 (`renderRifHeroTitle()`).
* **Backend / API:** `GET /api/site` (`homepage.hero`, `homepage.focusAreas`).
* **To Change the Text:** Admin Dashboard -> Homepage -> Hero Section.
* **To Change the Look:** Edit `main.css` lines 1780–1860.
* **To Change the Behavior:** Edit `HomePage.jsx` lines 270–290.

#### Section 1.4: Key Metrics & Impact Stats
* **What the User Sees:** 4-column card grid showing numbers (e.g., 50+ Ventures, 20+ Mentors, 10+ Sectors, 100% Commitment).
* **HTML Element / Class:** `HomePage.jsx` lines 312–322: `<section className="section">`, `<div className="stats-grid">`, `<article className="stat-card">`.
* **CSS:** `main.css` lines 2100–2180 (`.stats-grid`, `.stat-card strong`, `.stat-card span`).
* **Backend / API:** `GET /api/site` (`homepage.stats`).
* **To Change the Text:** Admin Dashboard -> Homepage -> Stats.
* **To Change the Look:** Edit `main.css` line 2120 (`.stat-card`).

#### Section 1.5: Affiliations & Compliance Marquee
* **What the User Sees:** Infinite looping logo ticker displaying institutional partner badges (G20, NGO Darpan, Startup India, ISO, 12A/80G, Udyam).
* **HTML Element / Class:** `HomePage.jsx` lines 324–358: `<div className="affiliations-marquee">`, `<div className="affiliations-marquee-track">`.
* **CSS:** `main.css` lines 2200–2290 (`.affiliations-marquee`, `.affiliations-marquee-track`, keyframe animation `affiliations-marquee-scroll`).
* **JavaScript:** Pure CSS continuous translate animation.
* **Data Source:** Hardcoded in `HomePage.jsx` array `spotlightPartners`.
* **To Change the Text/Logos:** Edit `frontend/src/pages/HomePage.jsx` lines 8–16.
* **To Change the Look/Speed:** Edit `main.css` line 2235 (`animation-duration: 28s`).

#### Section 1.6: Founder Testimonials Showcase
* **What the User Sees:** Dark themed carousel featuring founder quotes, avatar initials, venture titles, navigation arrows, and dot indicators.
* **HTML Element / Class:** `HomePage.jsx` lines 360–425: `<section className="section section-dark testimonials-showcase">`, `<div className="testimonial-carousel">`.
* **CSS:** `main.css` lines 2300–2500 (`.testimonials-showcase`, `.testimonial-carousel`, `.testimonial-track`).
* **JavaScript:** `HomePage.jsx` lines 145–175 (`goToTestimonial`, auto-scroll `setInterval` every 4.5s).
* **Backend / API:** `GET /api/site` (`homepage.testimonials`).
* **To Change the Text:** Admin Dashboard -> Homepage -> Testimonials.
* **To Change the Speed:** Edit `HomePage.jsx` line 160 (`4500`).

#### Section 1.7: Journey Timeline Grid
* **What the User Sees:** Numbered 4-step venture pathway cards (01 Idea Discovery, 02 Incubation, 03 Mentorship, 04 Acceleration).
* **HTML Element / Class:** `HomePage.jsx` lines 430–445: `<div className="timeline-grid">`, `<article className="timeline-card">`, `<span className="timeline-index">`.
* **CSS:** `main.css` lines 2520–2600 (`.timeline-grid`, `.timeline-card`, `.timeline-index`).
* **To Change the Text:** Admin Dashboard -> Homepage -> Timeline.

#### Section 1.8: Latest News Rail & Founder Support CTA
* **What the User Sees:** Left column showing featured news/events tiles; right column showing Founder Support card with QR code scan card and "Click to Connect" button.
* **HTML Element / Class:** `HomePage.jsx` lines 448–515: `<div className="split-grid home-latest-grid">`, `<div className="news-home-rail">`, `<div className="home-cta-qr-card">`.
* **CSS:** `main.css` lines 2620–2800 (`.news-home-rail`, `.news-home-tile`, `.home-cta-qr-card`).
* **Backend / API:** `GET /api/site` (`news`, `events`, `homepage.cta`).
* **To Change the QR Code:** Admin Dashboard -> Homepage -> Call to Action.

#### Section 1.9: Global Footer & Visitor Counter
* **What the User Sees:** 4-column institutional footer, contact information, Google Map link, quick links, legal policies, credit notice ("Developed by VUN Tech"), and live 6-digit visitor counter.
* **HTML Element / Class:** `Footer.jsx` lines 65–134: `<footer className="site-footer">`, `<div className="footer-visit-mini">`.
* **CSS:** `main.css` lines 1200–1450 (`.site-footer`, `.footer-top-grid`, `.footer-visit-mini span`).
* **JavaScript:** `Footer.jsx` lines 22–58 (`useEffect` calling `api.recordVisit()`).
* **Backend / API:** `POST /api/visits` (increments MongoDB atomic counter).
* **To Change the Text:** Admin Dashboard -> Site Settings, or edit `Footer.jsx`.

---

### Page 2: About Us (`/about`)
* **File:** `frontend/src/pages/AboutPage.jsx`
* **Route:** `/about`
* **Sections:**
  1. **Page Hero Banner:** Title, description, and action buttons (`PageHero.jsx`).
  2. **Mission & Vision Cards:** Split grid highlighting university-aligned mission and vision (`content-card`).
  3. **Leadership & Team Portal Navigation:** CTA cards redirecting to Board of Directors and Interns.
  4. **Onboard Startups Panel:** Prompt inviting visitors to explore startup directory.
* **Data Source:** MongoDB `site_content.about`.
* **To Change Content:** Admin Dashboard -> About.

---

### Page 3: Leadership Hub (`/leadership`)
* **File:** `frontend/src/pages/LeadershipPage.jsx`
* **Route:** `/leadership`
* **Sections:**
  1. **Page Hero:** Heading and CTAs to Board of Directors and Enquiry.
  2. **Patron Messages Grid:** Governor (Anandiben Patel) and Chief Minister (Yogi Adityanath) official message cards with photos and "Read More" expanders.
  3. **Vice Chancellor Message Card:** Dedicated message from MJPRU Vice Chancellor.
  4. **Leadership Pillars Grid:** Strategic institutional pillars (Governance, Ecosystem, Capital, etc.).
* **Data Source:** MongoDB `site_content.team.leadershipContent` and `site_content.about.pillars`.
* **To Change Content:** Admin Dashboard -> Leadership & Team -> Leadership Content.

---

### Page 4: Leadership Message Pages (`/leadership/message-from-*`)
* **File:** `frontend/src/pages/LeadershipMessagePage.jsx`
* **Routes:**
  * `/leadership/message-from-governor` (`messageKey="governorMessage"`)
  * `/leadership/message-from-chief-minister` (`messageKey="chiefMinisterMessage"`)
  * `/leadership/message-from-vice-chancellor` (`messageKey="viceChancellorMessage"`)
* **Sections:**
  1. **Message Hero & Official Quote:** Full portrait photo, patron name, designation, and message paragraphs.
  2. **Official Letter Card:** High-resolution image of the signed official document with "Preview Full Screen" button.
* **Data Source:** MongoDB `site_content.team.leadershipContent[messageKey]`.

---

### Page 5: Team & Directory Pages (`/team/*` & `/leadership/*`)
* **File:** `frontend/src/pages/TeamPage.jsx`
* **Routes:**
  * `/team/core-team` & `/team` (`sectionKey="coreTeam"`)
  * `/leadership/board-of-directors` & `/team/board-of-directors` (`sectionKey="boardOfDirectors"`)
  * `/leadership/advisory-board` & `/team/advisory-board` (`sectionKey="advisoryBoard"`)
  * `/team/interns` (`sectionKey="interns"`)
* **Sections:**
  1. **Page Hero:** Section title, eyebrow, and cross-navigation buttons.
  2. **Profile Card Grid:** Avatar image or initials circle, full name, role/designation, bio, and social links (LinkedIn, GitHub).
* **Data Source:** MongoDB `site_content.team[sectionKey]`.
* **To Change Content:** Admin Dashboard -> Leadership & Team.

---

### Page 6: Onboard Startups / Incubatees (`/incubatees`)
* **File:** `frontend/src/pages/IncubateesPage.jsx`
* **Route:** `/incubatees`
* **Sections:**
  1. **Page Hero:** Onboard startups banner and "Send Enquiry" CTA.
  2. **Startup Card Grid:** Cards displaying startup logo/avatar, venture name, sector tag, incubation stage, tagline, summary snippet, and "View Profile" link.
* **Data Source:** MongoDB `site_content.incubatees`.
* **To Change Content:** Admin Dashboard -> Incubatees.

---

### Page 7: Incubatee Company Profile (`/incubatees/:incubateeId`)
* **File:** `frontend/src/pages/IncubateeProfilePage.jsx`
* **Route:** `/incubatees/:incubateeId` (matches startup ID, slug, or sanitized name)
* **Sections:**
  1. **Company Header:** Logo, company name, stage badge, sector, location, and website link.
  2. **Founder & Contact Card:** Founder name, official email, phone, and social icons (LinkedIn, Twitter, etc.).
  3. **Venture Overview:** Establishment year, detailed summary, description, and strategic objectives.
  4. **Directors & Leadership List:** Bullet list of company directors.
  5. **Product Photo Gallery:** Image grid with lightbox zoom for venture photos.
* **Data Source:** Matches entry in `siteData.incubatees`.

---

### Page 8: Virtual Startups (`/virtual-startups` & `/:startupId`)
* **Files:** `frontend/src/pages/VirtualStartupsPage.jsx` & `VirtualStartupProfilePage.jsx`
* **Routes:** `/virtual-startups` and `/virtual-startups/:startupId`
* **Sections:** Mirror the physical incubatee directory and profile views but load from `siteData.virtualStartups`.
* **Data Source:** MongoDB `site_content.virtualStartups`.

---

### Page 9: Mentors Directory (`/mentors`)
* **File:** `frontend/src/pages/MentorsPage.jsx`
* **Route:** `/mentors`
* **Sections:** Page Hero, 3-column card grid featuring mentor photo, domain expertise badge, full name, company organization, and advisory focus description.
* **Data Source:** MongoDB `site_content.mentors`.
* **To Change Content:** Admin Dashboard -> Mentors.

---

### Page 10: Services & RIF Custom Services (`/services` & `/rif-services`)
* **Files:** `frontend/src/pages/ServicesPage.jsx` & `RifServicesPage.jsx`
* **Routes:** `/services` and `/rif-services`
* **Sections:**
  * `/services`: Structured grid of incubation facilities, legal guidance, laboratory access, and funding support.
  * `/rif-services`: Institutional custom offerings, "Benefits to Choose RIF", screening process flow, and eligibility criteria checklist.
* **Data Source:** MongoDB `site_content.services` and `site_content.rifServices`.
* **To Change Content:** Admin Dashboard -> Services OR RIF Services.

---

### Page 11: Membership Plans & Inquiries (`/membership-plans`)
* **File:** `frontend/src/pages/MembershipPage.jsx`
* **Route:** `/membership-plans`
* **Sections:**
  1. **Membership Plan Cards:** Pricing tier packages (Student, Startup, Corporate), fee breakdown, and feature lists.
  2. **Quick Query Form:** Inline interactive contact form sending queries directly to `/api/forms/enquiry`.
* **Data Source:** MongoDB `site_content.membershipPlans`.

---

### Page 12: News & Events (`/news-events` & `/:itemType/:itemId`)
* **File:** `frontend/src/pages/NewsEventsPage.jsx`
* **Routes:** `/news-events` and `/news-events/:itemType/:itemId`
* **Sections:**
  1. **Category Filter Tabs:** Toggle between "All Updates", "News", and "Events".
  2. **Update Cards:** Thumbnail image, category/status badge, date, title, excerpt, and link.
  3. **Item Detail View:** Full article copy, high-res banner, published date, and downloadable attachments (PDF/DOCX).
* **Data Source:** MongoDB `site_content.news` and `site_content.events`.
* **To Change Content:** Admin Dashboard -> News & Events.

---

### Page 13: Photo Gallery & Media Coverage (`/gallery` & `/media-coverage`)
* **Files:** `frontend/src/pages/GalleryPage.jsx` & `MediaCoveragePage.jsx`
* **Routes:** `/gallery` and `/media-coverage`
* **Sections:** Masonry/grid layout of institutional event photos and newspaper press coverage clippings with click-to-enlarge `<ImageLightbox>`.
* **Data Source:** MongoDB `site_content.gallery` and `site_content.mediaCoverage`.
* **To Change Content:** Admin Dashboard -> Gallery OR News & Events.

---

### Page 14: Documents Repository (`/documents`)
* **File:** `frontend/src/pages/DocumentsPage.jsx`
* **Route:** `/documents`
* **Sections:** Card list of official institutional brochures, policy manuals, and governance records with direct "View / Download" buttons streaming from `/api/assets/:assetId`.
* **Data Source:** MongoDB `site_content.about.documents`.

---

### Page 15: Public Form Pages
* **Routes & Files:**
  * **Incubation Application:** `/apply` (`ApplyPage.jsx` wrapping `SubmissionForm.jsx`).
  * **General Inquiry:** `/enquiry` (`EnquiryPage.jsx` wrapping `SubmissionForm.jsx`).
  * **Membership Registration:** `/membership-register` (`MembershipFormPage.jsx`).
  * **Incubatee Self-Onboarding:** `/incubatee-register` (`IncubiteeFormPage.jsx` with `ImageCropDialog.jsx`).
  * **Internship Registration:** `/intern-registration` (`InternRegistrationPage.jsx`).
* **Backend Endpoints:** `POST /api/forms/*`.
* **Where Submissions Go:** Saved into MongoDB `submissions` collection; alert emails sent via Nodemailer.

---

### Page 16: Legal & Policy Pages
* **Routes & Files:**
  * `/privacy-policy` (`PrivacyPolicyPage.jsx`)
  * `/terms-and-conditions` (`TermsConditionsPage.jsx`)
  * `/refund-policy` (`RefundPolicyPage.jsx`)
* **Renderer:** `PolicyPage.jsx`.
* **Data Source:** MongoDB `site_content.legalPages`.

---

### Page 17: Admin & Team Control Panels
* **Files:** `frontend/src/pages/AdminDashboardPage.jsx`
* **Routes:**
  * Super Admin Control: `/admin` (`teamMode={false}`)
  * Staff Team Panel: `/team-panel` (`teamMode={true}`)
* **Sections:** 20 administrative management tabs controlling every collection, user account, and submission in the system.

---

## Part 2: Feature-by-Feature Flow Trace

### Feature 2.1: Navigation Dropdown & Mobile Drawer
1. **User Action:** Clicks "About Us" or hamburger menu button on mobile.
2. **HTML Element:** `Header.jsx` line 97: `<button className="mobile-toggle">` or lines 105–180: `<div className="nav-group">`.
3. **JS Event:** `onClick={() => setMobileOpen(!mobileOpen)}` or `onMouseEnter` / `onClick` for dropdowns.
4. **State Change:** `mobileOpen` state toggles boolean; document root adds `.mobile-nav-open`.
5. **Screen Change:** Mobile navigation drawer slides in from the right; scroll on `body` is locked.

### Feature 2.2: Homepage Video & Hero Slider Navigation
1. **User Action:** Clicks slider arrow or pagination dot.
2. **HTML Element:** `HomePage.jsx` lines 233–248: `<button className="slider-arrow">`.
3. **JS Function:** `goToSlide(index)` updates `activeSlide`.
4. **Screen Change:** `.home-slide-active` CSS class shifts; previous slide fades out, next slide zooms in.

### Feature 2.3: Form Submission Flow (e.g. Incubation Apply Form)
1. **User Action:** Fills out fields and clicks "Submit Application".
2. **HTML Element:** `SubmissionForm.jsx` line 140: `<form onSubmit={handleSubmit}>`.
3. **JS Event / Function:** `handleSubmit(event)` validates fields and calls `api.submitForm("apply", payload)`.
4. **API Request:** `POST /api/forms/apply` with JSON payload.
5. **Backend Handler:** `backend/src/routes/public-routes.js` line 92 -> `createSubmission("apply", payload)`.
6. **Database Operation:** Inserts document into MongoDB `submissions` collection.
7. **Email Notification:** `mailer.js` -> `sendSubmissionEmails("apply", entry)` notifies admin and applicant.
8. **Screen Change:** Form inputs disable, green confirmation banner displays: "Application submitted successfully."

### Feature 2.4: Intern Application Flow (Mandatory Email)
1. **User Action:** Submits form at `/intern-registration`.
2. **API Request:** `POST /api/forms/intern`.
3. **Backend Handler:** Validates email format with regex; calls `sendInternRegistrationEmails(submission)`.
4. **SMTP Verification:** If SMTP credentials are missing, backend throws 503 error: "Intern registration email is not configured."
5. **Screen Change:** On success, displays confirmation message.

### Feature 2.5: Image Lightbox Zoom
1. **User Action:** Clicks any photo in Gallery or Media Coverage.
2. **HTML Element:** `GalleryPage.jsx` line 52: `<button className="image-preview-trigger">`.
3. **JS Event:** `setSelectedImage({ src, alt, title })`.
4. **DOM Operation:** `ImageLightbox.jsx` mounts modal portal into `document.body`.
5. **Screen Change:** Background darkens, full-resolution image displays in center; Escape key dismisses.

### Feature 2.6: Admin Login Flow
1. **User Action:** Enters username/password at `/admin` and clicks "Sign In".
2. **API Request:** `POST /api/auth/login`.
3. **Backend Handler:** `auth-routes.js` verifies scrypt password hash; returns stateless HMAC-SHA256 JWT.
4. **Frontend Action:** Stores token in `localStorage` under `rif-admin-token` and updates `SiteDataProvider`.
5. **Screen Change:** Login card unmounts; 20-tab Admin Dashboard unlocks.

### Feature 2.7: Emergency Maintenance Shield Toggle
1. **User Action:** Admin toggles "Maintenance Mode" switch in Admin Site Settings and clicks Save.
2. **API Request:** `PUT /api/admin/content/siteSettings` with `{ maintenanceMode: true }`.
3. **Backend Handler:** Normalizes and updates `site-content` in MongoDB.
4. **Frontend Reaction:** Next site refresh replaces standard layout with `MaintenanceShell` for all visitors, while preserving access to `/admin`.

---

## Part 3: Function, Class, & Component Dictionary

| Name | File & Line | What It Does (Plain Language) | Called By | Calls | Affects |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SiteDataProvider` | `SiteDataProvider.jsx:26` | React Context provider managing global site data, cache, and auth token | `main.jsx:11` | `readCachedSiteData`, `api.getSiteData` | Entire site |
| `useSiteData` | `SiteDataProvider.jsx:87` | Hook to consume site data and auth functions | Components & Pages | `useContext` | All data-driven UI |
| `SiteLayout` | `SiteLayout.jsx:62` | Master layout rendering Header, Footer, and scroll reveal animations | `App.jsx:43` | `useSiteData`, `IntersectionObserver` | Entire layout |
| `Header` | `Header.jsx:20` | Sticky header navigation and news ticker | `SiteLayout.jsx:178` | `useSiteData`, `isGroupActive` | Top of every page |
| `Footer` | `Footer.jsx:10` | Global footer, links, and visitor counter | `SiteLayout.jsx:182` | `api.recordVisit`, `useSiteData` | Bottom of every page |
| `PageHero` | `PageHero.jsx:66` | Internal page banner with title, description, and QR card | Public Pages | `useSiteData`, `resolveMediaUrl` | Top of internal pages |
| `SubmissionForm` | `SubmissionForm.jsx:55` | Multi-field interactive form handler | Apply, Enquiry, Membership | `api.submitForm` | Public form pages |
| `ImageLightbox` | `ImageLightbox.jsx:4` | Full-screen modal for previewing gallery images | `GalleryPage`, `MediaCoverage`| `createPortal` | Gallery & Media |
| `PageGate` | `PageGate.jsx:5` | Blocks disabled pages based on admin visibility settings | `App.jsx:41` | `useSiteData` | All routed pages |
| `PolicyPage` | `PolicyPage.jsx:13` | Renders standardized legal document sections | Legal Pages | `PageHero` | Legal pages |
| `resolveMediaUrl`| `media.js:29` | Resolves image paths or returns an SVG placeholder | Pages & Components | `API_ORIGIN` | All image elements |
| `formatDate` | `formatters.js:1` | Formats ISO timestamps into readable Indian date strings | News & Events | `Intl.DateTimeFormat` | News & event cards |
| `connectToDatabase`| `database.js:107` | Connects MongoDB, builds indexes, and seeds data | `server.js:6` | `MongoClient`, `seedDatabaseIfNeeded` | Entire backend |
| `getPublicSiteData`| `cms-service.js:705` | Fetches and normalizes full site content document | `public-routes.js:52`| `getSiteContentCollection` | Frontend UI |
| `createSubmission`| `cms-service.js:770` | Saves form submission to MongoDB and dispatches emails | `public-routes.js` | `sendSubmissionEmails` | Inquiries & Applications |
| `signToken` | `token.js:6` | Generates HMAC-SHA256 stateless JWT auth token | `auth-routes.js` | `crypto.createHmac` | Admin & Team sessions |
| `verifyToken` | `token.js:19` | Validates JWT signature and expiration | `auth-middleware.js` | `crypto.createHmac` | Protected API routes |
| `hashPassword` | `password.js:5` | Salts and hashes passwords with scrypt | `database.js`, `team-routes.js` | `crypto.scryptSync` | User authentication |
| `verifyPassword` | `password.js:12` | Constant-time password verification | `auth-routes.js` | `crypto.timingSafeEqual` | Login endpoints |
| `uploadImageBuffer`| `cloudinary.js:29`| Uploads image buffer stream to Cloudinary CDN | Routes & Services | `cloudinary.uploader` | Image uploads |

---

## Part 4: Reverse Lookup (File → Website Impact)

* **If `backend/src/config/database.js` is deleted or broken:** The backend server will not start; all API calls will fail; the frontend will fall back to static bundled JSON data in read-only mode.
* **If `backend/src/services/cms-service.js` is deleted or broken:** No content updates, submissions, or testimonials can be processed or fetched from the database.
* **If `backend/src/routes/public-routes.js` is deleted or broken:** Visitors will be unable to submit applications, inquiries, memberships, or download documents.
* **If `backend/src/routes/auth-routes.js` is deleted or broken:** Administrators and staff members will be unable to log in to `/admin` or `/team-panel`.
* **If `frontend/src/App.jsx` is deleted or broken:** The entire frontend website will crash with a blank screen; no routes will render.
* **If `frontend/src/components/SiteDataProvider.jsx` is deleted or broken:** All public pages will fail with a React Context error ("useSiteData must be used within SiteDataProvider").
* **If `frontend/src/components/Header.jsx` is deleted or broken:** The navigation bar, branding logo, and news ticker will disappear from every public page.
* **If `frontend/src/components/Footer.jsx` is deleted or broken:** The footer, visitor counter, legal links, and contact information will disappear from every page.
* **If `frontend/src/styles/main.css` is deleted or broken:** The entire website will lose its styling, appearing as unformatted plain HTML with broken layouts.
* **If `frontend/src/pages/AdminDashboardPage.jsx` is deleted or broken:** The `/admin` and `/team-panel` control centers will fail to render, disabling content management.

---

## Part 5: Shared Code & Dependencies

1. **`SiteDataProvider.jsx`:** Consumed by almost every component and page; provides `siteData`, `status`, `refreshSiteData`, and `authToken`.
2. **`SiteLayout.jsx`:** Wraps all routed pages; controls maintenance mode, header, footer, and scroll animations.
3. **`PageHero.jsx`:** Shared header banner used across 16 different public pages.
4. **`SubmissionForm.jsx`:** Shared form component powering Apply, Enquiry, Membership, and Intern pages.
5. **`PolicyPage.jsx`:** Shared legal page renderer powering Privacy Policy, Terms & Conditions, and Refund Policy.
6. **`main.css`:** Single global stylesheet loaded by `main.jsx` controlling visual styling across the entire site.
7. **`cms-data.json`:** Shared between backend (seed data) and frontend (`siteFallbackData.js`) for offline resilience.

---

## Part 6: Unknowns & Ambiguities

* `UNCERTAIN: Payment Gateway Integration`: Multiple forms and admin settings mention "Payment Amount" (`paymentAmount`), QR codes ("Scan to Pay"), and paise conversion (`parseAmountToPaise`), but there is no integrated online payment gateway SDK (such as Razorpay, Cashfree, or Stripe). Payments currently rely on offline bank transfers, cheque instructions, or manual QR code scanning.
* `UNCERTAIN: Cloudinary Production Account`: No live Cloudinary credentials are included in the repository. In development, image uploads will fail unless credentials are provided in `backend/.env`.
* `UNCERTAIN: SMTP Email Configuration`: If SMTP credentials are not configured in `backend/.env`, intern registrations at `/intern-registration` will return a 503 error, while other form submissions will save to the database but fail to send notification emails.

