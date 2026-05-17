import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpGetFeatures, httpCreateFeature, httpGetFeature, httpUpdateFeature, httpDeleteFeature, httpGetActionsByFeatureId, CreateFeaturePayload } from "../apis";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

export const useFeatures = () => {
  return useQuery({
    queryKey: ["features"],
    queryFn: () => httpGetFeatures(),
  });
};

export const useCreateFeature = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = useParams();

  return useMutation({
    mutationFn: (data: CreateFeaturePayload) => httpCreateFeature(data),
    onSuccess: () => {
      toast.success("Feature created successfully!");
      queryClient.invalidateQueries({ queryKey: ["features"] });
      router.push(`/project/${projectId}/features`);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to create feature";
      toast.error(message);
    },
  });
};

export const useFeature = (featureId: string) => {
  return useQuery({
    queryKey: ["features", featureId],
    queryFn: () => httpGetFeature(featureId),
    enabled: !!featureId,
  });
};

export const useUpdateFeature = (featureId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = useParams();

  return useMutation({
    mutationFn: (data: CreateFeaturePayload) => httpUpdateFeature(featureId, data),
    onSuccess: () => {
      toast.success("Feature updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["features"] });
      queryClient.invalidateQueries({ queryKey: ["features", featureId] });
      router.push(`/project/${projectId}/features`);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to update feature";
      toast.error(message);
    },
  });
};

export const useDeleteFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (featureId: string) => httpDeleteFeature(featureId),
    onSuccess: () => {
      toast.success("Feature deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to delete feature";
      toast.error(message);
    },
  });
};

export const useActionsByFeature = (featureId: string) => {
  return useQuery({
    queryKey: ["features", featureId, "actions"],
    queryFn: () => httpGetActionsByFeatureId(featureId),
    enabled: !!featureId,
  });
};
