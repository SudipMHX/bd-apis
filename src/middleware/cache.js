import NodeCache from "node-cache";

// Create cache instance with 5 minutes default TTL
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 600, // Check for expired keys every 10 minutes
  maxKeys: 1000, // Maximum number of keys in cache
});

// Cache middleware
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = `__bd_api__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      // Add cache hit header
      res.set("X-Cache", "HIT");
      return res.json(cachedResponse);
    }

    // Store original json function
    const originalJson = res.json;
    res.json = function (data) {
      // Cache the response
      cache.set(key, data, duration);

      // Add cache miss header
      res.set("X-Cache", "MISS");

      // Call original json function
      return originalJson.call(this, data);
    };

    next();
  };
};

// Clear cache middleware (for admin use)
export const clearCache = (req, res) => {
  cache.flushAll();
  res.json({
    success: true,
    message: "Cache cleared successfully",
  });
};

// Get cache stats
export const getCacheStats = (req, res) => {
  const stats = cache.getStats();
  res.json({
    success: true,
    data: {
      keys: stats.keys,
      hits: stats.hits,
      misses: stats.misses,
      hitRate: (stats.hits / (stats.hits + stats.misses)) * 100,
    },
  });
};

export default cache;
