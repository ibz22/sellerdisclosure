const properties = require('../data/properties.json');

class PropertyNotFoundError extends Error {
  constructor(message = 'Property not found.') {
    super(message);
    this.name = 'PropertyNotFoundError';
  }
}

const PAGE_SIZE = 20;

function normaliseSuburb(suburb) {
  return suburb.trim().toLowerCase();
}

function searchProperties({ suburb, minPrice, maxPrice, page = 1, pageSize = PAGE_SIZE }) {
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

  return {
    results,
    pagination: {
      page,
      pageSize: size,
      total,
    },
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
};
