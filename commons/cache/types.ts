/**
 * Cache types and interfaces
 * Generic caching functionality for all Lerian libraries
 */

export interface CacheManager {
  get(key: string): any | undefined;
  set(key: string, value: any, ttlSeconds?: number): void;
  del(key: string): void;
  has(key: string): boolean;
  clear(): void;
  getStats(): {
    keys: number;
    hits: number;
    misses: number;
    ksize: number;
    vsize: number;
  };
  close(): void;
}

export interface CacheConfig {
  defaultTtl?: number;
  checkPeriod?: number;
  useClones?: boolean;
  deleteOnExpire?: boolean;
}