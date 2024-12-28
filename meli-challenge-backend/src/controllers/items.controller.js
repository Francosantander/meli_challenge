import { ItemsService } from '../services/items.service.js';

export const searchItems = async (req, res) => {
    const { q: query } = req.query;

    try {
        const results = await ItemsService.searchItems(query);
        res.json(results);
    } catch (error) {
        console.error('Error in searchItems:', error);
        res.status(error.status || 500).json({
            error: {
                message: error.message || 'Internal server error',
                status: error.status || 500
            }
        });
    }
};

export const getItemById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await ItemsService.getItemById(id);
        res.json(product);
    } catch (error) {
        console.error('Error in getItemById:', error);
        res.status(error.status || 500).json({
            error: {
                message: error.message || 'Internal server error',
                status: error.status || 500
            }
        });
    }
};