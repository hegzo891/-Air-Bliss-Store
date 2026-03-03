import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl, type ProductsListResponse, type ProductResponse } from "@shared/routes";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ProductFilters {
  scentType?: string;
  size?: string;
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: [api.products.list.path, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.scentType && filters.scentType !== 'all') params.append('scentType', filters.scentType);
      if (filters?.size && filters.size !== 'all') params.append('size', filters.size);

      const queryString = params.toString();
      const url = `${api.products.list.path}${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      return data as ProductsListResponse;
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");

      const data = await res.json();
      return data as ProductResponse;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", api.products.create.path, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    }
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await apiRequest("PATCH", buildUrl(api.products.update.path, { id }), data);
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.products.get.path, id] });
    }
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", buildUrl(api.products.delete.path, { id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    }
  });
}
