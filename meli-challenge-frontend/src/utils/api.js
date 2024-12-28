'use client';

import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const searchProducts = async (query) => {
  try {
    const response = await api.get(`/api/items?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    if (error.response) {
    }
    throw new Error(
      error.response?.data?.message || 
      'Error al obtener productos. Por favor, intente nuevamente.'
    );
  }
};

export const getProductDetails = async (id) => {
  try {
    const response = await api.get(`/api/items/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Error al obtener detalles del producto. Por favor, intente nuevamente.'
    );
  }
};

export default api;