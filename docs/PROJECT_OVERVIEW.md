# RIF Website — Project Overview & Architecture Guide

## 1. Executive Summary & Purpose

The **Rohilkhand Incubation Foundation (RIF)** web platform is an institutional incubation and innovation portal inspired by premier institutional incubator platforms (such as IIM Bangalore's NSRCEL). Established under the aegis of Mahatma Jyotiba Phule Rohilkhand University (MJPRU), Bareilly, Uttar Pradesh, RIF supports grassroots student innovations, early-stage entrepreneurs, researchers, and regional startups across North India.

### Key Objectives
* **Institutional Credibility & Showcase:** Present the university-backed foundation's governance, advisory leadership (including state patron messages from the Governor and Chief Minister of Uttar Pradesh), and partner compliance accreditations (G20, NGO Darpan, Startup India, ISO, 12A/80G, Udyam).
* **Founder Directory & Discovery:** Maintain searchable directories for physical campus incubatees, virtual startups, and industry mentors with dedicated public venture profile pages.
* **Streamlined Incubation Intake:** Provide interactive multi-step application forms for Incubation Admissions (`/apply`), Membership Registrations (`/membership-register`), Onboarding Profiles (`/incubatee-register`), General Inquiries (`/enquiry`), and Internships (`/intern-registration`).
* **Full-Stack Content Management (CMS):** Empower foundation administrators and staff with a no-code Admin & Team Control Dashboard (`/admin` and `/team-panel`) to edit every title, banner, policy, mentor, team member, testimonial, news/event post, and download submission records without redeploying code.
* **Offline & Resilience Guarantee:** Support dual-layer data caching with automated fallback to bundled JSON data if the MongoDB database or backend API server is unreachable.

---

## 2. Technology Stack & Versions

| Layer | Technology | Version | Purpose / Role |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.1.1` | Component-based interactive UI with React 19 Concurrent features |
| **DOM Renderer** | React DOM | `^19.1.1` | Web browser mounting and DOM lifecycle management |
| **Client Router** | React Router DOM | `^7.8.2` | Single-Page Application (SPA) declarative client-side routing |
| **Build Tool & Dev Server**| Vite | `^7.1.4` | Ultra-fast ES Module bundler, hot module replacement (HMR), asset processing |
| **Vite React Plugin** | `@vitejs/plugin-react` | `^5.1.2` | Fast Refresh and JSX transformation |
| **Backend Runtime** | Node.js | `>=20.19.0` (ESM) | Native ECMAScript Modules (`"type": "module"`) asynchronous runtime |
| **Web API Framework** | Express.js | `^5.1.0` | HTTP routing, JSON payload parsing, and middleware pipeline |
| **Database Engine** | MongoDB | `^7.1.0` | Document database for CMS content, submissions, users, and audit logs |
| **GridFS File Storage** | MongoDB GridFSBucket | `^7.1.0` | Native binary chunked file storage (`gallery_assets`) for PDF/DOCX documents |
| **Cloud Media Storage** | Cloudinary SDK | `^2.9.0` | Cloud-hosted CDN storage for public images and venture galleries |
| **Multipart Parser** | Multer | `^2.1.1` | In-memory stream buffer management for image and document uploads |
| **Email Transporter** | Nodemailer | `^8.0.4` | SMTP transactional email notification dispatcher |
| **Cryptography** | Node.js `crypto` | Built-in | `scryptSync` password hashing and `HMAC-SHA256` stateless JWT generation |
| **Process Management** | Node.js `child_process`| Built-in | Custom concurrent runner script (`scripts/dev.mjs`) |

---

## 3. System Architecture & Topology

```
                  +-------------------------------------------------------------+
                  |                      Client Web Browser                     |
                  +-------------------------------------------------------------+
                           |                                        |
           (Static Assets, HTML, CSS, Bundles)             (REST API Calls /api/...)
                           v                                        v
                  +-----------------------+              +----------------------+
                  |   Vite / Apache Host  |              | Express.js API Server|
                  |   (Port 5173 / Web)   |              |   (Default Port 5001)|
                  +-----------------------+              +----------------------+
                           |                                        |
                 [ Bundled Fallback ]               +---------------+---------------+
                 (backend/data/cms-data.json)       |               |               |
                                                    v               v               v
                                            +---------------+ +------------+ +-------------+
                                            |  MongoDB Atlas| | Cloudinary | | SMTP Server |
                                            | / Local Mongo | | CDN Bucket | | (Email Alerts)
                                            +---------------+ +------------+ +-------------+
```

### Architectural Key Concepts
1. **Stateless JWT Security:** Authentication utilizes HMAC-SHA256 tokens generated natively with Node's crypto library (`backend/src/utils/token.js`) without external third-party JWT dependencies.
2. **Dual-Role Administration:**
   * **Super Admin:** Master administrative role configured via environment variables with complete system access, user creation, role assignment, and system audit history.
   * **Staff Team Users:** Granular permission-based access (19 individual permission keys) allowing team members to edit designated sections (e.g., News only, Mentors only, or Form Submissions only).
3. **Resilient Data Fallback Flow:** The React application initializes from local storage cache, queries `/api/site`, and if the network or backend is offline, automatically switches to a deep-cloned bundled copy of `backend/data/cms-data.json`.
4. **Maintenance Shield:** Instant kill-switch toggle (`siteSettings.maintenanceMode`) that safely displays an institutional maintenance page to regular visitors while allowing administrative routes (`/admin`) to remain functional.

---

## 4. Step-by-Step Installation, Running, & Deployment

### 4.1 Prerequisites
* **Node.js:** Version `20.19.0` or higher installed (`node -v`).
* **NPM:** Installed with Node (`npm -v`).
* **MongoDB:** A running MongoDB instance locally (`mongodb://127.0.0.1:27017`) or a free MongoDB Atlas connection URI.

### 4.2 Local Setup
Clone or unpack the workspace, then open your terminal in the project root:

```bash
# 1. Install backend dependencies
npm --prefix backend install

# 2. Install frontend dependencies
npm --prefix frontend install
```

### 4.3 Configure Environment Variables
Create the environment file for the backend (`backend/.env`):

```bash
# backend/.env
PORT=5001
FRONTEND_ORIGINS=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=rif_website
ADMIN_USERNAME=admin@rif.local
ADMIN_PASSWORD=change-me-to-a-secure-password
ADMIN_TOKEN_SECRET=generate-a-minimum-64-character-random-hex-string

# Optional Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=rif-site

# Optional SMTP Settings (for applicant & admin email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Rohilkhand Incubation Foundation <noreply@rifmjpru.com>
NOTIFY_ADMIN_EMAIL=admin@rifmjpru.com
```

Create frontend environment configuration (`frontend/.env`):

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_PORT=5173
```

### 4.4 Running in Development Mode
To start both the Express backend and Vite frontend concurrently:

```bash
npm run dev
```

* **Frontend App:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:5001/api](http://localhost:5001/api)
* **Admin Login:** [http://localhost:5173/admin](http://localhost:5173/admin)
* **Team Staff Login:** [http://localhost:5173/team-panel](http://localhost:5173/team-panel)

To run backend or frontend independently:
```bash
npm run dev:backend   # Starts backend on port 5001 with --watch
npm run dev:frontend  # Starts Vite frontend on port 5173
```

### 4.5 Production Build & Deployment

#### Frontend Build
```bash
npm run build
```
This produces an optimized production bundle inside `frontend/dist/`. 
* **Apache / cPanel Hosting:** The repository contains `frontend/public/.htaccess` configured with standard URL rewrite rules to point all requests to `index.html`.
* **Netlify / Cloudflare Pages:** The repository contains `frontend/public/_redirects` with `/* /index.html 200` for client-side routing.

#### Backend Production Service
Run the backend with Node directly or using PM2:
```bash
cd backend
npm start
# OR using PM2:
pm2 start src/server.js --name "rif-backend"
```

---

## 5. Required Environment Variables Reference

| Variable Name | Required | Default If Omitted | Purpose / Impact |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `5001` | TCP port where Express backend listens |
| `FRONTEND_ORIGINS` | No | `http://localhost:5173` | Comma-separated list of allowed CORS browser origins |
| `MONGODB_URI` | **Yes (Prod)** | `mongodb://127.0.0.1:27017` | MongoDB connection connection string |
| `MONGODB_DB_NAME` | No | `rif_website` | MongoDB database name |
| `ADMIN_USERNAME` | **Yes (Prod)** | `admin@rif.local` | Primary administrator username for initial seeding |
| `ADMIN_PASSWORD` | **Yes (Prod)** | `change-me` | Primary administrator password for initial seeding |
| `ADMIN_TOKEN_SECRET` | **Yes (Prod)** | `replace-with-a-long-random-string` | Cryptographic secret for signing auth tokens |
| `CLOUDINARY_CLOUD_NAME` | For Images | `""` (Empty string) | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | For Images | `""` (Empty string) | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | For Images | `""` (Empty string) | Cloudinary API Secret |
| `CLOUDINARY_UPLOAD_FOLDER` | No | `rif-site` | Cloudinary asset folder destination |
| `SMTP_HOST` | For Emails | `""` | SMTP hostname (e.g. `smtp.gmail.com` or `smtp.sendgrid.net`) |
| `SMTP_PORT` | No | `587` | SMTP port (465 for SSL, 587 for TLS) |
| `SMTP_USER` | For Emails | `""` | SMTP authentication user |
| `SMTP_PASS` | For Emails | `""` | SMTP authentication password/token |
| `SMTP_FROM` | For Emails | `SMTP_USER` value | Sender address displayed in outgoing emails |
| `NOTIFY_ADMIN_EMAIL` | For Emails | `ADMIN_USERNAME` value | Recipient address receiving form alerts |
| `VITE_API_BASE_URL` | Frontend | `http://localhost:5001/api` | API route base URL for client HTTP requests |
| `VITE_PORT` | Frontend | `5173` | Port for Vite development server |

