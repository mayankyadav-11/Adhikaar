import dotenv from "dotenv";
import path from "path";

// Load .env from workspace or monorepo root if available
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  MONGODB_URI: process.env.MONGODB_URI || "",
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || "",
  SERVICE_NAME: "adhikaar-api",
  VERSION: "0.1.0",
} as const;
