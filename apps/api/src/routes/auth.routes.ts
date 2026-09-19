import { Router } from "express";
import { getMe } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Protected profile endpoint
router.get("/auth/me", requireAuth, getMe);

export default router;
