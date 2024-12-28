'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Por favor ingrese un término de búsqueda');
      return;
    }

    console.log('Iniciando búsqueda con query:', query);

    const sanitizedQuery = encodeURIComponent(query.trim());
    router.push(`/items?search=${sanitizedQuery}`);
  };

  return (
    <div className="search-box__container">
      <div className="search-box__wrapper">
        <form onSubmit={handleSubmit} className="search-box__form">
          <div className="search-box__input-wrapper">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError('');
              }}
              placeholder="Nunca dejes de buscar"
              className="search-box__input"
              aria-label="Campo de búsqueda"
            />
            <button 
              type="submit"
              className="search-box__button"
              aria-label="Buscar"
            >
              <svg 
                className="search-box__icon" 
                viewBox="0 0 24 24" 
                width="24" 
                height="24"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
        </form>
        
        {error && (
          <div className="search-box__error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;