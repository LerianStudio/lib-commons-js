import { Logger } from './types';
import { format } from 'util';

export class ConsoleLogger implements Logger {
  private fields: any[] = [];
  private defaultMessageTemplate = '';

  info(...args: any[]): void {
    this.log('info', ...args);
  }

  infof(formatStr: string, ...args: any[]): void {
    this.logf('info', formatStr, ...args);
  }

  infoln(...args: any[]): void {
    this.logln('info', ...args);
  }

  error(...args: any[]): void {
    this.log('error', ...args);
  }

  errorf(formatStr: string, ...args: any[]): void {
    this.logf('error', formatStr, ...args);
  }

  errorln(...args: any[]): void {
    this.logln('error', ...args);
  }

  warn(...args: any[]): void {
    this.log('warn', ...args);
  }

  warnf(formatStr: string, ...args: any[]): void {
    this.logf('warn', formatStr, ...args);
  }

  warnln(...args: any[]): void {
    this.logln('warn', ...args);
  }

  debug(...args: any[]): void {
    this.log('debug', ...args);
  }

  debugf(formatStr: string, ...args: any[]): void {
    this.logf('debug', formatStr, ...args);
  }

  debugln(...args: any[]): void {
    this.logln('debug', ...args);
  }

  fatal(...args: any[]): void {
    this.log('error', ...args);
    process.exit(1);
  }

  fatalf(formatStr: string, ...args: any[]): void {
    this.logf('error', formatStr, ...args);
    process.exit(1);
  }

  fatalln(...args: any[]): void {
    this.logln('error', ...args);
    process.exit(1);
  }

  withFields(...fields: any[]): Logger {
    const logger = new ConsoleLogger();
    logger.fields = [...this.fields, ...fields];
    logger.defaultMessageTemplate = this.defaultMessageTemplate;
    return logger;
  }

  withDefaultMessageTemplate(message: string): Logger {
    const logger = new ConsoleLogger();
    logger.fields = [...this.fields];
    logger.defaultMessageTemplate = message;
    return logger;
  }

  async sync(): Promise<void> {
    // Console logging is synchronous, no-op
  }

  private log(level: string, ...args: any[]): void {
    const finalArgs = this.hydrateArgs(args);
    const fieldsStr = this.fields.length > 0 ? ` ${JSON.stringify(this.fields)}` : '';
    const consoleMethod = this.getConsoleMethod(level);
    consoleMethod(`[${level.toUpperCase()}]${fieldsStr}`, ...finalArgs);
  }

  private logf(level: string, formatStr: string, ...args: any[]): void {
    const finalArgs = this.hydrateArgs([formatStr, ...args]);
    const fieldsStr = this.fields.length > 0 ? ` ${JSON.stringify(this.fields)}` : '';
    const consoleMethod = this.getConsoleMethod(level);
    const formattedMsg = format(finalArgs[0], ...finalArgs.slice(1));
    consoleMethod(`[${level.toUpperCase()}]${fieldsStr} ${formattedMsg}`);
  }

  private logln(level: string, ...args: any[]): void {
    const finalArgs = this.hydrateArgs(args);
    const fieldsStr = this.fields.length > 0 ? ` ${JSON.stringify(this.fields)}` : '';
    const consoleMethod = this.getConsoleMethod(level);
    consoleMethod(`[${level.toUpperCase()}]${fieldsStr}`, ...finalArgs);
  }

  private getConsoleMethod(level: string): (...args: any[]) => void {
    switch (level) {
      case 'error':
        return console.error;
      case 'warn':
        return console.warn;
      case 'debug':
        return console.debug;
      case 'info':
      default:
        return console.log;
    }
  }

  private hydrateArgs(args: any[]): any[] {
    if (!this.defaultMessageTemplate) {
      return args;
    }
    return [this.defaultMessageTemplate, ...args];
  }
}