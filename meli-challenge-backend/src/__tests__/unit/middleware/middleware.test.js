import { jest } from '@jest/globals';
import { ValidationMiddleware } from '../../../middlewares/validation.js';
import { errorHandler } from '../../../middlewares/errorHandler.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { globalRateLimiter, searchRateLimiter, productRateLimiter } from '../../../middlewares/rateLimiter.js';

describe('Middlewares', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            query: {},
            params: {},
            ip: '127.0.0.1',
            headers: {}
        };
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
    });

    describe('ValidationMiddleware', () => {
        describe('validateSearchQuery', () => {
            it('should pass valid query', () => {
                mockReq.query.q = 'valid query';
                ValidationMiddleware.validateSearchQuery(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });

            it('should reject empty query', () => {
                mockReq.query.q = '';
                ValidationMiddleware.validateSearchQuery(mockReq, mockRes, mockNext);
                expect(mockRes.status).toHaveBeenCalledWith(400);
            });

            it('should reject too long query', () => {
                mockReq.query.q = 'a'.repeat(101);
                ValidationMiddleware.validateSearchQuery(mockReq, mockRes, mockNext);
                expect(mockRes.status).toHaveBeenCalledWith(400);
            });
        });

        describe('validateItemId', () => {
            it('should pass valid ID', () => {
                mockReq.params.id = 'MLA123456';
                ValidationMiddleware.validateItemId(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });

            it('should reject invalid ID format', () => {
                mockReq.params.id = 'invalid-id';
                ValidationMiddleware.validateItemId(mockReq, mockRes, mockNext);
                expect(mockRes.status).toHaveBeenCalledWith(400);
            });
        });
    });

    describe('errorHandler', () => {
        it('should format error response', () => {
            const error = new Error('Test error');
            error.status = 400;

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.objectContaining({
                    message: 'Test error',
                    status: 400
                })
            }));
        });

        it('should use 500 as default status', () => {
            const error = new Error('Server error');

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('asyncHandler', () => {
        it('should handle async functions', async () => {
            const asyncFn = jest.fn().mockResolvedValue('result');
            const wrapped = asyncHandler(asyncFn);

            await wrapped(mockReq, mockRes, mockNext);

            expect(asyncFn).toHaveBeenCalled();
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should catch errors and pass to next', async () => {
            const error = new Error('Async error');
            const asyncFn = jest.fn().mockRejectedValue(error);
            const wrapped = asyncHandler(asyncFn);

            await wrapped(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('rateLimiter', () => {
        describe('globalRateLimiter', () => {
            it('should pass requests under limit', async () => {
                await globalRateLimiter(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });

        describe('searchRateLimiter', () => {
            it('should pass requests under limit', async () => {
                await searchRateLimiter(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });

        describe('productRateLimiter', () => {
            it('should pass requests under limit', async () => {
                await productRateLimiter(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
});