import express from "express";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { validateDivisionName, validateDistrictName } from "../../middleware/validation.js";
import bdGeoData from "../../database/data.js";

const router = express.Router();

// 1. This API returns a list of all divisions in Bangladesh.
router.get(`/divisions`, asyncHandler(async (req, res) => {
  const divisions = bdGeoData.map((div) => div.division);
  
  res.json({
    success: true,
    data: divisions,
    message: "Successfully retrieved all divisions.",
    count: divisions.length,
    timestamp: new Date().toISOString()
  });
}));

// 2. This API returns a flat list of all districts in Bangladesh.
router.get(`/districts`, asyncHandler(async (req, res) => {
  const allDistricts = bdGeoData.flatMap((div) =>
    div.districts.map((dist) => dist.district)
  );
  
  res.json({
    success: true,
    data: allDistricts,
    message: "Successfully retrieved all districts.",
    count: allDistricts.length,
    timestamp: new Date().toISOString()
  });
}));

// 3. This API returns a flat list of all upazilas in Bangladesh.
router.get(`/upazilas`, asyncHandler(async (req, res) => {
  const allUpazilas = bdGeoData.flatMap((div) =>
    div.districts.flatMap((dist) => dist.upazilas)
  );
  
  res.json({
    success: true,
    data: allUpazilas,
    message: "Successfully retrieved all upazilas.",
    count: allUpazilas.length,
    timestamp: new Date().toISOString()
  });
}));

// 4. This API returns a list of districts for a specific division.
router.get(`/districts/:divisionName`, validateDivisionName, asyncHandler(async (req, res) => {
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
      count: districts.length,
      division: division.division,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(404).json({
      success: false,
      message: `Division '${divisionName}' not found.`,
      timestamp: new Date().toISOString()
    });
  }
}));

// 5. This API returns a list of upazilas for a specific district.
router.get(`/upazilas/:districtName`, validateDistrictName, asyncHandler(async (req, res) => {
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
      count: upazilas.length,
      district: foundDistrict,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(404).json({
      success: false,
      message: `District '${districtName}' not found.`,
      timestamp: new Date().toISOString()
    });
  }
}));

// 6. Search endpoint for finding entities by name
router.get(`/search/:query`, asyncHandler(async (req, res) => {
  const { query } = req.params;
  const { type = 'all' } = req.query;
  
  if (!query || query.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Search query must be at least 2 characters long.",
      timestamp: new Date().toISOString()
    });
  }

  const searchRegex = new RegExp(query, 'i');
  const results = {};

  try {
    if (type === 'all' || type === 'divisions') {
      results.divisions = bdGeoData
        .filter(div => searchRegex.test(div.division))
        .map(div => div.division);
    }

    if (type === 'all' || type === 'districts') {
      results.districts = bdGeoData
        .flatMap(div => div.districts)
        .filter(dist => searchRegex.test(dist.district))
        .map(dist => dist.district);
    }

    if (type === 'all' || type === 'upazilas') {
      results.upazilas = bdGeoData
        .flatMap(div => div.districts)
        .flatMap(dist => dist.upazilas)
        .filter(upazila => searchRegex.test(upazila))
        .map(upazila => upazila);
    }

    const totalCount = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

    res.json({
      success: true,
      data: results,
      message: `Search results for "${query}"`,
      count: totalCount,
      query,
      type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search operation failed",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}));

export default router;
