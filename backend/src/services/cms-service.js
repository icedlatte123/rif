import { randomUUID } from "node:crypto";
import { getSiteContentCollection, getSiteContentDocumentId, getSubmissionsCollection } from "../config/database.js";
import { slugify } from "../utils/slugify.js";
import { sendIncubateeProfileEmails, sendSubmissionEmails } from "./mailer.js";

const editableSections = new Set([
  "siteSettings",
  "pageVisibility",
  "pageHeroPanels",
  "homepage",
  "about",
  "legalPages",
  "team",
  "incubatees",
  "virtualStartups",
  "facultyMembers",
  "mentors",
  "services",
  "membershipPlans",
  "rifServices",
  "news",
  "events",
  "heroSlider",
  "gallery",
  "mediaCoverage",
  "formsMeta"
]);

const submissionTypes = new Set(["apply", "membership", "enquiry"]);
const acceptedSubmissionTypes = new Set(["apply", "membership", "enquiry", "incubatee", "intern"]);

const defaultTestimonialsSection = {
  eyebrow: "Testimonials",
  title: "What founders, members, and ecosystem partners say about working with RIF.",
  description: "",
  previewCount: 3,
  ctaLabel: "View More Testimonials",
  ctaLink: "/testimonials",
  pageEyebrow: "Testimonials",
  pageTitle: "Voices from the RIF ecosystem",
  pageDescription: ""
};

const defaultHomepageCta = {
  title: "Designed for institutional credibility and founder momentum.",
  description: "",
  primaryLabel: "Send Enquiry",
  primaryLink: "/enquiry",
  secondaryLabel: "View Leadership",
  secondaryLink: "/leadership",
  qrLabel: "Quick Scan",
  qrTitle: "",
  qrNote: "",
  qrImageUrl: "",
  qrAssetId: ""
};

const defaultSiteSettings = {
  name: "RIF",
  fullName: "Rohilkhand Incubation Foundation",
  tagline: "Building scalable ventures from research, regional insight, and founder grit.",
  location: "MJP Rohilkhand University, Bareilly, Uttar Pradesh",
  contactEmail: "hello@rif.org.in",
  contactPhone: "+91 98765 43210",
  socialLinks: {},
  footerNote: "NSRCEL-inspired digital experience adapted for RIF with a modern content-managed architecture.",
  maintenanceMode: false,
  maintenanceTitle: "Maintenance in Progress",
  maintenanceMessage: "The website is temporarily unavailable while the RIF team performs maintenance and updates."
};

const createDefaultLeadershipMessage = ({
  eyebrow,
  name,
  buttonLabel,
  buttonLink,
  pageTitle,
  imageAlt,
  letterSectionTitle,
  letterImageAlt,
  message
}) => ({
  eyebrow,
  name,
  buttonLabel,
  buttonLink,
  pageEyebrow: "Leadership Message",
  pageTitle,
  imageUrl: "",
  imageAssetId: "",
  imageAlt,
  letterSectionLabel: "Official Letter",
  letterSectionTitle,
  letterSectionDescription: "",
  letterImageUrl: "",
  letterImageAssetId: "",
  letterImageAlt,
  message
});

