'use client';

import React, { useEffect, useState } from 'react';
import { getProductDetails } from '@/utils/api';

const ProductDetail = ({ id }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductDetails(id);
        console.log('Product data:', data); // Para debug
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error al obtener el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="product-detail__loading">Cargando producto...</div>;
  }

  if (error) {
    return <div className="product-detail__error">{error}</div>;
  }

  if (!product) {
    return <div className="product-detail__not-found">Producto no encontrado</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-detail__container">
        {product.categories && product.categories.length > 0 && (
          <div className="product-detail__breadcrumb">
            {product.categories.join(' > ')}
          </div>
        )}

        <div className="product-detail__content">
          <div className="product-detail__main">
            <div className="product-detail__image-container">
              <img 
                src={product.item.picture} 
                alt={product.item.title}
                className="product-detail__image"
              />
            </div>
            <div className="product-detail__info">
              <span className="product-detail__condition">
                {`${product.item.condition === 'new' ? 'Nuevo' : 'Usado'} - ${product.item.sold_quantity} vendidos`}
              </span>
              <h1 className="product-detail__title">{product.item.title}</h1>
              <div className="product-detail__price">
                <span className="product-detail__price-amount">
                  $ {product.item.price.amount.toLocaleString('es-AR')}
                </span>
              </div>
              <button className="product-detail__buy-button">
                Comprar
              </button>
            </div>
          </div>
          {product.item.description && (
            <div className="product-detail__description">
              <h2 className="product-detail__description-title">
                Descripción del producto
              </h2>
              <p className="product-detail__description-text">
                {product.item.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;