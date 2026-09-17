export interface Agent {
  id: string | number;
  project_id?: string;
  name: string;
  slug: string;
  description: string;
  system_prompt: string;
  active: boolean;
  features?: number[];
}
