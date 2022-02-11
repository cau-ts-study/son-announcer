import { TransformableInfo } from "logform";
import winston from "winston";
const { createLogger, format } = winston;

interface LoggerForm extends TransformableInfo {
  [key: string]: string;
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD A hh:mm:ss",
    }),
    format.align(),
    format.printf(
      (info: LoggerForm) =>
        `[${info.timestamp}]\n\tInfo Message: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "info.log",
      level: "info",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "./logs/errors.log",
      level: "error",
    }),
  ],
});

export default logger;
