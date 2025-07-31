import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './shop/ProductCard';
import { mockProducts } from '../data/mock-products';

const HomePage: React.FC = () => {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="home-page-container">
      <section className="home-hero">
        <h1>지속가능한 내일을 위한 연결, 에코코넥트</h1>
        <p>환경을 생각하는 소비, 믿을 수 있는 브랜드들을 한 곳에서 만나보세요. 더 나은 미래를 위한 작은 실천을 응원합니다.</p>
        <Link to="/shop" className="hero-cta-btn">
          쇼핑하러 가기 <i className="fas fa-arrow-right"></i>
        </Link>
      </section>

      <section className="featured-products-section">
        <h2>주목할만한 상품</h2>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
