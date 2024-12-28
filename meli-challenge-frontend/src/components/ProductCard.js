'use client';

import React from 'react';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const { 
    id, 
    title, 
    price, 
    picture, 
    free_shipping,
    state_name
  } = product;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price.amount);
  };

  return (
    <div className="product-card">
      <Link href={`/items/${id}`} className="product-card__container">
        <div className="product-card__image-container">
          <img 
            src={picture} 
            alt={title}
            className="product-card__image"
          />
        </div>
        <div className="product-card__info">
          <div className="product-card__price-container">
            <div className="product-card__price">
              $ {formatPrice(price)}
            </div>
            {free_shipping && (
              <div className="product-card__shipping">
                Envío gratis
              </div>
            )}
          </div>
          <h2 className="product-card__title">
            {title}
          </h2>
        </div>
        <div className="product-card__location">
          {state_name}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;