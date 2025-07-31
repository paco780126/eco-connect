import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const { subtotal, shippingFee, totalPrice } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const fee = sub >= 50000 || sub === 0 ? 0 : 3000;
    const total = sub + fee;
    return { subtotal: sub, shippingFee: fee, totalPrice: total };
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>장바구니</h2>
        <div className="empty-cart-content">
          <i className="fas fa-shopping-cart" aria-hidden="true"></i>
          <p>장바구니가 비어있습니다.</p>
          <Link to="/shop" className="auth-button">쇼핑 계속하기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h2>장바구니</h2>
      <div className="cart-content">
        <ul className="cart-items-list">
          {cartItems.map(item => (
            <li key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <Link to={`/shop/${item.id}`} className="cart-item-name">{item.name}</Link>
                <p className="cart-item-price">{item.price.toLocaleString()}원</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-selector">
                  <button onClick={() => updateQuantity(item.id, -1)} aria-label="수량 감소">-</button>
                  <input type="number" value={item.quantity} readOnly aria-label="수량" />
                  <button onClick={() => updateQuantity(item.id, 1)} aria-label="수량 증가">+</button>
                </div>
                <p className="cart-item-total">{(item.price * item.quantity).toLocaleString()}원</p>
                <button onClick={() => removeFromCart(item.id)} className="remove-item-btn" aria-label={`${item.name} 삭제`}>&times;</button>
              </div>
            </li>
          ))}
        </ul>
        <aside className="cart-summary">
          <h3>결제 정보</h3>
          <div className="summary-row">
            <span>총 상품 금액</span>
            <span>{subtotal.toLocaleString()}원</span>
          </div>
          <div className="summary-row">
            <span>배송비</span>
            <span>{shippingFee > 0 ? `${shippingFee.toLocaleString()}원` : '무료'}</span>
          </div>
          <hr className="summary-divider" />
          <div className="summary-row total">
            <span>총 결제 예정 금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <button className="auth-button order-btn">주문하기</button>
          <Link to="/shop" className="continue-shopping-link">쇼핑 계속하기</Link>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
