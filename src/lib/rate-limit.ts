import { NextRequest } from "next/server";

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Periodically clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const ip in store) {
      if (store[ip].resetTime < now) {
        delete store[ip];
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * In-memory rate limiter per IP address.
 * @param request The incoming NextRequest
 * @param limit Maximum number of requests allowed in the window
 * @param windowMs Time window in milliseconds (default: 1 minute = 60000ms)
 * @returns object containing success boolean and remaining count
 */
export function checkRateLimit(
  request: NextRequest,
  limit: number = 20,
  windowMs: number = 60000
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const now = Date.now();
  const record = store[ip];

  if (!record || record.resetTime < now) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}
