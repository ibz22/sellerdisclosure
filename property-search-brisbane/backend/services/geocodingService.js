const DEFAULT_RESULT_LIMIT = 1;

class GeocodingError extends Error {
  constructor(message = 'Unable to complete geocoding request.') {
    super(message);
    this.name = 'GeocodingError';
  }
}

class GeocodingConfigurationError extends GeocodingError {
  constructor(message = 'Geocoding service is not configured correctly.') {
    super(message);
    this.name = 'GeocodingConfigurationError';
  }
}

class GeocodingNotFoundError extends GeocodingError {
  constructor(message = 'No matching coordinates were found for the supplied address.') {
    super(message);
    this.name = 'GeocodingNotFoundError';
  }
}

function buildRequestUrl(address) {
  const endpoint = process.env.GEOCODING_API_URL;
  const apiKey = process.env.GEOCODING_API_KEY;

  if (!endpoint) {
    throw new GeocodingConfigurationError('GEOCODING_API_URL must be configured.');
  }

  let url;
  try {
    url = new URL(endpoint);
  } catch (error) {
    throw new GeocodingConfigurationError('GEOCODING_API_URL is not a valid URL.');
  }

  url.searchParams.set('address', address);
  if (!url.searchParams.has('limit') && DEFAULT_RESULT_LIMIT) {
    url.searchParams.set('limit', DEFAULT_RESULT_LIMIT);
  }

  if (apiKey) {
    // Queensland Government Geocoding API accepts the API key as a query parameter named `key`.
    url.searchParams.set('key', apiKey);
  }

  return url;
}

function extractCoordinates(payload) {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload.features) && payload.features.length > 0) {
    for (const feature of payload.features) {
      const coordinates = feature?.geometry?.coordinates;
      if (Array.isArray(coordinates) && coordinates.length >= 2) {
        const [longitude, latitude] = coordinates;
        return { latitude, longitude };
      }

      const lat = feature?.properties?.lat ?? feature?.properties?.latitude;
      const lon = feature?.properties?.lon ?? feature?.properties?.longitude;
      if (typeof lat === 'number' && typeof lon === 'number') {
        return { latitude: lat, longitude: lon };
      }
    }
  }

  if (Array.isArray(payload.results) && payload.results.length > 0) {
    for (const result of payload.results) {
      const lat = result?.location?.lat ?? result?.location?.latitude ?? result?.lat;
      const lon = result?.location?.lng ?? result?.location?.longitude ?? result?.lon;
      if (typeof lat === 'number' && typeof lon === 'number') {
        return { latitude: lat, longitude: lon };
      }
    }
  }

  if (Array.isArray(payload.locations) && payload.locations.length > 0) {
    for (const location of payload.locations) {
      const lat = location?.lat ?? location?.latitude;
      const lon = location?.lon ?? location?.longitude ?? location?.lng;
      if (typeof lat === 'number' && typeof lon === 'number') {
        return { latitude: lat, longitude: lon };
      }
    }
  }

  if (typeof payload.latitude === 'number' && typeof payload.longitude === 'number') {
    return { latitude: payload.latitude, longitude: payload.longitude };
  }

  return null;
}

async function geocodeAddress(address) {
  if (typeof address !== 'string' || !address.trim()) {
    throw new GeocodingError('address must be provided as a non-empty string.');
  }

  const trimmedAddress = address.trim();

  const url = buildRequestUrl(trimmedAddress);

  let response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (error) {
    throw new GeocodingError(`Failed to call geocoding service: ${error.message}`);
  }

  if (!response.ok) {
    throw new GeocodingError(`Geocoding request failed with status ${response.status}.`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new GeocodingError('Geocoding service returned an invalid JSON response.');
  }

  const coordinates = extractCoordinates(payload);
  if (!coordinates) {
    throw new GeocodingNotFoundError();
  }

  return coordinates;
}

module.exports = {
  geocodeAddress,
  GeocodingError,
  GeocodingConfigurationError,
  GeocodingNotFoundError,
  extractCoordinates,
  buildRequestUrl,
};
