export const pageVisibilityDefinitions = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "leadership", label: "Leadership", path: "/leadership" },
  { key: "governorMessage", label: "Governor Message", path: "/leadership/message-from-governor" },
  { key: "chiefMinisterMessage", label: "Chief Minister Message", path: "/leadership/message-from-chief-minister" },
  { key: "viceChancellorMessage", label: "Vice Chancellor Message", path: "/leadership/message-from-vice-chancellor" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "team", label: "Team", path: "/team" },
  { key: "boardOfDirectors", label: "Board of Directors", path: "/leadership/board-of-directors" },
  { key: "advisoryBoard", label: "Advisory Board", path: "/leadership/advisory-board" },
  { key: "coreTeam", label: "Core Team", path: "/team/core-team" },
  { key: "interns", label: "Interns", path: "/team/interns" },
  { key: "incubatees", label: "Incubatees", path: "/incubatees" },
  { key: "virtualStartups", label: "Virtual Startups", path: "/virtual-startups" },
  { key: "mentors", label: "Mentors", path: "/mentors" },
  { key: "services", label: "Services", path: "/services" },
  { key: "membershipPlans", label: "Membership Plans", path: "/membership-plans" },
  { key: "rifServices", label: "RIF Services", path: "/rif-services" },
  { key: "newsEvents", label: "News and Events", path: "/news-events" },
  { key: "gallery", label: "Gallery", path: "/gallery" },
  { key: "mediaCoverage", label: "Media Coverage", path: "/media-coverage" },
  { key: "documents", label: "Documents", path: "/documents" },
  { key: "testimonials", label: "Testimonials", path: "/testimonials" },
  { key: "privacyPolicy", label: "Privacy Policy", path: "/privacy-policy" },
  { key: "termsConditions", label: "Terms and Conditions", path: "/terms-and-conditions" },
  { key: "refundPolicy", label: "Refund Policy", path: "/refund-policy" },
  { key: "apply", label: "Apply Form", path: "/apply" },
  { key: "enquiry", label: "Enquiry Form", path: "/enquiry" },
  { key: "membershipRegister", label: "Membership Form", path: "/membership-register" },
  { key: "incubateeRegister", label: "Incubatee Form", path: "/incubatee-register" },
  { key: "internRegistration", label: "Intern Registration Form", path: "/intern-registration" }
];

export const defaultDisabledPageMessage =
  "This page is currently unavailable. Please check back soon or contact RIF for assistance.";

export const createDefaultPageVisibility = () =>
  Object.fromEntries(
    pageVisibilityDefinitions.map((page) => [
      page.key,
      {
        enabled: true,
        message: defaultDisabledPageMessage
      }
    ])
  );
