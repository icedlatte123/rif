import { env } from "../config/env.js";

let transporter = null;
let nodemailerModule = null;

const isEmailConfigured = () =>
  Boolean(env.smtpHost && env.smtpUser && env.smtpPass && env.smtpFrom && env.notifyAdminEmail);

const getTransporter = async () => {
  if (transporter) return transporter;
  if (!isEmailConfigured()) return null;

  if (!nodemailerModule) {
    try {
      nodemailerModule = await import("nodemailer");
    } catch (error) {
      console.warn("[mail] Nodemailer not installed; email sending disabled.", error?.message || error);
      return null;
    }
  }

  transporter = nodemailerModule.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  return transporter;
};

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatValue(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${key}: ${formatValue(nestedValue)}`)
      .join(", ");
  }

  return String(value);
};

const formatLines = (payload = {}) =>
  Object.entries(payload)
    .map(([key, value]) => `${key}: ${formatValue(value)}`)
    .join("\n");

const sendMail = async ({ to, subject, text }) => {
  const tx = await getTransporter();
  if (!tx) {
    console.warn("[mail] Email not sent: SMTP not configured.");
    return false;
  }

  try {
    await tx.sendMail({
      from: env.smtpFrom,
      to,
      subject,
      text
    });
    return true;
  } catch (error) {
    console.error("[mail] Failed to send email", error);
    return false;
  }
};

export const sendSubmissionEmails = async (type, submission) => {
  const tx = await getTransporter();
  if (!tx) return;

  const subjectLabel = {
    apply: "New Apply Submission",
    membership: "New Membership Request",
    enquiry: "New General Enquiry",
    incubatee: "New Incubatee Submission"
  }[type] || "New Website Submission";

  const summary = formatLines(submission);

  await sendMail({
    to: env.notifyAdminEmail,
    subject: subjectLabel,
    text: `A new ${type} form was submitted:\n\n${summary}`
  });

  if (submission.email) {
    await sendMail({
      to: submission.email,
      subject: "We received your submission",
      text:
        `Hi ${submission.name || "there"},\n\n` +
        "Thanks for submitting your form. Our team will review and get back to you.\n\n" +
        "Summary:\n" +
        `${summary}\n\n` +
        "- RIF Team"
    });
  }
};

export const sendInternRegistrationEmails = async (submission) => {
  const tx = await getTransporter();
  if (!tx) {
    const error = new Error("Intern registration email is not configured. Please contact RIF directly.");
    error.statusCode = 503;
    throw error;
  }

  const summary = formatLines(submission);
  const adminSent = await sendMail({
    to: env.notifyAdminEmail,
    subject: "New Intern Registration",
    text: `A new intern registration was submitted:\n\n${summary}`
  });
  const applicantSent = await sendMail({
    to: submission.email,
    subject: "Thank you for applying to intern with RIF",
    text:
      `Hi ${submission.name},\n\n` +
      "Thank you for applying for an internship with the Rohilkhand Incubation Foundation (RIF). " +
      "We have received your application and our team will review it. If your profile is shortlisted, we will contact you using the details you provided.\n\n" +
      "Regards,\nRIF Team"
  });

  if (!adminSent || !applicantSent) {
    const error = new Error("We could not send the registration emails. Please try again or contact RIF directly.");
    error.statusCode = 503;
    throw error;
  }
};

export const sendIncubateeProfileEmails = async (profile) => {
  const tx = await getTransporter();
  if (!tx) return;

  const summary = formatLines(profile);

  await sendMail({
    to: env.notifyAdminEmail,
    subject: "New Incubatee Profile",
    text: `A new incubatee profile was submitted:\n\n${summary}`
  });

  if (profile.email) {
    await sendMail({
      to: profile.email,
      subject: "We received your incubatee profile",
      text:
        `Hi ${profile.name || "there"},\n\n` +
        "Thanks for submitting your incubatee profile. Our team will review it and get back to you.\n\n" +
        "Summary:\n" +
        `${summary}\n\n` +
        "- RIF Team"
    });
  }
};
