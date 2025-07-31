import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { authFetch } from '../../utils/api';
// import './PostDetailPage.css'; // CSS 파일이 있다면 주석 해제

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
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!postId) return;
    
    authFetch(`/posts/${postId}`, { token }).then(data => {
      setPost(data);
      setComments(data.comments);
    }).catch(err => {
      console.error("Failed to fetch post:", err);
      navigate('/community');
    });

    socketRef.current = io('http://localhost:3001');
    socketRef.current.emit('join-post-room', postId);
    
    socketRef.current.on('new-comment', (comment: PostComment) => {
      setComments(prev => [comment, ...prev]);
    });

    return () => { 
      if (socketRef.current) {
        socketRef.current.disconnect(); 
      }
    };
  }, [postId, navigate, token]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user ) return;
    
    setIsSubmitting(true);
    try {
      await authFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: { text: newComment },
        token,
      });
      setNewComment('');
    } catch(err) {
      console.error("Failed to submit comment:", err);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!post) return <div>게시글을 불러오는 중...</div>;

  return (
    <div className="post-detail-page">
      <h1>{post.title}</h1>
      <div className="post-meta">작성자: {post.author}</div>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <hr />
      {post.taggedProducts && post.taggedProducts.length > 0 && (
        <section className="tagged-products-section">
            <h3>태그된 상품</h3>
            <div className="tagged-products-grid">
            {post.taggedProducts.map(product => (
                <Link to={`/shop/${product.id}`} key={product.id} className="tagged-product-card">
                  <img src={product.imageUrl} alt={product.name} />
                  <div>
                      <p>{product.name}</p>
                      <p>{product.price.toLocaleString()}원</p>
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
            placeholder={user ? "댓글을 남겨보세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
            disabled={!user || isSubmitting}
          />
          <button type="submit" disabled={!user || isSubmitting || !newComment.trim()}>
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </form>
        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment.id}>
              <strong>{comment.author}</strong>
              <p>{comment.text}</p>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetailPage;