import { jest } from '@jest/globals';
import { MercadoLibreService } from '../../../services/mercadolibre.service.js';

const mockGet = jest.fn();
const mockCreate = jest.fn(() => ({ get: mockGet }));

jest.mock('axios', () => ({
    default: {
        create: mockCreate
    }
}));

describe('MercadoLibreService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('searchProducts', () => {
        it('should fetch search results successfully', async () => {
            const mockResponse = {
                data: {
                    results: [
                        {
                            id: 'MLA1',
                            title: 'Test Product',
                            price: 100,
                            currency_id: 'USD'
                        }
                    ],
                    filters: []
                }
            };

            mockGet.mockResolvedValueOnce(mockResponse);

            const result = await MercadoLibreService.searchProducts('test');
            expect(result).toEqual(mockResponse.data);
            expect(mockGet).toHaveBeenCalledWith('/sites/MLA/search?q=test&limit=4');
        });

        it('should handle API errors', async () => {
            const error = new Error('API Error');
            error.response = { status: 500, data: { message: 'Server Error' } };
            mockGet.mockRejectedValueOnce(error);

            await expect(MercadoLibreService.searchProducts('test'))
                .rejects
                .toThrow('MercadoLibre API error: 500 - Server Error');
        });
    });

    describe('getProductById', () => {
        it('should fetch product details successfully', async () => {
            const mockProductResponse = {
                data: {
                    id: 'MLA1',
                    title: 'Test Product'
                }
            };

            const mockDescriptionResponse = {
                data: {
                    plain_text: 'Description'
                }
            };

            mockGet
                .mockResolvedValueOnce(mockProductResponse)
                .mockResolvedValueOnce(mockDescriptionResponse);

            const result = await MercadoLibreService.getProductById('MLA1');
            
            expect(result).toEqual({
                item: mockProductResponse.data,
                description: mockDescriptionResponse.data
            });
        });

        it('should handle product not found', async () => {
            const error = new Error('Not Found');
            error.response = { status: 404 };
            mockGet.mockRejectedValueOnce(error);

            await expect(MercadoLibreService.getProductById('MLA999'))
                .rejects
                .toThrow('Product with ID MLA999 not found');
        });
    });
});