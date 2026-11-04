import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/client.js";
import ImageCropDialog from "../components/ImageCropDialog.jsx";
import { useSiteData } from "../components/SiteDataProvider.jsx";

const initialFormState = {
  name: "",
  tagline: "",
  sector: "",
  stage: "",
  founder: "",
  location: "",
  summary: "",
  description: "",
  establishmentYear: "",
  objectives: "",
  directors: "",
  email: "",
  phone: "",
  website: "",
  linkedin: "",
  photoUrls: ""
};

const fieldGroups = [
  {
    title: "Profile",
    fields: [
      { name: "name", label: "Venture Name", required: true },
      { name: "tagline", label: "Tagline / Role" },
      { name: "sector", label: "Sector", required: true },
      { name: "stage", label: "Stage", required: true },
      { name: "founder", label: "Founder / Co-Founder / CEO Name", required: true },
      { name: "location", label: "Location", required: true },
      { name: "summary", label: "Summary", type: "textarea", rows: 4, required: true },
      { name: "description", label: "Description of Startup", type: "textarea", rows: 4, required: true },
      { name: "establishmentYear", label: "Establishment Year" },
      { name: "objectives", label: "Objective of Startup", type: "textarea", rows: 4 },
      { name: "directors", label: "Directors / Team (one per line)", type: "textarea", rows: 4 }
    ]
  },
  {
    title: "Contact",
    fields: [
      { name: "email", label: "Email addresses (one per line)", type: "textarea", rows: 3 },
      { name: "phone", label: "Phone No." },
      { name: "website", label: "Website", type: "url" }
    ]
  },
  {
    title: "Social",
    fields: [{ name: "linkedin", label: "LinkedIn" }]
  }
];

export default function IncubiteeFormPage() {
  const navigate = useNavigate();
  const { siteData, refreshSiteData } = useSiteData();
  const meta = siteData?.formsMeta?.incubatee || siteData?.formsMeta?.enquiry;
  const [formState, setFormState] = useState(initialFormState);
  const [profileImage, setProfileImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [cropState, setCropState] = useState(null);
  const profileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleChange = (name, value) => {
    setFormState((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const formData = new FormData();

      Object.entries(formState).forEach(([key, value]) => {
        if (!value) return;
        formData.append(key, value);
      });

      if (profileImage) {
        formData.append("image", profileImage);
      }

      galleryImages.forEach((file) => {
        formData.append("galleryImages", file);
      });

      const result = await api.submitIncubateeProfile(formData);
      setStatus("success");
      setMessage(result.message || "Incubatee profile submitted successfully.");
      setFormState(initialFormState);
      setProfileImage(null);
      setGalleryImages([]);
      if (profileInputRef.current) profileInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      await refreshSiteData();
      navigate("/incubatees");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const openCropDialog = (file) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setCropState({
        file,
        imageUrl,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
        aspectRatio: 1,
        outputWidth: 800,
        outputHeight: 800,
        dialogTitle: "Crop Profile Image",
        helperText: "Adjust the square crop so the logo looks right on the incubatee cards."
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      setMessage("Unable to load the selected image.");
      setStatus("error");
    };
    image.src = imageUrl;
  };

  const handleCropConfirm = async (croppedFile) => {
    setProfileImage(croppedFile);
    setCropState(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }
  };

  const handleCropClose = () => {
    if (cropState?.imageUrl) {
      URL.revokeObjectURL(cropState.imageUrl);
    }
    setCropState(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }
  };

  useEffect(
    () => () => {
      if (cropState?.imageUrl) {
        URL.revokeObjectURL(cropState.imageUrl);
      }
    },
    [cropState?.imageUrl]
  );

  return (
    <section className="form-shell">
      <div className="form-copy">
        <p className="section-eyebrow">Incubatee Intake</p>
        <h1>{meta?.title || "Incubatee Registration"}</h1>
        <p>{meta?.intro || "Submit the same venture details used by the admin incubatee editor."}</p>
        <ul className="bullet-list">
          {(meta?.points || [
            "Fill the same profile fields shown in the admin incubatee editor",
            "Upload a profile image and optional gallery images",
            "The entry will be saved into the incubatees list and shown publicly"
          ]).map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {fieldGroups.map((group) => (
          <div className="field-grid" key={group.title}>
            {group.fields.map((field) => (
              <label
                key={field.name}
                className={
                  field.type === "textarea" ||
                  field.name === "summary" ||
                  field.name === "description" ||
                  field.name === "objectives" ||
                  field.name === "directors"
                    ? "field field-span-2"
                    : "field"
                }
              >
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    rows={field.rows || 5}
                    value={formState[field.name]}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                  />
                ) : (
                  <input
                    name={field.name}
                    required={field.required}
                    type={field.type || "text"}
                    value={formState[field.name]}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
        ))}

        <div className="field-grid">
          <label className="field field-span-2">
            <span>Profile Image (Crop to Square)</span>
            <input
              ref={profileInputRef}
              accept="image/*"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                openCropDialog(file);
              }}
            />
          </label>
          <label className="field field-span-2">
            <span>Gallery Images</span>
            <input
              ref={galleryInputRef}
              accept="image/*"
              multiple
              type="file"
              onChange={(event) => {
                setGalleryImages(Array.from(event.target.files || []));
              }}
            />
          </label>
          <label className="field field-span-2">
            <span>Fallback Gallery URLs</span>
            <textarea
              name="photoUrls"
              rows={3}
              placeholder="Optional: one image URL per line"
              value={formState.photoUrls}
              onChange={(event) => handleChange("photoUrls", event.target.value)}
            />
          </label>
        </div>

        <button className="button" disabled={status === "loading"} type="submit">
          {status === "loading" ? "Submitting..." : "Submit Incubatee Profile"}
        </button>
        {profileImage ? <p className="muted-copy">Selected profile image: {profileImage.name}</p> : null}
        {galleryImages.length ? <p className="muted-copy">{galleryImages.length} gallery image(s) selected.</p> : null}
        {message ? <p className={`form-message form-message-${status}`}>{message}</p> : null}
      </form>
      <ImageCropDialog cropState={cropState} onClose={handleCropClose} onConfirm={handleCropConfirm} />
    </section>
  );
}
