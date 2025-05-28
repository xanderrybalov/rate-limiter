export interface RateLimitRule {
    windowMs: number;
    max: number;
  }
  
  export interface RateLimitConfig {
    limits: {
      [path: string]: RateLimitRule;
    };
  }
  
  export interface RateLimitRequest {
    ip: string;
    path: string;
  }
  