import mongoose from "mongoose";
import { env } from "./env";
import { DatabaseStatus, DatabaseHealth } from "@adhikaar/shared";

let dbStatus: DatabaseStatus = "disconnected";
let dbErrorDetails: string | undefined;

export async function connectDatabase(): Promise<void> {
  if (!env.MONGODB_URI) {
    dbStatus = "not_configured";
    console.warn(
      "[Database] MONGODB_URI not provided. Running in standalone mode without database connection."
    );
    return;
  }

  try {
    dbStatus = "connecting";
    console.log("[Database] Connecting to MongoDB Atlas...");

    mongoose.connection.on("connected", () => {
      dbStatus = "connected";
      dbErrorDetails = undefined;
      console.log("[Database] Successfully connected to MongoDB Atlas.");
    });

    mongoose.connection.on("error", (err) => {
      dbStatus = "disconnected";
      dbErrorDetails = err instanceof Error ? err.message : "Unknown database error";
      console.error("[Database] Connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      dbStatus = "disconnected";
      console.warn("[Database] Disconnected from MongoDB Atlas.");
    });

    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    dbStatus = "disconnected";
    dbErrorDetails = error instanceof Error ? error.message : "Failed to connect to MongoDB";
    console.error("[Database] Initial connection failed:", dbErrorDetails);
  }
}

export function getDbHealth(): DatabaseHealth {
  return {
    status: dbStatus,
    ...(dbErrorDetails ? { details: dbErrorDetails } : {}),
  };
}

export async function closeDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    dbStatus = "disconnected";
  }
}
