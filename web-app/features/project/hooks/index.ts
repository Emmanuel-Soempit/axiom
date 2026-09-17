import { useMutation, useQuery } from "@tanstack/react-query";
import { httpCreateProject, httpGetProjects } from "../apis";
import { toast } from "react-hot-toast";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (data: { name: string }) => httpCreateProject(data),
    onSuccess: () => {
      toast.success("Project created successfully!");
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to create project";
      toast.error(message);
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => httpGetProjects(),
  });
};
