import * as winston from 'winston';
import { WinstonLogger } from './winston-logger';
import { WinstonConfig } from './types';
import { Logger, LogLevel, parseLevel } from '../log/types';

export function createWinstonLogger(config?: WinstonConfig): Logger {
  const environment = config?.environment || process.env.ENV_NAME || 'development';
  const logLevel = config?.level || process.env.LOG_LEVEL || getDefaultLevel(environment);
  const enableTracing = config?.enableTracing ?? true;
  const logFormat = config?.format || 'json';

  let winstonConfig: winston.LoggerOptions;

  if (environment === 'production') {
    winstonConfig = {
      level: logLevel,
      format: getProductionFormat(logFormat, enableTracing),
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
        }),
      ],
      exitOnError: false,
    };
  } else {
    winstonConfig = {
      level: logLevel,
      format: getDevelopmentFormat(logFormat, enableTracing),
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
        }),
      ],
      exitOnError: false,
    };
  }

  const winstonLogger = winston.createLogger(winstonConfig);
  return new WinstonLogger(winstonLogger);
}

function getDefaultLevel(environment: string): string {
  return environment === 'production' ? 'info' : 'debug';
}

function getProductionFormat(format: string, enableTracing: boolean): winston.Logform.Format {
  const formats = [winston.format.timestamp()];

  if (enableTracing) {
    formats.push(winston.format.metadata());
  }

  if (format === 'json') {
    formats.push(winston.format.json());
  } else {
    formats.push(winston.format.simple());
  }

  return winston.format.combine(...formats);
}

function getDevelopmentFormat(format: string, enableTracing: boolean): winston.Logform.Format {
  const formats = [
    winston.format.timestamp(),
    winston.format.colorize(),
  ];

  if (enableTracing) {
    formats.push(winston.format.metadata());
  }

  if (format === 'json') {
    formats.push(winston.format.json());
  } else {
    formats.push(
      winston.format.printf(({ level, message, timestamp, metadata }) => {
        let logMessage = `${timestamp} [${level}]: ${message}`;
        if (metadata && Object.keys(metadata).length > 0) {
          logMessage += ` ${JSON.stringify(metadata)}`;
        }
        return logMessage;
      })
    );
  }

  return winston.format.combine(...formats);
}

export function parseLogLevel(level: string): string {
  try {
    const logLevel = parseLevel(level);
    switch (logLevel) {
      case LogLevel.PANIC:
      case LogLevel.FATAL:
        return 'error';
      case LogLevel.ERROR:
        return 'error';
      case LogLevel.WARN:
        return 'warn';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.DEBUG:
        return 'debug';
      default:
        return 'info';
    }
  } catch {
    return 'info';
  }
}