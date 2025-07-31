import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { mockLiveStreams, getProductsByIds, ChatMessage } from '../../data/mock-live-streams';
import { Product } from '../../data/mock-products';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const SOCKET_SERVER_URL = 'http://localhost:3001';

const RelatedProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addToCart } = useCart();
    
    const handleAddToCart = () => {
        addToCart(product, 1);
        alert(`'${product.name}'을(를) 장바구니에 담았습니다.`);
    };

    return (
        <div className="related-product-card">
            <Link to={`/shop/${product.id}`}>
                <img src={product.imageUrl} alt={product.name} className="related-product-image" />
                <div className="related-product-info">
                    <p className="related-product-name">{product.name}</p>
                    <p className="related-product-price">{product.price.toLocaleString()}원</p>
                </div>
            </Link>
            <div className="related-product-actions">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <i className="fas fa-cart-plus"></i> 담기
                </button>
            </div>
        </div>
    );
};


const LivePage: React.FC = () => {
    const { streamId } = useParams<{ streamId: string }>();
    const { user } = useAuth();
    
    const stream = useMemo(() => streamId ? mockLiveStreams[streamId] : null, [streamId]);
    
    const [viewerCount, setViewerCount] = useState(stream?.viewerCount || 0);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(stream?.chatMessages || []);
    const [newMessage, setNewMessage] = useState('');
    
    const socketRef = useRef<Socket | null>(null);
    const chatListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!streamId) return;

        socketRef.current = io(SOCKET_SERVER_URL);

        socketRef.current.emit('joinStream', streamId);

        socketRef.current.on('newChatMessage', (message: ChatMessage) => {
            setChatMessages(prev => [...prev, message]);
        });

        const viewerInterval = setInterval(() => {
            setViewerCount(v => Math.max(0, v + Math.floor(Math.random() * 10) - 4));
        }, 3000);

        return () => {
            socketRef.current?.disconnect();
            clearInterval(viewerInterval);
        };
    }, [streamId]);

    useEffect(() => {
        if (chatListRef.current) {
            chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
    }, [chatMessages]);

    if (!stream) {
        return <Navigate to="/" replace />;
    }

    const relatedProducts = getProductsByIds(stream.relatedProductIds);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && socketRef.current && streamId) {
            const messagePayload = {
                id: `chat-${Date.now()}`,
                author: user?.name || '익명',
                text: newMessage.trim(),
            };
            socketRef.current.emit('chatMessage', { streamId, message: messagePayload });
            setNewMessage('');
        }
    };

    return (
        <div className="live-page-container">
            <div className="live-main-content">
                <header className="live-header">
                    <h1>{stream.title}</h1>
                    <div className="live-info">
                        <span><i className="fas fa-user"></i> {stream.hostName}</span>
                        <span><i className="fas fa-eye"></i> {viewerCount.toLocaleString()}명 시청중</span>
                    </div>
                </header>

                <div className="video-player-wrapper">
                    <video
                        src={stream.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                    />
                </div>

                <section className="related-products-section">
                    <h3>방송 중인 상품</h3>
                    <div className="related-products-grid">
                       {relatedProducts.map(product => (
                           <RelatedProductCard key={product.id} product={product} />
                       ))}
                    </div>
                </section>
            </div>

            <aside className="live-chat-panel">
                <h3>실시간 채팅</h3>
                <div className="chat-messages-list" ref={chatListRef}>
                    {chatMessages.map(msg => (
                        <div key={msg.id} className={`chat-message-item ${msg.author === user?.name ? 'user' : ''}`}>
                            <span className="chat-message-author">{msg.author}</span>
                            <div className="chat-message-bubble">{msg.text}</div>
                        </div>
                    ))}
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <textarea
                        placeholder={user ? "채팅을 입력하세요..." : "로그인 후 채팅에 참여할 수 있습니다."}
                        rows={1}
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        disabled={!user}
                    />
                    <button type="submit" disabled={!user || !newMessage.trim()}>전송</button>
                </form>
            </aside>
        </div>
    );
};

export default LivePage;
