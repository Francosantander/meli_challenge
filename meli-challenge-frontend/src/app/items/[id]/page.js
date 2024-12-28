'use client';

import React, { Suspense } from 'react';
import SearchBox from '@/components/SearchBox';
import ProductDetail from '@/components/ProductDetail';

export default async function ProductDetailPage({ params }) {
  const id = await params.id;

  return (
    <div className="product-detail-page">
      <SearchBox />
      <Suspense fallback={<div className="product-detail__loading">Cargando producto...</div>}>
        <ProductDetail id={id} />
      </Suspense>
    </div>
  );
}