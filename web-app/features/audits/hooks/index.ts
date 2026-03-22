import { useQuery } from "@tanstack/react-query";
import { httpGetAudits } from "../apis";

export const useAudits = () => {
  return useQuery({
    queryKey: ["audits"],
    queryFn: () => httpGetAudits(),
  });
};
