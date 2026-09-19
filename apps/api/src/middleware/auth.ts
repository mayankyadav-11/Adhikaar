import { Request, Response, NextFunction } from "express";
import { User } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "../config/supabase";

// Extend Express Request interface to include authenticated Supabase user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Authentication middleware for Express.
 * Verifies Bearer JWT sent in Authorization header against Supabase Auth.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication credentials were not provided or are malformed.",
      },
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    res.status(500).json({
      error: {
        code: "AUTH_CONFIG_ERROR",
        message: "Authentication service is not properly configured on this server.",
      },
    });
    return;
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        error: {
          code: "INVALID_TOKEN",
          message: "Token is invalid, expired, or revoked.",
        },
      });
      return;
    }

    req.user = user;
    next();
  } catch (err: unknown) {
    res.status(500).json({
      error: {
        code: "AUTH_VERIFICATION_FAILED",
        message: err instanceof Error ? err.message : "Internal authentication error.",
      },
    });
  }
}
