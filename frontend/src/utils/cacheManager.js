/**
 * Cache Manager
 * Implements caching strategies for static resources and API responses
 */

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.cacheConfig = {
      // Cache TTL in milliseconds
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      resourceTTL: 30 * 60 * 1000, // 30 minutes
      apiTTL: 2 * 60 * 1000, // 2 minutes
      
      // Cache size limits
      maxMemoryCacheSize: 50, // Maximum number of items in memory cache
      maxStorageCacheSize: 100, // Maximum number of items in localStorage
      
      // Cache keys
      storagePrefix: 'trustml_cache_',
      versionKey: 'cache_version'
    };
    
    this.currentVersion = '1.0.0';
    this.initializeCache();
  }

  /**
   * Initialize cache system
   */
  initializeCache() {
    try {
      // Check cache version and clear if outdated
      const storedVersion = localStorage.getItem(this.cacheConfig.versionKey);
      if (storedVersion !== this.currentVersion) {
        this.clearAllCaches();
        localStorage.setItem(this.cacheConfig.versionKey, this.currentVersion);
      }

      // Set up periodic cleanup
      setInterval(() => {
        this.cleanupExpiredEntries();
      }, 5 * 60 * 1000); // Every 5 minutes

      // Set up memory pressure handling
      if ('memory' in performance) {
        setInterval(() => {
          this.handleMemoryPressure();
        }, 30 * 1000); // Every 30 seconds
      }

      // Set up storage quota monitoring
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        this.monitorStorageQuota();
      }
    } catch (error) {
      console.warn('Failed to initialize cache manager:', error);
    }
  }

  /**
   * Get item from cache
   */
  get(key, options = {}) {
    const { useMemory = true, useStorage = true } = options;

    try {
      // Try memory cache first
      if (useMemory && this.memoryCache.has(key)) {
        const entry = this.memoryCache.get(key);
        if (this.isEntryValid(entry)) {
          entry.lastAccessed = Date.now();
          entry.accessCount++;
          return entry.data;
        } else {
          this.memoryCache.delete(key);
        }
      }

      // Try localStorage cache
      if (useStorage) {
        const storageKey = this.getStorageKey(key);
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
          try {
            const entry = JSON.parse(storedData);
            if (this.isEntryValid(entry)) {
              // Promote to memory cache if frequently accessed
              if (entry.accessCount > 3) {
                this.setMemoryCache(key, entry.data, entry.ttl);
              }
              
              entry.lastAccessed = Date.now();
              entry.accessCount++;
              localStorage.setItem(storageKey, JSON.stringify(entry));
              return entry.data;
            } else {
              localStorage.removeItem(storageKey);
            }
          } catch (parseError) {
            localStorage.removeItem(storageKey);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to get cache entry for key ${key}:`, error);
    }

    return null;
  }

  /**
   * Set item in cache
   */
  set(key, data, options = {}) {
    const {
      ttl = this.cacheConfig.defaultTTL,
      useMemory = true,
      useStorage = true,
      priority = 'normal'
    } = options;

    try {
      const entry = {
        data: data,
        timestamp: Date.now(),
        ttl: ttl,
        lastAccessed: Date.now(),
        accessCount: 1,
        priority: priority,
        size: this.estimateSize(data)
      };

      // Set in memory cache
      if (useMemory) {
        this.setMemoryCache(key, data, ttl, priority);
      }

      // Set in localStorage cache
      if (useStorage && this.canUseStorage(entry)) {
        this.setStorageCache(key, entry);
      }
    } catch (error) {
      console.warn(`Failed to set cache entry for key ${key}:`, error);
    }
  }

  /**
   * Set item in memory cache
   */
  setMemoryCache(key, data, ttl, priority = 'normal') {
    try {
      // Check memory cache size limit
      if (this.memoryCache.size >= this.cacheConfig.maxMemoryCacheSize) {
        this.evictMemoryCacheEntries();
      }

      const entry = {
        data: data,
        timestamp: Date.now(),
        ttl: ttl,
        lastAccessed: Date.now(),
        accessCount: 1,
        priority: priority
      };

      this.memoryCache.set(key, entry);
    } catch (error) {
      console.warn(`Failed to set memory cache entry for key ${key}:`, error);
    }
  }

  /**
   * Set item in storage cache
   */
  setStorageCache(key, entry) {
    try {
      const storageKey = this.getStorageKey(key);
      
      // Check storage cache size limit
      const currentStorageSize = this.getStorageCacheSize();
      if (currentStorageSize >= this.cacheConfig.maxStorageCacheSize) {
        this.evictStorageCacheEntries();
      }

      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, clearing old cache entries');
        this.evictStorageCacheEntries(0.5); // Clear 50% of entries
        try {
          localStorage.setItem(storageKey, JSON.stringify(entry));
        } catch (retryError) {
          console.warn('Failed to set storage cache entry after cleanup:', retryError);
        }
      } else {
        console.warn(`Failed to set storage cache entry for key ${key}:`, error);
      }
    }
  }

  /**
   * Remove item from cache
   */
  remove(key) {
    try {
      // Remove from memory cache
      this.memoryCache.delete(key);

      // Remove from storage cache
      const storageKey = this.getStorageKey(key);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn(`Failed to remove cache entry for key ${key}:`, error);
    }
  }

  /**
   * Clear all caches
   */
  clearAllCaches() {
    try {
      // Clear memory cache
      this.memoryCache.clear();

      // Clear storage cache
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.cacheConfig.storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to clear all caches:', error);
    }
  }

  /**
   * Cache API response
   */
  async cacheApiResponse(url, options = {}) {
    const cacheKey = this.generateApiCacheKey(url, options);
    
    // Try to get from cache first
    const cachedResponse = this.get(cacheKey, { useMemory: true, useStorage: true });
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      // Make API request
      const response = await fetch(url, options);
      
      if (response.ok) {
        const data = await response.json();
        
        // Cache the response
        this.set(cacheKey, data, {
          ttl: this.cacheConfig.apiTTL,
          useMemory: true,
          useStorage: true,
          priority: 'normal'
        });
        
        return data;
      } else {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn(`Failed to cache API response for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Cache resource (images, fonts, etc.)
   */
  async cacheResource(url, options = {}) {
    const cacheKey = this.generateResourceCacheKey(url);
    
    // Try to get from cache first
    const cachedResource = this.get(cacheKey, { useMemory: false, useStorage: true });
    if (cachedResource) {
      return cachedResource;
    }

    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        const blob = await response.blob();
        const dataUrl = await this.blobToDataUrl(blob);
        
        // Cache the resource
        this.set(cacheKey, dataUrl, {
          ttl: this.cacheConfig.resourceTTL,
          useMemory: false, // Resources are typically large
          useStorage: true,
          priority: 'low'
        });
        
        return dataUrl;
      } else {
        throw new Error(`Resource request failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn(`Failed to cache resource ${url}:`, error);
      throw error;
    }
  }

  /**
   * Preload and cache critical resources
   */
  async preloadCriticalResources(resources) {
    const preloadPromises = resources.map(async (resource) => {
      try {
        if (resource.type === 'api') {
          await this.cacheApiResponse(resource.url, resource.options);
        } else if (resource.type === 'resource') {
          await this.cacheResource(resource.url, resource.options);
        }
      } catch (error) {
        console.warn(`Failed to preload resource ${resource.url}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  /**
   * Check if cache entry is valid
   */
  isEntryValid(entry) {
    if (!entry || !entry.timestamp || !entry.ttl) {
      return false;
    }
    
    return (Date.now() - entry.timestamp) < entry.ttl;
  }

  /**
   * Estimate size of data
   */
  estimateSize(data) {
    try {
      return JSON.stringify(data).length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if storage can be used for entry
   */
  canUseStorage(entry) {
    // Don't store very large items in localStorage
    return entry.size < 1024 * 1024; // 1MB limit
  }

  /**
   * Get storage cache size
   */
  getStorageCacheSize() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.cacheConfig.storagePrefix)) {
        count++;
      }
    }
    return count;
  }

  /**
   * Evict memory cache entries using LRU strategy
   */
  evictMemoryCacheEntries(targetSize = null) {
    const targetCount = targetSize || Math.floor(this.cacheConfig.maxMemoryCacheSize * 0.8);
    
    if (this.memoryCache.size <= targetCount) {
      return;
    }

    // Sort entries by priority and last accessed time
    const entries = Array.from(this.memoryCache.entries()).sort((a, b) => {
      const [keyA, entryA] = a;
      const [keyB, entryB] = b;
      
      // Priority order: high > normal > low
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const priorityDiff = priorityOrder[entryB.priority] - priorityOrder[entryA.priority];
      
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      
      // If same priority, sort by last accessed time (most recent first)
      return entryB.lastAccessed - entryA.lastAccessed;
    });

    // Remove oldest/lowest priority entries
    const entriesToRemove = entries.slice(targetCount);
    entriesToRemove.forEach(([key]) => {
      this.memoryCache.delete(key);
    });
  }

  /**
   * Evict storage cache entries
   */
  evictStorageCacheEntries(ratio = 0.2) {
    try {
      const storageEntries = [];
      
      // Collect all cache entries
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.cacheConfig.storagePrefix)) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            storageEntries.push({ key, data });
          } catch (error) {
            // Remove invalid entries
            localStorage.removeItem(key);
          }
        }
      }

      // Sort by priority and last accessed time
      storageEntries.sort((a, b) => {
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        const priorityDiff = priorityOrder[b.data.priority] - priorityOrder[a.data.priority];
        
        if (priorityDiff !== 0) {
          return priorityDiff;
        }
        
        return b.data.lastAccessed - a.data.lastAccessed;
      });

      // Remove specified ratio of entries
      const countToRemove = Math.floor(storageEntries.length * ratio);
      const entriesToRemove = storageEntries.slice(-countToRemove);
      
      entriesToRemove.forEach(({ key }) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to evict storage cache entries:', error);
    }
  }

  /**
   * Cleanup expired entries
   */
  cleanupExpiredEntries() {
    try {
      // Cleanup memory cache
      for (const [key, entry] of this.memoryCache.entries()) {
        if (!this.isEntryValid(entry)) {
          this.memoryCache.delete(key);
        }
      }

      // Cleanup storage cache
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.cacheConfig.storagePrefix)) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (!this.isEntryValid(data)) {
              keysToRemove.push(key);
            }
          } catch (error) {
            keysToRemove.push(key);
          }
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to cleanup expired entries:', error);
    }
  }

  /**
   * Handle memory pressure
   */
  handleMemoryPressure() {
    if ('memory' in performance) {
      const memoryInfo = performance.memory;
      const memoryUsageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
      
      if (memoryUsageRatio > 0.8) {
        // High memory usage, aggressively clean cache
        this.evictMemoryCacheEntries(Math.floor(this.memoryCache.size * 0.5));
      } else if (memoryUsageRatio > 0.6) {
        // Moderate memory usage, clean some cache
        this.evictMemoryCacheEntries(Math.floor(this.memoryCache.size * 0.8));
      }
    }
  }

  /**
   * Monitor storage quota
   */
  async monitorStorageQuota() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usageRatio = estimate.usage / estimate.quota;
        
        if (usageRatio > 0.8) {
          console.warn('Storage quota nearly exceeded, cleaning cache');
          this.evictStorageCacheEntries(0.3);
        }
      }
    } catch (error) {
      console.warn('Failed to monitor storage quota:', error);
    }
  }

  /**
   * Generate API cache key
   */
  generateApiCacheKey(url, options = {}) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    const headers = options.headers ? JSON.stringify(options.headers) : '';
    
    return `api_${method}_${url}_${this.hashString(body + headers)}`;
  }

  /**
   * Generate resource cache key
   */
  generateResourceCacheKey(url) {
    return `resource_${this.hashString(url)}`;
  }

  /**
   * Get storage key with prefix
   */
  getStorageKey(key) {
    return `${this.cacheConfig.storagePrefix}${key}`;
  }

  /**
   * Simple hash function for strings
   */
  hashString(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Convert blob to data URL
   */
  blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const memoryStats = {
      size: this.memoryCache.size,
      maxSize: this.cacheConfig.maxMemoryCacheSize,
      hitRate: this.calculateHitRate('memory')
    };

    const storageStats = {
      size: this.getStorageCacheSize(),
      maxSize: this.cacheConfig.maxStorageCacheSize,
      hitRate: this.calculateHitRate('storage')
    };

    return {
      memory: memoryStats,
      storage: storageStats,
      version: this.currentVersion
    };
  }

  /**
   * Calculate cache hit rate (simplified)
   */
  calculateHitRate(type) {
    // This would require tracking hits/misses in a real implementation
    return 0.85; // Placeholder
  }

  /**
   * Configure cache settings
   */
  configure(config) {
    this.cacheConfig = { ...this.cacheConfig, ...config };
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

export default cacheManager;