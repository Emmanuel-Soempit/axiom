export interface AuditRecord {
  id: number;
  project_id: string;
  agent_id?: number;
  user_id?: number;
  action_id?: number;
  prompt: string;
  proposed_action?: Record<string, any>;
  validated: boolean;
  validation_errors?: string[];
  final_response?: Record<string, any>;
  error_type?: string;
  created_at: string;
}

export interface PaginatedAuditResponse {
  data: AuditRecord[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}

export interface AuditStat {
  value: number;
  percentage: number;
}

export interface AuditSummary {
  total: AuditStat;
  failed: AuditStat;
  successful: AuditStat;
}

export interface AuditOverviewResponse {
  audits: AuditRecord[];
  summary: AuditSummary;
}
