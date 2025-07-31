import React, { useState, useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { authFetch } from '../../utils/api';
import { useCart } from '../../contexts/CartContext';
import './ProductDetailPage.css';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  brand: string;
  description: string;
}

const ProductDetailPage: React.FC = () => {
  const { productId } = ReactRouterDom.useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
        setLoading(false);
        return;
    }
    // API_CALL_SIMULATION: Fetching single product details
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await authFetch(`/products/${productId}`);
        setProduct(data);
      } catch (error) {
        console.error('상품 정보를 불러오는 데 실패했습니다.', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '60px 0'}}>상품 정보를 불러오는 중...</div>;
  if (!product) return <ReactRouterDom.Navigate to="/shop" replace />;
  
  const totalPrice = product.price * quantity;

  return (
    <div className="product-detail-page">
      <div className="product-detail-layout">
        <div className="product-image-section">
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        </div>
        <div className="product-info-section">
          <p className="brand-name">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="price">{product.price.toLocaleString()}원</p>
          <hr />
          <div className="quantity-selector">
            <span>수량</span>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="수량 감소">-</button>
              <input type="number" value={quantity} readOnly aria-label="수량"/>
              <button onClick={() => setQuantity(q => q + 1)} aria-label="수량 증가">+</button>
            </div>
          </div>
          <hr />
          <div className="total-price-section">
            <span>총 상품 금액</span>
            <span className="total-price">{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="action-buttons">
            <button className="cart-btn" onClick={handleAddToCart}>장바구니 담기</button>
            <button className="buy-btn">바로 구매</button>
          </div>
        </div>
      </div>
      <div className="product-full-description">
        <h2>상품 상세 정보</h2>
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>
    </div>
  );
};

export default ProductDetailPage;