import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: '정상' | '정지';
}

const UserManagementPage: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authFetch('/admin/users', { token });
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === '정상' ? '정지' : '정상';
    if (!window.confirm(`${user.name}님의 계정을 '${newStatus}' 상태로 변경하시겠습니까?`)) {
      return;
    }
    
    try {
      const updatedUser = await authFetch(`/admin/users/${user.id}`, {
        method: 'PUT',
        body: { status: newStatus },
        token: token,
      });
      setUsers(prevUsers => prevUsers.map(u => (u.id === user.id ? updatedUser : u)));
      alert('상태가 성공적으로 변경되었습니다.');
    } catch (err: any) {
      alert(`오류: ${err.message}`);
    }
  };

  if (loading) return <div className="admin-page-container">사용자 목록을 불러오는 중...</div>;
  if (error) return <div className="admin-page-container error-message">오류: {error}</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>사용자 관리</h1>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>역할</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={`status-badge ${user.status === '정상' ? 'active' : 'suspended'}`}>
                  {user.status}
                </span>
              </td>
              <td className="action-cell">
                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`admin-btn-secondary`}
                  >
                    {user.status === '정상' ? '정지' : '활성화'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementPage;