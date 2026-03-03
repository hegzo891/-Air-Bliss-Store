import { z } from 'zod';
import { insertProductSchema, products, orders, orderItems } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      input: z.object({
        scentType: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id' as const,
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/products/:id' as const,
      input: insertProductSchema.partial(),
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/products/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products' as const,
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
      },
    },
  },
  orders: {
    list: {
      method: 'GET' as const,
      path: '/api/orders' as const,
      responses: {
        200: z.array(z.any()), // OrderWithItems[]
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/orders' as const,
      input: z.object({
        user: z.object({
          name: z.string(),
          email: z.string().email(),
          phone: z.string().min(10, "Phone number must be at least 10 characters"),
          password: z.string().optional(),
        }),
        city: z.string(),
        address: z.string(),
        totalAmount: z.number(),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          priceAtPurchase: z.string()
        }))
      }),
      responses: {
        201: z.object({
          id: z.number(),
          totalAmount: z.string(),
          status: z.string()
        }),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:id' as const,
      responses: {
        200: z.any(), // OrderWithItems
        404: errorSchemas.notFound,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/orders/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ProductResponse = z.infer<typeof api.products.get.responses[200]>;
export type ProductsListResponse = z.infer<typeof api.products.list.responses[200]>;
export type OrderInput = z.infer<typeof api.orders.create.input>;
export type OrderResponse = z.infer<typeof api.orders.create.responses[201]>;
