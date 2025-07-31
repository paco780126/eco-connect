import React, { useState, useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import ProductCard from './shop/ProductCard';
import LiveCard from '../components/live/LiveCard';
import { authFetch } from '../utils/api';
import './HomePage.css';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  brand: string;
  description: string;
}

interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  thumbnailUrl: string;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);

  useEffect(() => {
    // API_CALL_SIMULATION: Fetch featured products
    authFetch('/products')
      .then(data => setFeaturedProducts(data.slice(0, 4)))
      .catch(err => console.error("Error fetching products:", err));
    
    // API_CALL_SIMULATION: Fetch live streams
    authFetch('/live-streams')
      .then(data => setLiveStreams(data.slice(0, 4)))
      .catch(err => console.error("Error fetching live streams:", err));
  }, []);

  return (
    <div className="home-page-container">
      <section className="home-hero">
        <img 
          src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1920&auto=format&fit=crop" 
          alt="Lush green forest background" 
          style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0}}
          loading="lazy"
        />
        <h1>지속가능한 내일을 위한 연결, 에코코넥트</h1>
        <p>환경을 생각하는 소비, 믿을 수 있는 브랜드들을 한 곳에서 만나보세요. 더 나은 미래를 위한 작은 실천을 응원합니다.</p>
        <ReactRouterDom.Link to="/shop" className="hero-cta-btn">
          쇼핑하러 가기 <i className="fas fa-arrow-right"></i>
        </ReactRouterDom.Link>
      </section>

      <section className="featured-products-section">
        <h2>주목할만한 상품</h2>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="live-section">
        <h2 className="section-title">지금 진행중인 라이브 🚀</h2>
        <div className="live-grid">
          {liveStreams.map(stream => (
            <LiveCard 
              key={stream.id} 
              stream={stream}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;