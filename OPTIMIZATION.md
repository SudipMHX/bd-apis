# Bangladesh APIs - Performance Optimizations

This document outlines the comprehensive optimizations implemented to handle high traffic and prevent server crashes.

## 🚀 Performance Optimizations

### 1. Rate Limiting
- **Global Rate Limit**: 100 requests per 15 minutes per IP
- **API Rate Limit**: 50 requests per 15 minutes per IP for API endpoints
- **Configurable**: Rate limits can be adjusted via environment variables

### 2. Caching System
- **In-Memory Caching**: Using NodeCache for fast response times
- **Cache Duration**: 5 minutes for API responses
- **Cache Headers**: X-Cache header indicates cache hit/miss
- **Cache Management**: Endpoints to view stats and clear cache

### 3. Database Optimizations
- **Connection Pooling**: MongoDB connection pool with 10 max connections
- **Database Indexes**: Optimized indexes on all frequently queried fields
- **Query Optimization**: Using `.lean()` for faster queries
- **Connection Monitoring**: Real-time connection health monitoring

### 4. Compression
- **Gzip Compression**: Reduces response size by up to 70%
- **Configurable Level**: Compression level 6 for optimal performance
- **Threshold**: Only compresses responses > 1KB

### 5. Security Enhancements
- **Helmet.js**: Security headers protection
- **CORS Configuration**: Configurable cross-origin requests
- **Input Validation**: Request parameter validation
- **Error Handling**: Comprehensive error handling without exposing sensitive data

### 6. Monitoring & Logging
- **Performance Monitoring**: Request response time tracking
- **Memory Monitoring**: Automatic memory usage monitoring
- **Request Counting**: Track total requests and error rates
- **Slow Request Detection**: Logs requests taking > 1 second

### 7. Error Handling
- **Graceful Error Handling**: Prevents server crashes
- **Async Error Wrapper**: Automatic error catching for async routes
- **Custom Error Messages**: User-friendly error responses
- **Error Logging**: Detailed error logging for debugging

## 📊 Monitoring Endpoints

### Health Check
```
GET /health
```
Returns server health status, uptime, and memory usage.

### Cache Statistics
```
GET /cache/stats
```
Returns cache hit rate, keys count, and performance metrics.

### Server Statistics
```
GET /stats
```
Returns request count, error rate, and server performance metrics.

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Configuration
MongoDB_URI=mongodb://localhost:27017/bd-apis

# Security Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
API_RATE_LIMIT_MAX_REQUESTS=50

# Cache Configuration
CACHE_TTL=300
CACHE_MAX_KEYS=1000

# Monitoring Configuration
ENABLE_MONITORING=true
MEMORY_WARNING_THRESHOLD=500
```

## 🛡️ Crash Prevention Features

### 1. Memory Management
- Automatic memory monitoring
- Warning alerts for high memory usage
- Garbage collection optimization

### 2. Connection Management
- MongoDB connection pooling
- Automatic reconnection handling
- Connection timeout management

### 3. Request Handling
- Request size limits (10MB)
- Input validation
- Rate limiting to prevent abuse

### 4. Error Recovery
- Graceful shutdown handling
- Unhandled exception catching
- Process monitoring

## 📈 Performance Metrics

### Expected Performance
- **Response Time**: < 100ms for cached responses
- **Throughput**: 1000+ requests per second
- **Memory Usage**: < 500MB under normal load
- **Error Rate**: < 1% under normal conditions

### Monitoring Alerts
- Slow requests (> 1 second)
- High memory usage (> 500MB)
- High error rates (> 5%)
- Database connection issues

## 🔄 New Features Added

### 1. Search Endpoint
```
GET /geo/v1.0/search/:query
GET /geo/v2.0/search/:query
```
Search across all geographical entities by name.

### 2. Enhanced Response Format
All API responses now include:
- `count`: Number of items returned
- `timestamp`: Response timestamp
- `success`: Boolean status
- `message`: Descriptive message

### 3. Cache Headers
- `X-Cache`: HIT/MISS indicator
- `X-Response-Time`: Request processing time
- `Cache-Control`: Browser caching directives

## 🚀 Deployment Recommendations

### 1. Production Environment
- Use PM2 or similar process manager
- Enable load balancing for multiple instances
- Use Redis for distributed caching (optional)
- Monitor with tools like New Relic or DataDog

### 2. Database Optimization
- Use MongoDB Atlas or dedicated MongoDB instance
- Enable MongoDB query logging
- Regular database maintenance
- Monitor database performance

### 3. Server Configuration
- Use Node.js 18+ for better performance
- Enable HTTP/2 for better compression
- Use CDN for static assets
- Implement proper logging rotation

## 📝 API Usage Examples

### Basic Usage
```bash
# Get all divisions
curl https://your-api.com/geo/v2.0/divisions

# Get districts by division ID
curl https://your-api.com/geo/v2.0/districts/10

# Search for entities
curl https://your-api.com/geo/v2.0/search/dhaka?type=districts
```

### With Caching
```bash
# Check cache status in response headers
curl -I https://your-api.com/geo/v2.0/divisions
# Look for X-Cache: HIT or X-Cache: MISS
```

## 🔍 Troubleshooting

### Common Issues
1. **High Memory Usage**: Check for memory leaks in routes
2. **Slow Responses**: Monitor database query performance
3. **Rate Limit Errors**: Adjust rate limiting configuration
4. **Cache Issues**: Clear cache using `/cache/clear` endpoint

### Debug Endpoints
- `/health`: Server health status
- `/stats`: Performance metrics
- `/cache/stats`: Cache performance

## 📚 Additional Resources

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practices-performance.html)
- [MongoDB Performance Optimization](https://docs.mongodb.com/manual/core/performance-optimization/)
- [Node.js Performance Monitoring](https://nodejs.org/en/docs/guides/simple-profiling/) 