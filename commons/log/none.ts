import { Logger } from './types';

export class NoneLogger implements Logger {
  info(...args: any[]): void {}
  infof(format: string, ...args: any[]): void {}
  infoln(...args: any[]): void {}

  error(...args: any[]): void {}
  errorf(format: string, ...args: any[]): void {}
  errorln(...args: any[]): void {}

  warn(...args: any[]): void {}
  warnf(format: string, ...args: any[]): void {}
  warnln(...args: any[]): void {}

  debug(...args: any[]): void {}
  debugf(format: string, ...args: any[]): void {}
  debugln(...args: any[]): void {}

  fatal(...args: any[]): void {
    process.exit(1);
  }

  fatalf(format: string, ...args: any[]): void {
    process.exit(1);
  }

  fatalln(...args: any[]): void {
    process.exit(1);
  }

  withFields(...fields: any[]): Logger {
    return this;
  }

  withDefaultMessageTemplate(message: string): Logger {
    return this;
  }

  async sync(): Promise<void> {}
}