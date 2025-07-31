import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const ProductEditorPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    imageUrl: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(productId);

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      authFetch(`/products/${productId}`, { token })
        .then(data => {
          setProductData({
            name: data.name,
            brand: data.brand,
            category: data.category,
            price: String(data.price),
            imageUrl: data.imageUrl,
            description: data.description,
          });
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [productId, isEditing, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiPath = isEditing ? `/products/${productId}` : '/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      await authFetch(apiPath, {
        method,
        body: { ...productData, price: Number(productData.price) },
        token,
      });
      alert(`상품이 성공적으로 ${isEditing ? '수정' : '생성'}되었습니다.`);
      navigate('/products');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  
  if (isLoading && isEditing) return <div className="admin-page-container">상품 정보를 불러오는 중...</div>

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>{isEditing ? '상품 수정' : '새 상품 추가'}</h1>
      </div>
      <form className="editor-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="editor-form-group">
          <label htmlFor="name">상품명</label>
          <input id="name" name="name" type="text" value={productData.name} onChange={handleChange} required />
        </div>
        <div className="editor-form-group">
          <label htmlFor="brand">브랜드</label>
          <input id="brand" name="brand" type="text" value={productData.brand} onChange={handleChange} required />
        </div>
        <div className="editor-form-group">
          <label htmlFor="category">카테고리</label>
          <select id="category" name="category" value={productData.category} onChange={handleChange} required>
            <option value="" disabled>선택하세요</option>
            <option value="주방">주방</option>
            <option value="생활">생활</option>
            <option value="욕실">욕실</option>
            <option value="반려동물">반려동물</option>
          </select>
        </div>
        <div className="editor-form-group">
          <label htmlFor="price">가격</label>
          <input id="price" name="price" type="number" value={productData.price} onChange={handleChange} required />
        </div>
        <div className="editor-form-group">
          <label htmlFor="imageUrl">이미지 URL</label>
          <input id="imageUrl" name="imageUrl" type="text" value={productData.imageUrl} onChange={handleChange} />
        </div>
        <div className="editor-form-group">
          <label htmlFor="description">설명</label>
          <textarea id="description" name="description" value={productData.description} onChange={handleChange} />
        </div>
        <div className="editor-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate('/products')} disabled={isLoading}>
            취소
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isLoading}>
            {isLoading ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditorPage;