import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

const logger = createLogger({
    level: isDevelopment ? 'debug' : 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Capture stack trace for errors
        logFormat
    ),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        })
    ],
});

// If in production, add file transports for persistent logging
if (!isDevelopment) {
    logger.add(new transports.File({ filename: 'logs/error.log', level: 'error' }));
    logger.add(new transports.File({ filename: 'logs/combined.log' }));
}

export default logger;