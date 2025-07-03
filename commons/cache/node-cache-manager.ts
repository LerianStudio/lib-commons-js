/**
 * NodeCache implementation of CacheManager
 * Generic caching using node-cache for all Lerian libraries
 */

import NodeCache from 'node-cache';
import { CacheManager, CacheConfig } from './types';

export class NodeCacheManager implements CacheManager {
  private cache: NodeCache;

  constructor(config: CacheConfig = {}) {
    const {
      defaultTtl = 3600, // 1 hour default
      checkPeriod = 600,  // 10 minutes default
      useClones = false,
      deleteOnExpire = true
    } = config;

    this.cache = new NodeCache({
      stdTTL: defaultTtl,
      checkperiod: checkPeriod,
      useClones,
      deleteOnExpire,
    });
  }

  get(key: string): any | undefined {
    try {
      return this.cache.get(key);
    } catch {
      throw new Error(`Failed to get cache entry for key: ${key}`);
    }
  }

  set(key: string, value: any, ttlSeconds?: number): void {
    try {
      if (ttlSeconds !== undefined) {
        this.cache.set(key, value, ttlSeconds);
      } else {
        this.cache.set(key, value);
      }
    } catch {
      throw new Error(`Failed to set cache entry for key: ${key}`);
    }
  }

  del(key: string): void {
    try {
      this.cache.del(key);
    } catch {
      throw new Error(`Failed to delete cache entry for key: ${key}`);
    }
  }

  has(key: string): boolean {
    try {
      return this.cache.has(key);
    } catch {
      throw new Error(`Failed to check cache entry for key: ${key}`);
    }
  }

  clear(): void {
    try {
      this.cache.flushAll();
    } catch {
      throw new Error('Failed to clear cache');
    }
  }

  getStats(): {
    keys: number;
    hits: number;
    misses: number;
    ksize: number;
    vsize: number;
  } {
    return this.cache.getStats();
  }

  close(): void {
    this.cache.close();
  }
}

// Default export for convenience
export const createCacheManager = (config?: CacheConfig): CacheManager => {
  return new NodeCacheManager(config);
};