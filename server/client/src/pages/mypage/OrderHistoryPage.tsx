import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authFetch } from '../../utils/api';

interface OrderItemDetail {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  orderDate: string;
  userId: number;
  items: OrderItemDetail[];
  status: '배송중' | '배송완료' | '주문취소';
}

const OrderHistoryPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        setError("주문 내역을 보려면 로그인이 필요합니다.");
        return;
      }

      try {
        const data = await authFetch('/orders/my', { token });
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);
  
  const formatOrderItems = (items: OrderItemDetail[]): string => {
    if (!items || items.length === 0) return '상품 정보 없음';
    const firstItemName = items[0].productName;
    if (items.length > 1) {
        return `${firstItemName} 외 ${items.length - 1}건`;
    }
    return firstItemName;
  }

  const calculateTotalAmount = (items: OrderItemDetail[]): string => {
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return total.toLocaleString() + '원';
  }


  if (loading) {
    return (
        <div>
            <h2>주문 내역</h2>
            <p>주문 내역을 불러오는 중...</p>
        </div>
    );
  }

  if (error) {
     return (
        <div>
            <h2>주문 내역</h2>
            <p className="error-message">{error}</p>
        </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2>주문 내역</h2>
      {orders.length > 0 ? (
        <ul className="order-history-list">
          {orders.map((order) => (
            <li key={order.orderId} className="order-item">
              <div className="order-item-header">
                <span className="order-date">{order.orderDate}</span>
                <span className="order-id">주문번호: {order.orderId}</span>
              </div>
              <div className="order-item-body">
                <div className="order-details">
                  <p className="order-items">{formatOrderItems(order.items)}</p>
                  <p className="order-amount">{calculateTotalAmount(order.items)}</p>
                </div>
                <div className="order-status">
                  <span>{order.status}</span>
                  <button className="order-action-btn">주문 상세</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-orders">
          <p>주문 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
