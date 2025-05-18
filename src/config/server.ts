import { config } from "./env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

// Express configuration
export const configureServer = (app: express.Application) => {
  // Security middleware
  app.use(helmet());

  // Enable CORS
  app.use(
    cors({
      origin: config.corsOrigin,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Log HTTP requests
  if (config.nodeEnv !== "production") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  // Compress response bodies
  app.use(compression());

  // Disable X-Powered-By header
  app.disable("x-powered-by");

  return app;
};
