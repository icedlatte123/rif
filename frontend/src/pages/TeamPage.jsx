import { PageHero } from "../components/PageHero.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
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

const stripWrappingQuotes = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  let nextValue = value.trim();

  while (
    nextValue.length >= 2 &&
    ((nextValue.startsWith('"') && nextValue.endsWith('"')) ||
      (nextValue.startsWith("'") && nextValue.endsWith("'")) ||
      (nextValue.startsWith("“") && nextValue.endsWith("”")) ||
      (nextValue.startsWith("‘") && nextValue.endsWith("’")))
  ) {
    nextValue = nextValue.slice(1, -1).trim();
  }

  return nextValue;
};

const resolveExternalUrl = (value = "") => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
};

const LinkedinIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path
      d="M6.94 8.98H3.75v10.24h3.19V8.98ZM5.35 4.78a1.84 1.84 0 1 0 0 3.68 1.84 1.84 0 0 0 0-3.68Zm13.86 8.57c0-3.08-1.64-4.51-3.83-4.51a3.31 3.31 0 0 0-2.99 1.65h-.04V8.98H9.29v10.24h3.19v-5.07c0-1.34.25-2.63 1.91-2.63 1.63 0 1.65 1.53 1.65 2.72v4.98h3.18v-5.87Z"
      fill="currentColor"
    />
  </svg>
);

const GithubIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path
      d="M12 3.5a8.5 8.5 0 0 0-2.69 16.57c.43.08.59-.18.59-.41v-1.45c-2.4.52-2.91-1.03-2.91-1.03-.39-1-.96-1.27-.96-1.27-.79-.54.06-.53.06-.53.87.06 1.33.9 1.33.9.78 1.32 2.04.94 2.53.72.08-.56.3-.94.55-1.16-1.91-.22-3.93-.96-3.93-4.25 0-.94.34-1.71.89-2.31-.09-.22-.39-1.1.09-2.28 0 0 .73-.23 2.34.88A8.06 8.06 0 0 1 12 6.1c.72 0 1.44.1 2.11.29 1.61-1.11 2.34-.88 2.34-.88.48 1.18.18 2.06.09 2.28.55.6.89 1.37.89 2.31 0 3.31-2.02 4.03-3.95 4.25.31.27.59.8.59 1.62v2.39c0 .23.16.5.6.41A8.5 8.5 0 0 0 12 3.5Z"
      fill="currentColor"
    />
  </svg>
);

const sectionConfig = {
  boardOfDirectors: {
    id: "board-of-directors",
    panelKey: "boardOfDirectors",
    title: "Board of Directors",
    eyebrow: "Leadership",
    description: "Leadership pages now sit under About Us so governance and advisory information stay grouped together.",
    primaryAction: { label: "Advisory Board", to: "/leadership/advisory-board" },
    secondaryAction: { label: "Send Enquiry", to: "/enquiry" },
    style: "profile"
  },
  advisoryBoard: {
    id: "advisory-board",
    panelKey: "advisoryBoard",
    title: "Advisory Board Members",
    eyebrow: "Leadership",
    description: "Leadership pages now sit under About Us so governance and advisory information stay grouped together.",
    primaryAction: { label: "Board of Directors", to: "/leadership/board-of-directors" },
    secondaryAction: { label: "Send Enquiry", to: "/enquiry" },
    style: "advisory"
  },
  coreTeam: {
    id: "core-team",
    panelKey: "coreTeam",
    title: "Core Team",
    eyebrow: "Team",
    description: "Use the RIF Team menu to switch between the core team, interns, and mentor profiles.",
    primaryAction: { label: "Browse Mentors", to: "/mentors" },
    secondaryAction: { label: "Send Enquiry", to: "/enquiry" },
    style: "advisory"
  },
  interns: {
    id: "interns",
    panelKey: "interns",
    title: "Interns",
    eyebrow: "RIF Team",
    description: "Meet the emerging talent supporting founder operations, program delivery, documentation, and outreach across RIF.",
    primaryAction: { label: "Core Team", to: "/team/core-team" },
    secondaryAction: { label: "Send Enquiry", to: "/enquiry" },
    style: "advisory",
    showSocials: true
  }
};

const TeamSection = ({ id, title, items, style, showSocials = false }) => (
  <section className="section" id={id}>
    <SectionHeading eyebrow="People" title={title} compact />
    <div className={style === "advisory" ? "advisory-board-grid" : "card-grid profile-card-grid"}>
      {items?.map((member) => (
        <article
          className={style === "advisory" ? "advisory-member-card" : "content-card profile-content-card"}
          key={member.id}
        >
          <div className={style === "advisory" ? "advisory-member-avatar" : "profile-image-shell"}>
            {member.imageUrl ? (
              <img
                alt={member.name}
                className={style === "advisory" ? undefined : "profile-image"}
                src={resolveMediaUrl(member.imageUrl, member.name)}
              />
            ) : (
              <span className={style === "advisory" ? undefined : "profile-image-fallback"}>{getInitials(member.name)}</span>
            )}
          </div>
          {style === "advisory" ? (
            <>
              <h3>{member.name}</h3>
              <p className="advisory-member-role">{member.role}</p>
              {member.bio ? <p className="profile-bio">{stripWrappingQuotes(member.bio)}</p> : null}
              {showSocials && (member.linkedinUrl || member.githubUrl) ? (
                <div className="profile-social-links">
                  {member.linkedinUrl ? (
                    <a
                      aria-label={`${member.name} LinkedIn profile`}
                      className="profile-social-linkedin"
                      href={resolveExternalUrl(member.linkedinUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkedinIcon />
                      <span>LinkedIn</span>
                    </a>
                  ) : null}
                  {member.githubUrl ? (
                    <a
                      aria-label={`${member.name} GitHub profile`}
                      className="profile-social-github"
                      href={resolveExternalUrl(member.githubUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <GithubIcon />
                      <span>GitHub</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <p className="meta-line team-role-line">
                <span>{member.role}</span>
              </p>
              <h3>{member.name}</h3>
              <p className="profile-bio">{stripWrappingQuotes(member.bio)}</p>
            </>
          )}
        </article>
      ))}
    </div>
  </section>
);

export default function TeamPage({ sectionKey = "coreTeam" }) {
  const team = useSiteData().siteData?.team;
  const activeSection = sectionConfig[sectionKey] || sectionConfig.coreTeam;
  const sectionItems = team?.[sectionKey] || team?.coreTeam || [];
  const additionalDirectors = team?.additionalDirectors || [];
  const internItems = team?.interns || [];

  return (
    <>
      <PageHero
        eyebrow={activeSection.eyebrow}
        panelKey={activeSection.panelKey}
        title={activeSection.title}
        description={activeSection.description}
        primaryAction={activeSection.primaryAction}
        secondaryAction={activeSection.secondaryAction}
      />
      <TeamSection
        id={activeSection.id}
        items={sectionItems}
        showSocials={activeSection.showSocials}
        style={activeSection.style}
        title={activeSection.title}
      />
      {sectionKey === "boardOfDirectors" && additionalDirectors.length ? (
        <TeamSection id="additional-directors" items={additionalDirectors} style={activeSection.style} title="Additional Directors" />
      ) : null}
      {sectionKey === "coreTeam" && internItems.length ? (
        <TeamSection
          id={sectionConfig.interns.id}
          items={internItems}
          showSocials={sectionConfig.interns.showSocials}
          style={sectionConfig.interns.style}
          title={sectionConfig.interns.title}
        />
      ) : null}
    </>
  );
}
