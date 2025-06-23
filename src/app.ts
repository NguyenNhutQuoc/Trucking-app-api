import express from "express";
import { configureServer } from "./config/server";
import { errorMiddleware } from "./interface/middlewares/errorMiddleware";
import routes from "./interface/routes";
import { config } from "./config/env";
import { logger } from "./utils/logger";
import { AppDataSource } from "./config/database";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger";
import cors from "cors";

// Create Express application
const app = express();
// Cách 1: Cho phép tất cả origins (chỉ dùng development)
app.use(cors());

// Configure server
configureServer(app);

// Swagger setup
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established");
  } catch (error) {
    logger.error("Database connection failed:", error);
    process.exit(1);
  }
};

// API routes
app.use(config.apiPrefix, routes);

// Error handling middleware
app.use(errorMiddleware);

export { app, initializeDatabase };
