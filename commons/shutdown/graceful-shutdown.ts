/**
 * Graceful shutdown orchestrator
 * Based on lib-commons (Go) graceful shutdown patterns
 * Handles servers, license clients, telemetry, and custom handlers
 */

import { SignalHandler } from './signal-handler';
import { createServerAdapter } from './server-adapters';
import {
  Logger,
  ShutdownHandler,
  ServerAdapter,
  LicenseClient,
  TelemetryProvider,
  GracefulShutdownConfig,
  ServerRegistration,
  ServerType
} from './types';

export class GracefulShutdown {
  private logger: Logger;
  private signalHandler: SignalHandler;
  private servers: ServerAdapter[] = [];
  private licenseClient?: LicenseClient;
  private telemetryProvider?: TelemetryProvider;
  private customHandlers: ShutdownHandler[] = [];
  private config: Required<GracefulShutdownConfig>;
  private isShuttingDown = false;

  constructor(config: GracefulShutdownConfig = {}) {
    this.config = {
      timeout: config.timeout || 30000, // 30 seconds default
      signals: config.signals || ['SIGINT', 'SIGTERM'],
      logger: config.logger || this.createDefaultLogger(),
      forceExitTimeout: config.forceExitTimeout || 35000, // 35 seconds default
    };

    this.logger = this.config.logger;
    this.signalHandler = new SignalHandler(
      () => this.executeShutdown(),
      this.logger,
      this.config.signals
    );
  }

  /**
   * Register a server for shutdown
   */
  registerServer(server: any, type: ServerType, customShutdown?: () => Promise<void>): void {
    try {
      const adapter = createServerAdapter(server, type, customShutdown);
      this.servers.push(adapter);
      this.logger.debug(`Registered ${type} server for graceful shutdown`);
    } catch (error) {
      this.logger.error(`Failed to register ${type} server:`, error);
      throw error;
    }
  }

  /**
   * Register a license client for shutdown
   */
  registerLicenseClient(licenseClient: LicenseClient): void {
    this.licenseClient = licenseClient;
    this.logger.debug('Registered license client for graceful shutdown');
  }

  /**
   * Register a telemetry provider for shutdown
   */
  registerTelemetry(telemetryProvider: TelemetryProvider): void {
    this.telemetryProvider = telemetryProvider;
    this.logger.debug('Registered telemetry provider for graceful shutdown');
  }

  /**
   * Register a custom shutdown handler
   */
  registerHandler(name: string, handler: () => Promise<void> | void, priority: number = 50): void {
    this.customHandlers.push({ name, handler, priority });
    this.customHandlers.sort((a, b) => a.priority - b.priority);
    this.logger.debug(`Registered custom shutdown handler: ${name} (priority: ${priority})`);
  }

  /**
   * Start listening for shutdown signals
   */
  start(): void {
    this.signalHandler.register();
    this.logger.info('Graceful shutdown handler registered');
  }

  /**
   * Stop listening for shutdown signals
   */
  stop(): void {
    this.signalHandler.unregister();
    this.logger.info('Graceful shutdown handler unregistered');
  }

  /**
   * Manually trigger shutdown
   */
  async shutdown(): Promise<void> {
    if (this.isShuttingDown) {
      this.logger.warn('Shutdown already in progress');
      return;
    }

    await this.executeShutdown();
  }

  /**
   * Execute the shutdown sequence
   */
  private async executeShutdown(): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    this.logger.info('Starting graceful shutdown sequence...');

    // Set force exit timeout
    this.signalHandler.forceExit(this.config.forceExitTimeout);

    const shutdownPromise = this.performShutdownSequence();
    const timeoutPromise = this.createTimeoutPromise();

