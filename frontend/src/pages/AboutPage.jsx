import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { useSiteData } from "../components/SiteDataProvider.jsx";

export default function AboutPage() {
  const about = useSiteData().siteData?.about;

  return (
    <>
      <PageHero
        eyebrow="About RIF"
        panelKey="about"
        title={about?.overview?.title || "About RIF"}
        description={about?.overview?.body || ""}
        primaryAction={{ label: "Explore Leadership", to: "/leadership" }}
        secondaryAction={{ label: "View Documents", to: "/documents" }}
      />

      <section className="section">
        <div className="split-grid">
          <article className="content-card">
            <p className="section-eyebrow about-highlight-eyebrow">Mission</p>
            <h3>{about?.overview?.mission}</h3>
          </article>
          <article className="content-card">
            <p className="section-eyebrow about-highlight-eyebrow">Vision</p>
            <h3>{about?.overview?.vision}</h3>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="split-grid">
          <article className="cta-panel">
            <p className="section-eyebrow">Leadership</p>
            <h3>Meet the board and advisory leaders shaping RIF.</h3>
            <p>The leadership section now brings strategic pillars, board oversight, and advisory guidance together in one place.</p>
            <div className="hero-actions">
              <Link className="button" to="/leadership">
                View Leadership
              </Link>
              <Link className="button button-ghost" to="/leadership/board-of-directors">
                Board of Directors
              </Link>
            </div>
          </article>
          <article className="cta-panel">
            <p className="section-eyebrow">RIF Team</p>
            <h3>Meet the people and interns powering RIF programs.</h3>
            <p>Explore the core team, interns, and mentors supporting the foundation.</p>
            <div className="hero-actions">
              <Link className="button" to="/team/core-team">
                View RIF Team
              </Link>
              <Link className="button button-ghost" to="/team/interns">
                Meet Interns
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <article className="cta-panel onboard-startups-panel">
          <div>
            <p className="section-eyebrow">Onboard Startups</p>
            <h3>Meet the startups currently growing with RIF support.</h3>
            <p>Explore founder profiles, sectors, venture stages, and the ideas being developed through the RIF incubation ecosystem.</p>
          </div>
          <div className="hero-actions">
            <Link className="button" to="/incubatees">
              View Onboard Startups
            </Link>
            <Link className="button button-ghost" to="/apply">
              Apply for Incubation
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
