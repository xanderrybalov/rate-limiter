import http from "http";
import { createRateLimiter } from "./limiter";

const limiter = createRateLimiter({
  limits: {
    "/api/login": { windowMs: 60_000, max: 5 }
  }
});

const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress || "unknown";
  const url = req.url || "/";
  const method = req.method || "GET";

  if (url === "/favicon.ico") return res.end();

  const allowed = limiter({ ip, path: url });

  if (!allowed) {
    res.writeHead(429, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Too Many Requests" }));
    return;
  }

  if (url === "/api/login" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "OK" }));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