    try {
      await Promise.race([shutdownPromise, timeoutPromise]);
      this.logger.info('Graceful shutdown completed successfully');
    } catch (error) {
      this.logger.error('Error during graceful shutdown:', error);
      throw error;
    }
  }

  /**
   * Perform the actual shutdown sequence
   */
  private async performShutdownSequence(): Promise<void> {
    // 1. Shutdown servers (stop accepting new connections)
    await this.shutdownServers();

    // 2. Execute custom handlers (sorted by priority)
    await this.executeCustomHandlers();

    // 3. Shutdown telemetry
    await this.shutdownTelemetry();

    // 4. Sync logger
    await this.syncLogger();

    // 5. Shutdown license client background refresh (last)
    await this.shutdownLicenseClient();
  }

  /**
   * Shutdown all registered servers
   */
  private async shutdownServers(): Promise<void> {
    if (this.servers.length === 0) {
      return;
    }

    this.logger.info('Shutting down HTTP servers...');
    
    const shutdownPromises = this.servers.map(async (server, index) => {
      try {
        await server.shutdown();
        this.logger.debug(`Server ${index + 1} shut down successfully`);
      } catch (error) {
        this.logger.error(`Error shutting down server ${index + 1}:`, error);
        throw error;
      }
    });

    await Promise.all(shutdownPromises);
    this.logger.info('All servers shut down successfully');
  }

  /**
   * Execute custom shutdown handlers
   */
  private async executeCustomHandlers(): Promise<void> {
    if (this.customHandlers.length === 0) {
      return;
    }

    this.logger.info('Executing custom shutdown handlers...');

    for (const { name, handler } of this.customHandlers) {
      try {
        this.logger.debug(`Executing shutdown handler: ${name}`);
        await handler();
        this.logger.debug(`Shutdown handler completed: ${name}`);
      } catch (error) {
        this.logger.error(`Error in shutdown handler ${name}:`, error);
        // Continue with other handlers even if one fails
      }
    }

    this.logger.info('Custom shutdown handlers completed');
  }

  /**
   * Shutdown telemetry provider
   */
  private async shutdownTelemetry(): Promise<void> {
    if (!this.telemetryProvider) {
      return;
    }

    this.logger.info('Shutting down telemetry...');
    
    try {
      if (this.telemetryProvider.shutdownTelemetry) {
        this.telemetryProvider.shutdownTelemetry();
      } else if (this.telemetryProvider.shutdown) {
        await this.telemetryProvider.shutdown();
      }
      this.logger.info('Telemetry shut down successfully');
    } catch (error) {
      this.logger.error('Error shutting down telemetry:', error);
    }
  }

  /**
   * Sync logger
   */
  private async syncLogger(): Promise<void> {
    if (!this.logger.sync) {
      return;
    }

    this.logger.info('Syncing logger...');
    
    try {
      await this.logger.sync();
      this.logger.info('Logger synced successfully');
    } catch (error) {
      this.logger.error('Error syncing logger:', error);
    }
  }

  /**
   * Shutdown license client
   */
  private async shutdownLicenseClient(): Promise<void> {
    if (!this.licenseClient) {
      return;
    }

    this.logger.info('Shutting down license client...');
    
    try {
      if (this.licenseClient.shutdownBackgroundRefresh) {
        this.licenseClient.shutdownBackgroundRefresh();
      }
      
      if (this.licenseClient.shutdown) {
        await this.licenseClient.shutdown();
      }
      
      this.logger.info('License client shut down successfully');
    } catch (error) {
      this.logger.error('Error shutting down license client:', error);
    }
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Shutdown timeout exceeded (${this.config.timeout}ms)`));
      }, this.config.timeout);
    });
  }

  /**
   * Create default logger if none provided
   */
  private createDefaultLogger(): Logger {
    return {
      info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
      warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
      error: (message: string, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args),
      debug: (message: string, ...args: any[]) => console.debug(`[DEBUG] ${message}`, ...args),
    };
  }

  /**
   * Check if shutdown is in progress
   */
  isShutdownInProgress(): boolean {
    return this.isShuttingDown;
  }
}

/**
 * Convenience function to start server with graceful shutdown
 * Based on lib-commons (Go) StartServerWithGracefulShutdown function
 */
export async function startServerWithGracefulShutdown(
  serverConfig: ServerRegistration,
  licenseClient?: LicenseClient,
  telemetryProvider?: TelemetryProvider,
  logger?: Logger
): Promise<GracefulShutdown> {
  const gracefulShutdown = new GracefulShutdown({ logger });

  // Register components
  gracefulShutdown.registerServer(serverConfig.server, serverConfig.type);
  
  if (licenseClient) {
    gracefulShutdown.registerLicenseClient(licenseClient);
  }
  
  if (telemetryProvider) {
    gracefulShutdown.registerTelemetry(telemetryProvider);
  }

  // Start graceful shutdown handling
  gracefulShutdown.start();

  return gracefulShutdown;
}