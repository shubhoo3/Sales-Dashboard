const Joi = require('joi');

const validateDateRange = (req, res, next) => {
  const schema = Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
  });

  const { error, value } = schema.validate({
    startDate: req.query.startDate,
    endDate: req.query.endDate
  });

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }

  req.dateRange = value;
  next();
};

const validateAnalyticsQuery = (req, res, next) => {
  const schema = Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    region: Joi.string().valid('North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania').optional(),
    category: Joi.string().valid('Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Beauty', 'Automotive', 'Food & Beverage').optional(),
    limit: Joi.number().integer().min(1).max(100).default(10)
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }

  req.validatedQuery = value;
  next();
};

const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(error.errors).map(err => err.message)
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
};

module.exports = {
  validateDateRange,
  validateAnalyticsQuery,
  errorHandler
};