import { useQuery } from "@tanstack/react-query";
import { httpGetProjectDashboard } from "../apis";

export const useProjectDashboard = () => {
  return useQuery({
    queryKey: ["project-dashboard"],
    queryFn: () => httpGetProjectDashboard(),
  });
};
