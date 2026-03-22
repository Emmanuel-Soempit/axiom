import apiClient from "@/config/api-client";
import { ApiResponse, Project } from "@/types";
import { AxiosResponse } from "axios";

export const httpCreateProject = async (data: {
  name: string;
}): Promise<AxiosResponse<ApiResponse<Project>>> => {
  return await apiClient.post<ApiResponse<Project>>("/api/v1/projects", data);
};
export const httpGetProjects = async (): Promise<
  AxiosResponse<ApiResponse<Project[]>>
> => {
  return await apiClient.get<ApiResponse<Project[]>>("/api/v1/projects/all");
};
