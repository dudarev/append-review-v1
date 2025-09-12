import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on the port specified in PORT (default 5252 for local dev)
  // Allow overriding host via HOST or BIND_HOST (default 127.0.0.1 to avoid issues some
  // environments have with 0.0.0.0). Remove unsupported reusePort option.
  const port = parseInt(process.env.PORT || "5252", 10);
  const preferredHost = process.env.HOST || process.env.BIND_HOST || "127.0.0.1";

  function startServer(host?: string) {
    try {
      if (host) {
        server.listen(port, host, () => {
          log(`serving on http://${host}:${port}`);
        });
      } else {
        server.listen(port, () => {
          log(`serving on port ${port}`);
        });
      }
    } catch (err) {
      log(`Immediate listen error: ${(err as any).message}`);
      process.exit(1);
    }
  }

  server.on("error", (err: any) => {
    const code = err.code; // e.g. EADDRINUSE, EACCES, ENOTSUP
    log(`Server listen error (${code || "unknown"}): ${err.message}`);
    if (["EADDRINUSE", "EACCES"].includes(code)) {
      log(`Port ${port} unavailable. Try: make port-status / make kill-port or override: PORT=${port + 1} make dev`);
    } else if (["EAFNOSUPPORT", "EADDRNOTAVAIL", "ENOTSUP", "EINVAL"].includes(code)) {
      if (preferredHost) {
        log(`Retrying without explicit host (letting Node choose)...`);
        startServer(undefined);
      }
    }
  });

  startServer(preferredHost);
})();
