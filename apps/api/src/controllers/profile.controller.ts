import { Request, Response } from "express";
import { getSupabaseAdmin } from "../config/supabase";
import { CitizenProfile, CreateProfileDto, UpdateProfileDto } from "@adhikaar/shared";

/**
 * GET /profile
 * Retrieves the profile of the authenticated user.
 * Returns { profile: null } cleanly if no profile has been created yet.
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      },
    });
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.status(500).json({
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database service is not configured.",
      },
    });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      res.status(500).json({
        error: {
          code: "DATABASE_ERROR",
          message: error.message,
        },
      });
      return;
    }

    if (!data) {
      res.status(200).json({
        status: "ok",
        profile: null,
        message: "Profile not found.",
      });
      return;
    }

    res.status(200).json({
      status: "ok",
      profile: data as CitizenProfile,
    });
  } catch (err: unknown) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: err instanceof Error ? err.message : "Failed to fetch profile.",
      },
    });
  }
}

/**
 * POST /profile
 * Creates a new profile for the authenticated user.
 * Ownership is strictly anchored to req.user.id.
 */
export async function createProfile(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      },
    });
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.status(500).json({
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database service is not configured.",
      },
    });
    return;
  }

  const body = req.body as CreateProfileDto;
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Name is required to create a profile.",
      },
    });
    return;
  }

  let parsedAge: number | null = null;
  if (body.age !== undefined && body.age !== null) {
    const num = Number(body.age);
    if (isNaN(num) || num < 0 || num > 130) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Age must be a valid number between 0 and 130.",
        },
      });
      return;
    }
    parsedAge = Math.floor(num);
  }

  try {
    // Check if profile already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (existing) {
      res.status(409).json({
        error: {
          code: "PROFILE_EXISTS",
          message: "Profile already exists for this account. Use PUT to update it.",
        },
      });
      return;
    }

    const newProfile = {
      id: user.id, // Strictly server-derived from JWT
      name,
      state: body.state ? String(body.state).trim() : null,
      district: body.district ? String(body.district).trim() : null,
      age: parsedAge,
      gender: body.gender ? String(body.gender).trim() : null,
      occupation: body.occupation ? String(body.occupation).trim() : null,
      income_band: body.income_band ? String(body.income_band).trim() : null,
      category: body.category ? String(body.category).trim() : null,
      language: body.language ? String(body.language).trim() : null,
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      res.status(500).json({
        error: {
          code: "DATABASE_ERROR",
          message: error.message,
        },
      });
      return;
    }

    res.status(201).json({
      status: "ok",
      profile: data as CitizenProfile,
    });
  } catch (err: unknown) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: err instanceof Error ? err.message : "Failed to create profile.",
      },
    });
  }
}

/**
 * PUT /profile
 * Updates the existing profile for the authenticated user.
 * Ownership is strictly anchored to req.user.id.
 */
export async function updateProfile(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      },
    });
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.status(500).json({
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database service is not configured.",
      },
    });
    return;
  }

  const body = req.body as UpdateProfileDto;
  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const trimmed = typeof body.name === "string" ? body.name.trim() : "";
    if (!trimmed) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Name cannot be empty.",
        },
      });
      return;
    }
    updates.name = trimmed;
  }

  if (body.age !== undefined) {
    if (body.age === null) {
      updates.age = null;
    } else {
      const num = Number(body.age);
      if (isNaN(num) || num < 0 || num > 130) {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Age must be a valid number between 0 and 130.",
          },
        });
        return;
      }
      updates.age = Math.floor(num);
    }
  }

  if (body.state !== undefined) {
    updates.state = body.state ? String(body.state).trim() : null;
  }
  if (body.district !== undefined) {
    updates.district = body.district ? String(body.district).trim() : null;
  }
  if (body.gender !== undefined) {
    updates.gender = body.gender ? String(body.gender).trim() : null;
  }
  if (body.occupation !== undefined) {
    updates.occupation = body.occupation ? String(body.occupation).trim() : null;
  }
  if (body.income_band !== undefined) {
    updates.income_band = body.income_band ? String(body.income_band).trim() : null;
  }
  if (body.category !== undefined) {
    updates.category = body.category ? String(body.category).trim() : null;
  }
  if (body.language !== undefined) {
    updates.language = body.language ? String(body.language).trim() : null;
  }

  try {
    // Verify profile exists first
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existing) {
      res.status(404).json({
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Profile not found. Use POST to create a profile.",
        },
      });
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({
        error: {
          code: "DATABASE_ERROR",
          message: error.message,
        },
      });
      return;
    }

    res.status(200).json({
      status: "ok",
      profile: data as CitizenProfile,
    });
  } catch (err: unknown) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: err instanceof Error ? err.message : "Failed to update profile.",
      },
    });
  }
}
