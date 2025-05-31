import { RateLimitConfig, RateLimitRequest } from "./types";

//FixedWindowState — це поточний стан конкретного користувача
interface FixedWindowState {
  windowStart: number; // з якого часу пішло поточне вікно
  count: number;       // скільки запитів уже зроблено в цьому вікні
}

type FixedWindowStore = Map<string, FixedWindowState>

export function createFixedWindowLimiter(config: RateLimitConfig) {
    const store: FixedWindowStore = new Map();

    return function checkLimit(req: RateLimitRequest): boolean {
        const { ip, path } = req;
        const rule = config.limits[path];
        if (!rule) return true;

        const key = `${path}:${ip}`;
        const now = Date.now();
        const windowStart = now - (now % rule.windowMs);
        const record = store.get(key);

        console.log("record +>", record)

        if(!record || record.windowStart !== windowStart) {
            store.set(key, {windowStart, count:1});
            return true;
        }
        if (record.count >= rule.max) {
            return false;
        }
        record.count++;
        store.set(key, record);

        return true
    }
}