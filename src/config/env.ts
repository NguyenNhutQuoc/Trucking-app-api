// src/config/env.ts - Auto environment file switching
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Get environment
const nodeEnv = process.env.NODE_ENV || "development";

// Function to load environment files with fallback
const loadEnvironmentFiles = () => {
  const envFiles = [
    `.env.${nodeEnv}.local`, // .env.production.local or .env.development.local
    `.env.local`, // .env.local (local overrides)
    `.env.${nodeEnv}`, // .env.production or .env.development
    `.env`, // .env (default fallback)
  ];

  console.log(`🌍 Environment: ${nodeEnv}`);

  envFiles.forEach((envFile) => {
    const envPath = path.resolve(process.cwd(), envFile);

    if (fs.existsSync(envPath)) {
      console.log(`✅ Loading: ${envFile}`);
      dotenv.config({
        path: envPath,
        debug: nodeEnv === "development", // Show debug info in dev
      });
    } else {
      console.log(`⏭️  Skipping: ${envFile} (not found)`);
    }
  });
};

// Load environment files
loadEnvironmentFiles();

export const config = {
  // Application
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: nodeEnv,
  apiPrefix: process.env.API_PREFIX || "/api/v1",

  // Database - Now auto-switches based on loaded env file
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

// Enhanced logging
console.log(`📊 Configuration Summary:`);
console.log(`   Environment: ${config.nodeEnv}`);
console.log(
  `   Database Type: ${
    config.nodeEnv === "production" ? "TiDB (MySQL)" : "MSSQL"
  }`
);
console.log(`   Database Host: ${config.dbHost}`);
console.log(`   Database Port: ${config.dbPort}`);
console.log(`   Database User: ${config.dbUsername}`);
console.log(`   Database Name: ${config.dbName}`);
console.log(`   API Prefix: ${config.apiPrefix}`);

// Validate configuration
const validateConfig = () => {
  const errors: string[] = [];

  if (!config.dbHost) errors.push("DB_HOST is required");
  if (!config.dbUsername) errors.push("DB_USERNAME is required");
  if (!config.dbPassword) errors.push("DB_PASSWORD is required");
  if (!config.jwtSecret || config.jwtSecret === "your-jwt-secret-key") {
    errors.push("JWT_SECRET must be set to a secure value");
  }

  if (errors.length > 0) {
    console.error(`❌ Configuration Errors:`);
    errors.forEach((error) => console.error(`   - ${error}`));

    if (config.nodeEnv === "production") {
      throw new Error("Invalid production configuration");
    }
  } else {
    console.log(`✅ Configuration is valid`);
  }
};

validateConfig();
