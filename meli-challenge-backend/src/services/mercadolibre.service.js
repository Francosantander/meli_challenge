import axios from 'axios';
import { cacheService } from './cache.service.js';
import { config } from '../config/config.js';

const ML_API_BASE_URL = config.api.url;

const apiClient = axios.create({
    baseURL: ML_API_BASE_URL,
    timeout: config.api.timeout,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

class MLApiError extends Error {
    constructor(status, message, originalError = null) {
        super(message);
        this.name = 'MLApiError';
        this.status = status;
        this.originalError = originalError;
    }
}

export class MercadoLibreService {
    static handleApiError(error) {
        if (error instanceof MLApiError) {
            throw error;
        }

        if (axios.isAxiosError(error)) {
            if (error.response) {
                const status = error.response.status;
                switch (status) {
                    case 404:
                        throw new MLApiError(404, 'Item not found');
                    case 429:
                        throw new MLApiError(429, 'Too many requests to MercadoLibre API');
                    default:
                        throw new MLApiError(
                            error.response.status,
                            error.response.data?.message || 'API Error'
                        );
                }
            } else if (error.request) {
                throw new MLApiError(503, 'MercadoLibre API is not available');
            }
        }
        
        throw new MLApiError(500, 'Internal server error');
    }

    static async searchProducts(query) {
        const cacheKey = cacheService.generateSearchKey(query);
        
        try {
            return await cacheService.remember(cacheKey, config.cache.ttl.search, async () => {
                const response = await apiClient.get(`/sites/MLA/search?q=${encodeURIComponent(query)}&limit=4`);
                return response.data;
            });
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    static async getProductById(id) {
        const cacheKey = cacheService.generateProductKey(id);
        
        try {
            return await cacheService.remember(cacheKey, config.cache.ttl.product, async () => {
                try {
                    const [productResponse, descriptionResponse] = await Promise.all([
                        apiClient.get(`/items/${id}`),
                        apiClient.get(`/items/${id}/description`)
                    ]);

                    return {
                        item: productResponse.data,
                        description: descriptionResponse.data
                    };
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status === 404) {
                        throw new MLApiError(404, `Product with ID ${id} not found`);
                    }
                    throw error;
                }
            });
        } catch (error) {
            throw this.handleApiError(error);
        }
    }
}