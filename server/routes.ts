import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";



export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user.role === "ADMIN") {
      return next();
    }
    res.status(403).send("Forbidden: Admin access only");
  };

  app.get(api.products.list.path, async (req, res) => {
    try {
      const filters = req.query;
      const productsList = await storage.getProducts({
        scentType: filters.scentType as string | undefined,
      });
      res.status(200).json(productsList);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post(api.products.create.path, isAdmin, async (req: any, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input, req.user.id);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.patch(api.products.update.path, isAdmin, async (req, res) => {
    try {
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(Number(req.params.id), input);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.status(200).json(product);
    } catch (err) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete(api.products.delete.path, isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteProduct(Number(req.params.id));
      if (!success) return res.status(404).json({ message: "Product not found" });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.get(api.orders.list.path, isAdmin, async (req, res) => {
    try {
      const ordersList = await storage.getOrders();
      res.status(200).json(ordersList);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json({ id: order.id, totalAmount: order.totalAmount, status: order.status || "PENDING" });
    } catch (err: any) {
      console.error("Order creation error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get(api.orders.get.path, isAdmin, async (req, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.patch(api.orders.updateStatus.path, isAdmin, async (req, res) => {
    try {
      const { status } = api.orders.updateStatus.input.parse(req.body);
      const order = await storage.updateOrderStatus(Number(req.params.id), status);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json({ message: "Invalid status" });
    }
  });

  return httpServer;
}
