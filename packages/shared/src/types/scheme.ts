/**
 * Normalized Government Scheme Types for Adhikaar
 * Provider-agnostic contract separating external data sources (CSV, MyScheme API) from application consumers.
 */

export interface StructuredEligibility {
  minAge: number | null;
  maxAge: number | null;
  gender: "all" | "female" | "male";
  caste: string[];
  maxIncome: number | null;
  residence: "both" | "rural" | "urban";
  state: string[];
  disability: boolean;
  bpl: boolean;
}

export interface SchemeSourceMetadata {
  type: "dataset" | "myscheme_api";
  name: string;
  notice: string;
  scrapedAt: string | null;
  lastUpdated: string | null;
}

export interface Scheme {
  id: string; // slug-based unique identifier
  slug: string;
  name: string;
  shortTitle: string;
  description: string;
  ministry: string | null;
  department: string | null;
  state: string; // e.g. "Puducherry", "Central", "Punjab"
  level: "central" | "state";
  category: string[];
  beneficiaryType: string[];
  benefits: string;
  eligibilityText: string;
  applicationProcess: string | null;
  documentsRequired: string | null;
  applyUrl: string | null;
  officialUrl: string | null;
  structuredEligibility: StructuredEligibility;
  source: SchemeSourceMetadata;
}

export interface SchemeSearchQuery {
  keyword?: string;
  state?: string;
  category?: string;
  gender?: "all" | "female" | "male";
  age?: number;
  income?: number;
  disability?: boolean;
  bpl?: boolean;
  student?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SchemeSearchFacets {
  states: string[];
  categories: string[];
}

export interface SchemeSearchResult {
  schemes: Scheme[];
  pagination: PaginationMeta;
  facets: SchemeSearchFacets;
}

export interface SchemeSearchResponse {
  status: "ok";
  data: SchemeSearchResult;
  source: SchemeSourceMetadata;
}

export interface SchemeResponse {
  status: "ok";
  data: Scheme;
  source: SchemeSourceMetadata;
}

/**
 * Citizen inputs for deterministic eligibility evaluation
 */
export interface CitizenEligibilityCriteria {
  age?: number | null;
  gender?: string | null;
  income?: number | null;
  state?: string | null;
  disability?: boolean | null;
  bpl?: boolean | null;
}

export interface EligibilityEvaluationResult {
  isEligible: boolean;
  reasons: string[];
  evaluatedCriteriaCount: number;
}
