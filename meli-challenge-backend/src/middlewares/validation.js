export class ValidationMiddleware {
    static validateSearchQuery(req, res, next) {
        let { q } = req.query;

        if (!q) {
            return res.status(400).json({
                error: {
                    message: 'Search query is required',
                    status: 400
                }
            });
        }

        q = q.trim();
        
        if (q.length < 2) {
            return res.status(400).json({
                error: {
                    message: 'Search query must be at least 2 characters long',
                    status: 400
                }
            });
        }

        if (q.length > 100) {
            return res.status(400).json({
                error: {
                    message: 'Search query must not exceed 100 characters',
                    status: 400
                }
            });
        }

        const validQueryRegex = /^[a-zA-Z0-9\s\-_]+$/;
        if (!validQueryRegex.test(q)) {
            return res.status(400).json({
                error: {
                    message: 'Search query contains invalid characters',
                    status: 400
                }
            });
        }

        req.query.q = q;
        next();
    }

    static validateItemId(req, res, next) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: {
                    message: 'Item ID is required',
                    status: 400
                }
            });
        }

        const validIdRegex = /^[A-Z0-9]+$/;
        if (!validIdRegex.test(id)) {
            return res.status(400).json({
                error: {
                    message: 'Invalid item ID format',
                    status: 400
                }
            });
        }

        next();
    }
}