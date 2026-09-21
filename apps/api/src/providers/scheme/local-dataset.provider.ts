import fs from "fs";
import path from "path";
import {
  Scheme,
  SchemeSearchQuery,
  SchemeSearchResult,
} from "@adhikaar/shared";
import { SchemeProvider } from "./scheme.provider";

// Re-export the pure eligibility evaluator (defined in @adhikaar/shared, safe in browser + API)
export { evaluateEligibility } from "@adhikaar/shared";
export type { DetailedEligibilityResult, CriterionResult } from "@adhikaar/shared";

/**
 * Custom error thrown when Schemes.csv dataset is not present.
 */
export class DatasetNotFoundError extends Error {
  constructor(datasetPath: string) {
    super(`Scheme dataset not found at expected location: ${datasetPath}`);
    this.name = "DatasetNotFoundError";
  }
}

/**
 * Standard RFC 4180 compliant CSV parser supporting multiline quoted strings.
 */
function parseRFC4180CSV(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        field += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\r") {
        // ignore carriage return
      } else if (char === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
  }

  if (row.length > 0 || field.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * Helper to parse nullable or raw text
 */
function cleanText(val: string | undefined): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed === "" || trimmed.toLowerCase() === "null") return null;
  return trimmed;
}

/**
 * Helper to safely parse JSON arrays from CSV
 */
function parseJsonArray(val: string | undefined): string[] {
  if (!val) return [];
  const cleaned = val.trim();
  if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Fallback
    }
  }
  return [];
}

/**
 * Resolves the absolute path to data/Schemes.csv across local execution contexts.
 */
export function resolveDatasetPath(customPath?: string): string {
  if (customPath) return customPath;

  const searchLocations = [
    path.resolve(process.cwd(), "data/Schemes.csv"),
    path.resolve(process.cwd(), "../../data/Schemes.csv"),
    path.resolve(__dirname, "../../../../data/Schemes.csv"),
    path.resolve(__dirname, "../../../../../data/Schemes.csv"),
  ];

  for (const candidate of searchLocations) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return path.resolve(process.cwd(), "data/Schemes.csv");
}

/**
 * Local Dataset Scheme Provider
 * Reads and serves government schemes directly from data/Schemes.csv.
 */
export class LocalDatasetSchemeProvider implements SchemeProvider {
  private datasetPath: string;
  private schemes: Scheme[] = [];
  private schemeMap: Map<string, Scheme> = new Map();
  private availableStates: string[] = [];
  private availableCategories: string[] = [];
  private isLoaded = false;

  constructor(datasetPath?: string) {
    this.datasetPath = resolveDatasetPath(datasetPath);
  }

