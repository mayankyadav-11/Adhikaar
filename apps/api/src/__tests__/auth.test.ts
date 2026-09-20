import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import * as supabaseConfig from "../config/supabase";

describe("Auth Endpoints & Middleware", () => {
  const app = createApp();

  it("should reject unauthenticated request to /auth/me with 401 UNAUTHORIZED", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("should reject invalid Bearer token with 401 INVALID_TOKEN", async () => {
    // Mock getSupabaseAdmin to return an auth client that reports an invalid token
    vi.spyOn(supabaseConfig, "getSupabaseAdmin").mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "Invalid JWT signature" },
        }),
      },
    } as unknown as ReturnType<typeof supabaseConfig.getSupabaseAdmin>);

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer invalid-or-expired-token");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_TOKEN");
  });

  it("should accept valid token and return user profile details", async () => {
    const mockUser = {
      id: "usr_test_123",
      email: "citizen@adhikaar.gov.in",
      user_metadata: { full_name: "Aadhaar Citizen" },
      app_metadata: { provider: "email" },
      created_at: "2026-01-01T00:00:00Z",
    };

    vi.spyOn(supabaseConfig, "getSupabaseAdmin").mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as unknown as ReturnType<typeof supabaseConfig.getSupabaseAdmin>);

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer valid-jwt-token");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body.user).toHaveProperty("id", "usr_test_123");
    expect(response.body.user).toHaveProperty("email", "citizen@adhikaar.gov.in");
    expect(response.body.user).toHaveProperty("fullName", "Aadhaar Citizen");
  });
});
