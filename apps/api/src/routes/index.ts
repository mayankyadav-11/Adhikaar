import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";

const router = Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(profileRoutes);

export default router;

