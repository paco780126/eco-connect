import React from 'react';
import * as ReactRouterDom from 'react-router-dom';

const MyPageLayout: React.FC = () => {
  return (
    <div className="mypage-container">
      <aside className="mypage-sidebar">
        <h3>마이페이지</h3>
        <nav className="mypage-nav">
          <ReactRouterDom.NavLink to="orders" end>주문 내역</ReactRouterDom.NavLink>
          <ReactRouterDom.NavLink to="edit-profile">내 정보 수정</ReactRouterDom.NavLink>
          <ReactRouterDom.NavLink to="my-activities">나의 활동</ReactRouterDom.NavLink>
        </nav>
      </aside>
      <section className="mypage-content">
        <ReactRouterDom.Outlet />
      </section>
    </div>
  );
};

export default MyPageLayout;