import { Request, Response } from "express";
import { getSchemeProvider, evaluateEligibility } from "../providers/scheme/local-dataset.provider";
import { SchemeSearchQuery, CitizenEligibilityCriteria } from "@adhikaar/shared";

/**
 * GET /schemes/search
 * Query params: keyword, state, category, gender, age, income, disability, bpl, student, page, limit
 */
export async function searchSchemes(req: Request, res: Response): Promise<void> {
  try {
    const provider = getSchemeProvider();

    const query: SchemeSearchQuery = {
      keyword: req.query.keyword as string | undefined,
      state: req.query.state as string | undefined,
      category: req.query.category as string | undefined,
      gender: req.query.gender as "all" | "female" | "male" | undefined,
      age: req.query.age ? Number(req.query.age) : undefined,
      income: req.query.income ? Number(req.query.income) : undefined,
      disability: req.query.disability === "true" ? true : undefined,
      bpl: req.query.bpl === "true" ? true : undefined,
      student: req.query.student === "true" ? true : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    const result = await provider.searchSchemes(query);

    res.json({
      status: "ok",
      data: result,
      source: {
        type: "dataset",
        name: "Indian Government Schemes Dataset",
        notice:
          "Development dataset. Official scheme terms are subject to change by respective ministries.",
        scrapedAt: null,
        lastUpdated: null,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to search schemes.";
    res.status(500).json({ error: { code: "SCHEME_SEARCH_ERROR", message } });
  }
}

/**
 * GET /schemes/:id
 * Retrieves a single scheme by ID or slug.
 * Optional query: ?age=&gender=&income=&state=&disability=&bpl= for eligibility evaluation.
 */
export async function getSchemeById(req: Request, res: Response): Promise<void> {
  try {
    const provider = getSchemeProvider();
    const { id } = req.params;

    const scheme = await provider.getSchemeById(id);

    if (!scheme) {
      res.status(404).json({
        error: {
          code: "SCHEME_NOT_FOUND",
          message: `No scheme found with id or slug: ${id}`,
        },
      });
      return;
    }

    // Optional: evaluate eligibility if citizen criteria provided
    let eligibility = null;
    const hasEligCriteria =
      req.query.age ||
      req.query.gender ||
      req.query.income ||
      req.query.state ||
      req.query.disability ||
      req.query.bpl;

    if (hasEligCriteria) {
      const citizen: CitizenEligibilityCriteria = {
        age: req.query.age ? Number(req.query.age) : undefined,
        gender: (req.query.gender as string) || undefined,
        income: req.query.income ? Number(req.query.income) : undefined,
        state: (req.query.state as string) || undefined,
        disability: req.query.disability !== undefined ? req.query.disability === "true" : undefined,
        bpl: req.query.bpl !== undefined ? req.query.bpl === "true" : undefined,
      };
      eligibility = evaluateEligibility(scheme, citizen);
    }

    res.json({
      status: "ok",
      data: scheme,
      eligibility,
      source: scheme.source,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve scheme.";
    res.status(500).json({ error: { code: "SCHEME_FETCH_ERROR", message } });
  }
}
