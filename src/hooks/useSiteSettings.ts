import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings"],
    staleTime: 5 * 60 * 1000, // 5 minutes — settings rarely change
    queryFn: async () => {
      return await apiFetch("/settings");
    },
  });
};
