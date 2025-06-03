// src/config/env.ts - Environment-aware configuration
import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Application
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "/api/v1",

  // Database - Auto-switch based on environment
  dbHost:
    process.env.DB_HOST ||
    (process.env.NODE_ENV === "production"
      ? "gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
      : "localhost"),
  dbPort: parseInt(
    process.env.DB_PORT ||
      (process.env.NODE_ENV === "production" ? "4000" : "1433"),
    10
  ),
  dbUsername:
    process.env.DB_USERNAME ||
    (process.env.NODE_ENV === "production" ? "your-tidb-username.root" : "sa"),
  dbPassword: process.env.DB_PASSWORD || "",
  dbName:
    process.env.DB_NAME ||
    (process.env.NODE_ENV === "production"
      ? "truck_weighing"
      : "TruckWeighing"),
  // Only for MSSQL (local)
  dbInstanceName: process.env.DB_INSTANCE_NAME || "SQLEXPRESS01",

  // Authentication
  jwtSecret: process.env.JWT_SECRET || "your-jwt-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "*",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
};

console.log(`Database configuration loaded for: ${config.nodeEnv}`);
console.log(
  `Database type: ${config.nodeEnv === "production" ? "TiDB (MySQL)" : "MSSQL"}`
);
console.log(`Database host: ${config.dbHost}`);

// src/utils/logger.ts - Enhanced logging for multi-env
import winston from "winston";
import path from "path";

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;

  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }

  return msg;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    align(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    }),
  ],
});

// Only add file logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
    })
  );
  logger.add(
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    })
  );
}

logger.info(`Logger initialized for ${process.env.NODE_ENV} environment`);
export { logger };
