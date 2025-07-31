import { body, param, validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validate ID parameter
export const validateId = [
  param('id')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('ID must be between 1 and 50 characters'),
  handleValidationErrors
];

// Validate division name parameter
export const validateDivisionName = [
  param('divisionName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Division name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Division name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('Division name can only contain letters, spaces, and hyphens'),
  handleValidationErrors
];

// Validate district name parameter
export const validateDistrictName = [
  param('districtName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('District name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('District name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('District name can only contain letters, spaces, and hyphens'),
  handleValidationErrors
];

// Validate pagination query parameters
export const validatePagination = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
]; 