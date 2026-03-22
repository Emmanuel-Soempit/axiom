export interface AuditRecord {
  id: number;
  project_id: string;
  prompt: string;
  proposed_action: Record<string, any>;
  validated: boolean;
  validation_errors: string[];
  final_response: Record<string, any>;
  created_at: string;
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
