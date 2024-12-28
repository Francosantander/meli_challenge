import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import itemsRoutes from './routes/items.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { globalRateLimiter } from './middlewares/rateLimiter.js';
import { config } from './config/config.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: config.cors.origin,
    methods: ['GET']
}));
app.use(express.json());

app.use(globalRateLimiter);

app.use('/api', itemsRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;