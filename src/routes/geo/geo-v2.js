import express from "express";

import Division from "../../models/Division.js";
import District from "../../models/District.js";
import Upazila from "../../models/Upazila.js";
import Union from "../../models/Union.js";

const router = express.Router();

// 1. This API returns a list of all divisions in Bangladesh.
router.get(`/divisions`, async (req, res) => {
  try {
    const divisions = await Division.find().select("-_id");
    res.json({
      success: true,
      data: divisions,
      message: "Successfully retrieved all divisions.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve divisions.",
      error: error.message,
    });
  }
});

// 2. This API returns a flat list of all districts in Bangladesh.
router.get(`/districts`, async (req, res) => {
  try {
    const districts = await District.find().select("-_id");
    res.json({
      success: true,
      data: districts,
      message: "Successfully retrieved all districts.",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to retrieve all districts.",
      error: error.message,
    });
  }
});

// 3. This API returns a flat list of all upazilas in Bangladesh.
router.get(`/upazilas`, async (req, res) => {
  try {
    const upazilas = await Upazila.find().select("-_id");
    res.json({
      success: true,
      data: upazilas,
      message: "Successfully retrieved all upazilas.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve all upazilas.",
      error: error.message,
    });
  }
});

// 4. This API returns a list of districts for a specific division.
router.get(`/districts/:id`, async (req, res) => {
  const { id: divisionID } = req.params;

  try {
    const districts = await District.find({ division_id: divisionID }).select(
      "-_id -division_id"
    );

    if (!districts || districts.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `No districts found for division ID : ${divisionID}.`,
      });
    }

    res.json({
      success: true,
      data: districts,
      message: `Successfully retrieved districts for division ID ${divisionID}.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve districts by division.",
      error: error.message,
    });
  }
});

// 5. This API returns a list of upazilas for a specific district.
router.get(`/upazilas/:id`, async (req, res) => {
  const { id: districtID } = req.params;
  try {
    const upazilas = await Upazila.find({ district_id: districtID }).select(
      "-_id -district_id"
    );

    if (!upazilas || upazilas.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `No upazilas found for district ID : ${districtID}.`,
      });
    }

    res.json({
      success: true,
      data: upazilas,
      message: `Successfully retrieved upazilas for district ID ${districtID}.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve upazilas by district.",
      error: error.message,
    });
  }
});

// 6. This API returns a list of unions for a specific upazila.
router.get(`/unions/:id`, async (req, res) => {
  const { id: upazilaID } = req.params;
  try {
    const unions = await Union.find({ upazila_id: upazilaID }).select(
      "-_id -upazila_id"
    );

    if (!unions || unions.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `No unions found for upazila ID : ${upazilaID}.`,
      });
    }

    res.json({
      success: true,
      data: unions,
      message: `Successfully retrieved unions for upazila ID ${upazilaID}.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve unions by upazila.",
      error: error.message,
    });
  }
});

export default router;
