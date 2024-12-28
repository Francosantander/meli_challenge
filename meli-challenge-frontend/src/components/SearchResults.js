'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { searchProducts } from '@/utils/api';

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('search');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchProducts(query);
        setProducts(data.items || []);
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error en búsqueda:', err);
        setError('Error al obtener productos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) {
    return (
      <div className="search-results__loading">
        Cargando resultados...
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results__error">
        {error}
      </div>
    );
  }

  return (
    <div className="search-results__content">
      {categories.length > 0 && (
        <nav className="search-results__breadcrumb">
          {categories.join(' > ')}
        </nav>
      )}

      {!products.length ? (
        <div className="search-results__empty">
          No se encontraron productos para "{query}"
        </div>
      ) : (
        <div className="search-results__list">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;