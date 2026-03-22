import apiClient from "@/config/api-client";
import { ApiResponse } from "@/types";
import { AxiosResponse } from "axios";
import { ApiKey } from "../types";

export interface CreateApiKeyPayload {
  name: string;
  expires_at?: string;
}

export interface CreateApiKeyResponse extends ApiKey {
  full_key: string;
}

export const httpGetApiKeys = async (): Promise<
  AxiosResponse<ApiResponse<ApiKey[]>>
> => {
  return await apiClient.get<ApiResponse<ApiKey[]>>("/api/v1/credentials/keys");
};

export const httpCreateApiKey = async (
  data: CreateApiKeyPayload,
): Promise<AxiosResponse<ApiResponse<CreateApiKeyResponse>>> => {
  return await apiClient.post<ApiResponse<CreateApiKeyResponse>>(
    "/api/v1/credentials/keys",
    data,
  );
};

export const httpRevokeApiKey = async (
  id: string,
): Promise<AxiosResponse<ApiResponse<ApiKey>>> => {
  return await apiClient.patch<ApiResponse<ApiKey>>(
    `/api/v1/credentials/keys/${id}/revoke`,
  );
};

export const httpDeleteApiKey = async (
  id: string,
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return await apiClient.delete<ApiResponse<null>>(
    `/api/v1/credentials/keys/${id}`,
  );
};
