import rateLimit from 'express-rate-limit'

const REQUEST_MULTIPLIER = process.env.MODE === 'dev' ? 100 : 1
const MINUTE = 60 * 1000

export const defaultLimiter = rateLimit({
  windowMs: 30 * MINUTE,
  max: 500 * REQUEST_MULTIPLIER,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

export const authLimiter = rateLimit({
  windowMs: 30 * MINUTE,
  max: 20 * REQUEST_MULTIPLIER,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})