const defaultLeadershipContent = {
  eyebrow: "Leadership",
  title: "Leadership that guides governance, direction, and founder confidence.",
  description: "Explore the strategic pillars behind RIF along with the board and advisory leaders who shape institutional momentum.",
  primaryCtaLabel: "Board of Directors",
  primaryCtaLink: "/leadership/board-of-directors",
  secondaryCtaLabel: "Send Enquiry",
  secondaryCtaLink: "/enquiry",
  pillarsEyebrow: "Leadership Pillars",
  pillarsTitle: "The principles guiding how RIF builds trust and momentum.",
  pillarsDescription: "These pillars now sit within Leadership so governance, advisory support, and strategic direction are presented together.",
  governorMessage: createDefaultLeadershipMessage({
    eyebrow: "Governor, Uttar Pradesh",
    name: "Anandiben Patel",
    buttonLabel: "Message from Governor",
    buttonLink: "/leadership/message-from-governor",
    pageTitle: "Message from Governor",
    imageAlt: "Governor of Uttar Pradesh",
    letterSectionTitle: "View the signed governor message",
    letterImageAlt: "Signed governor message letter",
    message:
      "I feel extremely proud to know that Mahatma Jyotiba Phule Rohilkhand University, Bareilly, is sharing the promotional brochure of the Rohilkhand Incubation Foundation, established under the State Government of Uttar Pradesh to promote entrepreneurship."
  }),
  chiefMinisterMessage: createDefaultLeadershipMessage({
    eyebrow: "Chief Minister, Uttar Pradesh",
    name: "Yogi Adityanath",
    buttonLabel: "Message from Chief Minister",
    buttonLink: "/leadership/message-from-chief-minister",
    pageTitle: "Message from Chief Minister",
    imageAlt: "Chief Minister of Uttar Pradesh",
    letterSectionTitle: "View the signed chief minister message",
    letterImageAlt: "Signed chief minister message letter",
    message:
      "Innovation, entrepreneurship, and institutional collaboration can create transformative opportunities for young founders across Uttar Pradesh. Initiatives that connect education, incubation, and industry help build a stronger startup ecosystem for the state."
  }),
  viceChancellorMessage: createDefaultLeadershipMessage({
    eyebrow: "Vice Chancellor",
    name: "Vice Chancellor",
    buttonLabel: "Message from Vice Chancellor",
    buttonLink: "/leadership/message-from-vice-chancellor",
    pageTitle: "Message from Vice Chancellor",
    imageAlt: "Vice Chancellor message",
    letterSectionTitle: "View the signed vice chancellor message",
    letterImageAlt: "Signed vice chancellor message letter",
    message:
      "Rohilkhand Incubation Foundation reflects our commitment to nurture research, innovation, and entrepreneurship together. We aim to support students, researchers, and founders with an ecosystem that helps promising ideas become impactful ventures."
  })
};

const defaultInternProfiles = [
  {
    id: "intern-1",
    name: "Aarav Sharma",
    role: "Startup Operations Intern",
    bio: "Supports founder coordination, program documentation, and daily incubation workflows.",
    linkedinUrl: "",
    githubUrl: "",
    imageUrl: "",
    imageAssetId: ""
  },
  {
    id: "intern-2",
    name: "Nisha Verma",
    role: "Marketing and Outreach Intern",
    bio: "Assists with event communications, social media updates, and community engagement.",
    linkedinUrl: "",
    githubUrl: "",
    imageUrl: "",
    imageAssetId: ""
  },
  {
    id: "intern-3",
    name: "Kabir Khan",
    role: "Research and Documentation Intern",
    bio: "Helps maintain startup records, ecosystem research notes, and program reports.",
    linkedinUrl: "",
    githubUrl: "",
    imageUrl: "",
    imageAssetId: ""
  }
];

const defaultFormsMeta = {
  apply: {
    title: "Apply to RIF",
    intro: "Use this form for incubation or program admission requests.",
    points: [
      "Share your startup idea and stage",
      "Explain the problem and traction so far",
      "Mention the support you expect from RIF"
    ],
    qrCodeLabel: "Scan to Pay",
    qrCodeTitle: "Application Payment QR",
    qrCodeNote: "",
    qrCodeImageUrl: "",
    qrCodeAssetId: ""
  },
  membership: {
    title: "Register for Membership",
    intro: "Choose a plan and tell us how you want to engage with the ecosystem.",
    points: [
      "Select your membership track",
      "Tell us your role and goals",
      "Add your organization details"
    ],
    qrCodeLabel: "Scan to Pay",
    qrCodeTitle: "Membership Payment QR",
    qrCodeNote: "",
    qrCodeImageUrl: "",
    qrCodeAssetId: ""
  },
  enquiry: {
    title: "General Enquiry",
    intro: "Use this form for general questions, collaboration requests, startup support queries, or follow-up conversations with the RIF team.",
    points: [
      "Share your basic contact details",
      "Tell us the topic of your enquiry",
      "Explain how the RIF team can help"
    ],
    qrCodeLabel: "Quick Connect",
    qrCodeTitle: "General Enquiry QR",
    qrCodeNote: "",
    qrCodeImageUrl: "",
    qrCodeAssetId: ""
  }
};

const defaultDisabledPageMessage =
  "This page is currently unavailable. Please check back soon or contact RIF for assistance.";

const pageVisibilityKeys = [
  "home",
  "about",
  "leadership",
  "governorMessage",
  "chiefMinisterMessage",
  "viceChancellorMessage",
  "contact",
  "team",
  "boardOfDirectors",
  "advisoryBoard",
  "coreTeam",
  "interns",
  "incubatees",
  "virtualStartups",
  "facultyMembers",
  "mentors",
  "services",
  "membershipPlans",
  "rifServices",
  "newsEvents",
  "gallery",
  "mediaCoverage",
  "documents",
  "testimonials",
  "privacyPolicy",
  "termsConditions",
  "refundPolicy",
  "apply",
  "enquiry",
  "membershipRegister",
  "incubateeRegister",
  "internRegistration"
];

