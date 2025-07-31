import React, { useState, useEffect, useCallback } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { authFetch } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  imageUrl: string;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authFetch('/products', { token });
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`'${productName}' 상품을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }
    try {
      await authFetch(`/products/${productId}`, {
        method: 'DELETE',
        token: token,
      });
      alert('상품이 성공적으로 삭제되었습니다.');
      fetchProducts(); // Refresh the list
    } catch (err: any) {
      alert(`상품 삭제 실패: ${err.message}`);
    }
  };

  if (loading) return <div className="admin-page-container">상품 목록을 불러오는 중...</div>;
  if (error) return <div className="admin-page-container error-message">오류: {error}</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>상품 관리</h1>
        <ReactRouterDom.Link to="/products/new" className="admin-btn admin-btn-primary">
          새 상품 추가
        </ReactRouterDom.Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>이미지</th>
            <th>상품명</th>
            <th>브랜드</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="product-image-cell">
                <img src={product.imageUrl} alt={product.name} />
              </td>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.category}</td>
              <td>{product.price.toLocaleString()}원</td>
              <td className="action-cell">
                <ReactRouterDom.Link to={`/products/edit/${product.id}`} className="admin-btn-secondary admin-btn">수정</ReactRouterDom.Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="admin-btn-danger admin-btn"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListPage;