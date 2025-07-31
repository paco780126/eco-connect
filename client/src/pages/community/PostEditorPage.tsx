import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCommunity } from '../../contexts/CommunityContext';
import { authFetch } from '../../utils/api';
import './PostEditorPage.css';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    brand: string;
}

const PostEditorPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { fetchPosts } = useCommunity();
  
  const [taggedProducts, setTaggedProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const categories = ['꿀템발견', '집꾸미기', '추천', '집들이', '테크', '생활'];

  const openProductTagModal = async () => {
    setIsModalOpen(true);
    if (allProducts.length === 0) {
      setModalLoading(true);
      try {
        const productsData = await authFetch('/products');
        setAllProducts(productsData);
      } catch (error) {
        console.error(error);
        alert('상품 목록을 불러오는 데 실패했습니다.');
      } finally {
        setModalLoading(false);
      }
    }
  };

  const addProductTag = (product: Product) => {
    if (taggedProducts.length >= 5) {
        alert('상품 태그는 최대 5개까지 가능합니다.');
        return;
    }
    if (!taggedProducts.some(p => p.id === product.id)) {
      setTaggedProducts([...taggedProducts, product]);
    } else {
        alert('이미 태그된 상품입니다.');
    }
  };

  const removeProductTag = (productId: string) => {
    setTaggedProducts(taggedProducts.filter(p => p.id !== productId));
  };

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      alert('게시판을 선택해주세요.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // API_CALL_SIMULATION: Submit new post to server
      const payload = {
          title,
          content,
          category,
          taggedProductIds: taggedProducts.map(p => p.id)
      };
      const newPost = await authFetch('/posts', {
        method: 'POST',
        body: payload,
        token
      });
      
      await fetchPosts();

      alert('게시글이 성공적으로 등록되었습니다.');
      navigate(`/community/${newPost.id}`); 
    } catch (error: any) {
      alert(`게시글 등록에 실패했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-editor-page">
      <form onSubmit={handleSubmit} className="post-editor-form">
        <h2>새 글 작성하기</h2>
        <div className="category-select-bar">
          <select value={category} onChange={(e) => setCategory(e.target.value)} required disabled={isLoading}>
            <option value="" disabled>게시판을 선택해주세요 (필수)</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="title-input-wrapper">
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            disabled={isLoading}
          />
          <span>{title.length}/60</span>
        </div>
        
        <div className="tag-product-section">
            <button type="button" className="open-modal-btn" onClick={openProductTagModal}>
                <i className="fas fa-tag"></i> 상품 태그하기
            </button>
            <div className="tagged-products-preview">
                {taggedProducts.map(p => (
                    <div key={p.id} className="tagged-product-item">
                        <span>{p.name}</span>
                        <button type="button" onClick={() => removeProductTag(p.id)}>&times;</button>
                    </div>
                ))}
            </div>
        </div>

        <div className="content-textarea-wrapper">
          <textarea
            placeholder="내용을 입력해주세요. (이미지 추가는 HTML <img> 태그를 사용해주세요)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="cancel-btn" disabled={isLoading}>취소</button>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div className="product-tag-modal-overlay">
          <div className="product-tag-modal">
            <div className="modal-header">
              <h2>상품 태그하기</h2>
              <button onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-search">
                <input 
                    type="text" 
                    placeholder="상품명, 브랜드명으로 검색..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="modal-product-list">
                {modalLoading ? <p>로딩 중...</p> : (
                    filteredProducts.map(p => (
                        <div key={p.id} className="modal-product-item">
                            <img src={p.imageUrl} alt={p.name} />
                            <div className="info">
                                <span className="brand">{p.brand}</span>
                                <span className="name">{p.name}</span>
                            </div>
                            <button onClick={() => addProductTag(p)}>추가</button>
                        </div>
                    ))
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEditorPage;