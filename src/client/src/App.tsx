import React, { lazy, Suspense } from 'react';
import * as ReactRouterDom from 'react-router-dom';
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
          <ReactRouterDom.BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <ReactRouterDom.Routes>
                <ReactRouterDom.Route element={<AppLayout />}>
                  <ReactRouterDom.Route index element={<HomePage />} />
                  <ReactRouterDom.Route path="shop" element={<ProductListPage />} />
                  <ReactRouterDom.Route path="shop/:productId" element={<ProductDetailPage />} />
                  <ReactRouterDom.Route path="cart" element={<CartPage />} />
                  <ReactRouterDom.Route path="community" element={<CommunityPage />} />
                  <ReactRouterDom.Route path="community/new" element={<PostEditorPage />} />
                  <ReactRouterDom.Route path="community/:postId" element={<PostDetailPage />} />
                  <ReactRouterDom.Route path="live/main" element={<LiveMainPage />} />
                  <ReactRouterDom.Route path="live/:streamId" element={<LivePage />} />
                  <ReactRouterDom.Route path="login" element={<LoginPage />} />
                  <ReactRouterDom.Route path="register" element={<RegisterPage />} />
                  <ReactRouterDom.Route path="mypage" element={<MyPageLayout />}>
                    <ReactRouterDom.Route index element={<ReactRouterDom.Navigate to="orders" replace />} />
                    <ReactRouterDom.Route path="orders" element={<OrderHistoryPage />} />
                    <ReactRouterDom.Route path="edit-profile" element={<EditProfilePage />} />
                    <ReactRouterDom.Route path="my-activities" element={<MyActivitiesPage />} />
                  </ReactRouterDom.Route>
                  <ReactRouterDom.Route path="*" element={<ReactRouterDom.Navigate to="/" replace />} />
                </ReactRouterDom.Route>
              </ReactRouterDom.Routes>
            </Suspense>
          </ReactRouterDom.BrowserRouter>
        </CommunityProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;