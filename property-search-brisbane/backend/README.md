# Property Search Brisbane Backend

This package implements the backend API for the Property Search Brisbane application. It exposes endpoints for searching listings, retrieving property details, and any other domain-specific workflows.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- [npm](https://www.npmjs.com/) v9 or newer

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the required configuration values:
   ```bash
   cat <<'ENV' > .env
   PORT=3000
   GEOCODING_API_URL=https://api.qld.gov.au/example/geocoder
   GEOCODING_API_KEY=your-api-key
   ENV
   ```
   Replace the example values with the real Queensland Government Geocoding API endpoint and key for your environment.
3. Run the development server:
   ```bash
   npm run dev
   ```
4. For production, run:
   ```bash
   npm start
   ```

The service exposes a `/health` endpoint for simple uptime checks.

## Project Structure

- `server.js` – Express entry point
- `package.json` – project metadata and scripts
- `.env` – environment configuration (see below)

## Configuration

The backend relies on the Queensland Government Geocoding API to resolve addresses. Set the following environment variables either in `.env` or through your hosting provider:

- `GEOCODING_API_URL` – Base URL for the Queensland Government Geocoding API endpoint.
- `GEOCODING_API_KEY` – API key provisioned for your Queensland Government account.
- `PORT` – Optional. Port for the Express server (defaults to `3000`).

## Scripts

- `npm run dev` – start the server with nodemon for live reload
- `npm start` – start the server in production mode
