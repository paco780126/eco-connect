import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = ReactRouterDom.useNavigate();

  const handleLogout = () => {
    logout();
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <h1 className="logo">
          <ReactRouterDom.Link to="/">에코코넥트</ReactRouterDom.Link>
        </h1>
        <nav className="header-nav">
          <ReactRouterDom.Link to="/shop" className="nav-item">쇼핑</ReactRouterDom.Link>
          <ReactRouterDom.Link to="/live/main" className="nav-item">라이브</ReactRouterDom.Link>
          <ReactRouterDom.Link to="/community" className="nav-item">커뮤니티</ReactRouterDom.Link>
          <a href="#" className="nav-item">고객센터</a>
        </nav>
        <div className="header-user-menu">
          <ReactRouterDom.Link to="/cart" className="cart-link" aria-label="장바구니">
            장바구니
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </ReactRouterDom.Link>
          {user ? (
            <>
              <span style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>{user.name}님</span>
              <ReactRouterDom.Link to="/mypage">마이페이지</ReactRouterDom.Link>
              <button onClick={handleLogout} className="nav-logout-btn">로그아웃</button>
            </>
          ) : (
            <>
              <ReactRouterDom.Link to="/login">로그인</ReactRouterDom.Link>
              <span aria-hidden="true">/</span>
              <ReactRouterDom.Link to="/register">회원가입</ReactRouterDom.Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;