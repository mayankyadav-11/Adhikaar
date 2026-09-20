import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import * as supabaseConfig from "../config/supabase";

describe("Profile API Endpoints", () => {
  const app = createApp();

  const mockUser = {
    id: "usr_profile_123",
    email: "citizen@adhikaar.gov.in",
    user_metadata: { full_name: "Aadhaar Citizen" },
    app_metadata: { provider: "email" },
    created_at: "2026-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Authentication Guard", () => {
    it("should reject unauthenticated GET /profile with 401", async () => {
      const response = await request(app).get("/profile");
      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });

    it("should reject unauthenticated POST /profile with 401", async () => {
      const response = await request(app)
        .post("/profile")
        .send({ name: "Citizen" });
      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });

    it("should reject unauthenticated PUT /profile with 401", async () => {
      const response = await request(app)
        .put("/profile")
        .send({ name: "Citizen Updated" });
      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });
  });

  describe("GET /profile", () => {
    it("should return clean profile: null when user has no saved profile yet", async () => {
      // Mock auth + supabase query
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn().mockReturnValue({
          select: mockSelect,
          eq: mockEq,
          maybeSingle: mockMaybeSingle,
        }),
      };

      vi.spyOn(supabaseConfig, "getSupabaseAdmin").mockReturnValue(
        mockSupabase as unknown as ReturnType<typeof supabaseConfig.getSupabaseAdmin>
      );

      const response = await request(app)
        .get("/profile")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "ok",
        profile: null,
        message: "Profile not found.",
      });
      expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
      expect(mockEq).toHaveBeenCalledWith("id", mockUser.id);
    });

    it("should return saved profile when profile exists", async () => {
      const mockProfileData = {
        id: mockUser.id,
        name: "Aadhaar Citizen",
        state: "Punjab",
        district: "Ludhiana",
        age: 34,
        gender: "Female",
        occupation: "Farmer",
        income_band: "Below ₹1,00,000 / year (Antyodaya / BPL)",
        category: "General",
        language: "Punjabi (ਪੰਜਾਬੀ)",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: mockProfileData, error: null }),
        }),
      };

      vi.spyOn(supabaseConfig, "getSupabaseAdmin").mockReturnValue(
        mockSupabase as unknown as ReturnType<typeof supabaseConfig.getSupabaseAdmin>
      );

      const response = await request(app)
        .get("/profile")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
      expect(response.body.profile).toEqual(mockProfileData);
    });
  });

  describe("POST /profile", () => {
    it("should reject missing name with 400 VALIDATION_ERROR", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      };

      vi.spyOn(supabaseConfig, "getSupabaseAdmin").mockReturnValue(
        mockSupabase as unknown as ReturnType<typeof supabaseConfig.getSupabaseAdmin>
      );

      const response = await request(app)
        .post("/profile")
        .set("Authorization", "Bearer valid-token")
        .send({ state: "Punjab" });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should reject creation if profile already exists with 409 PROFILE_EXISTS", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: { id: mockUser.id }, error: null }),
        }),
      };

      vi.spyOn(supabaseConfig, "getSupabaseAdmin").mockReturnValue(
        mockSupabase as unknown as ReturnType<typeof supabaseConfig.getSupabaseAdmin>
      );

      const response = await request(app)
        .post("/profile")
        .set("Authorization", "Bearer valid-token")
        .send({ name: "Duplicate Citizen" });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe("PROFILE_EXISTS");
    });

    it("should successfully create profile and enforce user id from auth token", async () => {
      const createdRow = {
        id: mockUser.id,
        name: "New Citizen",
        state: "Maharashtra",
        district: "Pune",
        age: 28,
        gender: "Male",
        occupation: "Student",
        income_band: "₹1,00,000 – ₹2,50,000 / year",
        category: "OBC",
        language: "Marathi (मराठी)",
        created_at: "2026-09-20T00:00:00Z",
        updated_at: "2026-09-20T00:00:00Z",
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: createdRow, error: null });

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "profiles") {
            return {
              // for existence check:
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
              // for insert:
              insert: mockInsert.mockReturnValue({
                select: mockSelect.mockReturnValue({
                  single: mockSingle,
                }),
              }),
            };
          }
          return {};
        }),
      };

      vi.spyOn(supabaseConfig, "getSupabaseAdmin").mockReturnValue(
        mockSupabase as unknown as ReturnType<typeof supabaseConfig.getSupabaseAdmin>
      );

      const response = await request(app)
        .post("/profile")
        .set("Authorization", "Bearer valid-token")
        .send({
          id: "malicious_spoofed_id", // Should be ignored
          name: "New Citizen",
          state: "Maharashtra",
          district: "Pune",
          age: 28,
          gender: "Male",
          occupation: "Student",
          income_band: "₹1,00,000 – ₹2,50,000 / year",
          category: "OBC",
          language: "Marathi (मराठी)",
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("ok");
      expect(response.body.profile.id).toBe(mockUser.id);
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUser.id, // Strictly authentic user ID
          name: "New Citizen",
        })
      );
    });
  });

  describe("PUT /profile", () => {
    it("should return 404 PROFILE_NOT_FOUND if profile does not exist", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      };

      vi.spyOn(supabaseConfig, "getSupabaseAdmin").mockReturnValue(
        mockSupabase as unknown as ReturnType<typeof supabaseConfig.getSupabaseAdmin>
      );

      const response = await request(app)
        .put("/profile")
        .set("Authorization", "Bearer valid-token")
        .send({ state: "Delhi (NCT)" });

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe("PROFILE_NOT_FOUND");
    });

    it("should successfully update profile fields for the authenticated user", async () => {
      const updatedRow = {
        id: mockUser.id,
        name: "Updated Name",
        state: "Delhi (NCT)",
        district: "South Delhi",
        age: 35,
        gender: "Female",
        occupation: "Lawyer",
        income_band: "Above ₹8,00,000 / year",
        category: "General",
        language: "Hindi (हिंदी)",
        created_at: "2026-09-20T00:00:00Z",
        updated_at: "2026-09-20T00:00:00Z",
      };

      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: updatedRow, error: null });

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: { id: mockUser.id }, error: null }),
            }),
          }),
          update: mockUpdate.mockReturnValue({
            eq: mockEq.mockReturnValue({
              select: mockSelect.mockReturnValue({
                single: mockSingle,
              }),
            }),
          }),
        })),
      };

      vi.spyOn(supabaseConfig, "getSupabaseAdmin").mockReturnValue(
        mockSupabase as unknown as ReturnType<typeof supabaseConfig.getSupabaseAdmin>
      );

      const response = await request(app)
        .put("/profile")
        .set("Authorization", "Bearer valid-token")
        .send({
          name: "Updated Name",
          state: "Delhi (NCT)",
          district: "South Delhi",
          age: 35,
          gender: "Female",
          occupation: "Lawyer",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
      expect(response.body.profile.name).toBe("Updated Name");
      expect(mockEq).toHaveBeenCalledWith("id", mockUser.id);
    });
  });
});
