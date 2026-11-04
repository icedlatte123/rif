import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { useSiteData } from "../components/SiteDataProvider.jsx";
import { resolveMediaUrl } from "../utils/media.js";

const spotlightPartners = [
  { label: "G20 India", src: "/images/partners/g20-logo.webp" },
  { label: "NGO Darpan", src: "/images/partners/ngo-darpan.webp" },
  { label: "ISO", src: "/images/partners/startup.webp" },
  { label: "Startup India", src: "/images/partners/startinup.webp" },
  { label: "Udyam", src: "/images/partners/PngItem_2411963.webp" },
  { label: "12A / 80G", src: "/images/partners/12a-80G-1.webp" },
  { label: "Partner Mark", src: "/images/partners/Captur11e.webp" }
];

const qrConnectUrl = "https://forms.gle/XTdecnwMjBqfrEvHA";
const heroVideoSrc = "/videos/rif-hero-logo.mp4";
const miniVideoSrc = "/videos/Video_Generation_With_Logo.mp4";
const focusAreasTitle = "Built for founders solving hard, relevant problems.";
const focusAreasDescription =
  "The visual language takes cues from leading incubator platforms while keeping the content tailored to RIF's regional and institutional mission.";
const affiliationsTitle = "Recognized across institutional, startup, and compliance networks.";
const affiliationsDescription =
  "A moving view of the ecosystem logos, registrations, and standards connected to RIF.";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "RF";

const renderRifHeroTitle = (title = "") => {
  if (title.trim().toLowerCase() !== "rohilkhand incubation foundation") {
    return title;
  }

  return (
    <span className="rif-hero-title-mark" aria-label={title}>
      {[
        ["R", "ohilkhand"],
        ["I", "ncubation"],
        ["F", "oundation"]
      ].map(([initial, rest]) => (
        <span className="rif-hero-title-word" key={initial}>
          <span className="rif-hero-title-initial">{initial}</span>
          <span className="rif-hero-title-rest">{rest}</span>
        </span>
      ))}
    </span>
  );
};

const getFeaturedUpdates = (news = [], events = []) => [
  ...news
    .filter((item) => item?.featuredOnHome)
    .map((item) => ({
      ...item,
      itemType: "news",
      href: `/news-events/news/${item.id}`
    })),
  ...events
    .filter((item) => item?.featuredOnHome)
    .map((item) => ({
      ...item,
      itemType: "events",
      href: `/news-events/events/${item.id}`
    }))
];

