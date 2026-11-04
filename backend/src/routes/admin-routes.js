import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/auth-middleware.js";
import { uploadImageBuffer } from "../config/cloudinary.js";
import { deleteSubmission, getAdminData, getSubmissions, updateSection } from "../services/cms-service.js";
import { Readable } from "node:stream";
import { getAuditLogsCollection, getMediaBucket, getTeamUsersCollection } from "../config/database.js";
import { hashPassword } from "../utils/password.js";
import { randomBytes, randomUUID } from "node:crypto";
import { collectChanges } from "../utils/audit.js";

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

const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024
  },
  fileFilter(_request, file, callback) {
    const fileName = file.originalname.toLowerCase();
    const isPdf = file.mimetype === "application/pdf" || fileName.endsWith(".pdf");
    const isDocx =
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx");

    if (!isPdf && !isDocx) {
      const error = new Error("Only PDF and DOCX uploads are allowed.");
      error.statusCode = 400;
      callback(error);
      return;
    }

    callback(null, true);
  }
});

router.use(requireAdmin);

const teamPermissions = [
  { id: "overview", label: "Overview" },
  { id: "site-settings", label: "Site Settings" }, { id: "page-visibility", label: "Page Visibility" },
  { id: "page-hero-panels", label: "Hero Panels" }, { id: "homepage", label: "Homepage" },
  { id: "about", label: "About" }, { id: "gallery", label: "Gallery" }, { id: "team", label: "Leadership & Team" },
  { id: "incubatees", label: "Incubatees" }, { id: "virtual-startups", label: "Virtual Startups" },
  { id: "mentors", label: "Mentors" }, { id: "services", label: "Services" }, { id: "membership", label: "Membership" },
  { id: "rif-services", label: "RIF Services" }, { id: "legal-pages", label: "Legal Pages" },
  { id: "news-events", label: "News & Events" }, { id: "forms", label: "Forms" }, { id: "submissions", label: "Submissions" },
  { id: "uploads", label: "File Uploads" }
];

const makeTemporaryPassword = () => randomBytes(12).toString("base64url");
const audit = async (request, action, target, details = {}) => {
  await getAuditLogsCollection().insertOne({ id: randomUUID(), actorId: request.user.userId, actor: request.user.sub, action, target, details, createdAt: new Date().toISOString() });
};

router.get("/team-permissions", (_request, response) => response.json(teamPermissions));

router.get("/team-users", async (_request, response, next) => {
  try {
    const users = await getTeamUsersCollection().find({}, { projection: { passwordHash: 0, _id: 0 } }).sort({ createdAt: -1 }).toArray();
    response.json(users);
  } catch (error) { next(error); }
});

router.post("/team-users", async (request, response, next) => {
  try {
    const { name = "", email = "", permissions = [] } = request.body || {};
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail || !normalizedEmail.includes("@")) { response.status(400).json({ message: "Name and valid email are required." }); return; }
    const existing = await getTeamUsersCollection().findOne({ username: normalizedEmail });
    if (existing) { response.status(409).json({ message: "A team user with this email already exists." }); return; }
    const temporaryPassword = makeTemporaryPassword();
    const user = { id: randomUUID(), username: normalizedEmail, name: name.trim(), email: normalizedEmail, passwordHash: hashPassword(temporaryPassword), permissions: [...new Set(permissions)], active: true, mustChangePassword: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await getTeamUsersCollection().insertOne(user);
    await audit(request, "team_user_created", user.id, { name: user.name, email: user.email, permissions: user.permissions });
    response.status(201).json({ user: { ...user, passwordHash: undefined }, temporaryPassword });
  } catch (error) { next(error); }
});

router.patch("/team-users/:id", async (request, response, next) => {
  try {
    const permissions = [...new Set(Array.isArray(request.body?.permissions) ? request.body.permissions : [])];
    const allowedPermissions = new Set(teamPermissions.map((permission) => permission.id));
    if (permissions.some((permission) => !allowedPermissions.has(permission))) { response.status(400).json({ message: "Invalid team permission." }); return; }
    const existing = await getTeamUsersCollection().findOne({ id: request.params.id });
    if (!existing) { response.status(404).json({ message: "Team user not found." }); return; }
    await getTeamUsersCollection().updateOne({ id: request.params.id }, { $set: { permissions, updatedAt: new Date().toISOString() } });
    await audit(request, "team_permissions_updated", request.params.id, { changes: collectChanges(existing.permissions || [], permissions) });
    response.json({ message: "Team permissions updated.", permissions });
  } catch (error) { next(error); }
});

