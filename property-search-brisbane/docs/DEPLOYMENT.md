# Deployment Guide

This document describes how to deploy the Property Search Brisbane application across environments.

## Prerequisites

- Docker 24+
- Access to the container registry
- Access to the target infrastructure (e.g. Kubernetes cluster or VM)

## Build and Push Images

1. Build backend image:
   ```bash
   docker build -t registry.example.com/property-search-brisbane/backend:latest backend
   ```
2. Build frontend image:
   ```bash
   docker build -t registry.example.com/property-search-brisbane/frontend:latest frontend
   ```
3. Push both images to the registry.

## Environment Configuration

- Duplicate `backend/.env.example` to create a production `.env` file with real secrets.
- Ensure any required frontend environment variables are exposed at build time (Parcel supports `.env` files and `PARCEL_*` variables).

## Deployment Steps

1. Apply infrastructure templates (Terraform/CloudFormation) if required.
2. Deploy the backend service:
   - For Kubernetes: apply the Deployment, Service, and Ingress manifests.
   - For traditional servers: copy `.env`, install dependencies, and run the Node.js service under a process manager (PM2/systemd).
3. Deploy the frontend:
   - Build the static assets using `npm run build` in the `frontend` directory.
   - Upload the `dist/` folder to a CDN or static hosting platform.
4. Smoke test the `/health` endpoint and the main user journey.

## Rollback Plan

- Keep the previous container images tagged with the deployment version.
- Re-deploy the last known good version if issues arise.
- Maintain database backups prior to schema changes.
