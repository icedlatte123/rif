import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { useSiteData } from "../components/SiteDataProvider.jsx";
import { resolveMediaUrl } from "../utils/media.js";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .trim();

export default function VirtualStartupsPage() {
  const { siteData, status } = useSiteData();
  const virtualStartups = siteData?.virtualStartups || [];

  return (
    <>
      <PageHero
        eyebrow="Virtual Startups"
        panelKey="virtualStartups"
        title="Virtual startups growing with RIF support."
        description="Explore ventures that are building remotely, collaborating digitally, and developing through RIF's innovation ecosystem."
        primaryAction={{ label: "Send Enquiry", to: "/enquiry" }}
      />
      <section className="section">
        {status === "loading" && !virtualStartups.length ? (
          <div className="content-card">
            <p className="muted-copy">Loading virtual startup profiles...</p>
          </div>
        ) : null}
        <div className="card-grid card-grid-3 incubatees-grid">
          {virtualStartups?.map((startup) => (
            <article className="content-card profile-content-card incubatee-card" key={startup.id}>
              <div className="incubatee-card-row">
                <div className="profile-image-shell incubatee-avatar">
                  {startup.imageUrl ? (
                    <img alt={startup.name} className="profile-image" src={resolveMediaUrl(startup.imageUrl, startup.name)} />
                  ) : (
                    <span className="profile-image-fallback">{getInitials(startup.name)}</span>
                  )}
                </div>
                <div className="incubatee-card-body">
                  <p className="meta-line incubatee-card-stage">
                    <span>{startup.stage}</span>
                  </p>
                  <div className="incubatee-card-copy">
                    <h3>{startup.name}</h3>
                    <p className="detail-line incubatee-card-tagline" aria-hidden={!startup.tagline}>
                      {startup.tagline || ""}
                    </p>
                    <p className="incubatee-card-summary">{startup.summary}</p>
                  </div>
                  <p className="incubatee-sector-line">
                    <span>Sector</span>
                    <strong>{startup.sector}</strong>
                  </p>
                  <div className="incubatee-card-facts">
                    <p className="detail-line">Founder: {startup.founder}</p>
                    <p className="detail-line">Location: {startup.location}</p>
                  </div>
                  <div className="incubatee-actions">
                    <Link className="button button-gradient" to={`/virtual-startups/${startup.id || slugify(startup.name)}`}>
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
