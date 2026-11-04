# RIF Website — How to Change Things (Master Cheat Sheet)

This master cheat sheet provides step-by-step instructions on how to change any aspect of the website, whether through the **No-Code Admin Dashboard** or directly in the **Codebase**.

---

## 1. Quick Decision Guide: Admin Dashboard vs. Codebase

* **Can I change it without editing code?**
  **YES**, almost all text, images, logos, hero banners, team members, incubatees, mentors, news/events, legal policies, forms meta, and page visibility can be changed directly at [http://localhost:5173/admin](http://localhost:5173/admin) (or your live admin URL) without touching code or redeploying.
* **When do I need to edit code?**
  You only need to edit code to change brand colors, global fonts, CSS animations, add new custom pages/routes, add database collections, or modify backend business logic.

---

## 2. Master Cheat Sheet Table

| I Want to Change... | Edit This File | Exact Location (Selector / Function / Line) | Other Files That May Also Need Updating |
| :--- | :--- | :--- | :--- |
| **Primary Brand Blue Color** | `frontend/src/styles/main.css` | Line 13: `--primary: #1f4da7;` & Line 14: `--primary-deep: #123b8c;` | `main.css` (check gradient lines 44–48) |
| **Accent Red Color** | `frontend/src/styles/main.css` | Line 16: `--accent: #ce2026;` & Line 18: `--red-accent: #ce2026;` | None |
| **Background Color / Gradients**| `frontend/src/styles/main.css` | Line 4: `--bg: #edf3fb;` & Lines 43–48 (`body` background gradient) | None |
| **Global Font Family** | `frontend/src/styles/main.css` | Line 25: `font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;` | `frontend/index.html` (if loading Google Fonts) |
| **Site Logo (Header)** | `frontend/public/images/logo.jpg` | Replace the image file directly on disk, OR update `Header.jsx` line 92 (`src="/images/logo.jpg"`) | `backend/data/cms-data.json` |
| **Favicon Icon** | `frontend/public/favicon.ico` | Replace the `.ico` file on disk & update `frontend/index.html` line 5 to `<link rel="icon" href="/favicon.ico" />` | None |
| **Header Height** | `frontend/src/styles/main.css` | Line 3: `--header-height: 82px;` | None |
| **Navigation Menu Links / Order**| `frontend/src/data/navigation.js` | Lines 1–62: `export const navigation = [...]` | `frontend/src/App.jsx` (if adding new routes) |
| **Header Action Button (Enquiry)**| `frontend/src/data/navigation.js` | Lines 64–67: `export const applyAction = { label: "Enquiry", to: "/enquiry" };` | None |
| **News Ticker at Top of Header**| **Admin Dashboard:** News & Events | Go to Admin -> News & Events -> Create/Edit news or events | `backend/data/cms-data.json` |
| **Contact Email & Phone** | **Admin Dashboard:** Site Settings | Go to Admin -> Site Settings -> `contactEmail` & `contactPhone` | `backend/.env` (`NOTIFY_ADMIN_EMAIL`) |
| **Campus Location / Address** | **Admin Dashboard:** Site Settings | Go to Admin -> Site Settings -> `location` | `Footer.jsx` line 12 (fallback address) |
| **Footer Developed By Credit**| `frontend/src/components/Footer.jsx`| Lines 123–128: `<p className="footer-credit"><a href="https://vuntech.online"...>VUN Tech</a></p>` | None |
| **Footer Base Visitor Count**| `frontend/src/components/Footer.jsx`| Line 14: `const baseCount = siteSettings?.visitCount ?? 50000;` | `backend/src/services/cms-service.js` line 670 |
| **Homepage Hero Video** | `frontend/public/videos/rif-hero-logo.mp4` | Replace MP4 file directly on disk, OR update `HomePage.jsx` line 20: `const heroVideoSrc = "/videos/..."` | None |
| **Homepage Focus Areas Video**| `frontend/public/videos/Video_Generation_With_Logo.mp4` | Replace MP4 file on disk, OR update `HomePage.jsx` line 21: `const miniVideoSrc = "/videos/..."` | None |
| **Homepage Hero Title / Text** | **Admin Dashboard:** Homepage | Go to Admin -> Homepage -> Hero Section (`eyebrow`, `title`, `description`) | `backend/data/cms-data.json` |
| **Homepage Action Buttons** | **Admin Dashboard:** Homepage | Go to Admin -> Homepage -> Hero Section (`primaryCtaLabel`, `primaryCtaLink`, etc.) | None |
| **Homepage Stats (Numbers)** | **Admin Dashboard:** Homepage | Go to Admin -> Homepage -> Stats Collection (`value`, `label`) | `backend/data/cms-data.json` |
| **Homepage Partner Logos (Marquee)**| `frontend/src/pages/HomePage.jsx` | Lines 8–16: `const spotlightPartners = [...]` | Place new images in `frontend/public/images/partners/` |
| **Testimonials Slider Items** | **Admin Dashboard:** Homepage | Go to Admin -> Homepage -> Testimonials Collection (toggle `featuredOnHome`) | `TestimonialsPage.jsx` |
| **Testimonial Auto-Scroll Speed**| `frontend/src/pages/HomePage.jsx` | Line 160: `window.setInterval(..., 4500);` (change 4500ms) | None |
| **Journey Timeline Steps** | **Admin Dashboard:** Homepage | Go to Admin -> Homepage -> Timeline Collection (`title`, `description`) | `backend/data/cms-data.json` |
| **Founder Support QR Code** | **Admin Dashboard:** Homepage | Go to Admin -> Homepage -> Call to Action -> QR settings (`qrImageUrl`, `qrTitle`) | `SiteLayout.jsx` |
| **Google Forms Connect Link** | `frontend/src/components/SiteLayout.jsx`| Line 8: `const qrConnectUrl = "https://forms.gle/XTdecnwMjBqfrEvHA";` | `HomePage.jsx` line 19, `PageHero.jsx` line 17 |
| **Governor / CM Signed Letters**| **Admin Dashboard:** Leadership & Team | Go to Admin -> Leadership & Team -> Leadership Content -> Upload letter image | None |
| **Board / Advisory / Core Team**| **Admin Dashboard:** Leadership & Team | Go to Admin -> Leadership & Team -> Add/Edit profiles in each section | `backend/data/cms-data.json` |
| **Student Interns Directory** | **Admin Dashboard:** Leadership & Team | Go to Admin -> Leadership & Team -> Interns Collection | `backend/data/cms-data.json` |
| **Incubatees (Onboard Startups)**| **Admin Dashboard:** Incubatees | Go to Admin -> Incubatees -> Add New Incubatee with photos & links | `backend/data/cms-data.json` |
| **Virtual Startups Directory** | **Admin Dashboard:** Virtual Startups | Go to Admin -> Virtual Startups -> Add New Virtual Startup | `backend/data/cms-data.json` |
| **Industry Mentors Directory** | **Admin Dashboard:** Mentors | Go to Admin -> Mentors -> Add/Edit mentor profiles | `backend/data/cms-data.json` |
| **Incubation Services Grid** | **Admin Dashboard:** Services | Go to Admin -> Services -> Add/Edit service cards | `backend/data/cms-data.json` |
| **Membership Plans & Prices** | **Admin Dashboard:** Membership | Go to Admin -> Membership -> Add/Edit membership tiers and pricing | `MembershipFormPage.jsx` |
| **RIF Benefits & Screening Steps**| **Admin Dashboard:** RIF Services | Go to Admin -> RIF Services -> Benefits, Service Tiles, Screening Steps | `backend/data/cms-data.json` |
| **Public Photo Gallery** | **Admin Dashboard:** Gallery | Go to Admin -> Gallery -> Upload images | `frontend/public/` |
| **Media & Newspaper Clippings**| **Admin Dashboard:** Gallery / News | Go to Admin -> News & Events -> Media Coverage | None |
| **Official Documents (PDFs)** | **Admin Dashboard:** About | Go to Admin -> About -> Documents -> Upload PDF/DOCX file | MongoDB GridFS |
| **Legal Pages (Privacy/Terms)**| **Admin Dashboard:** Legal Pages | Go to Admin -> Legal Pages -> Edit sections for Privacy, Terms, or Refund | `frontend/src/data/legalPages.js` |
| **Form Fees (Apply / Incubatee)**| **Admin Dashboard:** Forms | Go to Admin -> Forms -> Set `paymentAmount` for Apply or Incubatee | None |
| **Disable a Specific Page** | **Admin Dashboard:** Page Visibility | Go to Admin -> Page Visibility -> Toggle switch for the page off | `pageVisibility.js` |
| **Turn On Maintenance Mode** | **Admin Dashboard:** Site Settings | Go to Admin -> Site Settings -> Toggle `maintenanceMode` on | None |
| **SEO Meta Title & Description**| `frontend/index.html` | Lines 6–18: `<title>`, `<meta name="description">`, `<meta property="og:...">` | `public/sitemap.xml` |
| **Sitemap URLs** | `frontend/public/sitemap.xml` | Edit XML `<loc>` entries directly | `public/robots.txt` |
| **Admin Login Username/Password**| `backend/.env` | `ADMIN_USERNAME=...` & `ADMIN_PASSWORD=...` (auto-syncs on server restart) | None |
| **Admin Secret Key (JWT)** | `backend/.env` | `ADMIN_TOKEN_SECRET=...` (change to a random 64-char string) | None |
| **Backend Port Number** | `backend/.env` | `PORT=5001` | `frontend/.env` (`VITE_API_BASE_URL`) |
| **MongoDB Connection String** | `backend/.env` | `MONGODB_URI=mongodb+srv://...` | None |
| **Cloudinary Image Credentials**| `backend/.env` | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | None |
| **Email SMTP Host / Password** | `backend/.env` | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | None |

---

## 3. Step-by-Step Guides for Common Customizations

### 3.1 How to Change Brand Colors
1. Open `frontend/src/styles/main.css`.
2. Locate the `:root` block at lines 1–28.
3. Replace the color values:
   ```css
   --primary: #your_new_primary_hex;      /* Main institutional blue */
   --primary-deep: #your_darker_blue_hex; /* Darker blue for hover states */
   --accent: #your_new_accent_hex;        /* Vibrant red/orange accent */
   --bg: #your_light_background_hex;      /* App background tint */
   ```
4. Save the file. Vite Hot Module Replacement (HMR) will instantly reflect the changes in your browser.

### 3.2 How to Add a New Page to the Website
To add a new page (e.g., `/fellowship`):
1. **Create the page component:**
   Create `frontend/src/pages/FellowshipPage.jsx`:
   ```jsx
   import { PageHero } from "../components/PageHero.jsx";
   export default function FellowshipPage() {
     return (
       <>
         <PageHero eyebrow="Program" title="RIF Fellowship" description="Supporting young innovators." />
         <section className="section"><p>Content goes here.</p></section>
       </>
     );
   }
   ```
2. **Register the route in `frontend/src/App.jsx`:**
   Import the component and add the route:
   ```jsx
   import FellowshipPage from "./pages/FellowshipPage.jsx";
   // Inside <Routes><Route element={<SiteLayout />}>:
   <Route element={gated("fellowship", <FellowshipPage />)} path="/fellowship" />
   ```
3. **Register page visibility in `frontend/src/data/pageVisibility.js`:**
   Add `{ key: "fellowship", label: "Fellowship Program", path: "/fellowship" }` to `pageVisibilityDefinitions`.
4. **Add to Navigation Menu in `frontend/src/data/navigation.js`:**
   Add `{ label: "Fellowship", to: "/fellowship" }` to the appropriate menu item children array.
5. **Add to Sitemap:** Add `<url><loc>https://rifmjpru.com/fellowship</loc></url>` to `frontend/public/sitemap.xml`.

### 3.3 How to Add a New Editable Section to the Admin Dashboard
1. **Register in backend CMS whitelist (`backend/src/services/cms-service.js`):**
   Add your section name (e.g., `"fellowshipProgram"`) to `editableSections`.
2. **Define default data (`backend/data/cms-data.json`):**
   Add `"fellowshipProgram": { "title": "...", "items": [] }`.
3. **Register permissions (`backend/src/routes/admin-routes.js` & `team-routes.js`):**
   Add `{ id: "fellowship", label: "Fellowship" }` to `teamPermissions`.
4. **Add Editor Tab in `frontend/src/pages/AdminDashboardPage.jsx`:**
   Add `{ id: "fellowship", label: "Fellowship" }` to `adminTabs` and add a corresponding panel case in `renderActivePanel()`.

### 3.4 How to Connect a Live MongoDB Atlas Database
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and copy the connection URI (e.g., `mongodb+srv://user:pass@cluster0.xyz.mongodb.net/?retryWrites=true&w=majority`).
3. Open `backend/.env`.
4. Set:
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster0.xyz.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=rif_website
   ```
5. Restart the backend: `npm run dev:backend`.
6. On initial connection, the backend will automatically seed all collections from `cms-data.json`!

