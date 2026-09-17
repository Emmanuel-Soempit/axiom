import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpGetActions, httpCreateAction, httpGetAction, httpUpdateAction, httpDeleteAction, CreateActionPayload } from "../apis";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

export const useActions = () => {
  return useQuery({
    queryKey: ["actions"],
    queryFn: () => httpGetActions(),
  });
};

export const useCreateAction = (redirectTo?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = useParams();

  return useMutation({
    mutationFn: (data: CreateActionPayload) => httpCreateAction(data),
    onSuccess: () => {
      toast.success("Action created successfully!");
      queryClient.invalidateQueries({ queryKey: ["actions"] });
      router.push(redirectTo || `/project/${projectId}/actions`);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to create action";
      toast.error(message);
    },
  });
};

export const useAction = (actionId: string) => {
  return useQuery({
    queryKey: ["actions", actionId],
    queryFn: () => httpGetAction(actionId),
    enabled: !!actionId,
  });
};

export const useUpdateAction = (actionId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = useParams();

  return useMutation({
    mutationFn: (data: CreateActionPayload) => httpUpdateAction(actionId, data),
    onSuccess: () => {
      toast.success("Action updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["actions"] });
      queryClient.invalidateQueries({ queryKey: ["actions", actionId] });
      router.push(`/project/${projectId}/actions`);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to update action";
      toast.error(message);
    },
  });
};

export const useDeleteAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actionId: string) => httpDeleteAction(actionId),
    onSuccess: () => {
      toast.success("Action deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["actions"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to delete action";
      toast.error(message);
    },
  });
};
