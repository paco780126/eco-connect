import React from 'react';

// Mock data for order history
const mockOrders = [
  {
    id: '20240601-0005',
    date: '2024.06.01',
    items: '태양광 충전 보조배터리',
    amount: '55,000원',
    status: '배송중',
  },
  {
    id: '20240521-0001',
    date: '2024.05.21',
    items: '친환경 대나무 칫솔 외 2건',
    amount: '35,000원',
    status: '배송완료',
  },
  {
    id: '20240518-0003',
    date: '2024.05.18',
    items: '유기농 천연 수세미',
    amount: '12,000원',
    status: '배송완료',
  },
  {
    id: '20240515-0012',
    date: '2024.05.15',
    items: '리사이클 유리컵 세트',
    amount: '28,000원',
    status: '배송완료',
  },
];

const OrderHistoryPage: React.FC = () => {
  return (
    <div className="order-history-container">
      <h2>주문 내역</h2>
      {mockOrders.length > 0 ? (
        <ul className="order-history-list">
          {mockOrders.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-item-header">
                <span className="order-date">{order.date}</span>
                <span className="order-id">주문번호: {order.id}</span>
              </div>
              <div className="order-item-body">
                <div className="order-details">
                  <p className="order-items">{order.items}</p>
                  <p className="order-amount">{order.amount}</p>
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
