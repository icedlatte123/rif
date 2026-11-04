# RIF Website — Architecture & Flow Diagrams

This document illustrates the structural architecture, page-to-page navigation topology, and major end-to-end user flows of the RIF web platform using Mermaid diagrams.

---

## 1. Overall System Architecture

```mermaid
flowchart TD
    User([Web Visitor / Admin]) -->|HTTPS Requests| Host[Vite / Web Server :5173]
    Host --> SPA[React 19 SPA Client]
    
    subgraph ClientLayer ["Frontend Client Layer (Browser)"]
        SPA --> SiteLayout[SiteLayout & Navigation Shell]
        SiteLayout --> SiteDataProvider[SiteDataProvider Global Context]
        SiteDataProvider -->|Check Local Cache| LocalStorage[(Browser LocalStorage)]
        SiteDataProvider -->|HTTP Fetch /api/...| APIClient[api/client.js]
    end

    APIClient -->|REST API Calls| Backend[Express.js API Server :5001]

    subgraph BackendLayer ["Backend Layer (Node.js ESM)"]
        Backend --> CORS[CORS Verification & Body Parser]
        CORS --> Router{Express Route Dispatcher}
        
        Router -->|/api/site, /api/forms/*| PublicRoutes[public-routes.js]
        Router -->|/api/auth/*| AuthRoutes[auth-routes.js]
        Router -->|/api/admin/*| AdminRoutes[admin-routes.js]
        Router -->|/api/team/*| TeamRoutes[team-routes.js]
        
        AdminRoutes --> AuthMW[auth-middleware.js JWT Check]
        TeamRoutes --> AuthMW
        
        PublicRoutes --> CMSService[cms-service.js]
        AdminRoutes --> CMSService
        TeamRoutes --> CMSService
        
        PublicRoutes --> Mailer[mailer.js Nodemailer]
    end

    subgraph DataStorage ["Data & Media Services"]
        CMSService --> Mongo[(MongoDB - Database 'rif_website')]
        Mongo --> CollContent[site_content collection]
        Mongo --> CollSubmissions[submissions collection]
        Mongo --> CollUsers[admin_users & team_users]
        Mongo --> GridFS[gallery_assets GridFS Bucket]
        
        AdminRoutes --> Cloudinary[(Cloudinary Cloud CDN)]
        PublicRoutes --> Cloudinary
        Mailer --> SMTP[(SMTP Email Server)]
    end

    subgraph OfflineResilience ["Offline Resilience Fallback"]
        SiteDataProvider -.->|If API Fails| FallbackData[siteFallbackData.js]
        FallbackData -.-> BundledJSON[(cms-data.json)]
    end
```

### Explanation of Architecture
1. **Visitor Requests:** The visitor browser loads the React single-page application bundle from the host server.
2. **Context Initialization:** `SiteDataProvider` initializes state from browser local storage, then makes an asynchronous call to `/api/site`. If the backend or database is unreachable, it seamlessly falls back to bundled JSON data (`cms-data.json`).
3. **Backend Middleware Pipeline:** The Express server validates CORS origin rules, parses incoming JSON payloads, and directs requests to appropriate routers.
4. **Administrative Protection:** Admin and team endpoints are protected by `auth-middleware.js`, which verifies stateless HMAC-SHA256 tokens signed with `ADMIN_TOKEN_SECRET`.
5. **Persistence & Media:** Structured CMS content, user profiles, and form submissions are saved in MongoDB. PDF/DOCX documents are stored in MongoDB GridFS, while images are uploaded to Cloudinary.

---

## 2. Page-to-Page Navigation Hierarchy

