import { Router } from "express";
import { searchSchemes, getSchemeById } from "../controllers/scheme.controller";
import { API_ROUTES } from "@adhikaar/shared";

const router = Router();

/**
 * GET /schemes/search — keyword + filter search with pagination
 * GET /schemes/:id    — single scheme by id/slug, optional eligibility evaluation
 */
router.get(API_ROUTES.SCHEMES_SEARCH, searchSchemes);
router.get(`${API_ROUTES.SCHEMES}/:id`, getSchemeById);

export default router;
