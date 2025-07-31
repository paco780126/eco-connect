import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    author: string;
    thumbnailUrl: string; 
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link to={`/community/${post.id}`} className="post-card">
      <div className="post-card-image">
        <img src={post.thumbnailUrl} alt={post.title} loading="lazy" />
      </div>
      <div className="post-card-content">
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-author">{post.author}</p>
      </div>
    </Link>
  );
};

export default PostCard;