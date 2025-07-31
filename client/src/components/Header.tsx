import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <h1 className="logo">
          <Link to="/">에코코넥트</Link>
        </h1>
        <nav className="header-nav">
          <Link to="/shop" className="nav-item">쇼핑</Link>
          <Link to="/live/main" className="nav-item">라이브</Link>
          <Link to="/community" className="nav-item">커뮤니티</Link>
          <a href="#" className="nav-item">고객센터</a>
        </nav>
        <div className="header-user-menu">
          <Link to="/cart" className="cart-link" aria-label="장바구니">
            장바구니
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
          {user ? (
            <>
              <span style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>{user.name}님</span>
              <Link to="/mypage">마이페이지</Link>
              <button onClick={handleLogout} className="nav-logout-btn">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <span aria-hidden="true">/</span>
              <Link to="/register">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;