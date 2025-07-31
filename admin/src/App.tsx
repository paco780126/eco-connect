import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AdminLoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Navigate to="/users" replace />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/new" element={<ProductEditorPage />} />
            <Route path="products/edit/:productId" element={<ProductEditorPage />} />
            <Route path="orders" element={<OrderManagementPage />} />
            <Route path="live-control" element={<LiveControlPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;