const defaultPageVisibility = Object.fromEntries(
  pageVisibilityKeys.map((key) => [
    key,
    {
      enabled: true,
      message: defaultDisabledPageMessage
    }
  ])
);

const defaultPageHeroPanels = {
  about: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  leadership: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  boardOfDirectors: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  advisoryBoard: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  coreTeam: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  interns: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  contact: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: "",
    qrLabel: "",
    qrTitle: "",
    qrNote: "",
    qrImageUrl: "",
    qrAssetId: ""
  },
  services: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  incubatees: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  virtualStartups: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  mentors: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  facultyMembers: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  newsEvents: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  testimonials: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  privacyPolicy: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  termsConditions: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  },
  refundPolicy: {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAssetId: "",
    imageAlt: ""
  }
};

const normalizeSubmissionType = (type = "") =>
  type === "incubatee" || type === "intern" ? "enquiry" : type;

const normalizeLegalPage = (value, baseKey) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  return {
    ...value,
    sections: ensureIds(value.sections, baseKey)
  };
};

const ensureIds = (value, baseKey = "item") => {
  if (!Array.isArray(value)) {
    return value;
  }

  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      return item;
    }

    if (item.id) {
      return item;
    }

    const titleLike = item.title || item.name || item.label || `${baseKey}-${index + 1}`;

    return {
      ...item,
      id: slugify(titleLike) || `${baseKey}-${index + 1}`
    };
  });
};

const normalizeNewsEventCollection = (value, baseKey) =>
  ensureIds(value, baseKey).map((item) => ({
    ...item,
    attachments: ensureIds(item?.attachments, `${baseKey}-attachment`)
  }));

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

const normalizeProfileCollection = (value, baseKey) => {
  const items = ensureIds(value, baseKey);

  if (!Array.isArray(items)) {
    return items;
  }

  return items.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }

    return {
      ...item,
      bio: stripWrappingQuotes(item.bio)
    };
  });
};

const normalizeHomepageSection = (value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  const legacyTestimonials =
    Array.isArray(value.testimonials) && value.testimonials.length
      ? value.testimonials
      : (value.startupStories || []).map((story) => ({
          id: story.id,
          name: story.name || "",
          role: story.role || story.sector || "",
          quote: story.quote || story.highlight || ""
        }));

  return {
    ...value,
    stats: ensureIds(value.stats, "stat"),
    featuredPrograms: ensureIds(value.featuredPrograms, "program"),
    cta: {
      ...defaultHomepageCta,
      ...(value.cta || {})
    },
    testimonialsSection: {
      ...defaultTestimonialsSection,
      ...(value.testimonialsSection || {})
    },
    testimonials: ensureIds(legacyTestimonials, "testimonial").map((testimonial) => ({
      ...testimonial,
      featuredOnHome: testimonial.featuredOnHome === true
    })),
    timeline: ensureIds(value.timeline, "timeline")
  };
};

const normalizeSiteSettings = (value) => {
  const safeValue = value && typeof value === "object" ? value : {};

  return {
    ...defaultSiteSettings,
    ...safeValue,
    socialLinks: {
      ...(defaultSiteSettings.socialLinks || {}),
      ...(safeValue.socialLinks || {})
    },
    maintenanceMode: safeValue.maintenanceMode === true,
    maintenanceTitle: safeValue.maintenanceTitle || defaultSiteSettings.maintenanceTitle,
    maintenanceMessage: safeValue.maintenanceMessage || defaultSiteSettings.maintenanceMessage
  };
};

const normalizeFormsMeta = (value) => {
  const safeValue = value && typeof value === "object" ? value : {};
  const enquiryValue = safeValue.enquiry || safeValue.incubatee || {};

  return {
    apply: {
      ...defaultFormsMeta.apply,
      ...(safeValue.apply || {})
    },
    membership: {
      ...defaultFormsMeta.membership,
      ...(safeValue.membership || {})
    },
    enquiry: {
      ...defaultFormsMeta.enquiry,
      ...enquiryValue
    }
  };
};

const normalizePageHeroPanels = (value) => {
  const safeValue = value && typeof value === "object" ? value : {};

  return Object.fromEntries(
    Object.entries(defaultPageHeroPanels).map(([key, defaults]) => [
      key,
      {
        ...defaults,
        ...(safeValue[key] || {})
      }
    ])
  );
};

