import React from 'react';
import { Link } from 'react-router-dom';
import './LiveCard.css';

interface LiveCardProps {
  stream: {
    id: string;
    title: string;
    streamer: string;
    thumbnailUrl: string;
  };
}

const LiveCard: React.FC<LiveCardProps> = ({ stream }) => {
  return (
    <Link to={`/live/${stream.id}`} className="live-card">
      <div className="live-card-thumbnail">
        <img src={stream.thumbnailUrl} alt={stream.title} loading="lazy" />
        <div className="live-badge">LIVE</div>
      </div>
      <div className="live-card-info">
        <h3 className="live-card-title">{stream.title}</h3>
        <p className="live-card-streamer">{stream.streamer}</p>
      </div>
    </Link>
  );
};

export default LiveCard;