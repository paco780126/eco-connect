import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

const API_URL = 'http://localhost:3001/api';

export type PostCategory = '꿀템발견' | '집꾸미기' | '집들이' | '추천';

// This is the summary type for the community list page
export interface CommunityPost {
  id: string;
  category: PostCategory;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
}

// This is the full type returned when creating a post
interface FullCommunityPost extends CommunityPost {
  content: string;
}

interface CommunityContextType {
  posts: CommunityPost[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (post: FullCommunityPost) => void;
}

const CommunityContext = createContext<CommunityContextType | null>(null);

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) {
        throw new Error('게시글을 불러오는 데 실패했습니다.');
      }
      const data: CommunityPost[] = await response.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = (newPost: FullCommunityPost) => {
    // The list view doesn't need the full content, so we store the summary.
    const { content, ...summary } = newPost;
    setPosts(prevPosts => [summary, ...prevPosts]);
  };

  const value = { posts, loading, error, fetchPosts, addPost };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};