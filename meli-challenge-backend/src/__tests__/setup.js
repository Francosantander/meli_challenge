process.env.NODE_ENV = 'test';
process.env.PORT = 3001;
process.env.API_URL = 'https://api.mercadolibre.com';
process.env.AUTHOR_NAME = 'Test';
process.env.AUTHOR_LASTNAME = 'User';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';
process.env.RATE_LIMIT_SEARCH_MAX = '20';
process.env.RATE_LIMIT_PRODUCT_MAX = '30';
process.env.CORS_ORIGIN = 'http://localhost:3001';
process.env.CACHE_SEARCH_TTL = '300';
process.env.CACHE_PRODUCT_TTL = '600';

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection in tests:', error);
});

global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

afterEach(() => {
    jest.clearAllMocks();
});

jest.setTimeout(10000);