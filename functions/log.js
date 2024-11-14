import {createLogger, format, transports} from "winston"

const { combine, timestamp, printf, colorize } = format;

// Custom log format
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a Winston logger
const logger = createLogger({
  level: 'info',  // Default level is 'info'
  format: combine(
    colorize(), // Adds color to logs
    timestamp(), // Adds timestamp
    customFormat // Uses the custom format
  ),
  transports: [
    new transports.Console(), // Logs to the console
    new transports.File({ filename: 'app.log' }) // Logs to a file
  ]
});

export default  logger;
