import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { authFetch } from '../../utils/api';

interface PostComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface TaggedProduct {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}
  
interface PostDetail {
    id: string;
    category: string;
    title: string;
    author: string;
    createdAt: string;
    views: number;
    likes: number;
    content: string;
    comments: PostComment[];
    isLiked: boolean;
    taggedProducts?: TaggedProduct[];
}

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!postId) return;
    
    // API_CALL_SIMULATION: Fetch post details including comments and like status
    authFetch(`/posts/${postId}`, { token }).then(data => {
      setPost(data);
      setComments(data.comments);
      setIsLiked(data.isLiked);
    }).catch(err => {
      console.error("Failed to fetch post:", err);
      navigate('/community');
    });

    socketRef.current = io('http://localhost:3001');
    socketRef.current.emit('join-post-room', postId);
    
    socketRef.current.on('new-comment', (comment: any) => {
      setComments(prev => [comment, ...prev]);
    });

    return () => { 
      if (socketRef.current) {
        socketRef.current.emit('leave-post-room', postId);
        socketRef.current.disconnect(); 
      }
    };
  }, [postId, navigate, token]);

  const handleLike = async () => {
    if (!user) {
        alert("추천하려면 로그인이 필요합니다.");
        navigate('/login');
        return;
    }
    if (isLiked) {
        alert("이미 추천한 게시물입니다.");
        return;
    }
    try {
        // API_CALL_SIMULATION: Send like request
        const data = await authFetch(`/posts/${postId}/like`, { method: 'POST', token });
        setPost((p: any) => p ? { ...p, likes: data.likes } : null);
        setIsLiked(true);
    } catch (error: any) {
        alert(error.message || "추천 처리에 실패했습니다.");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !token) {
        if(!user) alert("로그인이 필요합니다.");
        return;
    }
    
    setIsSubmitting(true);
    try {
      // API_CALL_SIMULATION: Post new comment
      await authFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: { text: newComment },
        token: token,
      });
      setNewComment('');
    } catch(err) {
      console.error("Failed to submit comment:", err);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
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

  if (!post) return <div style={{textAlign: 'center', padding: '60px 0'}}>게시글을 불러오는 중...</div>;

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

      {post.taggedProducts && post.taggedProducts.length > 0 && (
        <section className="tagged-products-section">
            <h3>태그된 상품</h3>
            <div className="tagged-products-grid">
            {post.taggedProducts.map(product => (
                <Link to={`/shop/${product.id}`} key={product.id} className="tagged-product-card">
                <img src={product.imageUrl} alt={product.name} />
                <div className="tagged-product-info">
                    <p className="name">{product.name}</p>
                    <p className="price">{product.price.toLocaleString()}원</p>
                </div>
                </Link>
            ))}
            </div>
        </section>
      )}
      
      <section className="comments-section">
        <h3>댓글 ({comments.length})</h3>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "따뜻한 댓글을 남겨보세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
            disabled={!user || isSubmitting}
          />
          <button type="submit" disabled={!user || isSubmitting || !newComment.trim()}>
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </form>
        <ul className="comment-list">
          {comments.map(comment => (
            <li key={comment.id} id={`comment-${comment.id}`} className="comment-item">
              <div className="comment-meta">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PostDetailPage;