import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../utils/api';

interface LiveStream {
    id: string;
    title: string;
    productId: string;
}
interface Product {
    id: string;
    name: string;
    brand: string;
}

const SOCKET_SERVER_URL = 'http://localhost:3001';

const LiveControlPage: React.FC = () => {
    const { token } = useAuth();
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedStreamId, setSelectedStreamId] = useState<string>('');
    const [featuredProductId, setFeaturedProductId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL);
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [streamsData, productsData] = await Promise.all([
                    authFetch('/live-streams', { token }),
                    authFetch('/products', { token }),
                ]);
                setLiveStreams(streamsData);
                setProducts(productsData);
                if (streamsData.length > 0) {
                    setSelectedStreamId(streamsData[0].id);
                    setFeaturedProductId(streamsData[0].productId);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                alert("데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);
    
    useEffect(() => {
        const selectedStream = liveStreams.find(s => s.id === selectedStreamId);
        if (selectedStream) {
            setFeaturedProductId(selectedStream.productId);
        }
    }, [selectedStreamId, liveStreams]);

    const handleFeatureProduct = (productId: string) => {
        if (!selectedStreamId) {
            alert('먼저 라이브 방송을 선택해주세요.');
            return;
        }
        if (socketRef.current) {
            socketRef.current.emit('admin-feature-product', {
                streamId: selectedStreamId,
                productId: productId,
            });
            setFeaturedProductId(productId);
            alert('상품 정보가 라이브 방송에 전송되었습니다.');
        }
    };
    
    if (loading) return <div className="admin-page-container">컨트롤 패널을 불러오는 중...</div>;

    return (
        <div className="admin-page-container live-control-page-container">
            <div className="admin-page-header">
                <h1>라이브 컨트롤 패널</h1>
            </div>
            <div className="stream-selector">
                <label htmlFor="stream-select">라이브 방송 선택:</label>
                <select 
                    id="stream-select"
                    value={selectedStreamId}
                    onChange={(e) => setSelectedStreamId(e.target.value)}
                >
                    {liveStreams.map(stream => (
                        <option key={stream.id} value={stream.id}>
                            {stream.title}
                        </option>
                    ))}
                </select>
            </div>
            <div className="product-list-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>상품명</th>
                            <th>브랜드</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <button 
                                        className={`admin-btn show-product-btn ${featuredProductId === product.id ? 'featured' : 'admin-btn-primary'}`}
                                        onClick={() => handleFeatureProduct(product.id)}
                                        disabled={featuredProductId === product.id}
                                    >
                                        {featuredProductId === product.id ? '송출 중' : '이 상품 지금 보여주기'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveControlPage;