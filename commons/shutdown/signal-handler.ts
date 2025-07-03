/**
 * Signal handler for graceful shutdown
 * Handles SIGINT, SIGTERM, and uncaught exceptions
 * Based on lib-commons (Go) signal handling patterns
 */

import { Logger } from './types';

export class SignalHandler {
  private logger: Logger;
  private shutdownCallback: () => Promise<void>;
  private isShuttingDown = false;
  private signals: NodeJS.Signals[];

  constructor(
    shutdownCallback: () => Promise<void>,
    logger: Logger,
    signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
  ) {
    this.shutdownCallback = shutdownCallback;
    this.logger = logger;
    this.signals = signals;
  }

  /**
   * Register signal handlers
   */
  register(): void {
    // Handle shutdown signals
    this.signals.forEach(signal => {
      process.on(signal, () => this.handleShutdownSignal(signal));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => this.handleUncaughtException(error));
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => 
      this.handleUnhandledRejection(reason, promise)
    );
  }

  /**
   * Unregister signal handlers
   */
  unregister(): void {
    this.signals.forEach(signal => {
      process.removeAllListeners(signal);
    });
    
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  }

  /**
   * Handle shutdown signals (SIGINT, SIGTERM)
   */
  private async handleShutdownSignal(signal: NodeJS.Signals): Promise<void> {
    if (this.isShuttingDown) {
      this.logger.warn(`Received ${signal} but shutdown already in progress`);
      return;
    }

    this.isShuttingDown = true;
    this.logger.info(`Received ${signal}, initiating graceful shutdown...`);

    try {
      await this.shutdownCallback();
      this.logger.info('Graceful shutdown completed successfully');
      process.exit(0);
    } catch (error) {
      this.logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  /**
   * Handle uncaught exceptions
   */
  private async handleUncaughtException(error: Error): Promise<void> {
    this.logger.error('Uncaught Exception:', error);

    if (!this.isShuttingDown) {
      this.isShuttingDown = true;
      
      try {
        await this.shutdownCallback();
        this.logger.info('Emergency shutdown completed');
      } catch (shutdownError) {
        this.logger.error('Error during emergency shutdown:', shutdownError);
      }
    }

    process.exit(1);
  }

  /**
   * Handle unhandled promise rejections
   */
  private async handleUnhandledRejection(reason: any, promise: Promise<any>): Promise<void> {
    this.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);

    if (!this.isShuttingDown) {
      this.isShuttingDown = true;
      
      try {
        await this.shutdownCallback();
        this.logger.info('Emergency shutdown completed due to unhandled rejection');
      } catch (shutdownError) {
        this.logger.error('Error during emergency shutdown:', shutdownError);
      }
    }

    process.exit(1);
  }

  /**
   * Force exit after timeout
   */
  forceExit(timeout: number): void {
    setTimeout(() => {
      this.logger.error(`Force exiting after ${timeout}ms timeout`);
      process.exit(1);
    }, timeout);
  }

  /**
   * Check if shutdown is in progress
   */
  isShutdownInProgress(): boolean {
    return this.isShuttingDown;
  }
}