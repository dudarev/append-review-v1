import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // no persistent storage in v1 — data lives in browser localStorage

  const httpServer = createServer(app);

  return httpServer;
}