router.post("/team-users/:id/reset-password", async (request, response, next) => {
  try {
    const temporaryPassword = makeTemporaryPassword();
    const result = await getTeamUsersCollection().updateOne({ id: request.params.id }, { $set: { passwordHash: hashPassword(temporaryPassword), mustChangePassword: true, updatedAt: new Date().toISOString() } });
    if (!result.matchedCount) { response.status(404).json({ message: "Team user not found." }); return; }
    await audit(request, "team_user_password_reset", request.params.id);
    response.json({ temporaryPassword });
  } catch (error) { next(error); }
});

router.delete("/team-users/:id", async (request, response, next) => {
  try {
    const result = await getTeamUsersCollection().deleteOne({ id: request.params.id });
    if (!result.deletedCount) { response.status(404).json({ message: "Team user not found." }); return; }
    await audit(request, "team_user_deleted", request.params.id);
    response.json({ message: "Team user deleted." });
  } catch (error) { next(error); }
});

router.get("/audit-logs", async (_request, response, next) => {
  try { response.json(await getAuditLogsCollection().find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(300).toArray()); } catch (error) { next(error); }
});

const handleAssetUpload = async (request, response, next, options) => {
  try {
    if (!request.file) {
      response.status(400).json({
        message: options.requiredMessage
      });
      return;
    }

    const uploadStream = getMediaBucket().openUploadStream(request.file.originalname, {
      contentType: request.file.mimetype,
      metadata: {
        contentType: request.file.mimetype,
        uploadedBy: request.user?.sub || "admin",
        uploadedAt: new Date().toISOString(),
        purpose: options.purpose
      }
    });

    await new Promise((resolve, reject) => {
      Readable.from(request.file.buffer)
        .pipe(uploadStream)
        .on("error", reject)
        .on("finish", resolve);
    });

    response.status(201).json({
      assetId: uploadStream.id.toString(),
      [options.urlKey]: `/api/assets/${uploadStream.id.toString()}`,
      filename: request.file.originalname
    });
    await audit(request, "asset_uploaded", options.purpose, { filename: request.file.originalname });
  } catch (error) {
    next(error);
  }
};

const handleImageUpload = async (request, response, next) => {
  try {
    if (!request.file) {
      response.status(400).json({ message: "Image file is required." });
      return;
    }

    const result = await uploadImageBuffer(request.file.buffer, {
      filename_override: request.file.originalname
    });

    response.status(201).json({
      assetId: result.public_id,
      imageUrl: result.secure_url,
      filename: request.file.originalname
    });
    await audit(request, "asset_uploaded", "image", { filename: request.file.originalname });
  } catch (error) {
    next(error);
  }
};

const handleDocumentUpload = async (request, response, next) =>
  handleAssetUpload(request, response, next, {
    purpose: "document",
    requiredMessage: "Document file is required.",
    urlKey: "documentUrl"
  });

router.get("/content", async (_request, response, next) => {
  try {
    const data = await getAdminData();
    response.json(data);
  } catch (error) {
    next(error);
  }
});

router.put("/content/:section", async (request, response, next) => {
  try {
    const before = await getAdminData();
    const updated = await updateSection(request.params.section, request.body?.value);
    await audit(request, "content_updated", request.params.section, { section: request.params.section, changes: collectChanges(before?.[request.params.section], updated) });
    response.json({
      message: `${request.params.section} updated successfully.`,
      value: updated
    });
  } catch (error) {
    next(error);
  }
});

router.get("/submissions", async (_request, response, next) => {
  try {
    const submissions = await getSubmissions();
    response.json(submissions);
  } catch (error) {
    next(error);
  }
});

router.delete("/submissions/:type/:id", async (request, response, next) => {
  try {
    const submissions = await deleteSubmission(request.params.type, request.params.id);
    response.json({
      message: "Submission deleted successfully.",
      submissions
    });
    await audit(request, "submission_deleted", `${request.params.type}/${request.params.id}`);
  } catch (error) {
    next(error);
  }
});

router.post("/uploads/image", imageUpload.single("image"), handleImageUpload);
router.post("/uploads/gallery-image", imageUpload.single("image"), handleImageUpload);
router.post("/uploads/document", documentUpload.single("document"), handleDocumentUpload);

export default router;
