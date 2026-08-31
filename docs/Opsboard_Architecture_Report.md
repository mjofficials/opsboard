# Opsboard Project Report

## 1. Executive Summary
Opsboard is a modern, full-stack monorepo application designed to streamline operational workflows. It acts as a robust platform for tracking tickets, managing team collaborations, organizing projects, and monitoring dashboard analytics—all within a secure, multi-tenant environment. 

## 2. Architecture Flow & Tech Stack

The project is structured as a monorepo using npm workspaces, containing two primary applications: a frontend web client (`apps/web`) and a backend API (`apps/api`).

### 2.1 Technology Stack
**Frontend (`@opsboard/web`)**:
- **Framework**: Next.js 16 (App Router)
- **UI/Styling**: React 19, Tailwind CSS v4, Shadcn UI
- **State Management**: Redux Toolkit (Global state), React Query (Server state/API data)
- **Forms & Validation**: React Hook Form & Zod

**Backend (`api`)**:
- **Framework**: NestJS 12
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport, bcrypt (with Supabase SDK available)

### 2.2 System Architecture Flow
1. **Client Layer (Web)**: The Next.js application serves the user interface. It utilizes React Query to manage API requests, caching, and data synchronization, and Redux Toolkit for complex global state.
2. **API Layer (Backend)**: The NestJS application receives RESTful requests. It uses controllers to route requests to appropriate services.
3. **Data Access Layer**: NestJS services utilize Prisma Client to interact with the PostgreSQL database.
4. **Authentication Flow**: Users authenticate via the NestJS API. The backend issues a JWT, which the Next.js frontend includes in subsequent request headers.
5. **Multi-tenancy Flow**: Most data entities (Users, Projects) are scoped to an `Organization`. The backend ensures data isolation by filtering queries by the authenticated user's `organizationId`.

## 3. Core Functionality & Features

### 3.1 Multi-Tenant Organization Management
- **Organizations**: The root entity of the system. Organizations have billing plans (FREE, PRO, ENTERPRISE) and can be linked to a Stripe customer ID.
- **Users & Roles**: Users are tied to an organization and have specific roles (`ADMIN`, `MEMBER`, `VIEWER`, `OWNER`) which dictate their access levels across the platform. User accounts also have statuses (`ACTIVE`, `INACTIVE`, `SUSPENDED`).

### 3.2 Project Management
- **Projects**: Users can create projects within their organization. Projects have a status lifecycle (`ACTIVE`, `COMPLETED`, `ARCHIVED`).
- **Assignments**: Projects can be assigned to specific users, tracking both the creator and the assigned user.

### 3.3 Ticket / Task Tracking
- **Tickets**: The core unit of work, tied to a specific project. 
- **Attributes**: Tickets have detailed statuses (`OPEN`, `IN_PROGRESS`, `REVIEW`, `RESOLVED`, `CLOSED`) and priorities (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
- **Comments**: Users can collaborate by leaving timestamped comments on tickets, enabling seamless communication on operational tasks.

### 3.4 Dashboard & Settings
- **Analytics**: The frontend includes a `dashboard` feature module responsible for aggregating ticket statuses and providing a visual overview of project progress.
- **Configuration**: Domain-driven feature modules like `settings` and `teams` handle application configurations and team structures.

## 4. Directory Structure Analysis

```text
opsboard/
├── apps/
│   ├── api/               # NestJS Backend
│   │   ├── prisma/        # Database schema (schema.prisma) & migrations
│   │   └── src/
│   │       ├── auth/      # Authentication logic
│   │       ├── organizations/ # Org management REST endpoints
│   │       ├── projects/  # Project management REST endpoints
│   │       └── prisma/    # Prisma service integration
│   └── web/               # Next.js Frontend
│       └── src/
│           ├── app/       # Next.js App Router (pages: auth, dashboard)
│           ├── components/# Reusable Shadcn UI components
│           ├── features/  # Domain-driven modules (auth, dashboard, projects, tickets, teams, users)
│           ├── store/     # Redux configuration
│           └── lib/       # Utility functions & axios configuration
├── docs/                  # Project documentation
├── package.json           # Root monorepo configuration (concurrently scripts)
```

## 5. Database Schema Breakdown

The Prisma schema defines a highly relational, normalized PostgreSQL database with strict foreign key constraints:

1. **`Organization`**: `id`, `name`, `plan`, `billingEmail`, `stripeCustomerId`. Has many `Users` and `Projects`.
2. **`User`**: `id`, `email`, `password`, `role`, `status`. Belongs to an `Organization` (Restrict delete). Has many assigned/created `Projects` and `Tickets`.
3. **`Project`**: `id`, `name`, `status`. Belongs to `Organization` (Cascade delete). Has a creator and assignee. Has many `Tickets`.
4. **`Ticket`**: `id`, `title`, `description`, `status`, `priority`. Belongs to `Project` (Cascade delete). Has an assignee and creator.
5. **`TicketComment`**: `id`, `comment`. Belongs to `Ticket` (Cascade delete) and `User` (Cascade delete).
