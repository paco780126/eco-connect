import React, { useState, useMemo } from 'react';
import { useCommunity } from '../../contexts/CommunityContext';
import type { PostCategory } from '../../contexts/CommunityContext';
import PostCard from '../../components/community/PostCard';
import './CommunityPage.css';
import { Link } from 'react-router-dom';

type CategoryFilter = 'all' | PostCategory;

const CommunityPage: React.FC = () => {
  const { posts, loading, error } = useCommunity();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const categories: CategoryFilter[] = ['all', '꿀템발견', '집꾸미기', '집들이', '추천'];

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') {
      return posts;
    }
    return posts.filter(p => p.category === activeCategory);
  }, [activeCategory, posts]);


  return (
    <div className="community-page">
      <div className="community-header">
        <h1>커뮤니티</h1>
         <Link to="/community/new" className="write-post-btn">
          <i className="fas fa-pen"></i>
          <span>글쓰기</span>
        </Link>
      </div>
      <div className="category-filter-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all' ? '전체' : cat}
          </button>
        ))}
      </div>
      
      {loading && <p style={{ textAlign: 'center', padding: '40px 0' }}>게시글을 불러오는 중입니다...</p>}
      {error && <p style={{ textAlign: 'center', padding: '40px 0', color: 'red' }}>오류: {error}</p>}

      {!loading && !error && (
        <div className="post-grid">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
