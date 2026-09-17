import apiClient from "@/config/api-client";
import { ApiResponse } from "@/types";
import { AxiosResponse } from "axios";
import { AuditOverviewResponse } from "../types";

export const httpGetAudits = async (): Promise<
  AxiosResponse<ApiResponse<AuditOverviewResponse>>
> => {
  return await apiClient.get<ApiResponse<AuditOverviewResponse>>(
    "/api/v1/projects/audits",
  );
};
