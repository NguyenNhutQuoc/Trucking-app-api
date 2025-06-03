import { app, initializeDatabase } from "./app";
import { config } from "./config/env";
import { logger } from "./utils/logger";
import serverless from "serverless-http";
// Start the server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start the express server
    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`API Prefix: ${config.apiPrefix}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the server
startServer();
