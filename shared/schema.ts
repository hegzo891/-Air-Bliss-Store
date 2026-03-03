import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  numeric,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/* ===========================
   ENUMS
=========================== */

// User roles
export const roleEnum = pgEnum("role", ["CUSTOMER", "ADMIN"]);

// Order status
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

// Inventory change reason
export const inventoryReasonEnum = pgEnum("inventory_reason", [
  "NEW_STOCK",
  "ORDER",
  "MANUAL_UPDATE",
]);

/* ===========================
   USERS
=========================== */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),

  email: text("email"),

  phone: text("phone"),

  password: text("password"),

  role: roleEnum("role").notNull().default("CUSTOMER"),

  createdAt: timestamp("created_at").defaultNow(),
});

/* ===========================
   PRODUCTS
=========================== */

export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),

  description: text("description"),

  price: numeric("price", { precision: 10, scale: 2 }).notNull(),

  scentType: text("scent_type"),

  isActive: text("is_active").default("true"),

  imageUrl: text("image_url").notNull().default(''),

  isBestSeller: boolean("is_best_seller").default(false),

  createdAt: timestamp("created_at").defaultNow(),
});

/* ===========================
   INVENTORY
=========================== */

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  quantityAvailable: integer("quantity_available").notNull().default(0),

  lastUpdated: timestamp("last_updated").defaultNow(),
});

/* ===========================
   INVENTORY LOGS
=========================== */

export const inventoryLogs = pgTable("inventory_logs", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  changeQuantity: integer("change_quantity").notNull(),

  reason: inventoryReasonEnum("reason").notNull(),

  adminId: integer("admin_id")
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow(),
});

/* ===========================
   ORDERS
=========================== */

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),

  status: orderStatusEnum("status").notNull().default("PENDING"),

  shippingAddress: text("shipping_address"), // Keep for backward compatibility or remove later

  city: text("city").notNull(),

  address: text("address").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

/* ===========================
   ORDER ITEMS
=========================== */

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),

  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  quantity: integer("quantity").notNull(),

  priceAtPurchase: numeric("price_at_purchase", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true }).extend({
  initialQuantity: z.number().int().min(0).optional().default(0),
});
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true, lastUpdated: true });
export const insertInventoryLogSchema = createInsertSchema(inventoryLogs).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type OrderWithItems = Order & {
  user: User;
  items: (OrderItem & { product: Product })[];
};