export default function HomePage() {
  const { siteData } = useSiteData();
  const homepage = siteData?.homepage;
  const testimonials =
    homepage?.testimonials?.length
      ? homepage.testimonials
      : (homepage?.startupStories || []).map((story) => ({
          id: story.id,
          name: story.name,
          role: story.sector,
          quote: story.highlight
        }));
  const testimonialsSection = homepage?.testimonialsSection || {};
  const featuredTestimonials = testimonials.filter((testimonial) => testimonial.featuredOnHome);
  const previewCount = Number(testimonialsSection.previewCount) > 0 ? Number(testimonialsSection.previewCount) : 3;
  const previewTestimonials = featuredTestimonials.slice(0, previewCount);
  const featuredUpdates = getFeaturedUpdates(siteData?.news || [], siteData?.events || []);
  const featuredCount = Math.max(featuredUpdates.length, 1);
  const featuredRailStyle = {
    "--news-home-tile-min-height": `${Math.max(84, Math.min(190, 310 / featuredCount))}px`,
    "--news-home-thumb-size": `${Math.max(48, Math.min(96, 118 - featuredCount * 8))}px`,
    "--news-home-title-size": `${Math.max(0.96, Math.min(1.56, 1.72 - featuredCount * 0.14))}rem`,
    "--news-home-chip-size": `${Math.max(0.72, Math.min(0.92, 0.96 - featuredCount * 0.03))}rem`
  };
  const imageSlides =
    siteData?.heroSlider?.length
      ? siteData.heroSlider.map((slide, index) => ({
          ...slide,
          mediaType: "image",
          key: slide.id || `hero-image-${index}`
        }))
      : [];
  const heroSlides = [
    {
      key: "hero-video",
      title: "RIF Hero Video",
      mediaType: "video",
      src: heroVideoSrc
    },
    ...imageSlides
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const sanitizePublicLink = (value, fallback) => {
    if (!value) {
      return fallback;
    }

    return value.startsWith("/admin") ? fallback : value;
  };

  const goToSlide = (index) => {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
  };

  const getSlideObjectPosition = (slide) => {
    const focusX = Number.isFinite(Number(slide?.focusX)) ? Math.min(Math.max(Number(slide.focusX), 0), 100) : 50;
    const focusY = Number.isFinite(Number(slide?.focusY)) ? Math.min(Math.max(Number(slide.focusY), 0), 100) : 50;
    return `${focusX}% ${focusY}%`;
  };

  useEffect(() => {
    if (!previewTestimonials.length) {
      setActiveTestimonial(0);
      return undefined;
    }

    setActiveTestimonial((current) => current % previewTestimonials.length);

    if (previewTestimonials.length === 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % previewTestimonials.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [previewTestimonials.length]);

  const goToTestimonial = (index) => {
    if (!previewTestimonials.length) {
      return;
    }

    setActiveTestimonial((index + previewTestimonials.length) % previewTestimonials.length);
  };

  const getTestimonialOffset = (index) => {
    if (previewTestimonials.length <= 1) {
      return 0;
    }

    const rawOffset = index - activeTestimonial;
    const halfLength = previewTestimonials.length / 2;

    if (rawOffset > halfLength) {
      return rawOffset - previewTestimonials.length;
    }

    if (rawOffset < -halfLength) {
      return rawOffset + previewTestimonials.length;
    }

    return rawOffset;
  };

  return (
    <>
      <section className="home-slider-shell">
        <div className="home-slider-stage">
          <div className="home-slider-media">
            {heroSlides.map((slide, index) => (
              <div
                aria-hidden={index !== activeSlide}
                className={
                  index === activeSlide
                    ? `home-slide home-slide-active ${slide.mediaType === "video" ? "home-slide-video-panel" : ""}`.trim()
                    : `home-slide ${slide.mediaType === "video" ? "home-slide-video-panel" : ""}`.trim()
                }
                key={slide.key}
              >
                {slide.mediaType === "video" ? (
                  <video
                    aria-label={slide.title}
                    autoPlay
                    className="home-slide-video"
                    loop
                    muted
                    playsInline
                  >
                    <source src={slide.src} type="video/mp4" />
                  </video>
                ) : (
                  <>
                    <div
                      aria-hidden
                      className="home-slide-image-backdrop"
                      style={{ backgroundImage: `url(${resolveMediaUrl(slide.imageUrl, slide.title)})` }}
                    />
                    <img
                      alt={slide.title || `Slide ${index + 1}`}
                      className="home-slide-image"
                      style={{ objectPosition: getSlideObjectPosition(slide) }}
                      src={resolveMediaUrl(slide.imageUrl, slide.title)}
                    />
                  </>
                )}
              </div>
            ))}
            <div
              className={
                heroSlides[activeSlide]?.mediaType === "video"
                  ? "home-slide-overlay home-slide-overlay-hidden"
                  : "home-slide-overlay"
              }
            />
            <div className="home-slide-controls">
              <button className="slider-arrow" onClick={() => goToSlide(activeSlide - 1)} type="button">
                ←
              </button>
              <div className="slider-dots">
                {heroSlides.map((slide, index) => (
                  <button
                    aria-label={`Go to ${slide.mediaType === "video" ? "video" : `slide ${index + 1}`}`}
                    className={index === activeSlide ? "slider-dot slider-dot-active" : "slider-dot"}
                    key={slide.key}
                    onClick={() => goToSlide(index)}
                    type="button"
                  />
                ))}
              </div>
              <button className="slider-arrow" onClick={() => goToSlide(activeSlide + 1)} type="button">
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-grid home-copy-shell">
        <div className="hero-copy home-copy-panel">
          <div aria-hidden="true" className="home-copy-launch-bg">
            <span className="home-copy-cloud home-copy-cloud-one" />
            <span className="home-copy-cloud home-copy-cloud-two" />
            <span className="home-copy-cloud home-copy-cloud-three" />
            <span className="home-copy-star home-copy-star-one" />
            <span className="home-copy-star home-copy-star-two" />
            <span className="home-copy-star home-copy-star-three" />
            <span className="home-copy-star home-copy-star-four" />
            <span className="home-copy-launch-ring home-copy-launch-ring-one" />
            <span className="home-copy-launch-ring home-copy-launch-ring-two" />
            <span className="home-copy-glow home-copy-glow-one" />
            <span className="home-copy-glow home-copy-glow-two" />
          </div>
          <p className="section-eyebrow">{homepage?.hero?.eyebrow}</p>
          <h1>{renderRifHeroTitle(homepage?.hero?.title)}</h1>
          <p className="section-description">{homepage?.hero?.description}</p>
          <div className="hero-actions">
            <Link className="button" to={homepage?.hero?.primaryCtaLink || "/enquiry"}>
              {homepage?.hero?.primaryCtaLabel || "Send Enquiry"}
            </Link>
            <Link className="button button-ghost" to={homepage?.hero?.secondaryCtaLink || "/membership-plans"}>
              {homepage?.hero?.secondaryCtaLabel || "Explore Membership"}
            </Link>
          </div>
        </div>
        <div className="hero-spotlight home-copy-spotlight">
          <div className="home-spotlight-video-wrap">
            <video
              aria-label="RIF Hero Video"
              autoPlay
              className="home-spotlight-video"
              loop
              muted
              playsInline
            >
              <source src={miniVideoSrc} type="video/mp4" />
            </video>
          </div>
          <div className="spotlight-focus-wrap">
            <p className="hero-spotlight-title">Focus Areas</p>
            <h3>{focusAreasTitle}</h3>
            <p className="spotlight-focus-copy">{focusAreasDescription}</p>
            <div className="chip-grid spotlight-focus-grid">
              {homepage?.focusAreas?.map((item) => (
                <span className="focus-chip spotlight-focus-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="stats-grid">
          {homepage?.stats?.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Affiliations and Standards"
          title={affiliationsTitle}
          description={affiliationsDescription}
        />
        <div
          aria-label="Affiliations and standards logo slider"
          className="affiliations-marquee"
          role="region"
        >
          <div className="affiliations-marquee-track">
            {[0, 1].map((copyIndex) => (
              <div
                aria-hidden={copyIndex === 1}
                className="affiliations-marquee-group"
                key={`affiliations-group-${copyIndex}`}
              >
                {spotlightPartners.map((partner, partnerIndex) => (
                  <div className="spotlight-partner-item" key={`${partner.label}-${copyIndex}-${partnerIndex}`}>
                    <div className="spotlight-partner-card spotlight-partner-image">
                      {partner.src ? (
                        <img alt={copyIndex === 0 ? partner.label : ""} src={partner.src} />
                      ) : (
                        <span className="spotlight-partner-fallback">{partner.label}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark testimonials-showcase">
        <SectionHeading
          eyebrow={testimonialsSection.eyebrow || "Testimonials"}
          title={testimonialsSection.title || "What founders, members, and ecosystem partners say about working with RIF."}
          description={testimonialsSection.description || ""}
        />
        <div className="testimonial-carousel">
          <div
            aria-label="Testimonials carousel"
            className="testimonial-carousel-stage"
            role="region"
          >
            <div className="testimonial-carousel-track">
              {previewTestimonials.map((testimonial, index) => {
                const testimonialOffset = getTestimonialOffset(index);
                const testimonialDistance = Math.min(Math.abs(testimonialOffset), 2);

                return (
                <article
                  aria-hidden={index !== activeTestimonial}
                  className={
                    index === activeTestimonial
                      ? "content-card content-card-dark testimonial-card testimonial-card-active"
                      : "content-card content-card-dark testimonial-card"
                  }
                  key={testimonial.id || testimonial.name}
                  style={{
                    "--testimonial-depth": `${80 - testimonialDistance * 90}px`,
                    "--testimonial-distance": testimonialDistance,
                    "--testimonial-offset": testimonialOffset
                  }}
                >
                  <div className="testimonial-head">
                    <div className="testimonial-kicker-wrap">
                      <span className="testimonial-kicker">Founder Voice</span>
                      <span className="testimonial-index">
                        {String(index + 1).padStart(2, "0")} / {String(previewTestimonials.length).padStart(2, "0")}
                      </span>
                    </div>
                    <span aria-hidden="true" className="testimonial-accent" />
                  </div>
                  <p className="testimonial-quote">{testimonial.quote}</p>
                  <div className="testimonial-meta">
                    <div className="testimonial-person">
                      <span aria-hidden="true" className="testimonial-avatar">
                        {getInitials(testimonial.name)}
                      </span>
                      <div className="testimonial-person-copy">
                        <h3>{testimonial.name}</h3>
                        <p className="detail-line">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          </div>
          {previewTestimonials.length > 1 ? (
            <div className="testimonial-carousel-controls">
              <button className="testimonial-nav-button" onClick={() => goToTestimonial(activeTestimonial - 1)} type="button">
                {"←"}
              </button>
              {previewTestimonials.map((testimonial, index) => (
                <button
                  aria-label={`Show testimonial ${index + 1}`}
                  className={index === activeTestimonial ? "slider-dot slider-dot-active" : "slider-dot"}
                  key={testimonial.id || testimonial.name || index}
                  onClick={() => goToTestimonial(index)}
                  type="button"
                />
              ))}
              <button className="testimonial-nav-button" onClick={() => goToTestimonial(activeTestimonial + 1)} type="button">
                {"→"}
              </button>
            </div>
          ) : null}
        </div>
        {featuredTestimonials.length > previewCount ? (
          <div className="hero-actions">
            <Link className="button" to={testimonialsSection.ctaLink || "/testimonials"}>
              {testimonialsSection.ctaLabel || "View More Testimonials"}
            </Link>
          </div>
        ) : null}
      </section>

      <section className="section">
        <SectionHeading eyebrow="Journey" title="A simple venture flow for institutional teams and founders." />
        <div className="timeline-grid">
          {homepage?.timeline?.map((item, index) => (
            <article className="timeline-card" key={item.title}>
              <span className="timeline-index">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading eyebrow="Latest" title="News, events, and current momentum." />
        <div className="split-grid home-latest-grid">
          <div className="news-home-rail-wrap">
            <div className="news-home-rail" aria-label="Featured news and events" style={featuredRailStyle}>
              {featuredUpdates.length ? (
                featuredUpdates.map((item) => (
                  <Link className="news-home-tile" key={`${item.itemType}-${item.id}`} to={item.href}>
                    <img
                      alt={item.thumbnailAlt || item.title || "Featured update"}
                      className="news-home-tile-image"
                      src={resolveMediaUrl(item.thumbnailUrl || item.imageUrl, item.title || "Featured update")}
                    />
                    <div className="news-home-tile-copy">
                      <span className="news-home-tile-chip">{item.itemType === "events" ? "Event" : item.type || "News"}</span>
                      <h3>{item.title}</h3>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="news-home-empty">
                  <p className="section-description">No News or Event.</p>
                </div>
              )}
            </div>
          </div>
          <div className="cta-panel home-founder-support">
            <p className="section-eyebrow">FOUNDER SUPPORT</p>
            <h3>{homepage?.cta?.title}</h3>
            <p>{homepage?.cta?.description}</p>
            {homepage?.cta?.qrTitle || homepage?.cta?.qrImageUrl ? (
              <div className="home-cta-qr-card">
                <div className="home-cta-qr-copy">
                  <p className="home-cta-qr-label">{homepage?.cta?.qrLabel || "Quick Scan"}</p>
                  <h4>{homepage?.cta?.qrTitle || "Connect with RIF"}</h4>
                  {homepage?.cta?.qrNote ? <p>{homepage.cta.qrNote}</p> : null}
                </div>
                <div className="qr-action-stack">
                  <div className="home-cta-qr-preview home-cta-qr-preview-large">
                    {homepage?.cta?.qrImageUrl ? (
                      <img
                        alt={homepage?.cta?.qrTitle || "RIF QR code"}
                        className="home-cta-qr-image"
                        src={resolveMediaUrl(homepage.cta.qrImageUrl, homepage?.cta?.qrTitle || "RIF QR code")}
                      />
                    ) : (
                      <div className="home-cta-qr-placeholder">QR</div>
                    )}
                  </div>
                  <a className="button button-small qr-connect-action" href={qrConnectUrl} rel="noreferrer" target="_blank">
                    Click to Connect
                  </a>
                </div>
              </div>
            ) : null}
            <div className="hero-actions">
              <Link className="button" to={sanitizePublicLink(homepage?.cta?.primaryLink, "/contact")}>
                {homepage?.cta?.primaryLabel || "Contact RIF"}
              </Link>
              <Link className="button button-ghost" to={sanitizePublicLink(homepage?.cta?.secondaryLink, "/about")}>
                {homepage?.cta?.secondaryLabel || "Learn More"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