const normalizePageVisibility = (value) => {
  const safeValue = value && typeof value === "object" ? value : {};

  return Object.fromEntries(
    Object.entries(defaultPageVisibility).map(([key, defaults]) => [
      key,
      {
        ...defaults,
        ...(safeValue[key] || {}),
        enabled: safeValue[key]?.enabled !== false,
        message: safeValue[key]?.message || defaultDisabledPageMessage
      }
    ])
  );
};

const normalizeSection = (section, value) => {
  if (section === "pageVisibility") {
    return normalizePageVisibility(value);
  }

  if (section === "siteSettings") {
    return normalizeSiteSettings(value);
  }

  if (section === "pageHeroPanels") {
    return normalizePageHeroPanels(value);
  }

  if (section === "homepage" && value && typeof value === "object") {
    return normalizeHomepageSection(value);
  }

  if (section === "team" && value && typeof value === "object") {
    return {
      ...value,
      leadershipContent: {
        ...defaultLeadershipContent,
        ...(value.leadershipContent || {}),
        governorMessage: {
          ...defaultLeadershipContent.governorMessage,
          ...(value.leadershipContent?.governorMessage || {})
        },
        chiefMinisterMessage: {
          ...defaultLeadershipContent.chiefMinisterMessage,
          ...(value.leadershipContent?.chiefMinisterMessage || {})
        },
        viceChancellorMessage: {
          ...defaultLeadershipContent.viceChancellorMessage,
          ...(value.leadershipContent?.viceChancellorMessage || {})
        }
      },
      boardOfDirectors: normalizeProfileCollection(value.boardOfDirectors, "board"),
      additionalDirectors: normalizeProfileCollection(value.additionalDirectors, "additional-director"),
      advisoryBoard: normalizeProfileCollection(value.advisoryBoard, "advisor"),
      coreTeam: normalizeProfileCollection(value.coreTeam, "core"),
      interns: normalizeProfileCollection(value.interns || defaultInternProfiles, "intern"),
      virtualStartups: normalizeProfileCollection(value.virtualStartups, "virtual-startup")
    };
  }

  if (
    ["incubatees", "virtualStartups", "facultyMembers", "mentors", "services", "membershipPlans", "news", "events", "heroSlider", "gallery", "mediaCoverage"].includes(
      section
    )
  ) {
    if (section === "news" || section === "events") {
      return normalizeNewsEventCollection(value, section);
    }

    return ensureIds(value, section);
  }

  if (section === "rifServices") {
    if (Array.isArray(value)) {
      return ensureIds(value, "rif-service");
    }

    if (value && typeof value === "object") {
      return {
        ...value,
        benefits: ensureIds(value.benefits, "rif-benefit"),
        serviceTiles: ensureIds(value.serviceTiles, "rif-tile"),
        screeningSteps: ensureIds(value.screeningSteps, "rif-step"),
        eligibilityPoints: Array.isArray(value.eligibilityPoints) ? value.eligibilityPoints : []
      };
    }
  }

  if (section === "about" && value && typeof value === "object") {
    return {
      ...value,
      pillars: ensureIds(value.pillars, "pillar"),
      documents: ensureIds(value.documents, "document")
    };
  }

  if (section === "legalPages" && value && typeof value === "object") {
    return {
      privacyPolicy: normalizeLegalPage(value.privacyPolicy, "privacy-section"),
      termsConditions: normalizeLegalPage(value.termsConditions, "terms-section"),
      refundPolicy: normalizeLegalPage(value.refundPolicy, "refund-section")
    };
  }

  if (section === "formsMeta") {
    return normalizeFormsMeta(value);
  }

  return value;
};

export const getPublicSiteData = async () => {
  const data = await getSiteContentCollection().findOne({ _id: getSiteContentDocumentId() });

  if (!data) {
    return {};
  }

  const { _id, ...siteContent } = data;

  return {
    ...siteContent,
    siteSettings: normalizeSiteSettings(siteContent.siteSettings),
    homepage: normalizeHomepageSection(siteContent.homepage),
    pageVisibility: normalizePageVisibility(siteContent.pageVisibility),
    pageHeroPanels: normalizePageHeroPanels(siteContent.pageHeroPanels),
    about: normalizeSection("about", siteContent.about),
    team: normalizeSection("team", siteContent.team),
    legalPages: normalizeSection("legalPages", siteContent.legalPages),
    formsMeta: normalizeFormsMeta(siteContent.formsMeta),
    news: normalizeNewsEventCollection(siteContent.news || [], "news"),
    events: normalizeNewsEventCollection(siteContent.events || [], "events"),
    heroSlider: Array.isArray(siteContent.heroSlider) ? siteContent.heroSlider : [],
    gallery: Array.isArray(siteContent.gallery) ? siteContent.gallery : [],
    mediaCoverage: Array.isArray(siteContent.mediaCoverage) ? siteContent.mediaCoverage : []
  };
};

