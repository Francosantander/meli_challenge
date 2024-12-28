import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

jest.mock('../../services/mercadolibre.service.js', () => {
    const mockSearchProducts = jest.fn();
    const mockGetProductById = jest.fn();

    return {
        MercadoLibreService: {
            searchProducts: mockSearchProducts,
            getProductById: mockGetProductById
        }
    };
});

const { MercadoLibreService } = await import('../../services/mercadolibre.service.js');

describe('Items API Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('GET /api/items', () => {
        it('should return search results with correct format', async () => {
            const mockResults = {
                results: [
                    {
                        id: 'MLA1',
                        title: 'iPhone',
                        price: 1000,
                        currency_id: 'USD',
                        thumbnail: 'url',
                        condition: 'new',
                        shipping: { free_shipping: true }
                    }
                ],
                filters: [
                    {
                        id: 'category',
                        values: [{
                            path_from_root: [
                                { name: 'Electrónicos' },
                                { name: 'Celulares' }
                            ]
                        }]
                    }
                ]
            };

            MercadoLibreService.searchProducts.mockResolvedValueOnce(mockResults);

            const response = await request(app)
                .get('/api/items?q=iphone')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({
                author: expect.objectContaining({
                    name: expect.any(String),
                    lastname: expect.any(String)
                }),
                categories: expect.any(Array),
                items: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        title: expect.any(String),
                        price: expect.objectContaining({
                            currency: expect.any(String),
                            amount: expect.any(Number),
                            decimals: expect.any(Number)
                        }),
                        picture: expect.any(String),
                        condition: expect.any(String),
                        free_shipping: expect.any(Boolean)
                    })
                ])
            });
        });

        it('should return 400 for missing query parameter', async () => {
            const response = await request(app)
                .get('/api/items')
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.error).toBeDefined();
            expect(response.body.error.status).toBe(400);
        });

        it('should return 400 for invalid query', async () => {
            const response = await request(app)
                .get('/api/items?q=')
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.error).toBeDefined();
            expect(response.body.error.status).toBe(400);
        });

        it('should handle API errors gracefully', async () => {
            const error = new Error('API Error');
            error.status = 500;
            MercadoLibreService.searchProducts.mockRejectedValueOnce(error);

            const response = await request(app)
                .get('/api/items?q=iphone')
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body.error).toBeDefined();
            expect(response.body.error.status).toBe(500);
        });
    });

    describe('GET /api/items/:id', () => {
        it('should return product details with correct format', async () => {
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

            MercadoLibreService.getProductById.mockResolvedValueOnce(mockProduct);

            const response = await request(app)
                .get('/api/items/MLA1')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({
                author: expect.objectContaining({
                    name: expect.any(String),
                    lastname: expect.any(String)
                }),
                item: expect.objectContaining({
                    id: expect.any(String),
                    title: expect.any(String),
                    price: expect.objectContaining({
                        currency: expect.any(String),
                        amount: expect.any(Number),
                        decimals: expect.any(Number)
                    }),
                    picture: expect.any(String),
                    condition: expect.any(String),
                    free_shipping: expect.any(Boolean),
                    sold_quantity: expect.any(Number),
                    description: expect.any(String)
                })
            });
        });

        it('should handle product not found', async () => {
            const error = new Error('Product not found');
            error.status = 404;
            MercadoLibreService.getProductById.mockRejectedValueOnce(error);

            const response = await request(app)
                .get('/api/items/MLA999999999')
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body.error).toBeDefined();
            expect(response.body.error.status).toBe(404);
        });
    });

    describe('Rate Limiting', () => {
        it('should limit requests when threshold is exceeded', async () => {
            const requests = Array(25).fill().map(() => 
                request(app)
                    .get('/api/items?q=test')
                    .catch(err => err.response)
            );

            const responses = await Promise.all(requests);
            const rateLimitedResponses = responses.filter(res => res && res.status === 429);
            
            expect(rateLimitedResponses.length).toBeGreaterThan(0);
        });
    });
});