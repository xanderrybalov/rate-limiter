import { createRateLimiter } from "./limiter";

const limiter = createRateLimiter({
  limits: {
    "/api/login": { windowMs: 60_000, max: 5 }
  }
});

const req = { ip: "192.168.1.10", path: "/api/login" };

for (let i = 1; i <= 7; i++) {
  const allowed = limiter(req);
  console.log(`Request ${i}:`, allowed ? "Allowed" : "429 Too Many Requests");
}