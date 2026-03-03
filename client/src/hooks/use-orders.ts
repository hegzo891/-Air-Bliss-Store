import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api, buildUrl, type OrderInput } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function useOrders() {
  return useQuery<any[]>({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const res = await fetch(api.orders.list.path);
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    }
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: OrderInput) => {
      const res = await apiRequest("POST", api.orders.create.path, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiRequest("PATCH", buildUrl(api.orders.updateStatus.path, { id }), { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
    }
  });
}
