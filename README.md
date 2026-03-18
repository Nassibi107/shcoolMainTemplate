# Scope School — School Management System

A modern, multi-tenant school management system built with Next.js 14, NestJS, Prisma, and PostgreSQL.

## Project Structure

```
scope-school/
├── apps/
│   ├── api/          # NestJS backend (port 4000)
│   └── web/          # Next.js frontend (port 3000)
└── prisma/
    └── schema.prisma # Shared Prisma schema
```

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend    | NestJS + TypeScript               |
| ORM        | Prisma                            |
| Database   | PostgreSQL                        |
| Auth       | JWT + RBAC (5 roles)              |
| Charts     | Recharts                          |
| PDF Export | Puppeteer                         |
| Excel      | ExcelJS                           |

## User Roles

| Role      | Access                                         |
|-----------|------------------------------------------------|
| ADMIN     | Full system access                             |
| ASSISTANT | Manage users, documents; no system settings   |
| TEACHER   | Own schedule, attendance, grades, leave        |
| STUDENT   | Timetable, grades, attendance, certificates    |
| PARENT    | Monitor child's data, request documents        |

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone and install

```bash
# Install root deps (Prisma CLI)
npm install

# Install API deps
cd apps/api && npm install

# Install Web deps
cd apps/web && npm install
```

### 2. Database setup

```bash
# Copy env files
cp apps/api/.env.example apps/api/.env
# Fill in DATABASE_URL, JWT secrets, etc.

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 3. Run development servers

```bash
# Terminal 1 — API
cd apps/api && npm run dev

# Terminal 2 — Web
cd apps/web && npm run dev
```

- API: http://localhost:4000
- API Docs (Swagger): http://localhost:4000/api/docs
- Frontend: http://localhost:3000

## Design System

### Colors

| Token          | Value     | Usage                         |
|----------------|-----------|-------------------------------|
| `--color-primary`  | `#0F1F3D` | Brand navy, headings          |
| `--color-accent`   | `#00C2A8` | CTAs, active states           |
| `--color-secondary`| `#3D5A80` | Cards, nav                    |
| `--color-surface`  | `#F4F7FA` | Page backgrounds              |
| `--color-success`  | `#2EC4A9` | Paid, present, done           |
| `--color-warning`  | `#F5A623` | Pending, alerts               |
| `--color-danger`   | `#E85D4A` | Errors, absences              |

### Typography
- **Headings**: Plus Jakarta Sans (bold, geometric)
- **Body**: DM Sans (clean, readable)
- **Monospace/Numbers**: JetBrains Mono (IDs, stats)

## API Overview

All endpoints are prefixed with `/api/v1`.

| Module       | Base Path                            |
|--------------|--------------------------------------|
| Auth         | `/auth`                              |
| Users        | `/schools/:schoolId/users`           |
| Students     | `/schools/:schoolId/students`        |
| Teachers     | `/schools/:schoolId/teachers`        |
| Classes      | `/schools/:schoolId/classes`         |
| Attendance   | `/schools/:schoolId/attendance`      |
| Grades       | `/schools/:schoolId/grades`          |
| Payments     | `/schools/:schoolId/payments`        |
| Certificates | `/schools/:schoolId/certificates`    |
| Calendar     | `/schools/:schoolId/calendar`        |
| Notifications| `/notifications`                     |
| Reports      | `/schools/:schoolId/reports`         |

Full Swagger documentation available at `/api/docs`.

## Admin Actions

- Admin can create Assistant accounts via `POST /api/v1/schools/:schoolId/users` with role `ASSISTANT`.
- Assistant can manually add payments from the dashboard.
- Timetable can be viewed by class or by teacher and exported to PDF/Excel.

## Database Schema

The schema uses:
- UUID primary keys on all models
- Soft deletes via `deletedAt DateTime?`
- Multi-tenancy via `schoolId` on all tenant-scoped models
- `createdAt` / `updatedAt` timestamps on all models

See `prisma/schema.prisma` for the complete schema.

Admin: admin@scopeschool.io / Admin@1234
Assistant: assistant@scopeschool.io / Assistant@1234
Teacher: teacher@scopeschool.io / Teacher@1234
Student: student@scopeschool.io / Student@1234
Parent: parent@scopeschool.io / Parent@1234