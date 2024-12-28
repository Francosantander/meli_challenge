import { ResponseFormatter } from '../../../utils/responseFormatter.js';

describe('ResponseFormatter', () => {
    describe('formatPrice', () => {
        it('should format price correctly', () => {
            const price = 1234.56;
            const currency = 'USD';
            
            const formattedPrice = ResponseFormatter.formatPrice(price, currency);
            
            expect(formattedPrice).toEqual({
                currency: 'USD',
                amount: 1234,
                decimals: 56
            });
        });

        it('should handle zero decimals', () => {
            const price = 1234.00;
            const currency = 'USD';
            
            const formattedPrice = ResponseFormatter.formatPrice(price, currency);
            
            expect(formattedPrice).toEqual({
                currency: 'USD',
                amount: 1234,
                decimals: 0
            });
        });

        it('should handle null or undefined price', () => {
            const formattedPrice = ResponseFormatter.formatPrice(null, 'USD');
            
            expect(formattedPrice).toEqual({
                currency: 'USD',
                amount: 0,
                decimals: 0
            });
        });
    });

    describe('formatSearchResults', () => {
        it('should format search results correctly', () => {
            const mockResults = {
                results: [
                    {
                        id: 'MLA1',
                        title: 'Product 1',
                        price: 100,
                        currency_id: 'USD',
                        thumbnail: 'url1',
                        condition: 'new',
                        shipping: { free_shipping: true }
                    }
                ],
                filters: [
                    {
                        id: 'category',
                        values: [{
                            path_from_root: [
                                { name: 'Category 1' },
                                { name: 'Category 2' }
                            ]
                        }]
                    }
                ]
            };

            const formatted = ResponseFormatter.formatSearchResults(mockResults);

            expect(formatted).toHaveProperty('author');
            expect(formatted).toHaveProperty('categories');
            expect(formatted).toHaveProperty('items');
            expect(formatted.categories).toEqual(['Category 1', 'Category 2']);
            expect(formatted.items[0]).toHaveProperty('free_shipping');
        });

        it('should handle empty filters', () => {
            const mockResults = {
                results: [
                    {
                        id: 'MLA1',
                        title: 'Product 1',
                        price: 100,
                        currency_id: 'USD',
                        thumbnail: 'url1',
                        condition: 'new',
                        shipping: { free_shipping: true }
                    }
                ],
                filters: [],
                available_filters: [
                    {
                        id: 'category',
                        values: [
                            {
                                name: 'Available Category',
                                results: 100
                            }
                        ]
                    }
                ]
            };

            const formatted = ResponseFormatter.formatSearchResults(mockResults);
            expect(formatted.categories).toEqual(['Available Category']);
        });

        it('should limit results to 4 items', () => {
            const mockResults = {
                results: Array(10).fill({
                    id: 'MLA1',
                    title: 'Product',
                    price: 100,
                    currency_id: 'USD',
                    thumbnail: 'url',
                    condition: 'new',
                    shipping: { free_shipping: true }
                }),
                filters: []
            };

            const formatted = ResponseFormatter.formatSearchResults(mockResults);
            expect(formatted.items).toHaveLength(4);
        });

        it('should handle null or empty results', () => {
            const mockResults = {
                results: null,
                filters: []
            };

            const formatted = ResponseFormatter.formatSearchResults(mockResults);
            expect(formatted.items).toEqual([]);
        });
    });

    describe('formatProductDetail', () => {
        it('should format product detail correctly', () => {
            const mockProduct = {
                item: {
                    id: 'MLA1',
                    title: 'iPhone',
                    price: 1000,
                    currency_id: 'USD',
                    pictures: [{ url: 'picture-url' }],
                    condition: 'new',
                    shipping: { free_shipping: true },
                    sold_quantity: 10
                },
                description: {
                    plain_text: 'Product description'
                }
            };

            const formatted = ResponseFormatter.formatProductDetail(mockProduct);

            expect(formatted.author).toBeDefined();
            expect(formatted.item).toBeDefined();
            expect(formatted.item.description).toBe('Product description');
        });

        it('should handle missing pictures', () => {
            const mockProduct = {
                item: {
                    id: 'MLA1',
                    title: 'iPhone',
                    price: 1000,
                    currency_id: 'USD',
                    thumbnail: 'thumbnail-url',
                    condition: 'new',
                    shipping: { free_shipping: true },
                    sold_quantity: 10
                },
                description: {
                    plain_text: 'Description'
                }
            };

            const formatted = ResponseFormatter.formatProductDetail(mockProduct);
            expect(formatted.item.picture).toBe('thumbnail-url');
        });

        it('should handle missing data gracefully', () => {
            const mockProduct = {
                item: {
                    id: 'MLA1',
                    title: 'iPhone',
                    price: 1000,
                    currency_id: 'USD'
                },
                description: {}
            };

            const formatted = ResponseFormatter.formatProductDetail(mockProduct);

            expect(formatted.item.description).toBe('');
            expect(formatted.item.free_shipping).toBe(false);
            expect(formatted.item.sold_quantity).toBe(0);
        });

        it('should handle completely empty input', () => {
            const mockProduct = {
                item: null,
                description: null
            };

            expect(() => ResponseFormatter.formatProductDetail(mockProduct))
                .toThrow('Product not found');
        });
    });
});