  /**
   * Loads and caches the CSV dataset into memory.
   */
  public ensureLoaded(): void {
    if (this.isLoaded) return;

    if (!fs.existsSync(this.datasetPath)) {
      throw new DatasetNotFoundError(this.datasetPath);
    }

    const rawContent = fs.readFileSync(this.datasetPath, "utf8");
    const rows = parseRFC4180CSV(rawContent);

    if (rows.length < 2) {
      this.isLoaded = true;
      return;
    }

    const header = rows[0].map((h) => h.trim());
    const colMap: Record<string, number> = {};
    header.forEach((h, idx) => {
      colMap[h] = idx;
    });

    const parsedSchemes: Scheme[] = [];
    const map = new Map<string, Scheme>();
    const stateSet = new Set<string>();
    const categorySet = new Set<string>();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const slug = cleanText(row[colMap["slug"]]) || `scheme-${i}`;
      let rawName = cleanText(row[colMap["name"]]) || "Government Scheme";
      // Clean leading/trailing repeated quotes from CSV artifact
      rawName = rawName.replace(/^["'\s]+|["'\s]+$/g, "").trim();

      const stateVal = cleanText(row[colMap["state"]]) || "Central";
      const isCentral = stateVal.toLowerCase() === "central";

      const categoryVal = cleanText(row[colMap["category"]]) || "";
      const categories = categoryVal
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      const beneficiaryVal = cleanText(row[colMap["beneficiary_type"]]) || "";
      const beneficiaries = beneficiaryVal
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);

      const minAgeRaw = cleanText(row[colMap["eligibility_age_min"]]);
      const maxAgeRaw = cleanText(row[colMap["eligibility_age_max"]]);
      const incomeRaw = cleanText(row[colMap["eligibility_income_max"]]);

      const minAge = minAgeRaw ? parseInt(minAgeRaw, 10) : null;
      const maxAge = maxAgeRaw ? parseInt(maxAgeRaw, 10) : null;
      const maxIncome = incomeRaw ? parseFloat(incomeRaw) : null;

      const genderRaw = cleanText(row[colMap["eligibility_gender"]])?.toLowerCase();
      const gender: "all" | "female" | "male" =
        genderRaw === "female" || genderRaw === "male" ? genderRaw : "all";

      const residenceRaw = cleanText(row[colMap["eligibility_residence"]])?.toLowerCase();
      const residence: "both" | "rural" | "urban" =
        residenceRaw === "rural" || residenceRaw === "urban" ? residenceRaw : "both";

      const caste = parseJsonArray(row[colMap["eligibility_caste"]]);
      const eligState = parseJsonArray(row[colMap["eligibility_state"]]);

      const disability = String(row[colMap["eligibility_disability"]]).toLowerCase() === "true";
      const bpl = String(row[colMap["eligibility_bpl"]]).toLowerCase() === "true";

      const scrapedAt = cleanText(row[colMap["scraped_at"]]);

      const scheme: Scheme = {
        id: slug,
        slug,
        name: rawName,
        shortTitle: rawName,
        description: cleanText(row[colMap["description"]]) || "",
        ministry: cleanText(row[colMap["ministry"]]),
        department: cleanText(row[colMap["department"]]),
        state: stateVal,
        level: isCentral ? "central" : "state",
        category: categories,
        beneficiaryType: beneficiaries,
        benefits: cleanText(row[colMap["benefits"]]) || "",
        eligibilityText: cleanText(row[colMap["eligibility_text"]]) || "",
        applicationProcess: cleanText(row[colMap["application_process"]]),
        documentsRequired: cleanText(row[colMap["documents_required"]]),
        applyUrl: cleanText(row[colMap["apply_url"]]),
        officialUrl: cleanText(row[colMap["official_url"]]),
        structuredEligibility: {
          minAge: isNaN(minAge as number) ? null : minAge,
          maxAge: isNaN(maxAge as number) ? null : maxAge,
          gender,
          caste,
          maxIncome: isNaN(maxIncome as number) ? null : maxIncome,
          residence,
          state: eligState,
          disability,
          bpl,
        },
        source: {
          type: "dataset",
          name: "Indian Government Schemes Dataset",
          notice:
            "Development dataset. Official scheme terms are subject to change by respective ministries.",
          scrapedAt,
          lastUpdated: scrapedAt,
        },
      };

      parsedSchemes.push(scheme);
      map.set(slug.toLowerCase(), scheme);

      if (stateVal) stateSet.add(stateVal);
      categories.forEach((cat) => categorySet.add(cat));
    }

    this.schemes = parsedSchemes;
    this.schemeMap = map;
    this.availableStates = Array.from(stateSet).sort();
    this.availableCategories = Array.from(categorySet).sort();
    this.isLoaded = true;
  }

