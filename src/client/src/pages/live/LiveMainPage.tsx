import React, { useState, useMemo, useEffect } from 'react';
import LiveCard from '../../components/live/LiveCard';
import './LiveMainPage.css';
import { authFetch } from '../../utils/api';

type LiveCategory = 'all' | '뷰티' | '패션' | '식품' | '라이프' | '테크';

interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  thumbnailUrl: string;
  viewerCount: number;
  category: LiveCategory;
}

const LiveMainPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<LiveCategory>('all');
  const [allStreams, setAllStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStreams = async () => {
      // API_CALL_SIMULATION: Fetch live streams from server
      try {
        setLoading(true);
        const data = await authFetch('/live-streams');
        setAllStreams(data);
      } catch(err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStreams();
  }, []);

  const popularStreams = useMemo(() => 
    [...allStreams].sort((a, b) => b.viewerCount - a.viewerCount).slice(0, 5), [allStreams]);
  
  const filteredStreams = useMemo(() => {
    if (activeCategory === 'all') {
      return allStreams;
    }
    return allStreams.filter(stream => stream.category === activeCategory);
  }, [activeCategory, allStreams]);

  const categories: LiveCategory[] = ['all', '뷰티', '패션', '식품', '라이프', '테크'];

  return (
    <div className="live-main-page-container">
      <section className="popular-live-section">
        <h2 className="section-title">인기 LIVE</h2>
        <div className="live-slider">
          {popularStreams.map(stream => (
            <div key={stream.id} className="slider-item">
              <LiveCard stream={stream} />
            </div>
          ))}
        </div>
      </section>

      <section className="all-live-section">
        <h2 className="section-title">전체 라이브</h2>
        <div className="live-category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>

        <div className="live-grid-container">
          {loading && <p>라이브 목록을 불러오는 중...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            filteredStreams.length > 0 ? (
              <div className="live-grid">
                {filteredStreams.map(stream => (
                  <LiveCard key={stream.id} stream={stream} />
                ))}
              </div>
            ) : (
              <p className="no-live-message">해당 카테고리의 라이브 방송이 없습니다.</p>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default LiveMainPage;