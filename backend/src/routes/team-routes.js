import { Router } from "express";
import multer from "multer";
import { requireAuth, requireTeamPermission } from "../middleware/auth-middleware.js";
import { deleteSubmission, getAdminData, getSubmissions, updateSection } from "../services/cms-service.js";
import { getAuditLogsCollection, getMediaBucket, getTeamUsersCollection } from "../config/database.js";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { uploadImageBuffer } from "../config/cloudinary.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { collectChanges } from "../utils/audit.js";

const router = Router();
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 6 * 1024 * 1024 }, fileFilter(_request, file, callback) { callback(file.mimetype.startsWith("image/") ? null : new Error("Only image uploads are allowed."), file.mimetype.startsWith("image/")); } });
const documentUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const sectionPermissions = {
  siteSettings: "site-settings", pageVisibility: "page-visibility", pageHeroPanels: "page-hero-panels", homepage: "homepage",
  about: "about", gallery: "gallery", team: "team", incubatees: "incubatees", virtualStartups: "virtual-startups",
  mentors: "mentors", services: "services", membershipPlans: "membership", rifServices: "rif-services", legalPages: "legal-pages",
  news: "news-events", events: "news-events", heroSlider: "homepage", mediaCoverage: "news-events", formsMeta: "forms"
};

router.use(requireAuth);
router.use((request, response, next) => {
  if (request.user.role !== "team") {
    response.status(403).json({ message: "Team access required." });
    return;
  }
  next();
});
router.get("/me", async (request, response, next) => { try { const user = await getTeamUsersCollection().findOne({ id: request.user.userId }, { projection: { passwordHash: 0, _id: 0 } }); response.json({ user: { ...user, permissions: request.user.permissions || user?.permissions || [] } }); } catch (error) { next(error); } });
router.post("/change-password", async (request, response, next) => {
  try {
    const { currentPassword = "", newPassword = "", confirmPassword = "" } = request.body || {};
    const user = await getTeamUsersCollection().findOne({ id: request.user.userId });
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) { response.status(400).json({ message: "Current password is incorrect." }); return; }
    if (newPassword.length < 10) { response.status(400).json({ message: "New password must be at least 10 characters." }); return; }
    if (newPassword !== confirmPassword) { response.status(400).json({ message: "New password and confirmation do not match." }); return; }
    await getTeamUsersCollection().updateOne({ id: user.id }, { $set: { passwordHash: hashPassword(newPassword), mustChangePassword: false, updatedAt: new Date().toISOString() } });
    await getAuditLogsCollection().insertOne({ id: randomUUID(), actorId: request.user.userId, actor: request.user.sub, action: "password_changed", target: user.id, details: { reason: "first_login_or_user_request" }, createdAt: new Date().toISOString() });
    response.json({ message: "Password updated successfully." });
  } catch (error) { next(error); }
});
router.get("/content", async (_request, response, next) => { try { response.json(await getAdminData()); } catch (error) { next(error); } });
router.get("/submissions", (request, response, next) => requireTeamPermission("submissions")(request, response, async () => { try { response.json(await getSubmissions()); } catch (error) { next(error); } }));
router.delete("/submissions/:type/:id", (request, response, next) => requireTeamPermission("submissions")(request, response, async () => { try { const submissions = await deleteSubmission(request.params.type, request.params.id); await getAuditLogsCollection().insertOne({ id: randomUUID(), actorId: request.user.userId, actor: request.user.sub, action: "submission_deleted", target: `${request.params.type}/${request.params.id}`, createdAt: new Date().toISOString() }); response.json({ message: "Submission deleted successfully.", submissions }); } catch (error) { next(error); } }));

router.post("/uploads/image", requireTeamPermission("uploads"), imageUpload.single("image"), async (request, response, next) => { try { if (!request.file) { response.status(400).json({ message: "Image file is required." }); return; } const result = await uploadImageBuffer(request.file.buffer, { filename_override: request.file.originalname }); response.status(201).json({ assetId: result.public_id, imageUrl: result.secure_url, filename: request.file.originalname }); } catch (error) { next(error); } });
router.post("/uploads/document", requireTeamPermission("uploads"), documentUpload.single("document"), async (request, response, next) => { try { if (!request.file) { response.status(400).json({ message: "Document file is required." }); return; } const uploadStream = getMediaBucket().openUploadStream(request.file.originalname, { contentType: request.file.mimetype, metadata: { uploadedBy: request.user.sub, uploadedAt: new Date().toISOString(), purpose: "document" } }); await new Promise((resolve, reject) => Readable.from(request.file.buffer).pipe(uploadStream).on("error", reject).on("finish", resolve)); response.status(201).json({ assetId: uploadStream.id.toString(), documentUrl: `/api/assets/${uploadStream.id.toString()}`, filename: request.file.originalname }); } catch (error) { next(error); } });

router.put("/content/:section", (request, response, next) => {
  const permission = sectionPermissions[request.params.section];
  if (!permission) { response.status(400).json({ message: "This section cannot be edited by a team user." }); return; }
  requireTeamPermission(permission)(request, response, async () => {
    try {
      const before = await getAdminData();
      const updated = await updateSection(request.params.section, request.body?.value);
      await getAuditLogsCollection().insertOne({ id: randomUUID(), actorId: request.user.userId, actor: request.user.sub, action: "content_updated", target: request.params.section, details: { section: request.params.section, changes: collectChanges(before?.[request.params.section], updated) }, createdAt: new Date().toISOString() });
      response.json({ message: `${request.params.section} updated successfully.`, value: updated });
    } catch (error) { next(error); }
  });
});

export default router;
