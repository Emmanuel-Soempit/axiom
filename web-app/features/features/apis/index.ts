import apiClient from "@/config/api-client";
import { ApiResponse } from "@/types";
import { AxiosResponse } from "axios";
import { Feature } from "../types";

export interface CreateFeaturePayload {
  name: string;
  description: string;
}

export const httpGetFeatures = async (): Promise<
  AxiosResponse<ApiResponse<Feature[]>>
> => {
  return await apiClient.get<ApiResponse<Feature[]>>("/api/v1/core/registry/features");
};

export const httpCreateFeature = async (
  data: CreateFeaturePayload,
): Promise<AxiosResponse<ApiResponse<Feature>>> => {
  return await apiClient.post<ApiResponse<Feature>>("/api/v1/core/registry/features", data);
};

export const httpGetFeature = async (
  featureId: string,
): Promise<AxiosResponse<ApiResponse<Feature>>> => {
  return await apiClient.get<ApiResponse<Feature>>(`/api/v1/core/registry/features/${featureId}`);
};

export const httpUpdateFeature = async (
  featureId: string,
  data: CreateFeaturePayload,
): Promise<AxiosResponse<ApiResponse<Feature>>> => {
  return await apiClient.put<ApiResponse<Feature>>(`/api/v1/core/registry/features/${featureId}`, data);
};

export const httpDeleteFeature = async (
  featureId: string,
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return await apiClient.delete<ApiResponse<null>>(`/api/v1/core/registry/features/${featureId}`);
};

export const httpGetActionsByFeatureId = async (
  featureId: string,
): Promise<AxiosResponse<ApiResponse<any[]>>> => {
  return await apiClient.get<ApiResponse<any[]>>(`/api/v1/core/registry/features/${featureId}/actions`);
};

export const httpDeleteAction = async (
  actionId: string,
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return await apiClient.delete<ApiResponse<null>>(`/api/v1/core/registry/actions/${actionId}`);
};
