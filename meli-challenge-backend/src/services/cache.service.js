import NodeCache from 'node-cache';

class CacheService {
    constructor(ttlSeconds = 60) {
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false
        });
    }

    get(key) {
        const value = this.cache.get(key);
        if (value) {
            console.log(`Cache hit for key: ${key}`);
        } else {
            console.log(`Cache miss for key: ${key}`);
        }
        return value;
    }

    set(key, value, ttl = undefined) {
        return this.cache.set(key, value, ttl);
    }

    del(keys) {
        return this.cache.del(keys);
    }

    flush() {
        return this.cache.flushAll();
    }

    async remember(key, ttl, callback) {
        const value = this.get(key);
        if (value) {
            return value;
        }
        const freshValue = await callback();
        this.set(key, freshValue, ttl);
        return freshValue;
    }

    generateSearchKey(query) {
        return `search:${query.toLowerCase().trim()}`;
    }

    generateProductKey(id) {
        return `product:${id}`;
    }
}

export const cacheService = new CacheService();