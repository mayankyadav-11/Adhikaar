import { createApp } from "./app";
import { env } from "./config/env";
import { connectDatabase, closeDatabase } from "./config/db";

const app = createApp();

async function startServer() {
  // Connect to MongoDB Atlas (if URI configured)
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`[Adhikaar API] Running on http://localhost:${env.PORT}`);
    console.log(`[Adhikaar API] Environment: ${env.NODE_ENV}`);
    console.log(`[Adhikaar API] Health Check: http://localhost:${env.PORT}/health`);
  });

  // Graceful shutdown handling
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n[Adhikaar API] Received ${signal}. Closing server gracefully...`);
    server.close(async () => {
      await closeDatabase();
      console.log("[Adhikaar API] Closed database and server connections.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

startServer().catch((err) => {
  console.error("[Adhikaar API] Fatal error during startup:", err);
  process.exit(1);
});
