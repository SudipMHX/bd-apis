import mongoose from "mongoose";
import { createIndexes } from "./indexes.js";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MongoDB_URI, {
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
      bufferCommands: false, // Disable mongoose buffering
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    });

    console.log(`✅ — MongoDB Connected: ${connection.connection.host}`);

    // Create database indexes for optimization
    await createIndexes();

    // Monitor connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("MongoDB reconnected");
      }
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      if (process.env.NODE_ENV !== "production") {
        console.log("MongoDB connection closed through app termination");
      }
      process.exit(0);
    });
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};
