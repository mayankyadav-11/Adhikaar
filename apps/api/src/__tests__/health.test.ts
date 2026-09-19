import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app";

describe("GET /health", () => {
  const app = createApp();

  it("should return status 200 with service information and ok status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("service", "adhikaar-api");
    expect(response.body).toHaveProperty("version");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("uptimeSeconds");
    expect(response.body).toHaveProperty("database");
    expect(response.body.database).toHaveProperty("status");
    expect(["connected", "disconnected", "not_configured", "connecting"]).toContain(
      response.body.database.status
    );
  });

  it("should return 404 for unknown endpoints", async () => {
    const response = await request(app).get("/non-existent-route");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
