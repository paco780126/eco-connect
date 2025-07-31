import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../utils/api';

interface OrderItemDetail {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  orderDate: string;
  customerName: string;
  items: OrderItemDetail[];
  status: '배송중' | '배송완료' | '주문취소';
}

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authFetch('/admin/orders', { token });
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const calculateTotal = (items: OrderItemDetail[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (loading) return <div className="admin-page-container">주문 목록을 불러오는 중...</div>;
  if (error) return <div className="admin-page-container error-message">오류: {error}</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>주문 관리</h1>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>주문번호</th>
            <th>주문일</th>
            <th>고객명</th>
            <th>총 주문액</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{new Date(order.orderDate).toLocaleDateString('ko-KR')}</td>
              <td>{order.customerName}</td>
              <td>{calculateTotal(order.items).toLocaleString()}원</td>
              <td>
                <span className={`status-badge ${order.status === '배송완료' ? 'active' : ''}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagementPage;