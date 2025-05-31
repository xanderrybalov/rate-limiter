
export interface RateLimitRule {
  windowMs: number; // тривалість вікна
  max: number;      // макс. запитів у вікно
}

// Статичні параметри
// Задаються один раз у конфігу
// Для всіх користувачів однакове правило.
// Для всіх користувачів

// RateLimitRule — це правило гри
// FixedWindowState — це те, як клієнт грає в ці правила

export interface RateLimitConfig {
  limits: {
    [path: string]: RateLimitRule;
  };
}

export interface RateLimitRequest {
  ip: string;
  path: string;
}

