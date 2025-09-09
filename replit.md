# FastAPI + React Boilerplate

## Overview
This is a full-stack web application with a Python FastAPI backend and React TypeScript frontend. The project was successfully imported from GitHub and configured for the Replit environment.

## Recent Changes (September 9, 2025)
- Imported from GitHub and set up for Replit environment
- Installed Python 3.11 and Node.js 20 dependencies
- Configured PostgreSQL database with Neon integration
- Set up development workflows for both frontend and backend
- Configured Vite to serve on 0.0.0.0:5000 for Replit proxy compatibility
- Added deployment configuration for production

## Project Architecture
### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.11
- **Database**: PostgreSQL (Neon-hosted)
- **Dependencies**: SQLModel, Alembic, Pydantic, Uvicorn
- **Port**: 8000 (development), uses localhost for backend
- **Main files**: 
  - `backend/api/main.py` - Main FastAPI application
  - `backend/local_dev.py` - Development server script
  - `backend/.env` - Environment configuration

### Frontend (React)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router DOM
- **Port**: 5000 (configured for Replit proxy)
- **Host**: 0.0.0.0 (required for Replit environment)
- **Main files**:
  - `frontend/src/App.tsx` - Main React component
  - `frontend/vite.config.ts` - Vite configuration

### Database
- PostgreSQL database provided by Replit (Neon-backed)
- Environment variables automatically configured
- Connection string in DATABASE_URL

## Development Workflow
- Frontend served on port 5000 with hot reload
- Backend served on port 8000 with hot reload
- Both workflows configured and running successfully
- CORS configured to allow communication between frontend and backend

## Deployment
- Configured for autoscale deployment
- Frontend builds with `npm run build` 
- Backend serves on port 5000 in production
- Uses Uvicorn production server

## User Preferences
- No specific user preferences recorded yet

## Status
✅ Project successfully imported and configured for Replit
✅ All dependencies installed and working
✅ Database connected and accessible
✅ Development workflows running
✅ Deployment configuration complete