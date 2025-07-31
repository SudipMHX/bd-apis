// Performance monitoring middleware
export const performanceMonitor = (req, res, next) => {
  const start = Date.now();

  // Override res.json to add response time header
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    this.setHeader("X-Response-Time", `${duration}ms`);
    return originalJson.call(this, data);
  };

  // Override res.send to add response time header
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    this.setHeader("X-Response-Time", `${duration}ms`);
    return originalSend.call(this, data);
  };

  // Log request metrics after response is sent
  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn(
        `🐌 Slow request: ${method} ${originalUrl} - ${duration}ms - ${statusCode} - ${ip}`
      );
    }

    // Log request metrics only in development
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `${method} ${originalUrl} - ${duration}ms - ${statusCode} - ${ip}`
      );
    }
  });

  next();
};

// Memory usage monitoring
export const memoryMonitor = () => {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
    heapTotal: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100,
    heapUsed: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
    external: Math.round((memUsage.external / 1024 / 1024) * 100) / 100,
  };

  // Log memory usage every 5 minutes only in development
  if (process.env.NODE_ENV !== "production") {
    console.log(`📊 Memory Usage:`, memUsageMB);
  }

  // Warning for high memory usage
  if (memUsageMB.heapUsed > 500) {
    // 500MB
    console.warn(`⚠️ High memory usage: ${memUsageMB.heapUsed}MB`);
  }
};

// Start memory monitoring
setInterval(memoryMonitor, 5 * 60 * 1000); // Every 5 minutes

// Request counter
let requestCount = 0;
let errorCount = 0;

export const requestCounter = (req, res, next) => {
  requestCount++;
  next();
};

export const errorCounter = (err, req, res, next) => {
  errorCount++;
  next(err);
};

export const getStats = () => ({
  requestCount,
  errorCount,
  errorRate:
    requestCount > 0 ? ((errorCount / requestCount) * 100).toFixed(2) : 0,
  uptime: process.uptime(),
  memory: process.memoryUsage(),
});
