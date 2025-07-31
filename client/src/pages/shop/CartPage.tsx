import React from 'react';
import { useCart } from '../../contexts/CartContext';
import * as ReactRouterDom from 'react-router-dom';
import './CartPage.css';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="cart-page">
      <h1>장바구니</h1>
      {cartItems.length > 0 ? (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <ReactRouterDom.Link to={`/shop/${item.id}`}>{item.name}</ReactRouterDom.Link>
                  <p className="cart-item-price">{item.price.toLocaleString()}원</p>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <input type="text" value={item.quantity} readOnly />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-total">
                  {(item.price * item.quantity).toLocaleString()}원
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">삭제</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>주문 요약</h3>
            <div className="summary-row">
              <span>총 상품 금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="summary-row">
              <span>배송비</span>
              <span>무료</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>총 주문 금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
            <button className="checkout-btn">주문하기</button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <p>장바구니가 비어 있습니다.</p>
          <ReactRouterDom.Link to="/shop" className="go-shopping-btn">쇼핑 계속하기</ReactRouterDom.Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;