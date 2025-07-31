import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, token, isLoading } = useAuth();
  const location = ReactRouterDom.useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // 또는 스피너 컴포넌트
  }

  if (!token || !user || user.role !== 'admin') {
    // 사용자를 로그인 페이지로 리디렉션하지만, 현재 위치를 state로 저장합니다.
    // 이렇게 하면 로그인 후에 사용자가 원래 가려던 페이지로 이동시킬 수 있어
    // 더 나은 사용자 경험을 제공합니다.
    return <ReactRouterDom.Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;