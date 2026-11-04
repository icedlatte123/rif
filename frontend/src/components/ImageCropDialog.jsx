import { useEffect, useRef, useState } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getImagePlacement = ({ width, height, zoom, offsetX, offsetY, outputWidth, outputHeight }) => {
  const safeZoom = clamp(Number(zoom) || 1, 0.1, 4);
  const coverScale = Math.max(outputWidth / width, outputHeight / height);
  const scale = coverScale * safeZoom;
  const drawWidth = width * scale;
  const drawHeight = height * scale;
  const panRangeX = Math.max(0, (drawWidth - outputWidth) / 2);
  const panRangeY = Math.max(0, (drawHeight - outputHeight) / 2);
  const drawX = (outputWidth - drawWidth) / 2 - (clamp(Number(offsetX) || 0, -100, 100) / 100) * panRangeX;
  const drawY = (outputHeight - drawHeight) / 2 - (clamp(Number(offsetY) || 0, -100, 100) / 100) * panRangeY;

  return {
    x: drawX,
    y: drawY,
    width: drawWidth,
    height: drawHeight
  };
};

const drawCroppedCanvas = async ({ imageUrl, width, height, zoom, offsetX, offsetY, outputWidth, outputHeight }) => {
  const image = await new Promise((resolve, reject) => {
    const nextImage = new Image();
    nextImage.onload = () => resolve(nextImage);
    nextImage.onerror = () => reject(new Error("Unable to process selected image."));
    nextImage.src = imageUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, outputWidth, outputHeight);

  const placement = getImagePlacement({ width, height, zoom, offsetX, offsetY, outputWidth, outputHeight });
  context.drawImage(image, placement.x, placement.y, placement.width, placement.height);

  return canvas;
};

export default function ImageCropDialog({ cropState, onClose, onConfirm }) {
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);
  const imageUrl = cropState?.imageUrl;
  const aspectRatio = cropState?.aspectRatio || 1;
  const previewWidth = aspectRatio < 1 ? 280 : aspectRatio > 1.4 ? 340 : 300;
  const previewHeight = Math.min(360, Math.max(160, Math.round(previewWidth / aspectRatio)));
  const outputWidth = cropState?.outputWidth || 800;
  const outputHeight = cropState?.outputHeight || 800;
  const minZoom = 0.1;
  const editorPlacement =
    cropState && imageUrl
      ? getImagePlacement({
          width: cropState.width,
          height: cropState.height,
          zoom,
          offsetX,
          offsetY,
          outputWidth: 1000,
          outputHeight: 1000 / aspectRatio
        })
      : null;
  const editorImageStyle =
    editorPlacement
      ? {
          width: `${editorPlacement.width / 10}%`,
          height: `${(editorPlacement.height / (1000 / aspectRatio)) * 100}%`,
          left: `${editorPlacement.x / 10}%`,
          top: `${(editorPlacement.y / (1000 / aspectRatio)) * 100}%`
        }
      : undefined;
  const cropModeLabel = aspectRatio === 1 ? "Square crop" : aspectRatio > 1 ? "Landscape crop" : "Portrait crop";

  useEffect(() => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  }, [cropState?.itemId, cropState?.section]);

  useEffect(() => {
    let cancelled = false;
    let generatedUrl = "";

    const renderPreview = async () => {
      if (!cropState || !imageUrl) {
        setPreviewUrl("");
        return;
      }

      try {
        const previewCanvas = await drawCroppedCanvas({
          imageUrl,
          width: cropState.width,
          height: cropState.height,
          zoom,
          offsetX,
          offsetY,
          outputWidth: previewWidth,
          outputHeight: previewHeight
        });

        generatedUrl = previewCanvas.toDataURL("image/jpeg", 0.9);

        if (!cancelled) {
          setPreviewUrl(generatedUrl);
        }
      } catch {
        if (!cancelled) {
          setPreviewUrl("");
        }
      }
    };

    renderPreview();

    return () => {
      cancelled = true;
    };
  }, [cropState, imageUrl, offsetX, offsetY, previewHeight, previewWidth, zoom]);

  const handleConfirm = async () => {
    if (!cropState || !imageUrl) {
      return;
    }

    try {
      setProcessing(true);
      const canvas = await drawCroppedCanvas({
        imageUrl,
        width: cropState.width,
        height: cropState.height,
        zoom,
        offsetX,
        offsetY,
        outputWidth,
        outputHeight
      });

      const croppedBlob = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not crop image."))), "image/jpeg", 0.92);
      });

      const safeName = (cropState.file?.name || "profile-image").replace(/\.[^.]+$/, "");
      const croppedFile = new File([croppedBlob], `${safeName}-cropped.jpg`, { type: "image/jpeg" });
      await onConfirm(croppedFile);
    } finally {
      setProcessing(false);
    }
  };

  const resetCrop = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handlePointerDown = (event) => {
    if (!imageUrl) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offsetX,
      offsetY
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    const dragStart = dragStartRef.current;
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;

    const sensitivity = 0.42;
    const nextOffsetX = clamp(dragStart.offsetX - (event.clientX - dragStart.x) * sensitivity, -100, 100);
    const nextOffsetY = clamp(dragStart.offsetY - (event.clientY - dragStart.y) * sensitivity, -100, 100);
    setOffsetX(nextOffsetX);
    setOffsetY(nextOffsetY);
  };

  const handlePointerEnd = (event) => {
    if (dragStartRef.current?.pointerId === event.pointerId) {
      dragStartRef.current = null;
    }
    setIsDragging(false);
  };

  if (!cropState) {
    return null;
  }

  return (
    <div className="crop-modal-backdrop" role="dialog" aria-modal="true">
      <div className="crop-modal">
        <div className="crop-modal-head">
          <div>
            <p className="crop-modal-kicker">{cropModeLabel}</p>
            <h3>{cropState?.dialogTitle || "Crop Image"}</h3>
          </div>
          <button className="button button-ghost button-small" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <p className="muted-copy">{cropState?.helperText || "Adjust zoom and position, then upload."}</p>
        <div className="crop-workspace">
          <div className="crop-editor-panel">
            <div
              className={isDragging ? "crop-editor-surface crop-editor-surface-dragging" : "crop-editor-surface"}
              onPointerCancel={handlePointerEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              style={{ aspectRatio: `${aspectRatio}` }}
            >
              {imageUrl ? <img alt="Crop source" className="crop-editor-image" draggable="false" src={imageUrl} style={editorImageStyle} /> : null}
              <div className="crop-editor-shade" />
              <div className="crop-editor-grid" />
            </div>
            <p className="crop-editor-hint">Drag image to reposition. Use zoom for a tighter crop.</p>
          </div>
          <aside className="crop-side-panel">
            <div>
              <p className="crop-side-label">Live preview</p>
              <div className="crop-preview-wrap" style={{ aspectRatio: `${aspectRatio}` }}>
                {previewUrl ? <img alt="Cropped preview" className="crop-preview-image" src={previewUrl} /> : null}
              </div>
            </div>
            <button className="button button-ghost button-small crop-reset-button" onClick={resetCrop} type="button">
              Reset crop
            </button>
          </aside>
        </div>
        <div className="crop-control-panel">
          <label className="crop-range-field crop-range-field-wide">
            <span>
              Zoom
              <strong>{zoom.toFixed(2)}x</strong>
            </span>
            <input max="4" min={minZoom} step="0.01" type="range" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
          </label>
          <label className="crop-range-field">
            <span>
              Horizontal
              <strong>{Math.round(offsetX)}</strong>
            </span>
            <input max="100" min="-100" step="1" type="range" value={offsetX} onChange={(event) => setOffsetX(Number(event.target.value))} />
          </label>
          <label className="crop-range-field">
            <span>
              Vertical
              <strong>{Math.round(offsetY)}</strong>
            </span>
            <input max="100" min="-100" step="1" type="range" value={offsetY} onChange={(event) => setOffsetY(Number(event.target.value))} />
          </label>
        </div>
        <div className="crop-modal-actions">
          <button className="button button-ghost" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="button" disabled={processing} onClick={handleConfirm} type="button">
            {processing ? "Processing..." : "Crop and Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
