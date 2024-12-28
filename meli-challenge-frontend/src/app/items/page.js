'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import ProductCard from '@/components/ProductCard';
import { searchProducts } from '@/utils/api';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('search');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        console.log('No hay query para buscar');
        setLoading(false);
        return;
      }

      try {
        console.log('Iniciando búsqueda en página de resultados con query:', query);
        setLoading(true);
        setError(null);
        const data = await searchProducts(query);
        console.log('Datos recibidos:', data);
        setProducts(data.items || []);
      } catch (err) {
        console.error('Error en página de resultados:', err);
        setError('Error al obtener productos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  console.log('Estado actual:', { loading, error, productsLength: products.length });

  return (
    <div className="search-results">
      <SearchBox />
      <div className="search-results__content">
        {loading && (
          <div className="search-results__loading">
            Cargando resultados...
          </div>
        )}

        {error && (
          <div className="search-results__error">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="search-results__empty">
            No se encontraron productos para "{query}"
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="search-results__list">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}