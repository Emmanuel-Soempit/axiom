import apiClient from "@/config/api-client";
import { ApiResponse } from "@/types";
import { AxiosResponse } from "axios";
import { Agent } from "../types";
import { AuditRecord, PaginatedAuditResponse } from "@/features/audits/types";
import { Feature } from "@/features/features/types";

export interface PaginatedFeatureResponse {
  data: Feature[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}

export interface CreateAgentPayload {
  name: string;
  description: string;
  system_prompt: string;
  features: number[];
}

export interface UpdateAgentPayload {
  name?: string;
  description?: string;
  system_prompt?: string;
  features?: number[];
  active?: boolean;
}

export const httpGetAgents = async (): Promise<
  AxiosResponse<ApiResponse<Agent[]>>
> => {
  return await apiClient.get<ApiResponse<Agent[]>>('/api/v1/core/registry/agents');
};

export const httpCreateAgent = async (
  data: CreateAgentPayload,
): Promise<AxiosResponse<ApiResponse<Agent>>> => {
  return await apiClient.post<ApiResponse<Agent>>('/api/v1/core/registry/agents', data);
};

export const httpGetAgent = async (
  agentId: string,
): Promise<AxiosResponse<ApiResponse<Agent>>> => {
  return await apiClient.get<ApiResponse<Agent>>(`/api/v1/core/registry/agents/${agentId}`);
};

export const httpUpdateAgent = async (
  agentId: string,
  data: UpdateAgentPayload,
): Promise<AxiosResponse<ApiResponse<Agent>>> => {
  return await apiClient.put<ApiResponse<Agent>>(`/api/v1/core/registry/agents/${agentId}`, data);
};

export const httpDeleteAgent = async (
  agentId: string,
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return await apiClient.delete<ApiResponse<null>>(`/api/v1/core/registry/agents/${agentId}`);
};

export const httpToggleAgentActive = async (
  agentId: string,
  active: boolean,
): Promise<AxiosResponse<ApiResponse<Agent>>> => {
  return await apiClient.put<ApiResponse<Agent>>(`/api/v1/core/registry/agents/${agentId}/active`, { active });
};

export const httpGetAgentAudits = async (
  agentId: string,
  page = 1,
  limit = 20,
): Promise<AxiosResponse<ApiResponse<PaginatedAuditResponse>>> => {
  return await apiClient.get<ApiResponse<PaginatedAuditResponse>>(
    `/api/v1/core/registry/agents/${agentId}/audits?page=${page}&limit=${limit}`,
  );
};

export const httpGetAgentFeatures = async (
  agentId: string,
  page = 1,
  limit = 20,
): Promise<AxiosResponse<ApiResponse<PaginatedFeatureResponse>>> => {
  return await apiClient.get<ApiResponse<PaginatedFeatureResponse>>(
    `/api/v1/core/registry/agents/${agentId}/features?page=${page}&limit=${limit}`,
  );
};

export type { AuditRecord, PaginatedAuditResponse };
