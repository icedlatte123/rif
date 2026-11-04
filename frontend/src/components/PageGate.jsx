import { Link } from "react-router-dom";
import { defaultDisabledPageMessage } from "../data/pageVisibility.js";
import { useSiteData } from "./SiteDataProvider.jsx";

export const PageGate = ({ pageKey, children }) => {
  const pageConfig = useSiteData().siteData?.pageVisibility?.[pageKey];
  const isEnabled = pageConfig?.enabled !== false;

  if (isEnabled) {
    return children;
  }

  return (
    <section className="section page-unavailable-section">
      <article className="empty-state page-unavailable-card">
        <p className="section-eyebrow">Page Unavailable</p>
        <h1>{pageConfig?.title || "This page is currently unavailable"}</h1>
        <p>{pageConfig?.message || defaultDisabledPageMessage}</p>
        <Link className="button" to="/contact">
          Contact RIF
        </Link>
      </article>
    </section>
  );
};
