import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer.jsx";
import { Header } from "./Header.jsx";
import { useSiteData } from "./SiteDataProvider.jsx";
import { resolveMediaUrl } from "../utils/media.js";

const qrConnectUrl = "https://forms.gle/XTdecnwMjBqfrEvHA";

const MaintenanceShell = ({ title, message, contactEmail, contactPhone, homepageCta }) => (
  <main className="maintenance-shell">
    <div className="maintenance-shell-grid">
      <section className="maintenance-shell-card maintenance-shell-card-alert">
        <div className="maintenance-shell-badge">Site Locked</div>
        <div className="maintenance-shell-icon" aria-hidden="true">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 9v4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h17.94a2 2 0 0 0 1.71-3L14.71 3.86a2 2 0 0 0-3.42 0Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <circle cx="12" cy="17" fill="currentColor" r="1.2" />
          </svg>
        </div>
        <p className="section-eyebrow maintenance-shell-eyebrow">Maintenance Mode</p>
        <h1>{title}</h1>
        <p className="maintenance-shell-copy">{message}</p>
        <div className="maintenance-shell-chips">
          {contactEmail ? <span>{contactEmail}</span> : null}
          {contactPhone ? <span>{contactPhone}</span> : null}
        </div>
      </section>
      <aside className="maintenance-shell-card maintenance-shell-card-note">
        <p className="section-eyebrow">Precautionary Notice</p>
        <h2>Please check back soon.</h2>
        <p>
          The public website is temporarily locked while the team applies important updates. Administrative access remains available.
        </p>
        {homepageCta?.qrTitle || homepageCta?.qrImageUrl ? (
          <div className="maintenance-shell-qr-card">
            <div className="maintenance-shell-qr-copy">
              <p className="home-cta-qr-label">For Enquiry</p>
              <h3>{homepageCta.qrTitle || "Scan to Connect"}</h3>
              {homepageCta.qrNote ? <p>{homepageCta.qrNote}</p> : null}
            </div>
            <div className="maintenance-shell-qr-action">
              <div className="home-cta-qr-preview maintenance-shell-qr-preview">
                {homepageCta.qrImageUrl ? (
                  <img
                    alt={homepageCta.qrTitle || "RIF QR code"}
                    className="home-cta-qr-image"
                    src={resolveMediaUrl(homepageCta.qrImageUrl, homepageCta.qrTitle || "RIF QR code")}
                  />
                ) : (
                  <div className="home-cta-qr-placeholder">QR</div>
                )}
              </div>
              <a className="button button-small qr-connect-action maintenance-shell-qr-button" href={qrConnectUrl} rel="noreferrer" target="_blank">
                Click to Connect
              </a>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  </main>
);

export const SiteLayout = () => {
  const { siteData, status, error, contentSource } = useSiteData();
  const location = useLocation();
  const siteSettings = siteData?.siteSettings || {};
  const isMaintenanceMode = siteSettings.maintenanceMode === true;
  const isAdminRoute = location.pathname.startsWith("/admin");
  const fallbackMessage =
    error && contentSource === "cache"
      ? "Live content is unavailable right now. Showing the last saved site content."
      : error && contentSource === "fallback"
        ? "Live content is unavailable right now. Showing bundled fallback content."
        : "";

  useEffect(() => {
    const revealSelector = [
      ".hero-grid",
      ".home-slider-shell",
      ".page-hero",
      ".section",
      ".section-heading",
      ".form-shell",
      ".footer-panel",
      ".content-card",
      ".list-card",
      ".stat-card",
      ".pricing-card",
      ".timeline-card",
      ".gallery-card",
      ".gallery-image-card",
      ".gallery-admin-card",
      ".visual-card",
      ".admin-panel",
      ".admin-card",
      ".submission-row",
      ".admin-login-card"
    ].join(", ");

    const elements = Array.from(document.querySelectorAll(revealSelector));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isElementInView = (element) => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
    };

    if (prefersReducedMotion) {
      elements.forEach((element) => element.classList.add("reveal-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    elements.forEach((element, index) => {
      if (isElementInView(element)) {
        element.classList.add("reveal-visible");
        element.classList.remove("reveal-ready");
        return;
      }

      element.classList.add("reveal-ready");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname, status, contentSource]);

  useEffect(() => {
    const targetId = location.hash.replace("#", "");

    if (!targetId) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const element = document.getElementById(targetId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.hash]);

  return (
    <div className="app-shell">
      {isMaintenanceMode && !isAdminRoute ? (
        <MaintenanceShell
          contactEmail={siteSettings.contactEmail}
          contactPhone={siteSettings.contactPhone}
          homepageCta={siteData?.homepage?.cta || {}}
          message={siteSettings.maintenanceMessage}
          title={siteSettings.maintenanceTitle}
        />
      ) : (
        <>
          <Header />
          {fallbackMessage ? <div className="status-banner">{fallbackMessage}</div> : null}
          <main className="site-main">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};
