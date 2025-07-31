import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
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
          <ReactRouterDom.BrowserRouter>
            <ReactRouterDom.Routes>
              <ReactRouterDom.Route element={<AppLayout />}>
                <ReactRouterDom.Route index element={<HomePage />} />
                <ReactRouterDom.Route path="shop" element={<ProductListPage />} />
                <ReactRouterDom.Route path="shop/:productId" element={<ProductDetailPage />} />
                <ReactRouterDom.Route path="cart" element={<CartPage />} />
                <ReactRouterDom.Route path="community" element={<CommunityPage />} />
                <ReactRouterDom.Route path="community/new" element={<PostEditorPage />} />
                <ReactRouterDom.Route path="community/:postId" element={<PostDetailPage />} />
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
          </ReactRouterDom.BrowserRouter>
        </CommunityProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;