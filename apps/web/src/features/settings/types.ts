export interface Organization {
  id: string;
  name: string;
  logo_path?: string | null;
  plan?: 'free' | 'pro' | 'enterprise';
  billing_email?: string | null;
  created_at: string;
  updated_at: string;
}
