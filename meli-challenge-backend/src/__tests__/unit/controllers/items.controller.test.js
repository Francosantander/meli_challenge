import { searchItems, getItemById } from '../../../controllers/items.controller.js';
import { ItemsService } from '../../../services/items.service.js';

jest.mock('../../../services/items.service.js');

describe('ItemsController', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            query: {},
            params: {}
        };
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
    });

    describe('searchItems', () => {
        it('should return search results', async () => {
            const mockResults = {
                author: { name: 'Test', lastname: 'User' },
                items: []
            };
            
            mockReq.query.q = 'test';
            ItemsService.searchItems.mockResolvedValue(mockResults);

            await searchItems(mockReq, mockRes);

            expect(ItemsService.searchItems).toHaveBeenCalledWith('test');
            expect(mockRes.json).toHaveBeenCalledWith(mockResults);
        });

        it('should handle validation errors', async () => {
            mockReq.query.q = '';
            ItemsService.validateSearchQuery.mockImplementation(() => {
                throw new Error('Invalid query');
            });

            await expect(searchItems(mockReq, mockRes))
                .rejects
                .toThrow('Invalid query');
        });

        it('should handle service errors', async () => {
            mockReq.query.q = 'test';
            ItemsService.searchItems.mockRejectedValue(new Error('Service error'));

            await expect(searchItems(mockReq, mockRes))
                .rejects
                .toThrow('Service error');
        });
    });

    describe('getItemById', () => {
        it('should return product details', async () => {
            const mockProduct = {
                author: { name: 'Test', lastname: 'User' },
                item: { id: 'MLA1', title: 'Test Product' }
            };
            
            mockReq.params.id = 'MLA1';
            ItemsService.getItemById.mockResolvedValue(mockProduct);

            await getItemById(mockReq, mockRes);

            expect(ItemsService.getItemById).toHaveBeenCalledWith('MLA1');
            expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
        });

        it('should handle validation errors', async () => {
            mockReq.params.id = 'invalid-id';
            ItemsService.validateItemId.mockImplementation(() => {
                throw new Error('Invalid ID');
            });

            await expect(getItemById(mockReq, mockRes))
                .rejects
                .toThrow('Invalid ID');
        });
    });
});