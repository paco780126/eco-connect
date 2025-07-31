import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { authFetch } from '../../utils/api';
import './LivePage.css';

interface ChatMessage {
  id: number;
  author: string;
  text: string;
}

const LivePage: React.FC = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const { user } = useAuth();
  const [stream, setStream] = useState<any>(null);
  const [featuredProduct, setFeaturedProduct] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!streamId) {
      setIsLoading(false);
      return;
    }

    // API_CALL_SIMULATION: Fetch live stream details
    authFetch(`/live-streams/${streamId}`)
      .then(data => {
        setStream(data.stream);
        setFeaturedProduct(data.product);
      })
      .catch(err => {
        console.error("Failed to fetch live stream data:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    socketRef.current = io('http://localhost:3001');
    socketRef.current.emit('joinStream', streamId);
    
    socketRef.current.on('newChatMessage', (message: ChatMessage) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    
    socketRef.current.on('update-featured-product', (newProductData) => {
      setFeaturedProduct(newProductData);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [streamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user && socketRef.current) {
      const messageData: ChatMessage = {
        id: Date.now(),
        author: user.name,
        text: newMessage,
      };
      socketRef.current.emit('chatMessage', { streamId, message: messageData });
      setNewMessage('');
    }
  };

  if (isLoading) {
    return <div style={{textAlign: 'center', padding: '60px 0'}}>라이브 정보를 불러오는 중...</div>;
  }

  if (!stream) {
    return <Navigate to="/live/main" replace />;
  }

  return (
    <div className="live-page-layout">
      <div className="video-player-section">
        <div className="video-wrapper">
          <iframe
            src={stream.videoUrl}
            title={stream.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="stream-info">
          <h1>{stream.title}</h1>
          <p>진행자: {stream.streamer}</p>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="product-info-card">
          <h3>방송 중인 상품</h3>
          {featuredProduct ? (
             <Link to={`/shop/${featuredProduct.id}`}>
                <img src={featuredProduct.imageUrl} alt={featuredProduct.name} loading="lazy" />
                <h4>{featuredProduct.name}</h4>
                <p className="price">{featuredProduct.price.toLocaleString()}원</p>
            </Link>
          ) : (
             <p>현재 판매중인 상품이 없습니다.</p>
          )}
        </div>
        <div className="chat-section">
          <h3>실시간 채팅</h3>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className="chat-message">
                <strong>{msg.author}: </strong>
                <span>{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder={user ? "채팅 메시지 입력..." : "로그인이 필요합니다."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!user}
            />
            <button type="submit" disabled={!user || !newMessage.trim()}>전송</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LivePage;