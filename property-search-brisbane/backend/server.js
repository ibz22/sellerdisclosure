require('dotenv').config();
const express = require('express');
const {
  searchProperties,
  getPropertyById,
  PropertyNotFoundError,
  PAGE_SIZE,
} = require('./services/propertyService');
const {
  geocodeAddress,
  GeocodingError,
  GeocodingNotFoundError,
  GeocodingConfigurationError,
} = require('./services/geocodingService');

const app = express();

const PORT = process.env.PORT || 3000;
const ERROR_CODES = {
  INVALID_REQUEST: 'INVALID_REQUEST',
  NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INTERNAL: 'INTERNAL_SERVER_ERROR',
};

app.use(express.json());

function respondWithError(res, status, code, message) {
  return res.status(status).json({
    error: {
      code,
      message,
    },
  });
}

function parseNumericQuery(value, field) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${field} must be a valid number.`);
  }
  return parsed;
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/properties', async (req, res, next) => {
  try {
    const { suburb, minPrice, maxPrice, page, address } = req.query;
    const filters = {};

    if (suburb !== undefined) {
      if (typeof suburb !== 'string' || !suburb.trim()) {
        return respondWithError(
          res,
          400,
          ERROR_CODES.INVALID_REQUEST,
          'suburb must be a non-empty string when provided.'
        );
      }
      filters.suburb = suburb.trim();
    }

    if (address !== undefined) {
      if (typeof address !== 'string' || !address.trim()) {
        return respondWithError(
          res,
          400,
          ERROR_CODES.INVALID_REQUEST,
          'address must be a non-empty string when provided.'
        );
      }
    }

    if (minPrice !== undefined) {
      const value = parseNumericQuery(minPrice, 'minPrice');
      if (value < 0) {
        return respondWithError(
          res,
          400,
          ERROR_CODES.INVALID_REQUEST,
          'minPrice must be greater than or equal to 0.'
        );
      }
      filters.minPrice = value;
    }

    if (maxPrice !== undefined) {
      const value = parseNumericQuery(maxPrice, 'maxPrice');
      if (value < 0) {
        return respondWithError(
          res,
          400,
          ERROR_CODES.INVALID_REQUEST,
          'maxPrice must be greater than or equal to 0.'
        );
      }
      filters.maxPrice = value;
    }

    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined &&
      filters.minPrice > filters.maxPrice
    ) {
      return respondWithError(
        res,
        400,
        ERROR_CODES.INVALID_REQUEST,
        'minPrice cannot be greater than maxPrice.'
      );
    }

    if (page !== undefined) {
      const value = parseNumericQuery(page, 'page');
      if (!Number.isInteger(value) || value < 1) {
        return respondWithError(
          res,
          400,
          ERROR_CODES.INVALID_REQUEST,
          'page must be a positive integer when provided.'
        );
      }
      filters.page = value;
    } else {
      filters.page = 1;
    }

    let coordinates;
    if (address !== undefined) {
      try {
        coordinates = await geocodeAddress(address.trim());
      } catch (error) {
        if (error instanceof GeocodingNotFoundError) {
          return respondWithError(
            res,
            400,
            ERROR_CODES.INVALID_REQUEST,
            'No geocoding results were found for the supplied address.'
          );
        }
        if (error instanceof GeocodingConfigurationError) {
          return respondWithError(
            res,
            500,
            ERROR_CODES.INTERNAL,
            error.message
          );
        }
        if (error instanceof GeocodingError) {
          return respondWithError(
            res,
            400,
            ERROR_CODES.INVALID_REQUEST,
            error.message
          );
        }
        throw error;
      }
    }

    const { results, pagination, locationContext } = searchProperties({
      suburb: filters.suburb,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      page: filters.page,
      pageSize: PAGE_SIZE,
      coordinates,
    });

    const data = results.map((property) => ({
      id: property.id,
      address: property.address,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parking: property.parking,
    }));

    const responseBody = {
      data,
      pagination,
    };

    if (locationContext) {
      responseBody.locationContext = locationContext;
    }

    return res.json(responseBody);
  } catch (error) {
    if (error.message && error.message.includes('must be a valid number')) {
      return respondWithError(
        res,
        400,
        ERROR_CODES.INVALID_REQUEST,
        error.message
      );
    }
    return next(error);
  }
});

app.get('/properties/:id', (req, res, next) => {
  try {
    const property = getPropertyById(req.params.id);
    return res.json({
      id: property.id,
      address: property.address,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parking: property.parking,
      description: property.description,
    });
  } catch (error) {
    if (error instanceof PropertyNotFoundError) {
      return respondWithError(
        res,
        404,
        ERROR_CODES.NOT_FOUND,
        'Property not found.'
      );
    }
    return next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err); // eslint-disable-line no-console
  return respondWithError(
    res,
    err.status || 500,
    err.code || ERROR_CODES.INTERNAL,
    err.message || 'An unexpected error occurred.'
  );
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
