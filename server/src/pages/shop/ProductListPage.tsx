import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { mockProducts, Product } from '../../data/mock-products';

type SortOption = 'latest' | 'price_asc' | 'price_desc';
type CategoryFilter = 'all' | '주방' | '생활' | '욕실' | '반려동물';

const ProductListPage: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const categories: CategoryFilter[] = ['all', '주방', '생활', '욕실', '반려동물'];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Sort
    switch (sortOption) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [sortOption, activeCategory]);

  return (
    <div className="product-list-page">
      <h2>온라인 스토어</h2>
      <div className="product-controls">
        <div className="filter-menu">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
        >
          <option value="latest">최신순</option>
          <option value="price_asc">낮은 가격순</option>
          <option value="price_desc">높은 가격순</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredAndSortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;