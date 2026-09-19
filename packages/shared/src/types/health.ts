export type DatabaseStatus = "connected" | "disconnected" | "not_configured" | "connecting";

export interface DatabaseHealth {
  status: DatabaseStatus;
  details?: string;
}

export interface HealthResponse {
  status: "ok" | "error";
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  database: DatabaseHealth;
  environment: string;
}
