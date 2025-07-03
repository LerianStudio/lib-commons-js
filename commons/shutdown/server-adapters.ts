/**
 * Server adapters for different web frameworks
 * Provides unified shutdown interface for Express, Fastify, Koa, etc.
 */

import { ServerAdapter, ServerType } from './types';

/**
 * Express server adapter
 */
export class ExpressServerAdapter implements ServerAdapter {
  constructor(private server: any) {}

  async shutdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      // Express server close method
      this.server.close((error?: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

/**
 * Fastify server adapter
 */
export class FastifyServerAdapter implements ServerAdapter {
  constructor(private server: any) {}

  async shutdown(): Promise<void> {
    if (!this.server || !this.server.close) {
      return;
    }

    // Fastify server close method
    await this.server.close();
  }
}

/**
 * Koa server adapter (uses Node.js HTTP server)
 */
export class KoaServerAdapter implements ServerAdapter {
  constructor(private server: any) {}

  async shutdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      // Koa uses Node.js HTTP server
      this.server.close((error?: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

/**
 * Generic HTTP server adapter
 */
export class HttpServerAdapter implements ServerAdapter {
  constructor(private server: any) {}

  async shutdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((error?: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

/**
 * Custom server adapter
 */
export class CustomServerAdapter implements ServerAdapter {
  constructor(private shutdownFn: () => Promise<void>) {}

  async shutdown(): Promise<void> {
    await this.shutdownFn();
  }
}

/**
 * Factory function to create appropriate server adapter
 */
export function createServerAdapter(server: any, type: ServerType, customShutdown?: () => Promise<void>): ServerAdapter {
  switch (type) {
    case 'express':
      return new ExpressServerAdapter(server);
    case 'fastify':
      return new FastifyServerAdapter(server);
    case 'koa':
      return new KoaServerAdapter(server);
    case 'http':
      return new HttpServerAdapter(server);
    case 'custom':
      if (!customShutdown) {
        throw new Error('Custom shutdown function is required for custom server type');
      }
      return new CustomServerAdapter(customShutdown);
    default:
      throw new Error(`Unsupported server type: ${type}`);
  }
}