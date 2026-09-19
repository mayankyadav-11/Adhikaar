import { Request, Response } from "express";

/**
 * Returns current authenticated user details from Supabase token.
 */
export function getMe(req: Request, res: Response): void {
  if (!req.user) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "User context not found.",
      },
    });
    return;
  }

  res.status(200).json({
    status: "ok",
    user: {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.user_metadata?.full_name || null,
      appMetadata: req.user.app_metadata,
      createdAt: req.user.created_at,
    },
  });
}
