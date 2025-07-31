import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authFetch } from '../../utils/api';

// Types for Post Detail
interface PostComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}
type PostCategory = '꿀템발견' | '집꾸미기' | '집들이' | '추천';
interface PostDetail {
  id: string;
  category: PostCategory;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  content: string;
  comments: PostComment[];
}

const API_URL = 'http://localhost:3001/api';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Local state for immediate UI feedback on like action
  const [isLiked, setIsLiked] = useState(false);
  
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      // Don't need to setLoading(true) on refetch
      const response = await fetch(`${API_URL}/posts/${postId}`);
      if (!response.ok) {
        throw new Error('게시글을 불러올 수 없습니다.');
      }
      const data = await response.json();
      setPost(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    setLoading(true);
    fetchPost();
  }, [fetchPost]);

  const handleLike = async () => {
    if (isLiked) {
      alert("이미 추천한 게시물입니다.");
      return;
    }
     if (!user) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('좋아요 처리에 실패했습니다.');
      }
      const data = await response.json();
      setIsLiked(true);
      setPost(p => p ? { ...p, likes: data.likes } : null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      navigate("/login");
      return;
    }
    
    setIsSubmittingComment(true);
    try {
      await authFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: { text: newComment },
        token: token,
      });

      setNewComment('');
      await fetchPost(); // Refetch post to get the new comment
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '60px 0'}}>게시글을 불러오는 중...</div>;
  }

  if (error || !post) {
    return <Navigate to="/community" replace />;
  }

  return (
    <div className="post-detail-page-container">
      <header className="post-header">
        <span className="post-category-badge">{post.category}</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>작성자: <strong>{post.author}</strong></span>
          <span>작성일: {formatDate(post.createdAt)}</span>
          <span>조회수: {post.views.toLocaleString()}</span>
        </div>
      </header>

      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      
      <div className="post-actions">
        <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          <i className="fas fa-heart"></i>
          <span>추천 {post.likes.toLocaleString()}</span>
        </button>
      </div>

      <section className="comments-section">
        <h3>댓글 ({post.comments.length})</h3>
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            placeholder={user ? "따뜻한 댓글을 남겨주세요." : "댓글을 작성하려면 로그인이 필요합니다."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || isSubmittingComment}
          />
          <button type="submit" disabled={!user || isSubmittingComment}>
            {isSubmittingComment ? '등록 중...' : '등록'}
          </button>
        </form>
        <ul className="comment-list">
            {post.comments.length > 0 ? post.comments.map(comment => (
                <li key={comment.id} className="comment-item">
                    <div className="comment-meta">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                </li>
            )) : (
                <p style={{textAlign: 'center', color: 'var(--text-color-secondary)', padding: '40px 0'}}>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            )}
        </ul>
      </section>
       <Link to="/community" className="auth-button" style={{width: 'auto', padding: '12px 24px', margin: '40px auto 0', display: 'block'}}>목록으로</Link>
    </div>
  );
};

export default PostDetailPage;
