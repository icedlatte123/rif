import { Router } from "express";
import { getAdminUsersCollection, getTeamUsersCollection } from "../config/database.js";
import { env } from "../config/env.js";
import { verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/token.js";

const router = Router();

router.post("/login", async (request, response, next) => {
  const { username = "", password = "" } = request.body || {};
  const normalizedUsername = username.trim().toLowerCase();

  try {
    const adminUser = await getAdminUsersCollection().findOne({ username: normalizedUsername });

    if (!adminUser || !verifyPassword(password, adminUser.passwordHash)) {
      response.status(401).json({
        message: "Invalid admin credentials."
      });
      return;
    }

    const token = signToken(
      {
        sub: adminUser.username,
        role: adminUser.role,
        userId: adminUser.id
      },
      env.adminTokenSecret
    );

    response.json({
      token,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/team-login", async (request, response, next) => {
  const { username = "", password = "" } = request.body || {};
  const normalizedUsername = username.trim().toLowerCase();

  try {
    const teamUser = await getTeamUsersCollection().findOne({ username: normalizedUsername, active: { $ne: false } });

    if (!teamUser || !verifyPassword(password, teamUser.passwordHash)) {
      response.status(401).json({ message: "Invalid team credentials." });
      return;
    }

    response.json({
      token: signToken({ sub: teamUser.username, role: "team", userId: teamUser.id, permissions: teamUser.permissions, mustChangePassword: teamUser.mustChangePassword !== false }, env.adminTokenSecret),
      user: { id: teamUser.id, username: teamUser.username, name: teamUser.name, email: teamUser.email, permissions: teamUser.permissions, mustChangePassword: teamUser.mustChangePassword !== false }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
