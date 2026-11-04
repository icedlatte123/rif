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

export default function IncubateesPage() {
  const { siteData, status } = useSiteData();
  const incubatees = siteData?.incubatees || [];

  return (
    <>
      <PageHero
        eyebrow="Onboard Startups"
        panelKey="incubatees"
        title="Onboard startups growing with RIF support."
        description="Explore ventures shaped through incubation, mentoring, infrastructure support, and university-linked innovation programs."
        primaryAction={{ label: "Send Enquiry", to: "/enquiry" }}
      />
      <section className="section">
        {status === "loading" && !incubatees.length ? (
          <div className="content-card">
            <p className="muted-copy">Loading onboard startup profiles...</p>
          </div>
        ) : null}
        <div className="card-grid card-grid-3 incubatees-grid">
          {incubatees?.map((company) => (
            <article className="content-card profile-content-card incubatee-card" key={company.id}>
              <div className="incubatee-card-row">
                <div className="profile-image-shell incubatee-avatar">
                  {company.imageUrl ? (
                    <img alt={company.name} className="profile-image" src={resolveMediaUrl(company.imageUrl, company.name)} />
                  ) : (
                    <span className="profile-image-fallback">{getInitials(company.name)}</span>
                  )}
                </div>
                <div className="incubatee-card-body">
                  <p className="meta-line incubatee-card-stage">
                    <span>{company.stage}</span>
                  </p>
                  <div className="incubatee-card-copy">
                    <h3>{company.name}</h3>
                    <p className="detail-line incubatee-card-tagline" aria-hidden={!company.tagline}>
                      {company.tagline || ""}
                    </p>
                    <p className="incubatee-card-summary">{company.summary}</p>
                  </div>
                  <p className="incubatee-sector-line">
                    <span>Sector</span>
                    <strong>{company.sector}</strong>
                  </p>
                  <div className="incubatee-card-facts">
                    <p className="detail-line">Founder: {company.founder}</p>
                    <p className="detail-line">Location: {company.location}</p>
                  </div>
                  <div className="incubatee-actions">
                    <Link className="button button-gradient" to={`/incubatees/${company.id || slugify(company.name)}`}>
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
