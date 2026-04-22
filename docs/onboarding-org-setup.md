# Onboarding: Organization Setup Flow

**Date:** 2026-04-22  
**Status:** Approved — ready for implementation  
**Route:** `/onboarding`

---

## Understanding Summary

- **What:** A dedicated `/onboarding` page where newly registered users create their first organization
- **Why:** The app is org-scoped (teams, tickets, projects). Users without an org cannot meaningfully use the dashboard
- **Who:** Any authenticated user who completed sign-up but has no `organization_id` in their session
- **Key constraints:** Bidirectional route guards (org-creation page + dashboard); org logic stays inside `features/auth/`
- **Non-goals:** Join by invite, multi-org support, confirmation screen after creation

---

## Assumptions

1. Creating an org inserts into `organizations` (with `owner_id`) then `organization_members` (with `role: 'owner'`)
2. Route is `/onboarding`, placed in the `(auth)` route group (no sidebar/shell)
3. After org creation, `initAuth()` is re-run to re-hydrate Redux with the decorated session (`user.organization_id`)
4. Guards only fire when auth `status === 'succeeded'` — never during loading

---

## Data Flow

```
User registers
    │
    ▼
authService.register() → Supabase signUp
    │
    ▼
onAuthStateChange fires → initAuth() runs
    │
    ├─ getCurrentSession() → queries organization_members
    │       └─ No org found → user.organization_id = undefined
    ▼
Register page redirects → /onboarding
    │
    ▼
/onboarding page guard:
    ├─ No session?       → /login
    ├─ Has org already?  → /dashboard
    └─ Authenticated, no org → render form
    │
    ▼
User submits org name → "Create Organization"
    │
    ▼
authService.createOrganization(name)
    ├─ INSERT into organizations { name, owner_id: userId }
    └─ INSERT into organization_members { organization_id, user_id, role: 'owner' }
    │
    ▼
useAuth.createOrganization() → calls initAuth() → Redux updated with organization_id
    │
    ▼
router.push('/dashboard')
    │
    ▼
Dashboard layout guard:
    ├─ No session?    → /login
    ├─ Has org?       → ✅ render dashboard
    └─ No org?        → /onboarding  ← hard backstop
```

---

## Components

### New Files

| File | Purpose |
|---|---|
| `src/app/(auth)/onboarding/page.tsx` | Org creation page — form, guard logic, submission handler |

### Modified Files

| File | Change |
|---|---|
| `src/features/auth/services/authService.ts` | Add `createOrganization(name, userId)` |
| `src/features/auth/hooks/useAuth.ts` | Add `createOrganization` wrapper; expose `initAuth` for re-hydration |
| `src/app/(dashboard)/layout.tsx` | Add org-guard redirect to `/onboarding` |
| `src/app/(auth)/register/page.tsx` | Redirect to `/onboarding` after successful register (not `/login`/`/dashboard`) |

---

## Error Handling

### On the `/onboarding` page

| Scenario | Handling |
|---|---|
| Empty org name | Client-side validation — inline error, button disabled |
| API failure (DB error, duplicate) | Show error below form, keep form enabled for retry |
| `organizations` insert ok, `organization_members` fails | Return error; user retries; no partial Redux state |
| `initAuth()` fails after org creation | Redirect to `/dashboard` anyway; dashboard guard bounces back if needed |

### Guard edge cases

| Scenario | Handling |
|---|---|
| Visits `/onboarding` while `status === 'loading'` | Show spinner, defer redirect until `'succeeded'` |
| Visits `/dashboard` while `status === 'loading'` | Show spinner, defer guard check |
| Visits `/onboarding` with an org already | Guard detects `organization_id` → redirect to `/dashboard` |
| Bookmarks `/dashboard` before onboarding | Dashboard guard detects no org → redirect to `/onboarding` |

---

## Decision Log

| # | Decision | Alternatives | Reason |
|---|---|---|---|
| 1 | `/onboarding` in `(auth)` group | `(dashboard)` group | No sidebar needed; consistent with login/register |
| 2 | Guards fire only on `status === 'succeeded'` | Fire on any non-idle state | Prevents redirect races during auth init |
| 3 | Org logic in `authService` + `useAuth` | New `features/organizations/` | Scoped to onboarding; no dedicated feature needed yet |
| 4 | Sequential DB inserts | Supabase RPC/transaction | Simpler; retryable on failure |
| 5 | `initAuth()` re-run after org creation | Manually dispatch org data | Reuses existing decoration logic; single source of truth |
| 6 | Client-side guards in layouts | Next.js middleware | Consistent with existing pattern; zero new infrastructure |
| 7 | Register page redirects to `/onboarding` | Redirect to `/dashboard` and bounce | Clearer intent; avoids extra redirect hop |
