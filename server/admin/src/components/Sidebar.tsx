import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        Eco Connect Admin
      </div>
      <nav className="sidebar-nav">
        <ReactRouterDom.NavLink to="/users">사용자 관리</ReactRouterDom.NavLink>
        <ReactRouterDom.NavLink to="/products">상품 관리</ReactRouterDom.NavLink>
        <ReactRouterDom.NavLink to="/orders">주문 관리</ReactRouterDom.NavLink>
        <ReactRouterDom.NavLink to="/live-control">라이브 컨트롤</ReactRouterDom.NavLink>
      </nav>
      <div className="sidebar-footer">
        {user && <p style={{textAlign: 'center', marginBottom: '10px'}}>{user.name}님</p>}
        <button className="logout-btn" onClick={logout}>로그아웃</button>
      </div>
    </aside>
  );
};

export default Sidebar;