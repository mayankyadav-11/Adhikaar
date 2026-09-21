import {
  HealthResponse,
  CitizenProfile,
  CreateProfileDto,
  UpdateProfileDto,
  ProfileResponse,
  API_ROUTES,
  SchemeSearchQuery,
  SchemeSearchResponse,
  SchemeResponse,
} from "@adhikaar/shared";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  /**
   * Fetches health and service status from the Adhikaar Express API.
   */
  async getHealth(): Promise<HealthResponse> {
    const url = `${this.baseUrl}${API_ROUTES.HEALTH}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API health check failed with status: ${response.status}`);
      }

      return (await response.json()) as HealthResponse;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to connect to Adhikaar API");
    }
  }

  /**
   * Fetches the authenticated citizen profile.
   */
  async getProfile(token: string): Promise<ProfileResponse> {
    const url = `${this.baseUrl}${API_ROUTES.PROFILE}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || `Failed to fetch profile (HTTP ${response.status})`);
    }

    return data as ProfileResponse;
  }

  /**
   * Creates a new citizen profile.
   */
  async createProfile(token: string, dto: CreateProfileDto): Promise<CitizenProfile> {
    const url = `${this.baseUrl}${API_ROUTES.PROFILE}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || `Failed to create profile (HTTP ${response.status})`);
    }

    return data.profile as CitizenProfile;
  }

  /**
   * Updates an existing citizen profile.
   */
  async updateProfile(token: string, dto: UpdateProfileDto): Promise<CitizenProfile> {
    const url = `${this.baseUrl}${API_ROUTES.PROFILE}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || `Failed to update profile (HTTP ${response.status})`);
    }

    return data.profile as CitizenProfile;
  }

  /**
   * Searches government schemes with optional keyword + filter criteria.
   * No authentication required — public endpoint.
   */
  async searchSchemes(query: SchemeSearchQuery = {}): Promise<SchemeSearchResponse> {
    const params = new URLSearchParams();
    if (query.keyword) params.set("keyword", query.keyword);
    if (query.state) params.set("state", query.state);
    if (query.category) params.set("category", query.category);
    if (query.gender) params.set("gender", query.gender);
    if (query.age !== undefined) params.set("age", String(query.age));
    if (query.income !== undefined) params.set("income", String(query.income));
    if (query.disability !== undefined) params.set("disability", String(query.disability));
    if (query.bpl !== undefined) params.set("bpl", String(query.bpl));
    if (query.student !== undefined) params.set("student", String(query.student));
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));

    const url = `${this.baseUrl}${API_ROUTES.SCHEMES_SEARCH}?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || `Failed to search schemes (HTTP ${response.status})`);
    }

    return data as SchemeSearchResponse;
  }

  /**
   * Retrieves a single scheme by ID or slug.
   * Optionally evaluates eligibility when citizen criteria are provided.
   */
  async getSchemeById(idOrSlug: string, citizen?: {
    age?: number;
    gender?: string;
    income?: number;
    state?: string;
    disability?: boolean;
    bpl?: boolean;
  }): Promise<SchemeResponse> {
    const params = new URLSearchParams();
    if (citizen?.age !== undefined) params.set("age", String(citizen.age));
    if (citizen?.gender) params.set("gender", citizen.gender);
    if (citizen?.income !== undefined) params.set("income", String(citizen.income));
    if (citizen?.state) params.set("state", citizen.state);
    if (citizen?.disability !== undefined) params.set("disability", String(citizen.disability));
    if (citizen?.bpl !== undefined) params.set("bpl", String(citizen.bpl));

    const qs = params.toString();
    const url = `${this.baseUrl}${API_ROUTES.SCHEMES}/${encodeURIComponent(idOrSlug)}${qs ? `?${qs}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || `Failed to fetch scheme (HTTP ${response.status})`);
    }

    return data as SchemeResponse;
  }
}

export const apiClient = new ApiClient();

