import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { authFetch } from '../utils/api';

export type PostCategory = '꿀템발견' | '집꾸미기' | '집들이' | '추천' | '테크' | '생활';

// This is the summary type for the community list page
export interface CommunityPost {
  id: string;
  category: PostCategory;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  thumbnailUrl: string;
}

interface CommunityContextType {
  posts: CommunityPost[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
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
      // API_CALL_SIMULATION: Fetch all posts
      const data: CommunityPost[] = await authFetch('/posts');
      // Sort by date descending
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  const value = { posts, loading, error, fetchPosts };

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