  /**
   * Search schemes with deterministic filtering and pagination.
   */
  public async searchSchemes(query: SchemeSearchQuery = {}): Promise<SchemeSearchResult> {
    this.ensureLoaded();

    let filtered = this.schemes;

    // 1. Keyword search (name, description, benefits, ministry, department, category)
    if (query.keyword && query.keyword.trim() !== "") {
      const kw = query.keyword.trim().toLowerCase();
      filtered = filtered.filter((s) => {
        return (
          s.name.toLowerCase().includes(kw) ||
          s.description.toLowerCase().includes(kw) ||
          s.benefits.toLowerCase().includes(kw) ||
          (s.ministry && s.ministry.toLowerCase().includes(kw)) ||
          (s.department && s.department.toLowerCase().includes(kw)) ||
          s.category.some((c) => c.toLowerCase().includes(kw)) ||
          s.beneficiaryType.some((b) => b.toLowerCase().includes(kw))
        );
      });
    }

    // 2. State filter
    if (query.state && query.state.trim() !== "" && query.state !== "All States & UTs") {
      const stateTarget = query.state.trim().toLowerCase();
      filtered = filtered.filter((s) => {
        return (
          s.state.toLowerCase() === stateTarget ||
          s.state.toLowerCase() === "central" ||
          s.structuredEligibility.state.some((st) => st.toLowerCase() === stateTarget)
        );
      });
    }

    // 3. Category filter
    if (query.category && query.category.trim() !== "" && query.category !== "all") {
      const catTarget = query.category.trim().toLowerCase();
      filtered = filtered.filter((s) => {
        return s.category.some((c) => c.toLowerCase().includes(catTarget));
      });
    }

    // 4. Gender filter
    if (query.gender && query.gender !== "all") {
      const targetGender = query.gender.toLowerCase();
      filtered = filtered.filter((s) => {
        return s.structuredEligibility.gender === "all" || s.structuredEligibility.gender === targetGender;
      });
    }

    // 5. Age filter
    if (query.age !== undefined && query.age !== null) {
      const citizenAge = Number(query.age);
      filtered = filtered.filter((s) => {
        const min = s.structuredEligibility.minAge;
        const max = s.structuredEligibility.maxAge;
        if (min !== null && citizenAge < min) return false;
        if (max !== null && citizenAge > max) return false;
        return true;
      });
    }

    // 6. Income filter
    if (query.income !== undefined && query.income !== null) {
      const citizenIncome = Number(query.income);
      filtered = filtered.filter((s) => {
        const maxInc = s.structuredEligibility.maxIncome;
        if (maxInc !== null && citizenIncome > maxInc) return false;
        return true;
      });
    }

    // 7. Disability filter
    if (query.disability === true) {
      filtered = filtered.filter((s) => s.structuredEligibility.disability === true);
    }

    // 8. BPL filter
    if (query.bpl === true) {
      filtered = filtered.filter((s) => s.structuredEligibility.bpl === true);
    }

    // 9. Student filter
    if (query.student === true) {
      filtered = filtered.filter((s) => {
        return (
          s.beneficiaryType.some((b) => b.toLowerCase().includes("student")) ||
          s.category.some((c) => c.toLowerCase().includes("education")) ||
          s.name.toLowerCase().includes("scholarship")
        );
      });
    }

    // Pagination
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedSchemes = filtered.slice(startIndex, startIndex + limit);

    return {
      schemes: paginatedSchemes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      facets: {
        states: this.availableStates,
        categories: this.availableCategories,
      },
    };
  }

  /**
   * Retrieves a single normalized scheme by ID or slug.
   */
  public async getSchemeById(idOrSlug: string): Promise<Scheme | null> {
    this.ensureLoaded();
    const cleanId = idOrSlug.trim().toLowerCase();
    return this.schemeMap.get(cleanId) || null;
  }
}

/**
 * Singleton instance of LocalDatasetSchemeProvider for Express API.
 */
let datasetProviderInstance: LocalDatasetSchemeProvider | null = null;

export function getSchemeProvider(): LocalDatasetSchemeProvider {
  if (!datasetProviderInstance) {
    datasetProviderInstance = new LocalDatasetSchemeProvider();
  }
  return datasetProviderInstance;
}

