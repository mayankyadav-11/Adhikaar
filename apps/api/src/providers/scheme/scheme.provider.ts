import { Scheme, SchemeSearchQuery, SchemeSearchResult } from "@adhikaar/shared";

/**
 * Pluggable Scheme Provider Interface
 * Allows seamless substitution of local dataset with official MyScheme API in future milestones.
 */
export interface SchemeProvider {
  /**
   * Searches schemes matching keyword, filters, and pagination.
   */
  searchSchemes(query: SchemeSearchQuery): Promise<SchemeSearchResult>;

  /**
   * Retrieves a single normalized scheme by unique ID or slug.
   */
  getSchemeById(idOrSlug: string): Promise<Scheme | null>;
}
