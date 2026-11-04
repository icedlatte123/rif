import { useEffect } from "react";
import { createPortal } from "react-dom";

export const ImageLightbox = ({ image, onClose }) => {
  useEffect(() => {
    if (!image) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image, onClose]);

  if (!image) {
    return null;
  }

  return createPortal(
    <div
      aria-label={image.title ? `Full image: ${image.title}` : "Full image preview"}
      aria-modal="true"
      className="image-lightbox-backdrop"
      onClick={onClose}
      role="dialog"
    >
      <div className="image-lightbox" onClick={(event) => event.stopPropagation()}>
        <button
          aria-label="Close image preview"
          autoFocus
          className="image-lightbox-close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <img alt={image.alt || image.title || "Full-size preview"} src={image.src} />
        {image.title ? <p className="image-lightbox-caption">{image.title}</p> : null}
      </div>
    </div>,
    document.body
  );
};
