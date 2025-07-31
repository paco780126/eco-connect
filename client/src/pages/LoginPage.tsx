import React, { useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button'; // 새로 만든 Button 컴포넌트 import
import Input from '../components/common/Input';   // 새로 만든 Input 컴포넌트 import
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = ReactRouterDom.useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/mypage/edit-profile'); // Match test case
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="이메일"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="이메일"
          />
          <Input
            label="비밀번호"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="비밀번호"
          />
          {error && <p className="error-message">{error}</p>}
          <Button type="submit" variant="secondary" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
        <div className="extra-links">
          <span>아직 회원이 아니신가요?</span>
          <ReactRouterDom.Link to="/register">회원가입</ReactRouterDom.Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;