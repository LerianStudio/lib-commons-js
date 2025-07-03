/**
 * Types and interfaces for graceful shutdown functionality
 * Following the patterns from shutdown module
 */

import { Logger } from '../log';

export { Logger };

export interface ShutdownHandler {
  name: string;
  priority: number; // Lower number = higher priority
  handler: () => Promise<void> | void;
}

export interface ServerAdapter {
  shutdown(): Promise<void>;
}

export interface LicenseClient {
  shutdown(): Promise<void> | void;
  shutdownBackgroundRefresh?(): void;
}

export interface TelemetryProvider {
  shutdown(): Promise<void> | void;
  shutdownTelemetry?(): void;
}

export interface GracefulShutdownConfig {
  timeout?: number; // Shutdown timeout in milliseconds
  signals?: NodeJS.Signals[]; // Signals to listen for
  logger?: Logger;
  forceExitTimeout?: number; // Force exit timeout
}

export type ServerType = 'express' | 'fastify' | 'koa' | 'http' | 'custom';

export interface ServerRegistration {
  server: any;
  type: ServerType;
  adapter?: ServerAdapter;
}