import { TwineClass } from "./_TwineClass";

type CacheId = string;

type CacheKey = string | number;

/**
 * State variable `$cache` is set to this singleton.
 */
export class Cache extends TwineClass {
  cache: {
    [cacheId: CacheId]: {
      [k: CacheKey]: any;
    };
  } = {};

  constructor() {
    super();
    this.cache ??= {};
  }

  override toJSON(): {} {
    // Don't let the cache data be serialized into the state,
    // by passing an empty object as the data to store
    return Serial.createReviver(`new setup.Cache()`);
  }

  /**
   * Caches a value.
   */
  set(cacheId: CacheId, key: CacheKey, value: any): void {
    (this.cache[cacheId] ??= {})[key] = value;
  }

  has(cacheId: CacheId, key: CacheKey): boolean {
    const cache_values = this.cache[cacheId];
    return cache_values && key in cache_values;
  }

  /**
   * Gets a cached value
   */
  get<T = any>(cacheId: CacheId, key: CacheKey): T | null {
    const cache_values = this.cache[cacheId];
    if (!cache_values || !(key in cache_values)) return null;
    return cache_values[key] as T;
  }

  /**
   * Clear a cached value
   */
  clear(cacheId: CacheId, key: CacheKey): void {
    const cache_values = this.cache[cacheId];
    if (!cache_values || !(key in cache_values)) return;
    delete cache_values[key];
  }

  /**
   * Clear all values from the cache.
   */
  clearAll(): void {
    this.cache = {};
  }
}
