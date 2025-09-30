# Property Search Brisbane

This repository contains the frontend, backend, and deployment documentation for the Property Search Brisbane application.

## Project Structure

```
property-search-brisbane/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── server.js
├── frontend/
│   ├── app.js
│   ├── index.html
│   ├── package.json
│   └── styles.css
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
├── .gitignore
├── LICENSE
└── README.md
```

## Backend

The backend is a Node.js Express server with environment-driven configuration. It provides REST endpoints for property data and includes a `/health` route for monitoring.

See [`backend/README.md`](backend/README.md) for setup instructions.

## Frontend

The frontend is a simple Parcel-powered single-page application. Update `frontend/app.js` to connect to backend APIs.

See [`frontend/README.md`](frontend/README.md) (if created) or the inline documentation for details on scripts.

## Documentation

- [`docs/API.md`](docs/API.md) – API contract for backend services.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) – Deployment runbook.

## License

See [LICENSE](LICENSE) for licensing information.
