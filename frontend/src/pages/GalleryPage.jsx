import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ImageLightbox } from "../components/ImageLightbox.jsx";
import { useSiteData } from "../components/SiteDataProvider.jsx";
import { resolveMediaUrl } from "../utils/media.js";

export const getAlbumImages = (item) => {
  if (!item) return [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images.filter((img) => img?.imageUrl);
  }
  if (item.imageUrl) {
    return [
      {
        id: `${item.id || "item"}-cover`,
        imageUrl: item.imageUrl,
        imageAssetId: item.imageAssetId || ""
      }
    ];
  }
  return [];
};

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const { siteData } = useSiteData();
  const gallery = (siteData?.gallery || []).filter(
    (item) => item?.imageUrl || (Array.isArray(item?.images) && item.images.length > 0)
  );

  const fallbackGallery =
    !gallery.length && siteData?.heroSlider?.length
      ? siteData.heroSlider
          .filter((slide) => slide?.imageUrl)
          .map((slide, index) => ({
            id: slide.id || `hero-fallback-${index}`,
            title: slide.title || "Gallery Image",
            imageUrl: slide.imageUrl,
            images: [{ id: `hero-fallback-${index}-cover`, imageUrl: slide.imageUrl }]
          }))
      : [];

  const galleryItems = gallery.length ? gallery : fallbackGallery;
  const usingFallback = !gallery.length && galleryItems?.length;

  const handleImageError = (event, title) => {
    event.target.src = resolveMediaUrl("", title);
  };

  const openAlbum = (album, event) => {
    if (event?.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      setOrigin({
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2)
      });
    } else {
      setOrigin({
        x: Math.round(window.innerWidth / 2),
        y: Math.round(window.innerHeight / 2)
      });
    }
    setIsClosing(false);
    setActiveAlbum(album);
  };

  const closeAlbum = () => {
    if (isClosing || !activeAlbum) return;
    setIsClosing(true);
    setTimeout(() => {
      setActiveAlbum(null);
      setIsClosing(false);
    }, 280);
  };

  useEffect(() => {
    if (!activeAlbum) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeAlbum]);

  useEffect(() => {
    if (!activeAlbum) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (!selectedImage) {
          closeAlbum();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeAlbum, selectedImage, isClosing]);

  return (
    <section className="section gallery-simple-section">
      <div className="gallery-simple-heading">
        <span aria-hidden className="gallery-simple-accent" />
        <h1>Image Gallery</h1>
        <svg aria-hidden focusable="false" height="22" viewBox="0 0 64 22" width="64" className="heading-illustration">
          <rect x="2" y="9" width="18" height="4" rx="2" fill="var(--primary)" />
          <rect x="24" y="6" width="14" height="10" rx="2" fill="var(--accent)" />
          <rect x="42" y="9" width="20" height="4" rx="2" fill="var(--primary)" />
        </svg>
      </div>
      {galleryItems?.length ? (
        <>
          <div className="album-grid">
            {galleryItems.map((item) => {
              const images = getAlbumImages(item);
              const photoCount = images.length;
              const isStack = photoCount > 1;
              const coverUrl = item.imageUrl || images[0]?.imageUrl || "";

              return (
                <article
                  className={`album-card${isStack ? " album-card-stack" : ""}`}
                  key={item.id || item.imageUrl}
                >
                  <button
                    aria-label={`Open album: ${item.title || "Untitled Album"}, ${photoCount} photo${photoCount === 1 ? "" : "s"}`}
                    className="album-card-cover"
                    onClick={(event) => openAlbum(item, event)}
                    type="button"
                  >
                    <div className="album-card-cover-inner">
                      <img
                        alt={item.altText || item.title || "Album cover"}
                        className="album-card-image"
                        loading="lazy"
                        onError={(event) => handleImageError(event, item.title)}
                        src={resolveMediaUrl(coverUrl, item.title)}
                      />
                      {isStack ? (
                        <span aria-hidden="true" className="album-card-count">
                          {photoCount} photos
                        </span>
                      ) : null}
                    </div>
                  </button>
                  <h3 className="album-card-title">{item.title || "Untitled Album"}</h3>
                  {item.description ? <p className="album-card-description">{item.description}</p> : null}
                </article>
              );
            })}
          </div>
          {usingFallback ? <p className="gallery-note">Showing hero slider images until gallery items are added.</p> : null}
        </>
      ) : (
        <div className="empty-state">
          <h3>Gallery is empty.</h3>
        </div>
      )}

      {activeAlbum &&
        createPortal(
          <div
            aria-label={activeAlbum.title || "Photo album"}
            aria-modal="true"
            className={`album-modal-backdrop${isClosing ? " album-modal-closing" : ""}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeAlbum();
              }
            }}
            role="dialog"
          >
            <div
              className={`album-modal${isClosing ? " album-modal-closing" : ""}`}
              style={{
                "--origin-x": `${origin.x}px`,
                "--origin-y": `${origin.y}px`
              }}
            >
              <div className="album-modal-head">
                <div className="album-modal-info">
                  <h2>{activeAlbum.title || "Photo Album"}</h2>
                  <div className="album-modal-meta">
                    <span className="album-modal-count-badge">
                      {getAlbumImages(activeAlbum).length} photo{getAlbumImages(activeAlbum).length === 1 ? "" : "s"}
                    </span>
                    {activeAlbum.description ? (
                      <p className="album-modal-desc">{activeAlbum.description}</p>
                    ) : null}
                  </div>
                </div>
                <button
                  aria-label="Close album"
                  className="album-modal-close"
                  onClick={closeAlbum}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="album-modal-body">
                <div className="album-modal-grid">
                  {getAlbumImages(activeAlbum).map((img, idx) => (
                    <button
                      aria-label={`View photo ${idx + 1} of ${getAlbumImages(activeAlbum).length} full screen`}
                      className="album-photo"
                      key={img.id || img.imageUrl || idx}
                      onClick={() =>
                        setSelectedImage({
                          alt: img.altText || activeAlbum.title || `Photo ${idx + 1}`,
                          src: resolveMediaUrl(img.imageUrl, activeAlbum.title),
                          title: activeAlbum.title ? `${activeAlbum.title} — Photo ${idx + 1}` : "Gallery Photo"
                        })
                      }
                      style={{
                        "--stagger-index": Math.min(idx, 14)
                      }}
                      type="button"
                    >
                      <img
                        alt={img.altText || activeAlbum.title || `Photo ${idx + 1}`}
                        loading="lazy"
                        onError={(event) => handleImageError(event, activeAlbum.title)}
                        src={resolveMediaUrl(img.imageUrl, activeAlbum.title)}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <ImageLightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </section>
  );
}
