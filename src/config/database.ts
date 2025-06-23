// src/config/database.ts - Multi-database support
import { DataSource } from "typeorm";
import { config } from "./env";
import { join } from "path";
import options from "./swagger";

// Database configuration factory
const createDataSourceConfig = () => {
  const baseConfig = {
    synchronize: false,
    logging: process.env.NODE_ENV !== "production",
    entities: [join(__dirname, "../domain/entities/**/*.{js,ts}")],
    migrations: [
      join(__dirname, "../infrastructure/database/migrations/**/*.{js,ts}"),
    ],
    subscribers: [
      join(__dirname, "../infrastructure/database/subscribers/**/*.{js,ts}"),
    ],
  };

  // Local development - MSSQL
  if (config.nodeEnv === "development") {
    return {
      ...baseConfig,
      type: "mssql" as const,
      host: config.dbHost,
      port: config.dbPort,
      username: config.dbUsername,
      password: config.dbPassword,
      database: config.dbName,
      options: {
        enableArithAbort: true,
        trustServerCertificate: true,
        instanceName: config.dbInstanceName,
        encrypt: false,
      },
    };
  }

  // Production - MSSQL
  return {
    ...baseConfig,
    type: "mssql" as const,
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUsername,
    password: config.dbPassword,
    database: config.dbName,
    options: {
      enableArithAbort: true,
      trustServerCertificate: true,
      encrypt: false, // Use encryption in production
    },
    extra: {
      connectionLimit: 10,
    },
  };
};

export const AppDataSource = new DataSource(createDataSourceConfig());
