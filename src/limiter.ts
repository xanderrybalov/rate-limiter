import { RateLimitConfig, RateLimitRequest } from "./types";

type RequestStore = Map<string, number[]>;

export function createRateLimiter(config: RateLimitConfig) {
  const store: RequestStore = new Map();


  return function checkLimit(req: RateLimitRequest): boolean {
    const { ip, path } = req;
    const rule = config.limits[path];
    if (!rule) return true; // no limit - we allow

    const key = `${path}:${ip}`;
    const now = Date.now();
    const timestamps = store.get(key) || [];
    // remove timestamps that are outside the window
    const validTimestamps = timestamps.filter(ts => now - ts < rule.windowMs);

    if (validTimestamps.length >= rule.max) {
      return false; // limit exceeded
    }

    validTimestamps.push(now); // save new request
    store.set(key, validTimestamps);
    console.log("now:", now, "timestamps:", timestamps, "valid:", validTimestamps);

    return true;
  };
}
