import { config } from '../config/config.js';

export class ResponseFormatter {
    static formatPrice(price, currency) {
        if (!price) return { currency: currency || 'USD', amount: 0, decimals: 0 };
        
        const amount = Math.floor(price);
        const decimals = Math.round((price - amount) * 100);
        
        return {
            currency,
            amount,
            decimals
        };
    }

    static extractCategories(mlResults) {
        const categoryFilter = mlResults.filters.find(filter => filter.id === 'category');
        if (categoryFilter?.values?.[0]?.path_from_root) {
            return categoryFilter.values[0].path_from_root.map(cat => cat.name);
        }

        const availableCategoryFilter = mlResults.available_filters?.find(filter => filter.id === 'category');
        if (availableCategoryFilter?.values) {
            const topCategory = availableCategoryFilter.values.sort((a, b) => b.results - a.results)[0];
            return topCategory ? [topCategory.name] : [];
        }

        return [];
    }

    static formatSearchResults(mlResults) {
        if (!mlResults.results) {
            return {
                author: config.author,
                categories: [],
                items: []
            };
        }

        const items = mlResults.results.slice(0, 4).map(item => ({
            id: item.id,
            title: item.title,
            price: this.formatPrice(item.price, item.currency_id),
            picture: item.thumbnail,
            condition: item.condition,
            free_shipping: item.shipping?.free_shipping || false,
            state_name: item.address?.state_name || ''
        }));

        return {
            author: config.author,
            categories: this.extractCategories(mlResults),
            items
        };
    }

    static formatProductDetail(productData) {
        const { item, description } = productData;
        
        if (!item) {
            throw new Error('Product not found');
        }

        return {
            author: config.author,
            item: {
                id: item.id,
                title: item.title,
                price: this.formatPrice(item.price, item.currency_id),
                picture: item.pictures?.[0]?.url || item.thumbnail,
                condition: item.condition,
                free_shipping: item.shipping?.free_shipping || false,
                sold_quantity: item.sold_quantity || 0,
                description: description?.plain_text || ''
            }
        };
    }
}