import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Environment variables with default values
export const config = {
  // Application
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "/api/v1",

  // Database
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: parseInt(process.env.DB_PORT || "1433", 10),
  dbUsername: process.env.DB_USERNAME || "sa",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "TruckWeighing",
  dbInstanceName: process.env.DB_INSTANCE_NAME || "SQLEXPRESS01",

  // Authentication
  jwtSecret: process.env.JWT_SECRET || "your-jwt-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "*",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
};

console.log("Environment variables loaded:", {
  port: config.port,
  nodeEnv: config.nodeEnv,
  apiPrefix: config.apiPrefix,

  dbHost: config.dbHost,
  dbPort: config.dbPort,
  dbUsername: config.dbUsername,
  dbName: config.dbName,
  dbInstanceName: config.dbInstanceName,
  jwtSecret: config.jwtSecret,
  jwtExpiresIn: config.jwtExpiresIn,
  corsOrigin: config.corsOrigin,
  logLevel: config.logLevel,
  dbPassword: config.dbPassword, // Mask password for security
  // Add any other variables you want to log
});
