/**
 * HTTP types and interfaces
 * Generic HTTP functionality for all Lerian libraries
 */

export interface HttpClient {
  post(url: string, data: any, headers?: Record<string, string>): Promise<any>;
  get?(url: string, headers?: Record<string, string>): Promise<any>;
  put?(url: string, data: any, headers?: Record<string, string>): Promise<any>;
  delete?(url: string, headers?: Record<string, string>): Promise<any>;
}

export interface HttpConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface HttpError {
  message: string;
  status: number;
  code?: string;
  isRetryable?: boolean;
}