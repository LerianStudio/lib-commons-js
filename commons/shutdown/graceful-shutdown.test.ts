/**
 * Tests for GracefulShutdown class
 * Based on lib-commons (Go) shutdown test patterns
 */

import { GracefulShutdown, startServerWithGracefulShutdown } from './graceful-shutdown';
import { Logger, LicenseClient, TelemetryProvider } from './types';

describe('GracefulShutdown', () => {
  let mockLogger: Logger;
  let mockLicenseClient: LicenseClient;
  let mockTelemetryProvider: TelemetryProvider;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      sync: jest.fn().mockResolvedValue(undefined)
    };

    mockLicenseClient = {
      shutdown: jest.fn().mockResolvedValue(undefined),
      shutdownBackgroundRefresh: jest.fn()
    };

    mockTelemetryProvider = {
      shutdown: jest.fn().mockResolvedValue(undefined),
      shutdownTelemetry: jest.fn()
    };
  });

  describe('constructor', () => {
    it('should create with default config', () => {
      const gs = new GracefulShutdown();
      expect(gs).toBeDefined();
      expect(gs.isShutdownInProgress()).toBe(false);
    });

    it('should create with custom config', () => {
      const gs = new GracefulShutdown({
        timeout: 10000,
        logger: mockLogger,
        signals: ['SIGINT'],
        forceExitTimeout: 15000
      });
      expect(gs).toBeDefined();
    });
  });

  describe('registration methods', () => {
    let gs: GracefulShutdown;

    beforeEach(() => {
      gs = new GracefulShutdown({ logger: mockLogger });
    });

    it('should register Express server', () => {
      const mockServer = { close: jest.fn() };
      expect(() => gs.registerServer(mockServer, 'express')).not.toThrow();
    });

    it('should register Fastify server', () => {
      const mockServer = { close: jest.fn() };
      expect(() => gs.registerServer(mockServer, 'fastify')).not.toThrow();
    });

    it('should register Koa server', () => {
      const mockServer = { close: jest.fn() };
      expect(() => gs.registerServer(mockServer, 'koa')).not.toThrow();
    });

    it('should register custom server with shutdown function', () => {
      const mockServer = {};
      const customShutdown = jest.fn().mockResolvedValue(undefined);
      expect(() => gs.registerServer(mockServer, 'custom', customShutdown)).not.toThrow();
    });

    it('should throw error for custom server without shutdown function', () => {
      const mockServer = {};
      expect(() => gs.registerServer(mockServer, 'custom')).toThrow();
    });

    it('should register license client', () => {
      expect(() => gs.registerLicenseClient(mockLicenseClient)).not.toThrow();
    });

    it('should register telemetry provider', () => {
      expect(() => gs.registerTelemetry(mockTelemetryProvider)).not.toThrow();
    });

    it('should register custom handler', () => {
      const handler = jest.fn();
      expect(() => gs.registerHandler('test-handler', handler, 10)).not.toThrow();
    });
  });

  describe('shutdown sequence', () => {
    let gs: GracefulShutdown;

    beforeEach(() => {
      gs = new GracefulShutdown({ 
        logger: mockLogger,
        timeout: 1000
      });
    });

    it('should execute shutdown sequence', async () => {
      // Register components
      gs.registerLicenseClient(mockLicenseClient);
      gs.registerTelemetry(mockTelemetryProvider);
      
      const customHandler = jest.fn().mockResolvedValue(undefined);
      gs.registerHandler('test', customHandler, 10);

      await gs.shutdown();

      expect(mockTelemetryProvider.shutdownTelemetry).toHaveBeenCalled();
      expect(mockLogger.sync).toHaveBeenCalled();
      expect(mockLicenseClient.shutdownBackgroundRefresh).toHaveBeenCalled();
      expect(customHandler).toHaveBeenCalled();
    });

    it('should handle shutdown with Express server', async () => {
      const mockServer = {
        close: jest.fn((callback) => callback())
      };
      
      gs.registerServer(mockServer, 'express');
      await gs.shutdown();

      expect(mockServer.close).toHaveBeenCalled();
    });

    it('should handle shutdown with Fastify server', async () => {
      const mockServer = {
        close: jest.fn().mockResolvedValue(undefined)
      };
      
      gs.registerServer(mockServer, 'fastify');
      await gs.shutdown();

      expect(mockServer.close).toHaveBeenCalled();
    });

    it('should not shutdown twice', async () => {
      const shutdownPromise1 = gs.shutdown();
      const shutdownPromise2 = gs.shutdown();

      await Promise.all([shutdownPromise1, shutdownPromise2]);

      expect(mockLogger.warn).toHaveBeenCalledWith('Shutdown already in progress');
    });

    it('should handle custom handler errors gracefully', async () => {
      const errorHandler = jest.fn().mockRejectedValue(new Error('Handler error'));
      gs.registerHandler('error-handler', errorHandler);

      await gs.shutdown();

      expect(errorHandler).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error in shutdown handler error-handler:',
        expect.any(Error)
      );
    });

    it('should execute handlers in priority order', async () => {
      const calls: string[] = [];
      
      const handler1 = jest.fn((): void => {
        calls.push('handler1');
      });
      const handler2 = jest.fn((): void => {
        calls.push('handler2');
      });
      const handler3 = jest.fn((): void => {
        calls.push('handler3');
      });

      gs.registerHandler('high-priority', handler1, 10);
      gs.registerHandler('low-priority', handler3, 30);
      gs.registerHandler('medium-priority', handler2, 20);

      await gs.shutdown();

      expect(calls).toEqual(['handler1', 'handler2', 'handler3']);
    });
  });

  describe('startServerWithGracefulShutdown', () => {
    it('should start server with graceful shutdown', async () => {
      const mockServer = { close: jest.fn() };
      
      const gs = await startServerWithGracefulShutdown(
        { server: mockServer, type: 'express' },
        mockLicenseClient,
        mockTelemetryProvider,
        mockLogger
      );

      expect(gs).toBeInstanceOf(GracefulShutdown);
    });

    it('should work without optional parameters', async () => {
      const mockServer = { close: jest.fn() };
      
      const gs = await startServerWithGracefulShutdown(
        { server: mockServer, type: 'express' }
      );

      expect(gs).toBeInstanceOf(GracefulShutdown);
    });
  });
});