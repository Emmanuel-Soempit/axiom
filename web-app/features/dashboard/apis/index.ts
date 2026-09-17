import apiClient from "@/config/api-client";
import { ApiResponse } from "@/types";
import { AxiosResponse } from "axios";
import { ProjectDashboardResponse } from "../types";

export const httpGetProjectDashboard = async (): Promise<
  AxiosResponse<ApiResponse<ProjectDashboardResponse>>
> => {
  return await apiClient.get<ApiResponse<ProjectDashboardResponse>>(
    "/api/v1/projects/dashboard",
  );
};