export const getAdminData = async () => {
  return getPublicSiteData();
};

export const incrementVisitCount = async () => {
  const result = await getSiteContentCollection().findOneAndUpdate(
    { _id: getSiteContentDocumentId() },
    [
      {
        $set: {
          "siteSettings.visitCount": {
            $add: [
              {
                $cond: [
                  { $isNumber: "$siteSettings.visitCount" },
                  "$siteSettings.visitCount",
                  50000
                ]
              },
              1
            ]
          }
        }
      }
    ],
    { returnDocument: "after" }
  );

  return result?.siteSettings?.visitCount ?? 50001;
};

export const updateSection = async (section, value) => {
  if (!editableSections.has(section)) {
    const error = new Error(`Section "${section}" is not editable.`);
    error.statusCode = 400;
    throw error;
  }

  const normalizedValue = normalizeSection(section, value);
  await getSiteContentCollection().updateOne(
    { _id: getSiteContentDocumentId() },
    {
      $set: {
        [section]: normalizedValue
      }
    }
  );

  return normalizedValue;
};

export const createSubmission = async (type, payload, { sendEmails = true } = {}) => {
  const normalizedType = normalizeSubmissionType(type);

  if (!acceptedSubmissionTypes.has(type) || !submissionTypes.has(normalizedType)) {
    const error = new Error(`Unsupported form type "${type}".`);
    error.statusCode = 400;
    throw error;
  }

  const entry = {
    id: randomUUID(),
    type,
    submittedAt: new Date().toISOString(),
    ...payload
  };

  await getSubmissionsCollection().insertOne(entry);
  if (sendEmails) {
    sendSubmissionEmails(type, entry).catch((error) => {
      console.error("[mail] Error sending submission emails", error);
    });
  }

  const { type: _type, ...submission } = entry;
  return submission;
};

export const createIncubateeProfile = async (payload) => {
  const profile = {
    id: randomUUID(),
    ...payload
  };

  const siteData = await getPublicSiteData();
  const incubatees = Array.isArray(siteData.incubatees) ? siteData.incubatees : [];
  await updateSection("incubatees", [profile, ...incubatees]);

  sendIncubateeProfileEmails(profile).catch((error) => {
    console.error("[mail] Error sending incubatee profile emails", error);
  });

  return profile;
};

export const createHomepageTestimonial = async (payload) => {
  const testimonial = {
    id: randomUUID(),
    name: String(payload?.name || "").trim(),
    role: String(payload?.role || "").trim(),
    quote: String(payload?.quote || "").trim(),
    featuredOnHome: false,
    submittedAt: new Date().toISOString(),
    source: "visitor"
  };

  const siteData = await getPublicSiteData();
  const homepage = siteData?.homepage && typeof siteData.homepage === "object" ? siteData.homepage : {};
  const testimonials = Array.isArray(homepage.testimonials) ? homepage.testimonials : [];

  await updateSection("homepage", {
    ...homepage,
    testimonials: [testimonial, ...testimonials]
  });

  return testimonial;
};

export const getSubmissions = async () => {
  const documents = await getSubmissionsCollection().find({}).sort({ submittedAt: -1 }).toArray();

  const initial = {
    apply: [],
    membership: [],
    enquiry: []
  };

  return (Array.isArray(documents) ? documents : []).reduce((grouped, document) => {
    if (!document || typeof document !== "object") {
      return grouped;
    }

    const { _id, type, ...submission } = document;
    const bucketKey = submissionTypes.has(normalizeSubmissionType(type)) ? normalizeSubmissionType(type) : "apply";

    if (!Array.isArray(grouped[bucketKey])) {
      grouped[bucketKey] = [];
    }

    grouped[bucketKey].push(submission);
    return grouped;
  }, initial);
};

export const deleteSubmission = async (type, id) => {
  const normalizedType = normalizeSubmissionType(type);

  if (!submissionTypes.has(normalizedType)) {
    const error = new Error(`Unsupported submission type "${type}".`);
    error.statusCode = 400;
    throw error;
  }

  await getSubmissionsCollection().deleteOne({
    id,
    type: {
      $in: normalizedType === "enquiry" ? ["enquiry", "incubatee", "intern"] : [normalizedType]
    }
  });
  return getSubmissions();
};
