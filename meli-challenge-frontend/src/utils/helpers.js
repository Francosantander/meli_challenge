export const formatPrice = (price) => {
    if (!price) return '';
    
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: price.currency || 'ARS',
      minimumFractionDigits: price.decimals || 0,
      maximumFractionDigits: price.decimals || 0,
    }).format(price.amount || 0);
  };
  
  export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>]/g, '');
  };
  
  export class AppError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  };