```mermaid
flowchart TD
    Home["Home Page (/)"]
    
    subgraph AboutGroup ["About Us Dropdown"]
        About["About RIF (/about)"]
        Leadership["Leadership Hub (/leadership)"]
        GovMsg["Governor Message (/leadership/message-from-governor)"]
        CMMsg["Chief Minister Message (/leadership/message-from-chief-minister)"]
        VCMsg["Vice Chancellor Message (/leadership/message-from-vice-chancellor)"]
        Board["Board of Directors (/leadership/board-of-directors)"]
        Advisory["Advisory Board (/leadership/advisory-board)"]
        CoreTeam["Core Team (/team/core-team)"]
        Interns["Interns Directory (/team/interns)"]
        Mentors["Mentors Profiles (/mentors)"]
    end

    subgraph GalleryDocsGroup ["Gallery & Documents Dropdown"]
        Gallery["Photo Gallery (/gallery)"]
        Media["Media Coverage (/media-coverage)"]
        Docs["Documents Repository (/documents)"]
    end

    subgraph ServicesGroup ["Services Dropdown"]
        Services["Services Overview (/services)"]
        Plans["Membership Plans (/membership-plans)"]
        RifServices["RIF Services & Benefits (/rif-services)"]
    end

    subgraph StartupGroup ["Startup Dropdown"]
        Incubatees["Onboard Startups (/incubatees)"]
        IncubateeDetail["Startup Profile (/incubatees/:id)"]
        VirtualStartups["Virtual Startups (/virtual-startups)"]
        VirtualDetail["Virtual Profile (/virtual-startups/:id)"]
        Apply["Apply for Incubation (/apply)"]
    end

    subgraph DirectLinks ["Direct & Action Links"]
        Contact["Contact Us (/contact)"]
        Enquiry["Enquiry Form (/enquiry)"]
        MemberForm["Membership Register (/membership-register)"]
        IncubateeForm["Incubatee Register (/incubatee-register)"]
        InternForm["Intern Registration (/intern-registration)"]
        Testimonials["Testimonials (/testimonials)"]
        Privacy["Privacy Policy (/privacy-policy)"]
        Terms["Terms & Conditions (/terms-and-conditions)"]
        Refund["Refund Policy (/refund-policy)"]
    end

    subgraph AdminPortal ["Admin Portal (Restricted)"]
        AdminLogin["Admin Dashboard (/admin)"]
        TeamLogin["Team Panel (/team-panel)"]
    end

    Home --> AboutGroup
    Home --> GalleryDocsGroup
    Home --> ServicesGroup
    Home --> StartupGroup
    Home --> DirectLinks
    Home -.->|Direct URL / Admin Link| AdminPortal
    
    Leadership --> GovMsg
    Leadership --> CMMsg
    Leadership --> VCMsg
    Leadership --> Board
    Leadership --> Advisory
    
    Incubatees --> IncubateeDetail
    VirtualStartups --> VirtualDetail
```

### Explanation of Navigation Flow
* **Header Dropdowns:** Provide structured access into 4 primary functional directories (About Us, Gallery & Documents, Services, and Startup).
* **Cross-Linking:** Hero action buttons on landing pages guide users directly into registration and inquiry funnels (e.g., from `/incubatees` to `/apply`, or from `/about` to `/leadership`).
* **Protected Pages:** If a page is disabled via the admin toggle, `<PageGate>` intercepts the route and presents a courteous "Page Unavailable" state.

---

## 3. End-to-End User Flow: Startup Incubation Application (`/apply`)

```mermaid
sequenceDiagram
    actor Applicant as Founder / Applicant
    participant Browser as Web Browser (ApplyPage.jsx)
    participant Form as SubmissionForm.jsx
    participant API as Express API Server (/api/forms/apply)
    participant DB as MongoDB ('submissions' collection)
    participant Mailer as Nodemailer Service
    participant Admin as Foundation Admin

    Applicant->>Browser: Navigates to /apply
    Browser->>Form: Mounts multi-field incubation application form
    Applicant->>Form: Fills Startup Name, Stage, Problem Statement, Contact Info
    Applicant->>Form: Clicks "Submit Application"
    
    Form->>Form: Validates required fields locally
    Form->>API: POST /api/forms/apply (JSON payload)
    
    API->>API: sanitizePayload() & requireFields() validation
    API->>DB: createSubmission("apply", payload) -> insertOne()
    DB-->>API: Returns inserted document with generated UUID
    
    par Async Email Notification
        API->>Mailer: sendSubmissionEmails("apply", submission)
        Mailer->>Admin: Sends new application summary email
        Mailer->>Applicant: Sends receipt confirmation email
    end
    
    API-->>Form: 201 Created { message: "Application submitted successfully.", entry }
    Form-->>Browser: Clears inputs and displays success confirmation alert
    Browser-->>Applicant: Shows green confirmation banner
```

### Explanation of Incubation Application Flow
1. The applicant enters their startup venture details into the responsive form.
2. The form validates the required fields on the client before issuing a `POST` request.
3. The backend sanitizes the payload, assigns a unique UUID, and inserts the submission into the `submissions` MongoDB collection.
4. An automated confirmation email is queued for the applicant, while an alert containing the application summary is delivered to the administrator.
5. The applicant sees an immediate success confirmation on screen.

---

