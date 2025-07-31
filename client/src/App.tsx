import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CommunityProvider } from './contexts/CommunityContext';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const MyPageLayout = lazy(() => import('./pages/MyPageLayout'));
const ProductListPage = lazy(() => import('./pages/shop/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/shop/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/shop/CartPage'));
const CommunityPage = lazy(() => import('./pages/community/CommunityPage'));
const PostEditorPage = lazy(() => import('./pages/community/PostEditorPage'));
const PostDetailPage = lazy(() => import('./pages/community/PostDetailPage'));
const LiveMainPage = lazy(() => import('./pages/live/LiveMainPage'));
const LivePage = lazy(() => import('./pages/live/LivePage'));
const OrderHistoryPage = lazy(() => import('./pages/mypage/OrderHistoryPage'));
const EditProfilePage = lazy(() => import('./pages/mypage/EditProfilePage'));
const MyActivitiesPage = lazy(() => import('./pages/mypage/MyActivitiesPage'));

const LoadingFallback: React.FC = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '18px', color: 'var(--text-color-secondary)' }}>
        <p>페이지를 불러오는 중입니다...</p>
    </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <CommunityProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ProductListPage />} />
                  <Route path="shop/:productId" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="community" element={<CommunityPage />} />
                  <Route path="community/new" element={<PostEditorPage />} />
                  <Route path="community/:postId" element={<PostDetailPage />} />
                  <Route path="live/main" element={<LiveMainPage />} />
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
            </Suspense>
          </BrowserRouter>
        </CommunityProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;