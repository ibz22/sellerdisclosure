# API Reference

The Property Search Brisbane backend exposes RESTful endpoints for interacting with property listings.

## Base URL

```
https://api.property-search-brisbane.example.com
```

For local development, use `http://localhost:3000` unless otherwise configured.

## Authentication

Authentication is not yet implemented. When security requirements are defined, tokens or session-based authentication will be documented here.

## Endpoints

### GET /health

Returns service health information.

**Response**

```
Status: 200 OK
Content-Type: application/json
```

```json
{
  "status": "ok"
}
```

### GET /properties

Fetch a paginated list of properties filtered by query parameters.

**Query Parameters**

| Name     | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| suburb   | string | Optional suburb name to filter listings          |
| minPrice | number | Optional lower bound for price filter            |
| maxPrice | number | Optional upper bound for price filter            |
| page     | number | Optional page index (default 1)                  |

**Response**

```
Status: 200 OK
```

```json
{
  "data": [
    {
      "id": "prop_123",
      "address": "123 Boundary St, West End",
      "price": 850000,
      "bedrooms": 3,
      "bathrooms": 2,
      "parking": 1
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

### GET /properties/{id}

Retrieve a single property by ID.

**Response**

```
Status: 200 OK
```

```json
{
  "id": "prop_123",
  "address": "123 Boundary St, West End",
  "price": 850000,
  "bedrooms": 3,
  "bathrooms": 2,
  "parking": 1,
  "description": "Stylish inner-city apartment with river views."
}
```

## Error Handling

Errors follow this schema:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "A human-readable description of the problem."
  }
}
```

## Rate Limiting

Not currently enforced. Additions will be documented here when implemented.
