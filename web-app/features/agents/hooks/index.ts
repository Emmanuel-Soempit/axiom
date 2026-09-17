import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  httpGetAgents,
  httpCreateAgent,
  httpGetAgent,
  httpUpdateAgent,
  httpDeleteAgent,
  httpToggleAgentActive,
  httpGetAgentAudits,
  httpGetAgentFeatures,
  CreateAgentPayload,
  UpdateAgentPayload,
} from "../apis";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

export const useAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: () => httpGetAgents(),
  });
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = useParams();

  return useMutation({
    mutationFn: (data: CreateAgentPayload) => httpCreateAgent(data),
    onSuccess: () => {
      toast.success("Agent created successfully!");
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      router.push(`/project/${projectId}/agents`);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to create agent";
      toast.error(message);
    },
  });
};

export const useAgent = (agentId: string) => {
  return useQuery({
    queryKey: ["agents", agentId],
    queryFn: () => httpGetAgent(agentId),
    enabled: !!agentId,
  });
};

export const useUpdateAgent = (agentId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = useParams();

  return useMutation({
    mutationFn: (data: UpdateAgentPayload) => httpUpdateAgent(agentId, data),
    onSuccess: () => {
      toast.success("Agent updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["agents", agentId] });
      router.push(`/project/${projectId}/agents`);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to update agent";
      toast.error(message);
    },
  });
};

export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) => httpDeleteAgent(agentId),
    onSuccess: () => {
      toast.success("Agent deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to delete agent";
      toast.error(message);
    },
  });
};

export const useToggleAgentActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, active }: { agentId: string; active: boolean }) =>
      httpToggleAgentActive(agentId, active),
    onSuccess: (_, { active }) => {
      toast.success(`Agent ${active ? "activated" : "deactivated"} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to update agent status";
      toast.error(message);
    },
  });
};

export const useAgentAudits = (agentId: string, page: number, limit = 20) => {
  return useQuery({
    queryKey: ["agent-audits", agentId, page, limit],
    queryFn: () => httpGetAgentAudits(agentId, page, limit),
    enabled: !!agentId,
  });
};

export const useAgentFeatures = (agentId: string, page: number, limit = 20) => {
  return useQuery({
    queryKey: ["agent-features", agentId, page, limit],
    queryFn: () => httpGetAgentFeatures(agentId, page, limit),
    enabled: !!agentId,
  });
};
