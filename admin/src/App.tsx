import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminLoginPage from './pages/AdminLoginPage';
import UserManagementPage from './pages/UserManagementPage';
import ProductListPage from './pages/ProductListPage';
import ProductEditorPage from './pages/ProductEditorPage';
import OrderManagementPage from './pages/OrderManagementPage';
import LiveControlPage from './pages/LiveControlPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

const App: React.FC = () => {
  return (
    <ReactRouterDom.BrowserRouter>
      <AuthProvider>
        <ReactRouterDom.Routes>
          <ReactRouterDom.Route path="/login" element={<AdminLoginPage />} />
          <ReactRouterDom.Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <ReactRouterDom.Route index element={<ReactRouterDom.Navigate to="/users" replace />} />
            <ReactRouterDom.Route path="users" element={<UserManagementPage />} />
            <ReactRouterDom.Route path="products" element={<ProductListPage />} />
            <ReactRouterDom.Route path="products/new" element={<ProductEditorPage />} />
            <ReactRouterDom.Route path="products/edit/:productId" element={<ProductEditorPage />} />
            <ReactRouterDom.Route path="orders" element={<OrderManagementPage />} />
            <ReactRouterDom.Route path="live-control" element={<LiveControlPage />} />
          </ReactRouterDom.Route>
        </ReactRouterDom.Routes>
      </AuthProvider>
    </ReactRouterDom.BrowserRouter>
  );
};

export default App;