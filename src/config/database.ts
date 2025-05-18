import { DataSource } from "typeorm";
import { config } from "./env";
import { join } from "path";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: false,
  logging: process.env.NODE_ENV !== "production",
  entities: [join(__dirname, "../domain/entities/**/*.{js,ts}")],
  migrations: [
    join(__dirname, "../infrastructure/database/migrations/**/*.{js,ts}"),
  ],
  subscribers: [
    join(__dirname, "../infrastructure/database/subscribers/**/*.{js,ts}"),
  ],
  options: {
    enableArithAbort: true,
    trustServerCertificate: true,
    instanceName: config.dbInstanceName,
    encrypt: false,
  },
});
