import { jest } from '@jest/globals';

const mockSearchProducts = jest.fn();
const mockGetProductById = jest.fn();

jest.mock('../../../services/mercadolibre.service.js', () => ({
    MercadoLibreService: {
        searchProducts: mockSearchProducts,
        getProductById: mockGetProductById
    }
}));

import { ItemsService } from '../../../services/items.service.js';

describe('ItemsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSearchProducts.mockReset();
        mockGetProductById.mockReset();
    });

    describe('searchItems', () => {
        it('should return formatted search results', async () => {
            const mockResults = {
                results: [
                    {
                        id: 'MLA1',
                        title: 'Test Product',
                        price: 100,
                        currency_id: 'USD',
                        thumbnail: 'url',
                        condition: 'new',
                        shipping: { free_shipping: true }
                    }
                ],
                filters: []
            };

            mockSearchProducts.mockResolvedValueOnce(mockResults);

            const result = await ItemsService.searchItems('test');

            expect(mockSearchProducts).toHaveBeenCalledWith('test');
            expect(result.items).toHaveLength(1);
            expect(result.items[0]).toMatchObject({
                id: 'MLA1',
                title: 'Test Product'
            });
        });

        it('should handle API errors', async () => {
            const error = new Error('API Error');
            mockSearchProducts.mockRejectedValueOnce(error);

            await expect(ItemsService.searchItems('test'))
                .rejects
                .toThrow('API Error');
        });
    });
});