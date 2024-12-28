import { MercadoLibreService } from './mercadolibre.service.js';
import { ResponseFormatter } from '../utils/responseFormatter.js';

export class ItemsService {
    static async searchItems(query) {
        try {
            const searchResults = await MercadoLibreService.searchProducts(query);
            
            const formattedResults = ResponseFormatter.formatSearchResults(searchResults);
            
            return formattedResults;
        } catch (error) {
            throw error;
        }
    }

    static async getItemById(id) {
        try {
            const productData = await MercadoLibreService.getProductById(id);
            
            const formattedProduct = ResponseFormatter.formatProductDetail(productData);
            
            return formattedProduct;
        } catch (error) {
            throw error;
        }
    }

    static validateSearchQuery(query) {
        if (!query || typeof query !== 'string') {
            throw new Error('Search query is required and must be a string');
        }

        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length < 2) {
            throw new Error('Search query must be at least 2 characters long');
        }

        if (trimmedQuery.length > 100) {
            throw new Error('Search query must not exceed 100 characters');
        }

        return trimmedQuery;
    }

    static validateItemId(id) {
        if (!id || typeof id !== 'string') {
            throw new Error('Item ID is required and must be a string');
        }

        const validIdRegex = /^[A-Z0-9]+$/;
        if (!validIdRegex.test(id)) {
            throw new Error('Invalid item ID format');
        }

        return id;
    }
}