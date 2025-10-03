const properties = require('../data/properties.json');

class PropertyNotFoundError extends Error {
  constructor(message = 'Property not found.') {
    super(message);
    this.name = 'PropertyNotFoundError';
  }
}

const PAGE_SIZE = 20;
const DEFAULT_LOCATION_RADIUS_METERS = 100;

function normaliseSuburb(suburb) {
  return suburb.trim().toLowerCase();
}

function buildLocationContext(coordinates) {
  if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
    return null;
  }

  return {
    searchOrigin: {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
    radiusMeters: DEFAULT_LOCATION_RADIUS_METERS,
  };
}

function searchProperties({ suburb, minPrice, maxPrice, coordinates, page = 1, pageSize = PAGE_SIZE }) {
  let filtered = properties;

  if (suburb) {
    const target = normaliseSuburb(suburb);
    filtered = filtered.filter((property) => normaliseSuburb(property.suburb) === target);
  }

  if (typeof minPrice === 'number') {
    filtered = filtered.filter((property) => property.price >= minPrice);
  }

  if (typeof maxPrice === 'number') {
    filtered = filtered.filter((property) => property.price <= maxPrice);
  }

  const total = filtered.length;
  const size = pageSize;
  const start = (page - 1) * size;
  const end = start + size;
  const results = filtered.slice(start, end);

  const locationContext = buildLocationContext(coordinates);

  return {
    results,
    pagination: {
      page,
      pageSize: size,
      total,
    },
    locationContext,
  };
}

function getPropertyById(id) {
  const property = properties.find((item) => item.id === id);

  if (!property) {
    throw new PropertyNotFoundError();
  }

  return property;
}

module.exports = {
  searchProperties,
  getPropertyById,
  PropertyNotFoundError,
  PAGE_SIZE,
  DEFAULT_LOCATION_RADIUS_METERS,
  buildLocationContext,
};
