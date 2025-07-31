import React, { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { mockProducts } from '../../data/mock-products';
import { mockProductDetails, ProductDetail, Review, QuestionAnswer } from '../../data/mock-product-details';
import { useCart } from '../../contexts/CartContext';

type Tab = 'description' | 'reviews' | 'qna';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  
  const product = useMemo(() => mockProducts.find(p => p.id === productId), [productId]);
  const details = useMemo(() => productId ? mockProductDetails[productId] : null, [productId]);
  
  const [selectedImage, setSelectedImage] = useState<string | undefined>(details?.galleryImages[0]);

  React.useEffect(() => {
    if (details) {
      setSelectedImage(details.galleryImages[0]);
    }
  }, [details]);

  if (!product || !details) {
    return <Navigate to="/shop" replace />;
  }
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`'${product.name}' ${quantity}개를 장바구니에 담았습니다.`);
    }
  };

  return (
    <div className="product-detail-page">
      <div className="detail-main-content">
        <section className="image-gallery">
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
          <div className="thumbnail-list">
            {details.galleryImages.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail-item ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>
        <section className="product-actions">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">{product.price.toLocaleString()}원</p>
          <p className="short-description">{details.shortDescription}</p>
          
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange(-1)} aria-label="수량 감소">-</button>
            <input type="number" value={quantity} readOnly aria-label="수량" />
            <button onClick={() => handleQuantityChange(1)} aria-label="수량 증가">+</button>
          </div>

          <div className="action-buttons">
            <button className="cart-btn" onClick={handleAddToCart}>장바구니 담기</button>
            <button className="buy-btn">바로 구매하기</button>
          </div>
        </section>
      </div>
      
      <div className="detail-info-tabs">
        <nav className="tab-nav">
          <button 
            className={`tab-nav-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}>
            상세 정보
          </button>
          <button 
            className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}>
            리뷰 <span className="count">({details.reviews.length})</span>
          </button>
          <button 
            className={`tab-nav-btn ${activeTab === 'qna' ? 'active' : ''}`}
            onClick={() => setActiveTab('qna')}>
            Q&A <span className="count">({details.qna.length})</span>
          </button>
        </nav>
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="long-description" dangerouslySetInnerHTML={{ __html: details.longDescription }} />
          )}
          {activeTab === 'reviews' && (
            <ul className="review-list">
              {details.reviews.length > 0 ? details.reviews.map(review => (
                <li key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.author}</span>
                    <span className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                </li>
              )) : <p>아직 작성된 리뷰가 없어요.</p>}
            </ul>
          )}
          {activeTab === 'qna' && (
            <ul className="qa-list">
              {details.qna.length > 0 ? details.qna.map(qa => (
                <li key={qa.id} className="qa-item">
                  <div className="qa-question">
                    <span className="qa-q-icon">Q.</span>
                    <div className="qa-text-content">
                      <p>{qa.question}</p>
                      <span className="qa-meta">{qa.questioner} | {qa.questionDate}</span>
                    </div>
                  </div>
                  <div className="qa-answer">
                    <span className="qa-a-icon">A.</span>
                     <div className="qa-text-content">
                      <p>{qa.answer}</p>
                      <span className="qa-meta">{qa.answerer} | {qa.answerDate}</span>
                    </div>
                  </div>
                </li>
              )) : <p>아직 등록된 Q&A가 없어요.</p>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
