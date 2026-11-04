import { SubmissionForm } from "../components/SubmissionForm.jsx";

const fields = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email address", type: "email", required: true },
  { name: "phone", label: "Phone number", type: "tel", required: true },
  { name: "college", label: "College / institution", required: true },
  { name: "course", label: "Course and year", required: true },
  {
    name: "interestArea",
    label: "Area of interest",
    type: "select",
    required: true,
    options: ["Startup incubation", "Entrepreneurship", "Marketing and communications", "Research and analysis", "Events and operations", "Technology", "Other"]
  },
  { name: "availability", label: "Availability / preferred duration", required: true },
  { name: "linkedin", label: "LinkedIn or portfolio URL", type: "url" },
  { name: "skills", label: "Relevant skills", type: "textarea", span: 2, rows: 3 },
  { name: "motivation", label: "Why would you like to intern with RIF?", type: "textarea", span: 2, rows: 5, required: true }
];

export default function InternRegistrationPage() {
  return (
    <SubmissionForm
      eyebrow="Internship Application"
      title="Register your interest in interning with RIF"
      intro="Share a few details about your studies, interests, and availability. The RIF team will review your application and contact you if there is a suitable opportunity."
      points={["Complete all required fields.", "Use an email address you check regularly.", "A confirmation will be sent to your email after submission."]}
      fields={fields}
      submitType="intern"
      submitLabel="Send application"
      sectionClassName="intern-registration-shell"
    />
  );
}

// inter registraion page link : http://localhost:5173/intern-registration , haha 
