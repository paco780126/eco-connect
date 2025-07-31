import React, { useState, useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authFetch } from '../../utils/api';
import './MyActivitiesPage.css';

// 데이터 타입 정의
interface Post {
  id: string;
  title: string;
  createdAt: string;
  views: number;
  likes: number;
}
interface Comment {
  id: string;
  postId: string;
  text: string;
  createdAt: string;
}

const MyActivitiesPage: React.FC = () => {
  const { token } = useAuth();
  const [activities, setActivities] = useState<{ posts: Post[]; comments: Comment[] }>({ posts: [], comments: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchActivities = async () => {
      if (token) {
        try {
          setLoading(true);
          const data = await authFetch('/users/me/activities', { token });
          setActivities(data);
        } catch (error) {
          console.error('나의 활동 내역을 불러오는 데 실패했습니다.', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return <div><h2>나의 활동</h2><p>로딩 중...</p></div>;
  }
  
  if (!token) {
      return <div><h2>나의 활동</h2><p>활동 내역을 보려면 로그인이 필요합니다.</p></div>
  }

  return (
    <div className="my-activities-container">
      <h2>나의 활동</h2>
      <div className="activity-tabs">
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          작성한 글 ({activities.posts.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          작성한 댓글 ({activities.comments.length})
        </button>
      </div>

      <div className="activity-content">
        {activeTab === 'posts' && (
          <div className="post-list">
            {activities.posts.length > 0 ? (
              activities.posts.map(post => (
                <ReactRouterDom.Link to={`/community/${post.id}`} key={post.id} className="post-item">
                  <span className="post-title">{post.title}</span>
                  <div className="post-meta">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>조회 {post.views}</span>
                    <span>추천 {post.likes}</span>
                  </div>
                </ReactRouterDom.Link>
              ))
            ) : <p className="no-content-message">작성한 글이 없습니다.</p>}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="comment-list">
            {activities.comments.length > 0 ? (
               activities.comments.map(comment => (
                <ReactRouterDom.Link to={`/community/${comment.postId}#comment-${comment.id}`} key={comment.id} className="comment-item">
                   <p className="comment-text">"{comment.text}"</p>
                   <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </ReactRouterDom.Link>
              ))
            ) : <p className="no-content-message">작성한 댓글이 없습니다.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyActivitiesPage;