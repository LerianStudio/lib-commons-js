/**
 * Generic HTTP Client implementation
 * Provides basic HTTP functionality for all Lerian libraries
 */

import { HttpClient, HttpConfig } from './types';

export class DefaultHttpClient implements HttpClient {
  private config: HttpConfig;

  constructor(config: HttpConfig = {}) {
    this.config = {
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      headers: {},
      ...config,
    };
  }

  async post(
    url: string,
    data: any,
    headers: Record<string, string> = {},
  ): Promise<any> {
    return this.request('POST', url, data, headers);
  }

  async get(url: string, headers: Record<string, string> = {}): Promise<any> {
    return this.request('GET', url, undefined, headers);
  }

  async put(
    url: string,
    data: any,
    headers: Record<string, string> = {},
  ): Promise<any> {
    return this.request('PUT', url, data, headers);
  }

  async delete(url: string, headers: Record<string, string> = {}): Promise<any> {
    return this.request('DELETE', url, undefined, headers);
  }

  private async request(
    method: string,
    url: string,
    data?: any,
    headers: Record<string, string> = {},
  ): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const requestInit: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
          ...headers,
        },
        signal: controller.signal,
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        requestInit.body = JSON.stringify(data);
      }

      const response = await fetch(url, requestInit);
      clearTimeout(timeoutId);

      const responseData = await this.parseResponse(response);

      if (!response.ok) {
        throw this.createHttpError(response, responseData);
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw this.createTimeoutError();
      }

      if (error instanceof Error && this.isNetworkError(error)) {
        throw this.createNetworkError(error);
      }

      throw error;
    }
  }

  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    }

    const text = await response.text();
    return text || null;
  }

  private createHttpError(response: Response, responseData: any): Error {
    const message = responseData?.message || `HTTP ${response.status}: ${response.statusText}`;
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).code = responseData?.code;
    (error as any).isRetryable = response.status >= 500 || response.status === 408 || response.status === 429;
    return error;
  }

  private createTimeoutError(): Error {
    const error = new Error('Request timeout');
    (error as any).status = 408;
    (error as any).code = 'TIMEOUT_ERROR';
    (error as any).isRetryable = true;
    return error;
  }

  private createNetworkError(originalError: Error): Error {
    const error = new Error(`Network error: ${originalError.message}`);
    (error as any).status = 0;
    (error as any).code = 'NETWORK_ERROR';
    (error as any).isRetryable = true;
    return error;
  }

  private isNetworkError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('econnrefused') ||
      errorMessage.includes('enotfound') ||
      errorMessage.includes('etimedout')
    );
  }
}

// Factory function for convenience
export const createHttpClient = (config?: HttpConfig): HttpClient => {
  return new DefaultHttpClient(config);
};