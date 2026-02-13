# Nest Store API Template

A NestJS-based API template for e-commerce platforms with MVP deployment.

## Tech Stack

- NestJS 11
- PostgreSQL + Prisma ORM
- Redis
- JWT Authentication
- Cloudinary

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run migrations
npx prisma migrate dev

# Start development
npm run start:dev
```

## Scripts

- `npm run start:dev` - Development with watch mode
- `npm run start:prod` - Production server
- `npm run build` - Build project
- `npm run format` - Format code

## Project Structure

```
src/
├── api/          - API routes & controllers
├── common/       - Guards, decorators, utilities
├── databases/    - Prisma & Redis services
├── integrations/ - External services
└── modules/      - Feature modules
```

## Requirements

- Node.js 16+
- PostgreSQL
- Redis
- Cloudinary account (optional)