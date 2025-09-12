import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Health and version endpoint for quick diagnostics
  app.get("/api/health", (_req, res) => {
    try {
      const pkgPath = path.resolve(import.meta.dirname, "..", "package.json");
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      res.json({ status: "ok", version: pkg.version, env: process.env.NODE_ENV || "development" });
    } catch {
      res.json({ status: "ok", version: "unknown", env: process.env.NODE_ENV || "development" });
    }
  });

  // no persistent storage in v1 — data lives in browser localStorage

  const httpServer = createServer(app);

  return httpServer;
}
