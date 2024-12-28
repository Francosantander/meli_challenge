import { Router } from 'express';
import { searchItems, getItemById } from '../controllers/items.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationMiddleware } from '../middlewares/validation.js';
import { searchRateLimiter, productRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.get('/items', 
    searchRateLimiter,
    ValidationMiddleware.validateSearchQuery,
    asyncHandler(searchItems)
);

router.get('/items/:id',
    productRateLimiter,
    ValidationMiddleware.validateItemId,
    asyncHandler(getItemById)
);

export default router;