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
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) {
          // ✅ Cho phép nếu không có origin (mobile, Postman, etc.)
          return callback(null, true);
        }

        if (config.corsOrigin.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
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
