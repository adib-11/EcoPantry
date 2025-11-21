/**
 * Simple in-memory rate limiter
 * Prevents API abuse by limiting requests per user
 */

const rateLimit = new Map();

const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60000; // 1 minute default
  const maxRequests = options.maxRequests || 60; // 60 requests per minute default

  return (req, res, next) => {
    // Use userId from body or IP address as identifier
    const identifier = req.body?.userId || req.ip;
    
    const now = Date.now();
    const userLimit = rateLimit.get(identifier) || { count: 0, resetTime: now + windowMs };

    // Reset if window expired
    if (now > userLimit.resetTime) {
      userLimit.count = 0;
      userLimit.resetTime = now + windowMs;
    }

    // Increment counter
    userLimit.count++;
    rateLimit.set(identifier, userLimit);

    // Check if limit exceeded
    if (userLimit.count > maxRequests) {
      const resetIn = Math.ceil((userLimit.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        error: {
          name: 'RateLimitExceeded',
          message: `Too many requests. Please try again in ${resetIn} seconds.`,
          retryAfter: resetIn
        }
      });
    }

    // Add rate limit info to headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - userLimit.count);
    res.setHeader('X-RateLimit-Reset', new Date(userLimit.resetTime).toISOString());

    next();
  };
};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 5 * 60 * 1000);

module.exports = rateLimiter;
