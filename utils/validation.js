const { validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const validationError = new Sequelize.ValidationError('Validation error');

        // Map validation errors to Sequelize.ValidationErrorItem format
        validationError.errors = errors.array().map(error => ({
            ...error,
            message: "Registration unsuccessful",
        }));

        // Pass the validation error to the next middleware
        next(validationError);
    }

    next();
};

module.exports = { handleValidationErrors };
