import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const MyPageLayout: React.FC = () => {
  return (
    <div className="mypage-container">
      <aside className="mypage-sidebar">
        <h3>마이페이지</h3>
        <nav className="mypage-nav">
          <NavLink to="orders" end>주문 내역</NavLink>
          <NavLink to="edit-profile">내 정보 수정</NavLink>
          <NavLink to="my-activities">나의 활동</NavLink>
        </nav>
      </aside>
      <section className="mypage-content">
        <Outlet />
      </section>
    </div>
  );
};

export default MyPageLayout;
