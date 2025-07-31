import Division from "../models/Division.js";
import District from "../models/District.js";
import Upazila from "../models/Upazila.js";
import Union from "../models/Union.js";

export const createIndexes = async () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("Creating database indexes...");
    }

    // Division indexes
    await Division.collection
      .createIndex({ id: 1 }, { unique: true })
      .catch(() => {});
    await Division.collection.createIndex({ name: 1 }).catch(() => {});
    await Division.collection.createIndex({ bn_name: 1 }).catch(() => {});
    await Division.collection
      .createIndex({ name: "text", bn_name: "text" })
      .catch(() => {});

    // District indexes
    await District.collection
      .createIndex({ id: 1 }, { unique: true })
      .catch(() => {});
    await District.collection.createIndex({ division_id: 1 }).catch(() => {});
    await District.collection.createIndex({ name: 1 }).catch(() => {});
    await District.collection.createIndex({ bn_name: 1 }).catch(() => {});
    await District.collection
      .createIndex({ name: "text", bn_name: "text" })
      .catch(() => {});
    await District.collection
      .createIndex({ division_id: 1, name: 1 })
      .catch(() => {});

    // Upazila indexes
    await Upazila.collection
      .createIndex({ id: 1 }, { unique: true })
      .catch(() => {});
    await Upazila.collection.createIndex({ district_id: 1 }).catch(() => {});
    await Upazila.collection.createIndex({ name: 1 }).catch(() => {});
    await Upazila.collection.createIndex({ bn_name: 1 }).catch(() => {});
    await Upazila.collection
      .createIndex({ name: "text", bn_name: "text" })
      .catch(() => {});
    await Upazila.collection
      .createIndex({ district_id: 1, name: 1 })
      .catch(() => {});

    // Union indexes
    await Union.collection
      .createIndex({ id: 1 }, { unique: true })
      .catch(() => {});
    await Union.collection.createIndex({ upazila_id: 1 }).catch(() => {});
    await Union.collection.createIndex({ name: 1 }).catch(() => {});
    await Union.collection.createIndex({ bn_name: 1 }).catch(() => {});
    await Union.collection
      .createIndex({ name: "text", bn_name: "text" })
      .catch(() => {});
    await Union.collection
      .createIndex({ upazila_id: 1, name: 1 })
      .catch(() => {});

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Database indexes created successfully");
    }
  } catch (error) {
    console.error("Error creating indexes:", error);
    // Don't exit process, just log the error
  }
};
