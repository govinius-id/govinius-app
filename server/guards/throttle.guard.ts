import { defineEventHandler, getRequestIP, createError } from 'h3';

const requestCounts = new Map<string, { count: number; timestamp: number }>();
const maxRequestDuration = 60000;
const maxRequestCount = {
  GET: 100,
  POST: 20,
  PUT: 20,
  PATCH: 20,
  DELETE: 10,
};

export default defineEventHandler({
  handler: async (event) => {
    const ip = getRequestIP(event) || 'unknown';
    const now = Date.now();
    const method = event.node.req.method || 'GET';

    if (!event.path.startsWith('/api/')) return;

    const limit = maxRequestCount[method as keyof typeof maxRequestCount];
    const key = `${ip}-${method}`;

    if (!requestCounts.has(ip)) {
      requestCounts.set(key, { count: 1, timestamp: now });
      return;
    }

    const data = requestCounts.get(key)!;

    if (now - data.timestamp > maxRequestDuration) {
      requestCounts.set(key, { count: 1, timestamp: now });
      return;
    }

    data.count++;

    if (data.count > limit) {
      setResponseStatus(event, 429, 'Too Many Requests');
      throw createError({
        statusCode: 429,
        message: 'Too Many Requests',
      });
    }
  },
});
