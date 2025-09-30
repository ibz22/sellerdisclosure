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
2. Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```
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
- `.env.example` – template for environment configuration

## Scripts

- `npm run dev` – start the server with nodemon for live reload
- `npm start` – start the server in production mode
