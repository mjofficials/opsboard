-- 1. ENUMS (Handled with DO blocks to avoid "already exists" errors)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organization_plan') THEN
        CREATE TYPE organization_plan AS ENUM ('free', 'pro', 'enterprise');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('ACTIVE', 'INACTIVE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_priority') THEN
        CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
    END IF;
END $$;

-- 2. TABLES

-- Organizations
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    contact_email TEXT,
    website TEXT,
    description TEXT,
    plan organization_plan DEFAULT 'free',
    billing_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS plan organization_plan DEFAULT 'free';
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS billing_email TEXT;

-- Users (Profiles extending auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    status user_status DEFAULT 'ACTIVE',
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'ACTIVE';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Organization Members (Teams)
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    status user_status DEFAULT 'ACTIVE',
    created_by UUID REFERENCES public.users(id),
    assignee_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(organization_id, user_id)
);
ALTER TABLE public.organization_members ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'ACTIVE';
ALTER TABLE public.organization_members ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id);
ALTER TABLE public.organization_members ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES public.users(id);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'ACTIVE',
    created_by UUID NOT NULL REFERENCES public.users(id),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status project_status DEFAULT 'ACTIVE';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES public.users(id);

-- Project Members
CREATE TABLE IF NOT EXISTS public.project_members (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (project_id, user_id)
);
ALTER TABLE public.project_members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';

-- Tickets
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status ticket_status DEFAULT 'OPEN',
    priority ticket_priority DEFAULT 'MEDIUM',
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.users(id),
    assignee_id UUID REFERENCES public.users(id),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS status ticket_status DEFAULT 'OPEN';
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS priority ticket_priority DEFAULT 'MEDIUM';
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES public.users(id);
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_tickets_project ON public.tickets(project_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON public.tickets(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tickets_deleted_at ON public.tickets(deleted_at) WHERE deleted_at IS NULL;

-- 4. VIEWS
DROP VIEW IF EXISTS public.tickets_with_project_details;
CREATE OR REPLACE VIEW public.tickets_with_project_details WITH (security_invoker = true) AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.project_id,
    t.created_by,
    t.assignee_id,
    t.deleted_at,
    t.created_at,
    t.updated_at,
    p.name AS project_name,
    p.organization_id
FROM public.tickets t
JOIN public.projects p ON t.project_id = p.id
WHERE t.deleted_at IS NULL;

-- 5. RLS (Policies will be created/replaced)

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.user_organizations()
RETURNS SETOF UUID AS $$
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = auth.uid() AND status = 'ACTIVE';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- DROP existing policies to avoid "already exists" errors, then recreate
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their organizations" ON public.organizations;
    DROP POLICY IF EXISTS "Organization admins can update organization" ON public.organizations;
    DROP POLICY IF EXISTS "Users can view themselves and org members" ON public.users;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can view members of their organizations" ON public.organization_members;
    DROP POLICY IF EXISTS "Admins can manage organization members" ON public.organization_members;
    DROP POLICY IF EXISTS "Users can view projects in their orgs" ON public.projects;
    DROP POLICY IF EXISTS "Users can insert projects in their orgs" ON public.projects;
    DROP POLICY IF EXISTS "Users can update projects in their orgs" ON public.projects;
    DROP POLICY IF EXISTS "Users can delete projects in their orgs" ON public.projects;
    DROP POLICY IF EXISTS "Users can view project members in their orgs" ON public.project_members;
    DROP POLICY IF EXISTS "Users can manage project members in their orgs" ON public.project_members;
    DROP POLICY IF EXISTS "Users can view tickets in their org projects" ON public.tickets;
    DROP POLICY IF EXISTS "Users can insert tickets in their org projects" ON public.tickets;
    DROP POLICY IF EXISTS "Users can update tickets in their org projects" ON public.tickets;
    DROP POLICY IF EXISTS "Users can hard delete tickets they created" ON public.tickets;
END $$;

CREATE POLICY "Users can view their organizations" ON public.organizations FOR SELECT USING (id IN (SELECT public.user_organizations()));
CREATE POLICY "Organization admins can update organization" ON public.organizations FOR UPDATE USING (EXISTS (SELECT 1 FROM public.organization_members WHERE organization_id = id AND user_id = auth.uid() AND LOWER(role::text) IN ('admin', 'owner')));
CREATE POLICY "Users can view themselves and org members" ON public.users FOR SELECT USING (id = auth.uid() OR id IN (SELECT user_id FROM public.organization_members WHERE organization_id IN (SELECT public.user_organizations())));
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can view members of their organizations" ON public.organization_members FOR SELECT USING (organization_id IN (SELECT public.user_organizations()));
CREATE POLICY "Admins can manage organization members" ON public.organization_members FOR ALL USING (EXISTS (SELECT 1 FROM public.organization_members om WHERE om.organization_id = organization_members.organization_id AND om.user_id = auth.uid() AND LOWER(om.role::text) IN ('admin', 'owner')));
CREATE POLICY "Users can view projects in their orgs" ON public.projects FOR SELECT USING (organization_id IN (SELECT public.user_organizations()));
CREATE POLICY "Users can insert projects in their orgs" ON public.projects FOR INSERT WITH CHECK (organization_id IN (SELECT public.user_organizations()));
CREATE POLICY "Users can update projects in their orgs" ON public.projects FOR UPDATE USING (organization_id IN (SELECT public.user_organizations()));
CREATE POLICY "Users can delete projects in their orgs" ON public.projects FOR DELETE USING (organization_id IN (SELECT public.user_organizations()));
CREATE POLICY "Users can view project members in their orgs" ON public.project_members FOR SELECT USING (project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT public.user_organizations())));
CREATE POLICY "Users can manage project members in their orgs" ON public.project_members FOR ALL USING (project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT public.user_organizations())));
CREATE POLICY "Users can view tickets in their org projects" ON public.tickets FOR SELECT USING (project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT public.user_organizations())) AND deleted_at IS NULL);
CREATE POLICY "Users can insert tickets in their org projects" ON public.tickets FOR INSERT WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT public.user_organizations())));
CREATE POLICY "Users can update tickets in their org projects" ON public.tickets FOR UPDATE USING (project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT public.user_organizations())));
CREATE POLICY "Users can hard delete tickets they created" ON public.tickets FOR DELETE USING (created_by = auth.uid());

-- 6. FUNCTIONS & TRIGGERS

CREATE OR REPLACE FUNCTION public.handle_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_org_updated_at ON public.organizations;
CREATE TRIGGER set_org_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_org_members_updated_at ON public.organization_members;
CREATE TRIGGER set_org_members_updated_at BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_tickets_updated_at ON public.tickets;
CREATE TRIGGER set_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.create_project_with_member(p_name TEXT, p_description TEXT, p_org_id UUID, p_user_id UUID, p_status project_status) RETURNS public.projects AS $$
DECLARE v_project public.projects;
BEGIN
    INSERT INTO public.projects (name, description, organization_id, created_by, status) VALUES (p_name, p_description, p_org_id, p_user_id, p_status) RETURNING * INTO v_project;
    INSERT INTO public.project_members (project_id, user_id, role) VALUES (v_project.id, p_user_id, 'owner');
    RETURN v_project;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name) VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
