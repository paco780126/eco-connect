import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPageLayout from './pages/MyPageLayout';
import ProductListPage from './pages/shop/ProductListPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CartPage from './pages/shop/CartPage';
import CommunityPage from './pages/community/CommunityPage';
import PostDetailPage from './pages/community/PostDetailPage';
import PostEditorPage from './pages/community/PostEditorPage';
import LivePage from './pages/live/LivePage';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CommunityProvider } from './contexts/CommunityContext';
import OrderHistoryPage from './pages/mypage/OrderHistoryPage';
import EditProfilePage from './pages/mypage/EditProfilePage';
import MyActivitiesPage from './pages/mypage/MyActivitiesPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <CommunityProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ProductListPage />} />
                <Route path="shop/:productId" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="community/new" element={<PostEditorPage />} />
                <Route path="community/:postId" element={<PostDetailPage />} />
                <Route path="live/:streamId" element={<LivePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="mypage" element={<MyPageLayout />}>
                  <Route index element={<Navigate to="orders" replace />} />
                  <Route path="orders" element={<OrderHistoryPage />} />
                  <Route path="edit-profile" element={<EditProfilePage />} />
                  <Route path="my-activities" element={<MyActivitiesPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CommunityProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
