import { Link, useParams } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { useSiteData } from "../components/SiteDataProvider.jsx";
import { formatDate } from "../utils/formatters.js";
import { resolveAssetUrl, resolveMediaUrl } from "../utils/media.js";

const isExternalLink = (value = "") => /^https?:\/\//i.test(value);

const normalizeText = (value = "") => {
  if (Array.isArray(value)) {
    return value.map((line) => String(line).trim()).filter(Boolean);
  }

  return String(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

const getNewsLink = (item) => `/news-events/news/${item.id}`;
const getEventLink = (item) => `/news-events/events/${item.id}`;

const getItemLabel = (itemType) => (itemType === "events" ? "Event" : "News");

const getItemCollection = (siteData, itemType) => {
  if (itemType === "events") {
    return Array.isArray(siteData?.events) ? siteData.events : [];
  }

  return Array.isArray(siteData?.news) ? siteData.news : [];
};

const getItemDetail = (siteData, itemType, itemId) => {
  const collection = getItemCollection(siteData, itemType);
  return collection.find((item) => item.id === itemId) || null;
};

const NewsEventCard = ({ item, itemType }) => {
  const href = itemType === "events" ? getEventLink(item) : getNewsLink(item);
  const metaLabel = itemType === "events" ? item.status || "Event" : item.type || "News";
  const secondaryMeta =
    itemType === "events"
      ? [item.location, item.date ? formatDate(item.date) : ""].filter(Boolean).join(" • ")
      : [item.category, item.publishedAt ? formatDate(item.publishedAt) : ""].filter(Boolean).join(" • ");

  return (
    <Link className="news-event-card" to={href}>
      <div className="news-event-card-media">
        <img
          alt={item.thumbnailAlt || item.title}
          className="news-event-card-image"
          src={resolveMediaUrl(item.thumbnailUrl || item.imageUrl, item.title || getItemLabel(itemType))}
        />
        <span className={itemType === "events" ? "news-event-card-chip news-event-card-chip-event" : "news-event-card-chip"}>
          {metaLabel}
        </span>
      </div>
      <div className="news-event-card-copy">
        <h3>{item.title}</h3>
        <p>{itemType === "events" ? item.summary || item.excerpt : item.excerpt || item.summary}</p>
        {secondaryMeta ? <p className="news-event-card-meta">{secondaryMeta}</p> : null}
      </div>
    </Link>
  );
};

const NewsEventGrid = ({ title, description, items, itemType }) => (
  <section className="news-event-section">
    <div className="news-event-section-head">
      <div>
        <p className="section-eyebrow">{title}</p>
        <p className="section-description">{description}</p>
      </div>
    </div>
    <div className="news-event-grid">
      {(items || []).map((item) => (
        <NewsEventCard item={item} itemType={itemType} key={item.id} />
      ))}
    </div>
  </section>
);

const DetailMeta = ({ label, value }) =>
  value ? (
    <div className="news-event-detail-meta">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  ) : null;

const NewsEventDetailPage = ({ itemType, itemId }) => {
  const { siteData } = useSiteData();
  const item = getItemDetail(siteData, itemType, itemId);

  if (!item) {
    return (
      <section className="section news-event-detail-page">
        <div className="news-event-detail-empty">
          <p className="section-eyebrow">News and Events</p>
          <h1>Item not found</h1>
          <p className="section-description">The content you are looking for is unavailable or has been removed.</p>
          <Link className="button" to="/news-events">
            Back to News and Events
          </Link>
        </div>
      </section>
    );
  }

  const headline = itemType === "events" ? item.summary || item.excerpt || item.title : item.excerpt || item.summary || item.title;
  const detailLines = normalizeText(item.details || item.body || headline);
  const attachments = Array.isArray(item.attachments) ? item.attachments : [];
  const eventAgenda = itemType === "events" ? normalizeText(item.agenda) : [];
  const publicLink = item.link && !item.link.startsWith("/news-events") ? item.link : "";
  const itemLabel = getItemLabel(itemType);
  const metaOne = itemType === "events" ? formatDate(item.date) : formatDate(item.publishedAt);
  const metaTwo = itemType === "events" ? item.location : item.category;
  const metaThree = itemType === "events" ? item.status : item.author;

  return (
    <>
      <PageHero
        eyebrow={itemLabel}
        panelKey="newsEvents"
        title={item.title}
        description={headline}
      />
      <section className="section news-event-detail-page">
        <div className="news-event-detail-grid">
          <div className="news-event-detail-visual">
            <img
              alt={item.thumbnailAlt || item.title}
              className="news-event-detail-image"
              src={resolveMediaUrl(item.thumbnailUrl || item.imageUrl, item.title || itemLabel)}
            />
          </div>
          <div className="news-event-detail-body">
            <div className="news-event-detail-topline">
              <span className="news-event-detail-chip">{itemLabel}</span>
              <span className="news-event-detail-muted">{metaOne}</span>
            </div>
            <h1>{item.title}</h1>
            <p className="news-event-detail-summary">{headline}</p>
            {publicLink ? (
              <a className="button button-ghost button-small news-event-source-link" href={publicLink} rel="noreferrer" target="_blank">
                Open Source Link
              </a>
            ) : null}
            <div className="news-event-detail-meta-grid">
              <DetailMeta label={itemType === "events" ? "Date" : "Published"} value={metaOne} />
              <DetailMeta label={itemType === "events" ? "Location" : "Category"} value={metaTwo} />
              <DetailMeta label={itemType === "events" ? "Status" : "Author"} value={metaThree} />
            </div>
            {detailLines.length ? (
              <div className="news-event-detail-copy">
                {detailLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            ) : null}
            {eventAgenda.length ? (
              <section className="news-event-detail-block">
                <h2>Agenda</h2>
                <ul className="bullet-list">
                  {eventAgenda.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            {attachments.length ? (
              <section className="news-event-detail-block">
                <h2>Documents</h2>
                <div className="news-event-attachments">
                  {attachments.map((attachment) => (
                    <a
                      className="news-event-attachment"
                      href={resolveAssetUrl(attachment.url)}
                      key={attachment.id || attachment.url || attachment.title}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <strong>{attachment.title || attachment.filename || "Document"}</strong>
                      <span>{attachment.description || attachment.filename || attachment.mimeType || "Open file"}</span>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
};

const NewsEventsListPage = () => {
  const { siteData } = useSiteData();
  const news = siteData?.news || [];
  const events = siteData?.events || [];

  return (
    <>
      <PageHero
        eyebrow="News and Events"
        panelKey="newsEvents"
        title="Latest updates, announcements, and event moments in one place."
        description="Browse news and events as visual cards, then open any item for full details and supporting documents."
        primaryAction={{ label: "Contact RIF", to: "/contact" }}
      />
      <section className="section news-events-page">
        <NewsEventGrid
          description="Announcements, milestones, and program updates from the foundation."
          itemType="news"
          items={news}
          title="News"
        />
        <NewsEventGrid
          description="Upcoming and completed events with their dates, locations, and supporting material."
          itemType="events"
          items={events}
          title="Events"
        />
      </section>
    </>
  );
};

export default function NewsEventsPage() {
  const { itemType, itemId } = useParams();

  if (itemType && itemId) {
    return <NewsEventDetailPage itemId={itemId} itemType={itemType} />;
  }

  return <NewsEventsListPage />;
}
