import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { authFetch } from '../../utils/api';

// ... (Interface 정의 부분은 동일) ...

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

  // ... (나머지 함수와 return 부분은 동일) ...

  // return 부분의 <ReactRouterDom.Link> 를 <Link>로 수정
  return (
    // ...
    <Link to={`/shop/${product.id}`} key={product.id} className="tagged-product-card">
    {/* ... */}
    </Link>
    // ...
  );
};

export default PostDetailPage;