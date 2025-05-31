import http from "http";
import dotenv from "dotenv";
import { createFixedWindowLimiter } from "./createFixedWindowLimiter";
import { RateLimitRequest } from "./types";

dotenv.config();

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
const max = parseInt(process.env.RATE_LIMIT_MAX || "5", 10);

const limiter = createFixedWindowLimiter({
  limits: {
    "/api/login": { windowMs, max }
  }
});

const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress || "unknown";
  const url = req.url || "/";
  const method = req.method || "GET";

  if (url === "/favicon.ico") return res.end();

    const allowed = limiter({ ip, path: url } as RateLimitRequest);

  if (!allowed) {
    res.writeHead(429, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Too Many Requests" }));
    return;
  }


  if (url === "/api/login" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "OK, I'm a server" }));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
