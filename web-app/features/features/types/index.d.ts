export interface Feature {
  id: string | number;
  project_id?: string;
  name: string;
  description: string;
}

export interface Action {
  id: string | number;
  name: string;
  description: string;
  project_id?: string;
  parameters: Record<string, any>;
  required_feature?: string;
  version?: number;
}
