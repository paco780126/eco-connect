import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authFetch } from '../../utils/api';

const EditProfilePage: React.FC = () => {
  const { user, token, updateUserProfile } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (newPassword && newPassword !== confirmNewPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (newPassword && newPassword.length < 6) {
        setError('새 비밀번호는 6자 이상으로 설정해주세요.');
        return;
    }
    
    if (newPassword && !currentPassword) {
        setError('비밀번호를 변경하려면 현재 비밀번호를 입력해야 합니다.');
        return;
    }

    setIsLoading(true);
    try {
      const payload: { name: string, currentPassword?: string, newPassword?: string } = { name };
      if (newPassword) {
          payload.currentPassword = currentPassword;
          payload.newPassword = newPassword;
      }

      const data = await authFetch('/users/me', {
        method: 'PUT',
        body: payload,
        token: token,
      });

      updateUserProfile({ user: data.user, token: data.token });
      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
      // Clear password fields after success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>내 정보 수정</h2>
      <form className="auth-form" onSubmit={handleSubmit} style={{maxWidth: '600px', margin: '0'}}>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        <div className="form-group">
          <label htmlFor="email">이메일 (변경 불가)</label>
          <input type="email" id="email" value={email} readOnly disabled />
        </div>
        
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input 
            type="text" 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
        
        <hr className="form-divider" />
        <p className="form-section-title">비밀번호 변경 (선택)</p>

        <div className="form-group">
          <label htmlFor="current-password">현재 비밀번호</label>
          <input 
            type="password" 
            id="current-password" 
            placeholder="비밀번호 변경 시에만 입력"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="new-password">새 비밀번호</label>
          <input 
            type="password" 
            id="new-password" 
            placeholder="6자 이상 입력"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-new-password">새 비밀번호 확인</label>
          <input 
            type="password" 
            id="confirm-new-password" 
            placeholder="새 비밀번호를 다시 입력"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? '저장 중...' : '변경사항 저장'}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