## 4. End-to-End User Flow: Admin Login & Content Update

```mermaid
sequenceDiagram
    actor AdminUser as Administrator
    participant Browser as Web Browser (/admin)
    participant API as Express API (/api/auth/login)
    participant DB as MongoDB ('admin_users' & 'site_content')
    participant Audit as Audit Logger ('audit_logs')

    AdminUser->>Browser: Visits /admin
    Browser->>Browser: Checks localStorage for 'rif-admin-token'
    alt Token Missing or Expired
        Browser-->>AdminUser: Displays Admin Login Card
        AdminUser->>Browser: Enters username & password
        Browser->>API: POST /api/auth/login { username, password }
        API->>DB: findOne({ username }) in admin_users
        DB-->>API: Returns stored user & scrypt password hash
        API->>API: verifyPassword(password, storedHash)
        alt Password Valid
            API->>API: signToken(payload, ADMIN_TOKEN_SECRET, 12h)
            API-->>Browser: Returns 200 OK { token, user }
            Browser->>Browser: Saves token in localStorage & SiteDataProvider
        else Password Invalid
            API-->>Browser: Returns 401 Unauthorized
        end
    end

    Browser-->>AdminUser: Unlocks 20-Tab CMS Dashboard
    AdminUser->>Browser: Modifies section (e.g., Homepage Hero Title)
    AdminUser->>Browser: Clicks "Save Changes"
    Browser->>API: PUT /api/admin/content/homepage (Bearer Token + JSON)
    API->>API: requireAdmin middleware validates JWT
    API->>DB: getAdminData() [fetches 'before' snapshot]
    API->>DB: updateSection("homepage", value) -> updateOne()
    API->>Audit: collectChanges(before, after) -> insertOne() into audit_logs
    API-->>Browser: Returns 200 OK { message: "homepage updated successfully.", value }
    Browser->>Browser: Updates SiteDataProvider global state
    Browser-->>AdminUser: Displays "Saved successfully" toast notification
```

### Explanation of Admin Flow
1. The administrator signs in using credentials that are securely verified using Node's native `scrypt` hashing algorithm.
2. A 12-hour HMAC-SHA256 stateless token is issued and stored in the browser's local storage.
3. When saving CMS edits, `auth-middleware.js` verifies the administrator's token.
4. The system calculates a deep diff between the previous and updated state using `audit.js`, storing an immutable record in `audit_logs` before updating `site_content`.
5. The frontend immediately updates its in-memory context, reflecting the changes in real time.

---

## 5. End-to-End User Flow: Incubatee Self-Onboarding with Image Crop

```mermaid
sequenceDiagram
    actor Founder as Startup Founder
    participant Browser as Web Browser (/incubatee-register)
    participant Cropper as ImageCropDialog.jsx (Canvas)
    participant API as Express API (/api/forms/incubatee-profile)
    participant Cloudinary as Cloudinary Cloud Storage
    participant DB as MongoDB ('site_content')

    Founder->>Browser: Navigates to /incubatee-register
    Founder->>Browser: Selects profile logo image from disk
    Browser->>Cropper: Opens ImageCropDialog modal with canvas preview
    Founder->>Cropper: Adjusts zoom and pan offsets
    Founder->>Cropper: Clicks "Confirm Crop"
    Cropper-->>Browser: Converts cropped canvas to image Blob/File
    
    Founder->>Browser: Fills Venture Name, Sector, Stage, Bio, Social Links
    Founder->>Browser: Clicks "Submit Profile"
    Browser->>API: POST /api/forms/incubatee-profile (FormData multipart)
    
    API->>Cloudinary: uploadImageBuffer(image.buffer)
    Cloudinary-->>API: Returns { secure_url, public_id }
    
    API->>DB: createIncubateeProfile(payload)
    Note over API,DB: Inserts new profile into site_content.incubatees
    
    API-->>Browser: 201 Created { message: "Incubatee profile submitted successfully.", entry }
    Browser-->>Founder: Redirects to /incubatees showing the newly added profile
```

### Explanation of Incubatee Self-Onboarding Flow
1. Founders uploading profile graphics are presented with an interactive canvas crop dialog to ensure consistent aspect ratios.
2. The form sends a multipart `FormData` payload to the backend.
3. Multer buffers the image in memory and streams it directly to Cloudinary CDN.
4. The profile metadata and secure Cloudinary image URL are appended to `site_content.incubatees`.
5. The new venture profile immediately becomes publicly discoverable in the directory.

