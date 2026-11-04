import { Router } from "express";
import multer from "multer";
import { ObjectId } from "mongodb";
import { uploadImageBuffer } from "../config/cloudinary.js";
import { getDatabaseStatus, getMediaBucket, getMediaFilesCollection } from "../config/database.js";
import {
  createHomepageTestimonial,
  createIncubateeProfile,
  createSubmission,
  getPublicSiteData,
  incrementVisitCount
} from "../services/cms-service.js";
import { requireFields, sanitizePayload } from "../utils/validation.js";
import { sendInternRegistrationEmails } from "../services/mailer.js";

const router = Router();
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024
  },
  fileFilter(_request, file, callback) {
    if (!file.mimetype.startsWith("image/")) {
      const error = new Error("Only image uploads are allowed.");
      error.statusCode = 400;
      callback(error);
      return;
    }

    callback(null, true);
  }
});
const incubateeUpload = imageUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 }
]);

router.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "rif-backend",
    database: getDatabaseStatus()
  });
});

router.get("/site", async (_request, response, next) => {
  try {
    const data = await getPublicSiteData();
    response.json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/visits", async (_request, response, next) => {
  try {
    const visitCount = await incrementVisitCount();
    response.json({ visitCount });
  } catch (error) {
    next(error);
  }
});

router.get("/assets/:assetId", async (request, response, next) => {
  try {
    const { assetId } = request.params;

    if (!ObjectId.isValid(assetId)) {
      response.status(404).json({
        message: "Asset not found."
      });
      return;
    }

    const objectId = new ObjectId(assetId);
    const file = await getMediaFilesCollection().findOne({ _id: objectId });

    if (!file) {
      response.status(404).json({
        message: "Asset not found."
      });
      return;
    }

    response.setHeader("Content-Type", file.metadata?.contentType || file.contentType || "application/octet-stream");
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    const stream = getMediaBucket().openDownloadStream(objectId);
    stream.on("error", next);
    stream.pipe(response);
  } catch (error) {
    next(error);
  }
});

router.post("/forms/apply", async (request, response, next) => {
  try {
    const payload = sanitizePayload(request.body);
    requireFields(payload, ["name", "email", "startupName", "stage", "problemStatement"]);
    const entry = await createSubmission("apply", payload);
    response.status(201).json({
      message: "Application submitted successfully.",
      entry
    });
  } catch (error) {
    next(error);
  }
});

router.post("/forms/membership", async (request, response, next) => {
  try {
    const payload = sanitizePayload(request.body);
    requireFields(payload, ["name", "email", "planName", "organization", "engagementGoal"]);
    const entry = await createSubmission("membership", payload);
    response.status(201).json({
      message: "Membership request submitted successfully.",
      entry
    });
  } catch (error) {
    next(error);
  }
});

router.post("/forms/intern", async (request, response, next) => {
  try {
    const payload = sanitizePayload(request.body);
    requireFields(payload, ["name", "email", "phone", "college", "course", "interestArea", "availability", "motivation"]);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      const error = new Error("Please enter a valid email address.");
      error.statusCode = 400;
      throw error;
    }

    const submission = await createSubmission("intern", {
      ...payload,
      topic: "Intern Registration"
    }, { sendEmails: false });
    await sendInternRegistrationEmails(submission);
    response.status(201).json({ message: "Thanks for applying. RIF has received your intern registration and sent you a confirmation email." });
  } catch (error) {
    next(error);
  }
});

const handleEnquirySubmission = async (request, response, next) => {
  try {
    const payload = sanitizePayload(request.body);
    requireFields(payload, ["name", "email", "topic", "message"]);
    const entry = await createSubmission("enquiry", payload);
    response.status(201).json({
      message: "Enquiry submitted successfully.",
      entry
    });
  } catch (error) {
    next(error);
  }
};

const handleIncubateeProfileSubmission = async (request, response, next) => {
  try {
    const payload = sanitizePayload(request.body);
    requireFields(payload, ["name", "sector", "stage", "founder", "location", "summary"]);

    const socialLinks = {
      linkedin: payload.linkedin,
      twitter: payload.twitter,
      youtube: payload.youtube,
      facebook: payload.facebook,
      instagram: payload.instagram
    };

    const cleanedSocialLinks = Object.fromEntries(
      Object.entries(socialLinks).filter(([, value]) => Boolean(value))
    );

    let imageUrl = payload.imageUrl || "";
    let imageAssetId = payload.imageAssetId || "";
    const galleryFiles = request.files?.galleryImages || [];
    const uploadedGalleryUrls = [];
    const textGalleryUrls = String(payload.photoUrls || "")
      .split(/\r?\n|,|;|\s{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);

    for (const file of galleryFiles) {
      const uploadResult = await uploadImageBuffer(file.buffer, {
        filename_override: file.originalname
      });
      uploadedGalleryUrls.push(uploadResult.secure_url);
    }

    const profileImage = request.files?.image?.[0];
    if (profileImage) {
      const uploadResult = await uploadImageBuffer(profileImage.buffer, {
        filename_override: profileImage.originalname
      });
      imageUrl = uploadResult.secure_url;
      imageAssetId = uploadResult.public_id;
    }

    const profile = await createIncubateeProfile({
      ...payload,
      imageUrl,
      imageAssetId,
      socialLinks: cleanedSocialLinks,
      photoUrls: [...uploadedGalleryUrls, ...textGalleryUrls]
    });

    response.status(201).json({
      message: "Incubatee profile submitted successfully.",
      entry: profile
    });
  } catch (error) {
    next(error);
  }
};

const handleIncubateeSubmission = async (request, response, next) => {
  try {
    const payload = sanitizePayload(request.body);
    const hasProfileShape =
      Boolean(payload.name && payload.sector && payload.stage && payload.founder && payload.location && payload.summary) ||
      Boolean(payload.description || payload.establishmentYear || payload.objectives || payload.directors);

    if (hasProfileShape) {
      await handleIncubateeProfileSubmission(request, response, next);
      return;
    }

    requireFields(payload, ["name", "email", "topic", "message"]);
    const entry = await createSubmission("incubatee", payload);
    response.status(201).json({
      message: "Incubatee request submitted successfully.",
      entry
    });
  } catch (error) {
    next(error);
  }
};

router.post("/forms/enquiry", handleEnquirySubmission);
router.post("/forms/incubatee", incubateeUpload, handleIncubateeSubmission);
router.post("/forms/incubatee-profile", incubateeUpload, handleIncubateeProfileSubmission);

router.post("/forms/testimonial", async (request, response, next) => {
  try {
    const payload = sanitizePayload(request.body);
    requireFields(payload, ["name", "quote"]);
    const entry = await createHomepageTestimonial(payload);
    response.status(201).json({
      message: "Testimonial submitted successfully.",
      entry
    });
  } catch (error) {
    next(error);
  }
});

export default router;
