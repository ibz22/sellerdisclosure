const request = require('supertest');
const app = require('../server');

describe('Property routes', () => {
  describe('GET /properties', () => {
    it('returns a paginated list of properties', async () => {
      const response = await request(app).get('/properties');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        pageSize: 20,
      });
      expect(typeof response.body.pagination.total).toBe('number');
      response.body.data.forEach((property) => {
        expect(property).toMatchObject({
          id: expect.any(String),
          address: expect.any(String),
          price: expect.any(Number),
          bedrooms: expect.any(Number),
          bathrooms: expect.any(Number),
          parking: expect.any(Number),
        });
      });
    });

    it('filters properties by suburb and price range', async () => {
      const response = await request(app)
        .get('/properties')
        .query({ suburb: 'West End', minPrice: 800000, maxPrice: 900000 });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach((property) => {
        expect(property.address).toContain('West End');
        expect(property.price).toBeGreaterThanOrEqual(800000);
        expect(property.price).toBeLessThanOrEqual(900000);
      });
    });

    it('returns a validation error for invalid page', async () => {
      const response = await request(app).get('/properties').query({ page: 0 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          code: 'INVALID_REQUEST',
          message: 'page must be a positive integer when provided.',
        },
      });
    });

    it('returns a validation error when minPrice is not a number', async () => {
      const response = await request(app)
        .get('/properties')
        .query({ minPrice: 'abc' });

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual({
        code: 'INVALID_REQUEST',
        message: 'minPrice must be a valid number.',
      });
    });
  });

  describe('GET /properties/:id', () => {
    it('returns a property when it exists', async () => {
      const response = await request(app).get('/properties/prop_001');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 'prop_001',
        address: expect.any(String),
        price: expect.any(Number),
        bedrooms: expect.any(Number),
        bathrooms: expect.any(Number),
        parking: expect.any(Number),
        description: expect.any(String),
      });
    });

    it('returns not found when property does not exist', async () => {
      const response = await request(app).get('/properties/unknown');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Property not found.',
        },
      });
    });
  });
});
