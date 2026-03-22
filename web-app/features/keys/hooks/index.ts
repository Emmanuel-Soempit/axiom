import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  httpCreateApiKey,
  httpGetApiKeys,
  httpRevokeApiKey,
  httpDeleteApiKey,
  CreateApiKeyPayload,
} from "../apis";
import { toast } from "react-hot-toast";

export const useApiKeys = () => {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: () => httpGetApiKeys(),
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateApiKeyPayload) => httpCreateApiKey(data),
    onSuccess: () => {
      toast.success("API key created successfully!");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to create API key";
      toast.error(message);
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => httpRevokeApiKey(id),
    onSuccess: () => {
      toast.success("API key revoked successfully!");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to revoke API key";
      toast.error(message);
    },
  });
};

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => httpDeleteApiKey(id),
    onSuccess: () => {
      toast.success("API key deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to delete API key";
      toast.error(message);
    },
  });
};
