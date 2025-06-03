import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';

export class CacheUtils {
  static async safeGet<T>(
    cache: Cache,
    key: string,
    logger: Logger,
  ): Promise<T | null> {
    try {
      const value = await cache.get<T>(key);
      return value ?? null;
    } catch (error) {
      logger.warn(`Failed to retrieve cached value for key: ${key}`, error);
      return null;
    }
  }

  static async safeSet<T>(
    cache: Cache,
    key: string,
    value: T,
    ttl: number,
    logger: Logger,
  ): Promise<void> {
    try {
      await cache.set(key, value, ttl);
    } catch (error) {
      logger.warn(`Failed to cache value for key: ${key}`, error);
    }
  }
}
