const chalk = require("chalk");

const env = process.env.NODE_ENV || "development";

console.log(chalk.blue(`🌍 Environment: ${env}`));

if (env === "development") {
  console.log(chalk.green("📊 Database: MSSQL (Local)"));
  console.log(chalk.yellow("🔧 Make sure your local MSSQL server is running"));
} else {
  console.log(chalk.green("☁️  Database: TiDB (Cloud)"));
  console.log(chalk.yellow("🌐 Using cloud database configuration"));
}

// Required environment variables check
const required = [
  "DB_HOST",
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.log(
    chalk.red(`❌ Missing environment variables: ${missing.join(", ")}`)
  );
  process.exit(1);
} else {
  console.log(chalk.green("✅ All environment variables are set"));
}
