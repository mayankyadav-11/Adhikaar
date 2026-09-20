import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../controllers/profile.controller";

const router = Router();

// Protected profile routes
router.get("/profile", requireAuth, getProfile);
router.post("/profile", requireAuth, createProfile);
router.put("/profile", requireAuth, updateProfile);

export default router;
