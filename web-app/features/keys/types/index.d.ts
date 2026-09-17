export interface ApiKey {
  id: string;
  name: string;
  project_id: string;
  key_prefix: string;
  status: string;
  full_key: string;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}
