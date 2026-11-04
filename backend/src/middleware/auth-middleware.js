import { env } from "../config/env.js";
import { verifyToken } from "../utils/token.js";

export const requireAuth = (request, response, next) => {
  const authorization = request.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const payload = verifyToken(token, env.adminTokenSecret);

  if (!payload) {
    response.status(401).json({
      message: "Authentication required."
    });
    return;
  }

  request.user = payload;
  next();
};

export const requireAdmin = (request, response, next) => {
  requireAuth(request, response, () => {
    if (request.user.role !== "admin") {
      response.status(403).json({ message: "Admin access required." });
      return;
    }

    next();
  });
};

export const requireTeamPermission = (permission) => (request, response, next) => {
  requireAuth(request, response, () => {
    if (request.user.role !== "team" || !request.user.permissions?.includes(permission)) {
      response.status(403).json({ message: "You do not have permission for this operation." });
      return;
    }

    next();
  });
};

