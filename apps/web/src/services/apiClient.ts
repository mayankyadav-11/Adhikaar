import { HealthResponse, API_ROUTES } from "@adhikaar/shared";

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
}

export const apiClient = new ApiClient();
