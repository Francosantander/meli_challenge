import { jest } from '@jest/globals';
import { cacheService } from '../../../services/cache.service.js';

describe('CacheService', () => {
    beforeEach(() => {
        cacheService.flush();
    });

    describe('get/set operations', () => {
        it('should store and retrieve values', () => {
            cacheService.set('test-key', 'test-value');
            expect(cacheService.get('test-key')).toBe('test-value');
        });

        it('should return undefined for non-existent keys', () => {
            expect(cacheService.get('non-existent')).toBeUndefined();
        });

        it('should respect TTL', async () => {
            cacheService.set('ttl-test', 'value', 1);
            expect(cacheService.get('ttl-test')).toBe('value');
            
            await new Promise(resolve => setTimeout(resolve, 1100));
            expect(cacheService.get('ttl-test')).toBeUndefined();
        });
    });

    describe('remember method', () => {
        it('should cache and return computed value', async () => {
            const callback = jest.fn().mockResolvedValue('computed-value');

            const result1 = await cacheService.remember('key', 60, callback);
            const result2 = await cacheService.remember('key', 60, callback);

            expect(result1).toBe('computed-value');
            expect(result2).toBe('computed-value');
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should recompute when value expires', async () => {
            const callback = jest.fn().mockResolvedValue('computed-value');

            await cacheService.remember('key', 1, callback);
            await new Promise(resolve => setTimeout(resolve, 1100));
            await cacheService.remember('key', 1, callback);

            expect(callback).toHaveBeenCalledTimes(2);
        });
    });

    describe('key generation', () => {
        it('should generate search keys correctly', () => {
            const key = cacheService.generateSearchKey('test query');
            expect(key).toBe('search:test query');
        });

        it('should generate product keys correctly', () => {
            const key = cacheService.generateProductKey('MLA123');
            expect(key).toBe('product:MLA123');
        });
    });
});