import winston from "winston";
import path from "path";

const { combine, timestamp, printf, colorize, align } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;

  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }

  return msg;
});

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    align(),
    logFormat
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    }),
    // Write to all logs to logs/combined.log
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
    }),
    // Write all errors to logs/error.log
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }),
  ],
  exceptionHandlers: [
    // Write exceptions to logs/exceptions.log
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/exceptions.log"),
    }),
  ],
});

console.log(`Logger initialized with level: ${logger.level}`);
export { logger };
