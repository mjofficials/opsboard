export interface Organization {
  id: string;
  name: string;
  logo_url?: string | null;
  contact_email?: string | null;
  website?: string | null;
  description?: string | null;
  plan?: 'free' | 'pro' | 'enterprise';
  billing_email?: string | null;
  created_at: string;
  updated_at: string;
}
