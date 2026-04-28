# OpsBoard Technical Documentation

## 1. Executive Summary
OpsBoard is a modern operations dashboard designed to streamline project and ticket management for organizations. Built with a robust technology stack including **Next.js (App Router)**, **Supabase**, and **Redux Toolkit**, OpsBoard provides a secure, scalable, and responsive user experience. It features multi-tenant organization support, real-time updates (via Supabase), and a clean, feature-based architecture.

## 2. Architecture Overview
OpsBoard follows a layered architecture with a clear separation of concerns:

- **Frontend**: Built with Next.js, utilizing the App Router for server-side rendering and efficient routing.
- **State Management**: Redux Toolkit manages global client-side state, primarily authentication and user context.
- **Backend-as-a-Service**: Supabase provides PostgreSQL database services, Authentication, and Row-Level Security (RLS).

### System Data Flow
1. User interacts with the UI.
2. UI components dispatch actions or call services.
3. Services interact with the Supabase client.
4. Supabase enforces security policies and interacts with the database.

## 3. Design Decisions
- **Feature-Based Module Structure**: Code is organized into cohesive feature folders (e.g., `src/features/tickets`) to improve maintainability.
- **Supabase for Backend Services**: Leveraged to accelerate development while ensuring enterprise-grade security and scalability.
- **Hybrid Auth State**: Redux stores the current user's organization context, enabling easy access for data filtering.

## 4. Core Components

### 4.1 Authentication Service
Located at [authService.ts](file:///home/mj/Learning/opsboard/src/features/auth/services/authService.ts), this service manages user sessions, registration, login, and organization creation.

### 4.2 Ticket Service
Located at [ticketService.ts](file:///home/mj/Learning/opsboard/src/features/tickets/services/ticketService.ts), this service handles CRUD operations for tickets. It automatically scopes queries to the user's active organization ID retrieved from the Redux store.

### 4.3 Project Service
Located at [projectService.ts](file:///home/mj/Learning/opsboard/src/features/projects/services/projectService.ts), this service manages project entities, similarly scoped by organization.

### 4.4 Team Service
Located at [teamService.ts](file:///home/mj/Learning/opsboard/src/features/teams/services/teamService.ts), this service manages invitations and organization membership.

## 5. Data Models
The system relies on the following core PostgreSQL tables (managed via Supabase):
- `organizations`: Stores organization metadata.
- `organization_members`: Maps users to organizations with specific roles (e.g., admin, member).
- `projects`: Contains project definitions linked to an organization.
- `tickets`: Tracks individual tasks or issues linked to a project.
- `invitations`: Manages pending and processed team invites.

## 6. Integration Points
- **Supabase SSR**: Integration for consistent session handling across server and client components.
- **Supabase RPCs**: Used for complex transactional logic like `create_organization` and `accept_invitation`.

## 7. Security Model
OpsBoard implements a rigorous security model:
- **Authentication**: Managed securely via Supabase Auth (JWT).
- **Authorization**: Enforced at the database level using Supabase Row Level Security (RLS) policies, ensuring users can only access data belonging to their organization.

## 8. State Management Configuration
The global store configuration can be reviewed at [store.ts](file:///home/mj/Learning/opsboard/src/store/store.ts).
