import { Logger } from '../log/types';
import { format } from 'util';
import * as winston from 'winston';
import { TracingContext } from './types';

export class WinstonLogger implements Logger {
  private winstonLogger: winston.Logger;
  private fields: any[] = [];
  private defaultMessageTemplate = '';
  private tracingContext?: TracingContext;

  constructor(winstonLogger: winston.Logger) {
    this.winstonLogger = winstonLogger;
  }

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
    const logger = new WinstonLogger(this.winstonLogger);
    logger.fields = [...this.fields, ...fields];
    logger.defaultMessageTemplate = this.defaultMessageTemplate;
    logger.tracingContext = this.tracingContext;
    return logger;
  }

  withDefaultMessageTemplate(message: string): Logger {
    const logger = new WinstonLogger(this.winstonLogger);
    logger.fields = [...this.fields];
    logger.defaultMessageTemplate = message;
    logger.tracingContext = this.tracingContext;
    return logger;
  }

  withTracing(context: TracingContext): Logger {
    const logger = new WinstonLogger(this.winstonLogger);
    logger.fields = [...this.fields];
    logger.defaultMessageTemplate = this.defaultMessageTemplate;
    logger.tracingContext = context;
    return logger;
  }

  async sync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.winstonLogger.on('finish', resolve);
      this.winstonLogger.on('error', reject);
      this.winstonLogger.end();
    });
  }

  private log(level: string, ...args: any[]): void {
    const finalArgs = this.hydrateArgs(args);
    const meta = this.buildMeta();
    this.winstonLogger.log(level, finalArgs.join(' '), meta);
  }

  private logf(level: string, formatStr: string, ...args: any[]): void {
    const finalArgs = this.hydrateArgs([formatStr, ...args]);
    const meta = this.buildMeta();
    const formattedMsg = format(finalArgs[0], ...finalArgs.slice(1));
    this.winstonLogger.log(level, formattedMsg, meta);
  }

  private logln(level: string, ...args: any[]): void {
    const finalArgs = this.hydrateArgs(args);
    const meta = this.buildMeta();
    this.winstonLogger.log(level, finalArgs.join(' '), meta);
  }

  private buildMeta(): any {
    const meta: any = {};

    if (this.fields.length > 0) {
      meta.fields = this.fields;
    }

    if (this.tracingContext) {
      if (this.tracingContext.traceId) {
        meta.traceId = this.tracingContext.traceId;
      }
      if (this.tracingContext.spanId) {
        meta.spanId = this.tracingContext.spanId;
      }
    }

    return meta;
  }

  private hydrateArgs(args: any[]): any[] {
    if (!this.defaultMessageTemplate) {
      return args;
    }
    return [this.defaultMessageTemplate, ...args];
  }
}