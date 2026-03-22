import apiClient from "@/config/api-client";
import { ApiResponse } from "@/types";
import { AxiosResponse } from "axios";
import { Action } from "../types";

export interface CreateActionPayload {
  name: string;
  description: string;
  parameters: Record<string, any>;
  required_feature?: string;
  version: number;
}

export const httpGetActions = async (): Promise<
  AxiosResponse<ApiResponse<Action[]>>
> => {
  return await apiClient.get<ApiResponse<Action[]>>("/api/v1/core/registry/actions");
};

export const httpCreateAction = async (
  data: CreateActionPayload,
): Promise<AxiosResponse<ApiResponse<Action>>> => {
  return await apiClient.post<ApiResponse<Action>>("/api/v1/core/registry/actions", data);
};

export const httpGetAction = async (
  actionId: string,
): Promise<AxiosResponse<ApiResponse<Action>>> => {
  return await apiClient.get<ApiResponse<Action>>(`/api/v1/core/registry/actions/${actionId}`);
};

export const httpUpdateAction = async (
  actionId: string,
  data: CreateActionPayload,
): Promise<AxiosResponse<ApiResponse<Action>>> => {
  return await apiClient.put<ApiResponse<Action>>(`/api/v1/core/registry/actions/${actionId}`, data);
};

export const httpDeleteAction = async (
  actionId: string,
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return await apiClient.delete<ApiResponse<null>>(`/api/v1/core/registry/actions/${actionId}`);
};
