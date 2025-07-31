import express from "express";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { validateId } from "../../middleware/validation.js";

import Division from "../../models/Division.js";
import District from "../../models/District.js";
import Upazila from "../../models/Upazila.js";
import Union from "../../models/Union.js";

const router = express.Router();

// Middleware to handle unsupported HTTP methods
const methodNotAllowed = (req, res, next) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed for this endpoint. Only GET requests are supported.`,
      allowedMethods: ["GET"],
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

// 1. This API returns a list of all divisions in Bangladesh.
router.get(
  `/divisions`,
  asyncHandler(async (req, res) => {
    const divisions = await Division.find().select("-_id").lean();

    res.json({
      success: true,
      data: divisions,
      message: "Successfully retrieved all divisions.",
      count: divisions.length,
      timestamp: new Date().toISOString(),
    });
  })
);

// 2. This API returns a flat list of all districts in Bangladesh.
router.get(
  `/districts`,
  asyncHandler(async (req, res) => {
    const districts = await District.find().select("-_id").lean();

    res.json({
      success: true,
      data: districts,
      message: "Successfully retrieved all districts.",
      count: districts.length,
      timestamp: new Date().toISOString(),
    });
  })
);

// 3. This API returns a flat list of all upazilas in Bangladesh.
router.get(
  `/upazilas`,
  asyncHandler(async (req, res) => {
    const upazilas = await Upazila.find().select("-_id").lean();

    res.json({
      success: true,
      data: upazilas,
      message: "Successfully retrieved all upazilas.",
      count: upazilas.length,
      timestamp: new Date().toISOString(),
    });
  })
);

// 4. This API returns a list of districts for a specific division.
router.get(
  `/districts/:id`,
  validateId,
  asyncHandler(async (req, res) => {
    const { id: divisionID } = req.params;

    const districts = await District.find({ division_id: divisionID })
      .select("-_id -division_id")
      .lean();

    if (!districts || districts.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `No districts found for division ID: ${divisionID}.`,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: districts,
      message: `Successfully retrieved districts for division ID ${divisionID}.`,
      count: districts.length,
      timestamp: new Date().toISOString(),
    });
  })
);

// 5. This API returns a list of upazilas for a specific district.
router.get(
  `/upazilas/:id`,
  validateId,
  asyncHandler(async (req, res) => {
    const { id: districtID } = req.params;

    const upazilas = await Upazila.find({ district_id: districtID })
      .select("-_id -district_id")
      .lean();

    if (!upazilas || upazilas.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `No upazilas found for district ID: ${districtID}.`,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: upazilas,
      message: `Successfully retrieved upazilas for district ID ${districtID}.`,
      count: upazilas.length,
      timestamp: new Date().toISOString(),
    });
  })
);

// 6. This API returns a list of unions for a specific upazila.
router.get(
  `/unions/:id`,
  validateId,
  asyncHandler(async (req, res) => {
    const { id: upazilaID } = req.params;

    const unions = await Union.find({ upazila_id: upazilaID })
      .select("-_id -upazila_id")
      .lean();

    if (!unions || unions.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `No unions found for upazila ID: ${upazilaID}.`,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: unions,
      message: `Successfully retrieved unions for upazila ID ${upazilaID}.`,
      count: unions.length,
      timestamp: new Date().toISOString(),
    });
  })
);

// 7. Search endpoint for finding entities by name
router.get(
  `/search/:query`,
  asyncHandler(async (req, res) => {
    const { query } = req.params;
    const { type = "all" } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters long.",
        timestamp: new Date().toISOString(),
      });
    }

    const searchRegex = new RegExp(query, "i");
    const results = {};

    try {
      if (type === "all" || type === "divisions") {
        results.divisions = await Division.find({
          $or: [{ name: searchRegex }, { bn_name: searchRegex }],
        })
          .select("-_id")
          .lean();
      }

      if (type === "all" || type === "districts") {
        results.districts = await District.find({
          $or: [{ name: searchRegex }, { bn_name: searchRegex }],
        })
          .select("-_id")
          .lean();
      }

      if (type === "all" || type === "upazilas") {
        results.upazilas = await Upazila.find({
          $or: [{ name: searchRegex }, { bn_name: searchRegex }],
        })
          .select("-_id")
          .lean();
      }

      if (type === "all" || type === "unions") {
        results.unions = await Union.find({
          $or: [{ name: searchRegex }, { bn_name: searchRegex }],
        })
          .select("-_id")
          .lean();
      }

      const totalCount = Object.values(results).reduce(
        (sum, arr) => sum + arr.length,
        0
      );

      res.json({
        success: true,
        data: results,
        message: `Search results for "${query}"`,
        count: totalCount,
        query,
        type,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Search operation failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  })
);

export default router;
