export enum LogLevel {
  PANIC = 0,
  FATAL = 1,
  ERROR = 2,
  WARN = 3,
  INFO = 4,
  DEBUG = 5,
}

export interface Logger {
  info(...args: any[]): void;
  infof(format: string, ...args: any[]): void;
  infoln(...args: any[]): void;

  error(...args: any[]): void;
  errorf(format: string, ...args: any[]): void;
  errorln(...args: any[]): void;

  warn(...args: any[]): void;
  warnf(format: string, ...args: any[]): void;
  warnln(...args: any[]): void;

  debug(...args: any[]): void;
  debugf(format: string, ...args: any[]): void;
  debugln(...args: any[]): void;

  fatal(...args: any[]): void;
  fatalf(format: string, ...args: any[]): void;
  fatalln(...args: any[]): void;

  withFields(...fields: any[]): Logger;
  withDefaultMessageTemplate(message: string): Logger;
  sync(): Promise<void>;
}

export function parseLevel(lvl: string): LogLevel {
  switch (lvl.toLowerCase()) {
    case 'panic':
      return LogLevel.PANIC;
    case 'fatal':
      return LogLevel.FATAL;
    case 'error':
      return LogLevel.ERROR;
    case 'warn':
    case 'warning':
      return LogLevel.WARN;
    case 'info':
      return LogLevel.INFO;
    case 'debug':
      return LogLevel.DEBUG;
    default:
      throw new Error(`not a valid LogLevel: "${lvl}"`);
  }
}