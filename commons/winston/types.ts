import { Logger } from '../log/types';

export interface WinstonConfig {
  level?: string;
  environment?: string;
  enableTracing?: boolean;
  format?: 'json' | 'simple';
}

export interface TracingContext {
  traceId?: string;
  spanId?: string;
}