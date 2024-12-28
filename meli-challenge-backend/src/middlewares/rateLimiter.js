import { rateLimit } from 'express-rate-limit';
import { config } from '../config/config.js';

export const globalRateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        error: {
            status: 429,
            message: 'Too many requests from this IP, please try again later.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    
    keyGenerator: (req) => {
        
        return req.headers['x-forwarded-for'] || req.ip;
    }
});


export const searchRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: {
        error: {
            status: 429,
            message: 'Too many search requests, please try again later.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for'] || req.ip;
    }
});


export const productRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
        error: {
            status: 429,
            message: 'Too many product requests, please try again later.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for'] || req.ip;
    }
});