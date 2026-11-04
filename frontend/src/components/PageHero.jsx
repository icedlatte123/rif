import { Link } from "react-router-dom";
import { resolveMediaUrl } from "../utils/media.js";
import { useSiteData } from "./SiteDataProvider.jsx";

const defaultPanel = {
  eyebrow: "",
  title: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  qrLabel: "",
  qrTitle: "",
  qrNote: "",
  qrImageUrl: ""
};

const qrConnectUrl = "https://forms.gle/XTdecnwMjBqfrEvHA";

const panelFallbacks = {
  incubatees: {
    eyebrow: "Founder Momentum",
    title: "Ideas moving from campus to market.",
    description: "Meet the ventures building products, services, and research-led solutions with support from RIF."
  },
  virtualStartups: {
    eyebrow: "Virtual Ventures",
    title: "Startups building with flexibility and reach.",
    description: "Meet the ventures growing through virtual-first programs, mentoring, and support from RIF."
  }
};

const hasAdminPlaceholderCopy = (panel) => {
  const copy = [panel.eyebrow, panel.title, panel.description].join(" ").toLowerCase();
  return copy.includes("editable from admin") || copy.includes("fully editable") || copy.includes("showcase a visual");
};

const getPublicPanel = (panelKey, panel) => {
  const fallback = panelFallbacks[panelKey];
  if (!fallback || !hasAdminPlaceholderCopy(panel)) {
    return panel;
  }

  return {
    ...panel,
    eyebrow: fallback.eyebrow,
    title: fallback.title,
    description: fallback.description
  };
};

const brandHeroPanels = new Set([
  "about",
  "leadership",
  "boardOfDirectors",
  "advisoryBoard",
  "coreTeam",
  "interns",
  "mentors",
  "services",
  "incubatees",
  "virtualStartups",
  "contact"
]);

export const PageHero = ({ eyebrow, title, description, primaryAction, secondaryAction, panelKey = "", children }) => {
  const pageHeroPanels = useSiteData().siteData?.pageHeroPanels || {};
  const panel = getPublicPanel(
    panelKey,
    panelKey && pageHeroPanels?.[panelKey] ? { ...defaultPanel, ...pageHeroPanels[panelKey] } : defaultPanel
  );
  const hasImage = Boolean(panel.imageUrl);
  const hasText = Boolean(panel.eyebrow || panel.title || panel.description);
  const hasPanelContent = hasImage || hasText;
  const cardClassName = hasImage && hasText ? "page-hero-card page-hero-card-both" : hasImage ? "page-hero-card page-hero-card-image-only" : "page-hero-card page-hero-card-text-only";
  const hasQrBlock = Boolean(panel.qrTitle || panel.qrImageUrl || panel.qrNote);
  const qrPreviewClassName =
    panelKey === "contact" ? "page-hero-qr-preview page-hero-qr-preview-large" : "page-hero-qr-preview";

  const isBrandHero = brandHeroPanels.has(panelKey);

  return (
    <section
      className={`${hasPanelContent ? "page-hero" : "page-hero page-hero-single"}${panelKey ? ` page-hero-${panelKey}` : ""}${
        isBrandHero ? " page-hero-brand" : ""
      }`}
    >
      <div>
        <p className="section-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <p className="section-description">{description}</p> : null}
        <div className="hero-actions">
          {primaryAction ? (
            <Link className="button" to={primaryAction.to}>
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link className="button button-ghost" to={secondaryAction.to}>
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
        {children}
        {hasQrBlock ? (
          <div className="page-hero-qr-card">
            <div className="page-hero-qr-copy">
              {panel.qrLabel ? <p className="page-hero-qr-label">{panel.qrLabel}</p> : null}
              {panel.qrTitle ? <h3>{panel.qrTitle}</h3> : null}
              {panel.qrNote ? <p>{panel.qrNote}</p> : null}
            </div>
            <div className="qr-action-stack">
              <div className={qrPreviewClassName}>
                {panel.qrImageUrl ? (
                  <img
                    alt={panel.qrTitle || "QR code"}
                    className="page-hero-qr-image"
                    src={resolveMediaUrl(panel.qrImageUrl, panel.qrTitle || "QR code")}
                  />
                ) : (
                  <div className="page-hero-qr-placeholder">QR</div>
                )}
              </div>
              <a className="button button-small qr-connect-action" href={qrConnectUrl} rel="noreferrer" target="_blank">
                Click to Connect
              </a>
            </div>
          </div>
        ) : null}
      </div>
      {hasPanelContent ? (
        <div className={cardClassName}>
          {hasImage ? (
            <div className="page-hero-card-media">
              <img
                alt={panel.imageAlt || panel.title || "Hero panel image"}
                className="page-hero-card-image"
                src={resolveMediaUrl(panel.imageUrl, panel.imageAlt || panel.title)}
              />
            </div>
          ) : null}
          {hasText ? (
            <div className="page-hero-card-copy">
              {panel.eyebrow ? <span className="eyebrow-chip">{panel.eyebrow}</span> : null}
              {panel.title ? <h3>{panel.title}</h3> : null}
              {panel.description ? <p>{panel.description}</p> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};
