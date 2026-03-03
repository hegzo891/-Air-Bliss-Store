import { db } from "./db";
import {
  products, orders, orderItems, users, inventory, inventoryLogs,
  type User,
  type Product,
  type Order,
  type OrderItem,
  type OrderWithItems,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { sendTelegramMessage } from "./telegramService";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;

  // Products
  getProducts(filters?: { scentType?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: Partial<Product> & { initialQuantity?: number }, adminId: number): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Orders
  getOrders(): Promise<OrderWithItems[]>;
  createOrder(orderData: {
    user: { name: string, email: string, phone: string, password?: string },
    city: string,
    address: string,
    totalAmount: number,
    items: { productId: number, quantity: number, priceAtPurchase: string }[]
  }): Promise<Order>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  updateOrderStatus(id: number, status: any): Promise<Order | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getProducts(filters?: { scentType?: string }): Promise<Product[]> {
    let query = db.select().from(products);
    const conditions = [];

    if (filters?.scentType && filters.scentType !== 'all') {
      conditions.push(eq(products.scentType, filters.scentType));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: Partial<Product> & { initialQuantity?: number }, adminId: number): Promise<Product> {
    return await db.transaction(async (tx) => {
      const { initialQuantity, ...rest } = productData;
      const [product] = await tx.insert(products).values(rest as any).returning();

      const quantity = initialQuantity || 0;

      // Create inventory record
      await tx.insert(inventory).values({
        productId: product.id,
        quantityAvailable: quantity,
      });

      // Create inventory log
      await tx.insert(inventoryLogs).values({
        productId: product.id,
        changeQuantity: quantity,
        reason: "NEW_STOCK",
        adminId: adminId,
      });

      return product;
    });
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(productData).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const [product] = await db.delete(products).where(eq(products.id, id)).returning();
    return !!product;
  }

  async getOrders(): Promise<OrderWithItems[]> {
    const allOrders = await db.select().from(orders);
    const result = [];
    for (const order of allOrders) {
      const [user] = await db.select().from(users).where(eq(users.id, order.userId));
      const items = await db.select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        priceAtPurchase: orderItems.priceAtPurchase,
        product: products
      })
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id))
        .innerJoin(products, eq(orderItems.productId, products.id));

      result.push({
        ...order,
        user,
        items: items.map(item => ({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
          product: item.product
        }))
      });
    }
    return result;
  }

  async createOrder(data: {
    user: { name: string, email: string, phone: string, password?: string },
    city: string,
    address: string,
    totalAmount: number,
    items: { productId: number, quantity: number, priceAtPurchase: string }[]
  }): Promise<Order> {
    console.log("Starting createOrder process for user:", data.user.email);

    // Check if new customer before starting transaction
    const [existingUser] = await db.select().from(users).where(eq(users.phone, data.user.phone)).limit(1);
    const isNewCustomer = !existingUser;

    const resultOrder = await db.transaction(async (tx) => {
      try {
        console.log("Steps: Inserting new user record...");
        const [user] = await tx.insert(users).values({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: 'CUSTOMER'
        }).returning();

        const [order] = await tx.insert(orders).values({
          userId: user.id,
          totalAmount: String(data.totalAmount),
          city: data.city,
          address: data.address,
          status: "PENDING"
        }).returning();

        if (data.items.length > 0) {
          // Verify all products exist
          for (const item of data.items) {
            const [product] = await tx.select().from(products).where(eq(products.id, item.productId));
            if (!product) throw new Error(`Product ID ${item.productId} not found.`);
          }

          const orderItemsToInsert = data.items.map(item => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          }));

          await tx.insert(orderItems).values(orderItemsToInsert);

          // Update inventory
          for (const item of data.items) {
            const [inv] = await tx.select().from(inventory).where(eq(inventory.productId, item.productId));
            if (inv) {
              await tx.update(inventory)
                .set({ quantityAvailable: inv.quantityAvailable - item.quantity })
                .where(eq(inventory.id, inv.id));

              await tx.insert(inventoryLogs).values({
                productId: item.productId,
                changeQuantity: -item.quantity,
                reason: "ORDER",
              });
            }
          }
        }
        return order;
      } catch (err) {
        console.error("TRANSACTION FAILED:", err);
        throw err;
      }
    });

    // Post-order Telegram Notification (Admin Only)
    try {
      const fullOrder = await this.getOrder(resultOrder.id);
      if (fullOrder) {
        let adminMsg = `🚨 *New Order Received (#${resultOrder.id})*\n`;
        adminMsg += `👤 *Customer:* ${data.user.name}\n`;
        adminMsg += `📞 *Phone:* ${data.user.phone}\n`;
        adminMsg += `📍 *Location:* ${data.city}, ${data.address}\n`;
        adminMsg += `✨ *Status:* ${isNewCustomer ? "New Customer! 🌟" : "Returning Customer 🌿"}\n\n`;

        adminMsg += `📦 *Items:*\n`;
        fullOrder.items.forEach(item => {
          adminMsg += `- ${item.product.name} (x${item.quantity}): ${Number(item.priceAtPurchase) * item.quantity} EGP\n`;
        });

        adminMsg += `\n💰 *Total Amount:* ${resultOrder.totalAmount} EGP\n`;
        adminMsg += `--------------------------\n`;
        adminMsg += `Please contact the customer for confirmation.`;

        await sendTelegramMessage(adminMsg);
      }
    } catch (msgErr) {
      console.error("Telegram notification failed:", msgErr);
    }

    return resultOrder;
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const [user] = await db.select().from(users).where(eq(users.id, order.userId));
    const items = await db.select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      priceAtPurchase: orderItems.priceAtPurchase,
      product: products
    })
      .from(orderItems)
      .where(eq(orderItems.orderId, id))
      .innerJoin(products, eq(orderItems.productId, products.id));

    return {
      ...order,
      user,
      items: items.map(item => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        product: item.product
      }))
    };
  }

  async updateOrderStatus(id: number, status: any): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order;
  }
}

export const storage = new DatabaseStorage();
