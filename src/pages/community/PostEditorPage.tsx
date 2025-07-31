import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCommunity } from '../../contexts/CommunityContext';
import { authFetch } from '../../utils/api';

type PostCategory = '꿀템발견' | '집꾸미기' | '집들이' | '추천';

const PostEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addPost } = useCommunity();

  const [category, setCategory] = useState<PostCategory>('꿀템발견');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: PostCategory[] = ['꿀템발견', '집꾸미기', '집들이', '추천'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      alert('글을 작성하려면 로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    try {
      const newPost = await authFetch('/posts', {
        method: 'POST',
        body: { category, title, content },
        token: token,
      });
      
      addPost(newPost); // Update community context state

      alert('게시글이 성공적으로 등록되었습니다.');
      navigate('/community');

    } catch (err: any) {
      setError(err.message);
      alert(`오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-editor-container">
      <h2>새 글 작성하기</h2>
      <form className="editor-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="editor-form-group">
          <label htmlFor="category">카테고리</label>
          <select 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value as PostCategory)}
            disabled={isLoading}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="editor-form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="editor-form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요. 사진을 첨부하거나 글을 꾸밀 수도 있습니다."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="editor-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/community')} disabled={isLoading}>
            취소
          </button>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditorPage;
