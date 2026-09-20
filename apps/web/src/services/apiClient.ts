import {
  HealthResponse,
  CitizenProfile,
  CreateProfileDto,
  UpdateProfileDto,
  ProfileResponse,
  API_ROUTES,
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
}

export const apiClient = new ApiClient();

