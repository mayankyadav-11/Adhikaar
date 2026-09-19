import { HealthResponse } from "@adhikaar/shared";
import { env } from "../config/env";
import { getDbHealth } from "../config/db";

export function getHealthStatus(): HealthResponse {
  return {
    status: "ok",
    service: env.SERVICE_NAME,
    version: env.VERSION,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: getDbHealth(),
    environment: env.NODE_ENV,
  };
}
