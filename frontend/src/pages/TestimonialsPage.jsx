import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { PageHero } from "../components/PageHero.jsx";
import { useSiteData } from "../components/SiteDataProvider.jsx";

export default function TestimonialsPage() {
  const { siteData, refreshSiteData } = useSiteData();
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
  const section = homepage?.testimonialsSection || {};
  const [formValue, setFormValue] = useState({
    name: "",
    role: "",
    quote: ""
  });
  const [submissionState, setSubmissionState] = useState({
    status: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormValue((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmissionState({ status: "", message: "" });

    try {
      await api.submitTestimonial({
        name: formValue.name.trim(),
        role: formValue.role.trim(),
        quote: formValue.quote.trim()
      });
      setFormValue({ name: "", role: "", quote: "" });
      await refreshSiteData();
      setSubmissionState({
        status: "success",
        message: "Thanks. Your testimonial has been added to the page and can be featured by the admin on the homepage."
      });
    } catch (error) {
      setSubmissionState({
        status: "error",
        message: error.message || "Could not submit your testimonial right now."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow={section.pageEyebrow || section.eyebrow || "Testimonials"}
        panelKey="testimonials"
        title={section.pageTitle || section.title || "Voices from the RIF ecosystem"}
        description={section.pageDescription || section.description || ""}
        primaryAction={{ label: "Send Enquiry", to: "/enquiry" }}
        secondaryAction={{ label: "Contact RIF", to: "/contact" }}
      />

      <section className="section">
        <div className="testimonials-page-layout">
          <div className="testimonials-list-column">
            <div className="card-grid card-grid-3">
              {testimonials.map((testimonial) => (
                <article className="content-card content-card-dark testimonial-page-card" key={testimonial.id || testimonial.name}>
                  <div className="testimonial-head">
                    <span aria-hidden="true" className="testimonial-accent" />
                  </div>
                  <p className="testimonial-quote">{testimonial.quote}</p>
                  <div className="testimonial-meta">
                    <h3>{testimonial.name}</h3>
                    <p className="detail-line">{testimonial.role}</p>
                  </div>
                </article>
              ))}
            </div>
            {!testimonials.length ? (
              <article className="content-card">
                <h3>No testimonials added yet</h3>
                <Link className="button" to="/enquiry">
                  Send Enquiry
                </Link>
              </article>
            ) : null}
          </div>

          <article className="content-card testimonial-submit-card">
            <p className="section-eyebrow">Share Your Voice</p>
            <h3>Add a testimonial</h3>
            <p className="section-description">
              Share a short note about your experience with RIF. The admin team can choose which testimonials appear on the homepage.
            </p>
            <form className="testimonial-submit-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Name</span>
                <input
                  required
                  type="text"
                  value={formValue.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label className="field">
                <span>Role / Organization</span>
                <input
                  type="text"
                  value={formValue.role}
                  onChange={(event) => handleChange("role", event.target.value)}
                  placeholder="Founder, member, partner..."
                />
              </label>
              <label className="field field-span-2">
                <span>Your testimonial</span>
                <textarea
                  required
                  rows={6}
                  value={formValue.quote}
                  onChange={(event) => handleChange("quote", event.target.value)}
                  placeholder="Tell us what stood out about your experience..."
                />
              </label>
              {submissionState.message ? (
                <p className={submissionState.status === "error" ? "form-message form-message-error" : "form-message"}>
                  {submissionState.message}
                </p>
              ) : null}
              <button className="button" disabled={submitting} type="submit">
                {submitting ? "Submitting..." : "Submit Testimonial"}
              </button>
            </form>
          </article>
        </div>
      </section>
    </>
  );
}
