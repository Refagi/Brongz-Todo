import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 25, // Maksimal 100 request per IP dalam 15 menit
  skipSuccessfulRequests: true,
  message: 'Too many requests from this IP, please try again later'
});
