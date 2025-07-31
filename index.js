import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

import { connectDB } from "./src/config/db.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";
import {
  cacheMiddleware,
  clearCache,
  getCacheStats,
} from "./src/middleware/cache.js";
import {
  performanceMonitor,
  requestCounter,
  errorCounter,
  getStats,
} from "./src/middleware/monitoring.js";

import geoV1Routes from "./src/routes/geo/geo.js";
import geoV2Routes from "./src/routes/geo/geo-v2.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware - Disable CSP in development for TailwindCSS compatibility
if (process.env.NODE_ENV === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://cdn.tailwindcss.com",
            "https://fonts.googleapis.com",
          ],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://cdn.tailwindcss.com",
          ],
          fontSrc: [
            "'self'",
            "https://fonts.gstatic.com",
            "https://cdn.tailwindcss.com",
          ],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://cdn.tailwindcss.com"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );
} else {
  // In development, disable CSP completely
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
}

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Compression middleware
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// Request logging - only in development
if (process.env.NODE_ENV !== "production") {
  app.use(
    morgan("combined", {
      skip: (req, res) => res.statusCode < 400,
      stream: {
        write: (message) => console.log(message.trim()),
      },
    })
  );
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
      retryAfter: Math.ceil((15 * 60) / 60), // minutes
    });
  },
});

// Apply rate limiting to all routes
app.use(limiter);

// Stricter rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs for API routes
  message: {
    success: false,
    message: "API rate limit exceeded, please try again after 15 minutes",
  },
});

// Performance monitoring middleware
app.use(performanceMonitor);
app.use(requestCounter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files with caching
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "1d",
    etag: true,
    lastModified: true,
  })
);

// Front-end routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/geo-api-v1", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "v1.html"));
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || "2.0.0",
  });
});

// Cache management endpoints (protected in production)
app.get("/cache/stats", getCacheStats);
app.post("/cache/clear", clearCache);

// Server stats endpoint
app.get("/stats", (req, res) => {
  res.json({
    success: true,
    data: getStats(),
    message: "Server statistics retrieved successfully",
    timestamp: new Date().toISOString(),
  });
});

// BD APIs Geo Routes with rate limiting and caching
app.use(`/geo/v1.0`, apiLimiter, geoV1Routes);
app.use(`/geo/v2.0`, apiLimiter, cacheMiddleware(300), geoV2Routes); // 5 minutes cache

// 404 handler
app.use(notFound);

// Error counter middleware
app.use(errorCounter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("SIGTERM received, shutting down gracefully");
  }
  process.exit(0);
});

process.on("SIGINT", () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("SIGINT received, shutting down gracefully");
  }
  process.exit(0);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", err);
  process.exit(1);
});

// Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ — Server running on port: ${PORT}`);
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `🌍 — Environment: ${process.env.NODE_ENV || "development"}`
        );
        console.log(`📊 — Health check: http://localhost:${PORT}/health`);
      }
    });

    // Handle server errors
    server.on("error", (error) => {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

      switch (error.code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
