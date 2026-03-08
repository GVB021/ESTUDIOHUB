import type { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../replit_integrations/auth/replitAuth";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

export interface AuthUser {
  id: string;
  email: string | null;
  role: string;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      dbUser?: AuthUser;
      studioRole?: string;
      studioRoles?: string[];
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const sessionUser = req.user as any;
  const userId = sessionUser?.claims?.sub;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [dbUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!dbUser) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      status: dbUser.status,
    };

    next();
  } catch (err) {
    logger.error("Auth middleware error", { error: String(err) });
    res.status(500).json({ message: "Internal error" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as AuthUser;
  if (user?.role !== "platform_owner") {
    logger.warn("Unauthorized admin access attempt", { userId: user?.id, path: req.path });
    return res.status(403).json({ message: "Forbidden: platform_owner role required" });
  }
  next();
}

export const ROLE_HIERARCHY: Record<string, number> = {
  platform_owner: 100,
  studio_admin: 80,
  diretor: 60,
  engenheiro_audio: 40,
  dublador: 20,
};

export function getHighestRole(roles: string[]): string {
  let highest = roles[0] || "";
  let highestLevel = ROLE_HIERARCHY[highest] ?? 0;
  for (const r of roles) {
    const level = ROLE_HIERARCHY[r] ?? 0;
    if (level > highestLevel) {
      highest = r;
      highestLevel = level;
    }
  }
  return highest;
}

export async function requireStudioAccess(req: Request, res: Response, next: NextFunction) {
  const studioId = req.params.studioId || req.body?.studioId;
  if (!studioId) return next();

  const user = (req as any).user as AuthUser;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (user.role === "platform_owner") {
    req.studioRole = "platform_owner";
    req.studioRoles = ["platform_owner"];
    return next();
  }

  try {
    const { storage } = await import("../storage");
    const roles = await storage.getUserRolesInStudio(user.id, studioId);
    if (roles.length === 0) {
      logger.warn("Unauthorized studio access attempt", { userId: user.id, studioId });
      return res.status(403).json({ message: "You do not have access to this studio" });
    }
    req.studioRoles = roles;
    req.studioRole = getHighestRole(roles);
    next();
  } catch (err) {
    logger.error("Studio access check failed", { error: String(err) });
    res.status(500).json({ message: "Internal error checking studio access" });
  }
}

export function requireStudioRole(...allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const studioId = req.params.studioId || req.body?.studioId;
    if (!studioId) return next();

    const user = (req as any).user as AuthUser;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.role === "platform_owner") {
      req.studioRole = "platform_owner";
      req.studioRoles = ["platform_owner"];
      return next();
    }

    try {
      const { storage } = await import("../storage");
      const roles = await storage.getUserRolesInStudio(user.id, studioId);
      if (roles.length === 0) {
        return res.status(403).json({ message: "Voce nao tem acesso a este estudio" });
      }

      const hasPermission = roles.some(r => allowedRoles.includes(r));
      if (!hasPermission) {
        return res.status(403).json({ message: "Voce nao tem permissao para esta acao" });
      }

      req.studioRoles = roles;
      req.studioRole = getHighestRole(roles);
      next();
    } catch (err) {
      logger.error("Studio role check failed", { error: String(err) });
      res.status(500).json({ message: "Erro interno ao verificar permissoes" });
    }
  };
}
