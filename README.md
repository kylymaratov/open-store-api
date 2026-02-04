# General Avto Store API

## Overview
NestJS-based backend API for an automotive parts e-commerce platform. Provides:
- Admin authentication and management
- Product catalog with categories
- Order processing
- File storage integration (Cloudinary)

## Tech Stack
- NestJS
- Prisma ORM
- PostgreSQL
- Redis (caching/rate limiting)
- JWT authentication

## Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Database setup
npx prisma migrate dev

# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## API Structure
- `src/api/` - Main API endpoints
- `src/common/` - Shared utilities/guards
- `prisma/` - Database schema
- `src/main.ts` - Application entry point

## Deployment
Docker-ready with health checks. Requires:
- PostgreSQL
- Redis
- Cloudinary credentials