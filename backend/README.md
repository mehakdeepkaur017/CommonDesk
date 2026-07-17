# CommonDesk Backend

This is the official Node.js / Express backend for CommonDesk.

## Technology Stack
- **Runtime:** Node.js
- **Framework:** Express (TypeScript)
- **Database:** PostgreSQL (with Prisma ORM)
- **Validation:** Zod
- **Authentication:** JWT + HttpOnly Cookies (Refresh Tokens)

## Setup Guide
1. Copy `.env.example` to `.env`.
   ```bash
   cp .env.example .env
   ```
2. Update the `DATABASE_URL` in `.env` to point to your PostgreSQL instance.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Prisma Migration Guide
Whenever you update `prisma/schema.prisma`:
1. Push changes directly to the database (for local dev):
   ```bash
   npm run db:push
   ```
2. Create a migration history (for production):
   ```bash
   npm run db:migrate
   ```

## API Examples
### 1. Register a User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "securepassword",
  "name": "Test User"
}
```

### 2. Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "securepassword"
}
```

### 3. Get Current User (Requires Authorization Header)
```http
GET /api/v1/auth/me
Authorization: Bearer <ACCESS_TOKEN>
```
