import express from "express";
import bdGeoData from "../../database/data.js";

const router = express.Router();

// 1. This API returns a list of all divisions in Bangladesh.
router.get(`/divisions`, (req, res) => {
  try {
    const divisions = bdGeoData.map((div) => div.division);
    res.json({
      success: true,
      data: divisions,
      message: "Successfully retrieved all divisions.",
    });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve divisions.",
      error: error.message,
    });
  }
});

// 2. This API returns a flat list of all districts in Bangladesh.
router.get(`/districts`, (req, res) => {
  try {
    const allDistricts = bdGeoData.flatMap((div) =>
      div.districts.map((dist) => dist.district)
    );
    res.json({
      success: true,
      data: allDistricts,
      message: "Successfully retrieved all districts.",
    });
  } catch (error) {
    console.error("Error fetching all districts:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to retrieve all districts.",
      error: error.message,
    });
  }
});

// 3. This API returns a flat list of all upazilas in Bangladesh.
router.get(`/upazilas`, (req, res) => {
  try {
    const allUpazilas = bdGeoData.flatMap((div) =>
      div.districts.flatMap((dist) => dist.upazilas)
    );
    res.json({
      success: true,
      data: allUpazilas,
      message: "Successfully retrieved all upazilas.",
    });
  } catch (error) {
    console.error("Error fetching all upazilas:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve all upazilas.",
      error: error.message,
    });
  }
});

// 4. This API returns a list of districts for a specific division.
router.get(`/districts/:divisionName`, (req, res) => {
  try {
    const divisionName = req.params.divisionName
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    const division = bdGeoData.find(
      (div) => div.division.toLowerCase() === divisionName.toLowerCase()
    );

    if (division) {
      const districts = division.districts.map((dist) => dist.district);
      res.json({
        success: true,
        data: districts,
        message: `Successfully retrieved districts for ${division.division} division.`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Division '${divisionName}' not found.`,
      });
    }
  } catch (error) {
    console.error(
      `Error fetching districts for division ${req.params.divisionName}:`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to retrieve districts by division.",
      error: error.message,
    });
  }
});

// 5. This API returns a list of upazilas for a specific district.
router.get(`/upazilas/:districtName`, (req, res) => {
  try {
    const districtName = req.params.districtName
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    let upazilas = [];
    let foundDistrict = null;

    for (const division of bdGeoData) {
      const district = division.districts.find(
        (dist) => dist.district.toLowerCase() === districtName.toLowerCase()
      );
      if (district) {
        upazilas = district.upazilas;
        foundDistrict = district.district;
        break;
      }
    }

    if (foundDistrict) {
      res.json({
        success: true,
        data: upazilas,
        message: `Successfully retrieved upazilas for ${foundDistrict} district.`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: `District '${districtName}' not found.`,
      });
    }
  } catch (error) {
    console.error(
      `Error fetching upazilas for district ${req.params.districtName}:`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to retrieve upazilas by district.",
      error: error.message,
    });
  }
});

export default router;
