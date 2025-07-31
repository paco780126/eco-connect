import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCommunity } from '../../contexts/CommunityContext';
import type { PostCategory, CommunityPost } from '../../contexts/CommunityContext';

type CategoryFilter = 'all' | PostCategory;

const CommunityPage: React.FC = () => {
  const { posts, loading, error } = useCommunity();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const categories: CategoryFilter[] = ['all', '꿀템발견', '집꾸미기', '집들이', '추천'];

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') {
      return posts;
    }
    return posts.filter(post => post.category === activeCategory);
  }, [activeCategory, posts]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).slice(0, -1);
  };

  return (
    <div className="community-page-container">
      <div className="community-header">
        <h2>커뮤니티</h2>
        <Link to="/community/new" className="write-post-btn">
          <i className="fas fa-pen"></i>
          <span>글쓰기</span>
        </Link>
      </div>

      <div className="community-controls">
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center', padding: '40px 0' }}>게시글을 불러오는 중입니다...</p>}
      {error && <p style={{ textAlign: 'center', padding: '40px 0', color: 'red' }}>오류: {error}</p>}
      
      {!loading && !error && (
        <table className="community-posts-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>카테고리</th>
              <th className="col-title">제목</th>
              <th style={{ width: '12%' }}>작성자</th>
              <th style={{ width: '12%' }}>작성일</th>
              <th style={{ width: '8%' }}>조회</th>
              <th style={{ width: '8%' }}>추천</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <tr key={post.id}>
                  <td>{post.category}</td>
                  <td className="col-title">
                    <Link to={`/community/${post.id}`}>{post.title}</Link>
                  </td>
                  <td>{post.author}</td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>{post.views.toLocaleString()}</td>
                  <td>{post.likes.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-color-secondary)' }}>
                  아직 작성된 게시글이 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CommunityPage;
