import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductListPage.css';
import { authFetch } from '../../utils/api';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: '주방' | '생활' | '욕실' | '반려동물';
  brand: string;
  description: string;
}


const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('전체');

  useEffect(() => {
    const fetchProducts = async () => {
      // API_CALL_SIMULATION: Fetching products from server
      try {
        setLoading(true);
        const data = await authFetch('/products');
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['전체', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = activeCategory === '전체'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="product-list-page">
      <div className="category-filter-bar">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && <p style={{textAlign: 'center', padding: '60px 0'}}>상품 목록을 불러오는 중...</p>}
      {error && <p className="error-message" style={{textAlign: 'center'}}>{error}</p>}
      
      {!loading && !error && (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;