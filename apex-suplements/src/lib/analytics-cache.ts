import type { AnalyticsCache, AnalyticsFilters } from '@/types/analytics';

class AnalyticsCacheManager {
  private cache: Map<string, AnalyticsCache> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any): void {
    const now = Date.now();
    const expiresAt = now + this.CACHE_DURATION;

    this.cache.set(key, {
      key,
      data,
      timestamp: now,
      expires_at: expiresAt
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expires_at) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  has(key: string): boolean {
    return this.cache.has(key) && Date.now() <= (this.cache.get(key)?.expires_at || 0);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  generateKey(operation: string, filters?: AnalyticsFilters): string {
    const filterString = filters ? JSON.stringify(filters) : 'default';
    return `${operation}_${filterString}`;
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const analyticsCache = new AnalyticsCacheManager();

// Cache decorator for analytics functions
export const withCache = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operation: string
) => {
  return async (...args: T): Promise<R> => {
    const filters = args[0] as AnalyticsFilters | undefined;
    const cacheKey = analyticsCache.generateKey(operation, filters);

    // Check cache first
    const cached = analyticsCache.get(cacheKey);
    if (cached) {
      return cached as R;
    }

    // Execute function and cache result
    const result = await fn(...args);
    analyticsCache.set(cacheKey, result);

    return result;
  };
};