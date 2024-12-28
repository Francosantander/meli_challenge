import dotenv from 'dotenv';

dotenv.config();

export const config = {
    cache: {
        ttl: {
            search: parseInt(process.env.CACHE_SEARCH_TTL, 10) || 300,
            product: parseInt(process.env.CACHE_PRODUCT_TTL, 10) || 600
        }
    },
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    api: {
        url: process.env.API_URL || 'https://api.mercadolibre.com',
        timeout: 5000
    },
    author: {
        name: process.env.AUTHOR_NAME || 'Tu Nombre',
        lastname: process.env.AUTHOR_LASTNAME || 'Tu Apellido'
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3001'
    }
};