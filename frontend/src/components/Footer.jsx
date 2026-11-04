import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useSiteData } from "./SiteDataProvider.jsx";

let visitRequestStarted = false;

export const Footer = () => {
  const { siteData, setSiteData } = useSiteData();
  const siteSettings = siteData?.siteSettings;
  const mapAddress =
    siteSettings?.location || "MJP Rohilkhand University, Pilibhit Bypass Road, Bareilly, Uttar Pradesh 243006";
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`;
  const baseCount = siteSettings?.visitCount ?? 50000;
  const [visitCount, setVisitCount] = useState(baseCount);

  useEffect(() => {
    setVisitCount((current) => Math.max(current, baseCount));
  }, [baseCount]);

  useEffect(() => {
    const sessionKey = "rif_visit_counted";

    try {
      if (window.sessionStorage.getItem(sessionKey)) {
        return;
      }

      window.sessionStorage.setItem(sessionKey, "true");
    } catch (error) {
      if (visitRequestStarted) {
        return;
      }
    }

    visitRequestStarted = true;
    let isMounted = true;

    api
      .recordVisit()
      .then(({ visitCount: nextVisitCount }) => {
        if (!isMounted || !Number.isFinite(nextVisitCount)) {
          return;
        }

        setVisitCount(nextVisitCount);
        setSiteData((currentSiteData) => ({
          ...currentSiteData,
          siteSettings: {
            ...(currentSiteData?.siteSettings || {}),
            visitCount: nextVisitCount
          }
        }));
      })
      .catch(() => {
        setVisitCount((current) => Math.max(current, baseCount));
      });

    return () => {
      isMounted = false;
    };
  }, [baseCount, setSiteData]);

  const visitDigits = visitCount.toString().padStart(6, "0").split("");

  return (
    <footer className="site-footer">
      <div className="footer-panel">
        <div className="footer-top-grid">
          <div>
            <p className="section-eyebrow">RIF</p>
            <h3>{siteSettings?.fullName || "Rohilkhand Incubation Foundation"}</h3>
            <p>{siteSettings?.tagline}</p>
          </div>
          <div>
            <p className="footer-label">Contact</p>
            <a href={`mailto:${siteSettings?.contactEmail}`}>{siteSettings?.contactEmail}</a>
            <a href={`tel:${siteSettings?.contactPhone}`}>{siteSettings?.contactPhone}</a>
            <a className="footer-map-link" href={mapLink} rel="noreferrer" target="_blank">
              <span aria-hidden="true" className="footer-map-icon">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"
                    fill="currentColor"
                  />
                  <circle cx="12" cy="10" fill="#ffffff" r="2.2" />
                </svg>
              </span>
              <span className="footer-map-text">{siteSettings?.location}</span>
            </a>
          </div>
          <div>
            <p className="footer-label">Quick Links</p>
            <Link to="/apply">Apply Now</Link>
            <Link to="/membership-register">Membership Form</Link>
            <Link to="/enquiry">Enquiry Form</Link>
            <Link to="/testimonials">Testimonials</Link>
          </div>
          <div>
            <p className="footer-label">Legal</p>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
            <Link to="/refund-policy">Refund Policy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-counter-shell" title="Website visits">
            <div className="footer-counter-copy">
              <span className="footer-counter-label">Visitor Counter</span>
              <p className="footer-counter-note">Tracking the growing RIF community</p>
            </div>
            <div className="footer-visit-mini" aria-label={`Website visits ${visitCount.toLocaleString()}`}>
              {visitDigits.map((digit, idx) => (
                <span key={`visit-digit-${idx}`}>{digit}</span>
              ))}
            </div>
          </div>
          <div className="footer-meta-row">
            <p className="footer-note">{siteSettings?.footerNote || "RIF © | All Rights Reserved."}</p>
            <p className="footer-credit-label">Developed by</p>
            <p className="footer-credit">
              <a href="https://vuntech.online" target="_blank" rel="noreferrer">
                VUN Tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
