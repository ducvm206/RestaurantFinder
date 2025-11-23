// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google'; 
import FacebookLogin from '@greatsumini/react-facebook-login'; // 1. Đã import
import axios from 'axios'; 
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // HÀM CHUNG GỌI BACKEND
  const handleSocialAuth = async (email, name, avatar, authId, authType) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar, authId, authType })
      });
      const data = await res.json();

      if (res.ok) {
        alert(`Đăng nhập ${authType} thành công!`);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Lỗi kết nối Server");
    } finally {
      setIsLoading(false);
    }
  };

  // ĐĂNG NHẬP THƯỜNG
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      alert('Đăng nhập thành công!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // GOOGLE LOGIN
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const { email, name, picture, sub } = userInfo.data;
        handleSocialAuth(email, name, picture, sub, 'google');
      } catch (err) {
        setError("Lỗi kết nối Google");
      }
    },
    onError: () => setError('Đăng nhập Google thất bại'),
  });

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <p className="welcome-text">今日は!</p>
          <h1 className="login-title">おかえり</h1>
        </div>

        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <span className="material-icons-outlined input-icon">email</span>
            <input className="form-input" type="email" placeholder="メール" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <span className="material-icons-outlined input-icon">lock</span>
            <input className="form-input" type={showPassword ? "text" : "password"} placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              <span className="material-icons-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
            </button>
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            <span className="material-icons-outlined">login</span>
            {isLoading ? <span>処理中...</span> : <span>ログイン</span>}
          </button>
        </form>

        <div className="divider-container">
          <div className="divider-line"></div>
          <span className="divider-text">Or Login with</span>
          <div className="divider-line"></div>
        </div>

        <div className="social-login">
          {/* NÚT GOOGLE */}
          <button className="btn-social" type="button" onClick={() => loginGoogle()} title="Đăng nhập bằng Google">
            <svg className="social-icon" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
          </button>

          {/* NÚT FACEBOOK THẬT (Đã thay thế nút giả) */}
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            fields="name,email,picture"
            onProfileSuccess={(response) => {
              // Khi login thành công -> Gửi về Backend
              handleSocialAuth(
                response.email, 
                response.name, 
                response.picture?.data?.url, 
                response.id, 
                'facebook'
              );
            }}
            onFail={(error) => {
              console.log('Facebook Login Failed!', error);
              setError("Đăng nhập Facebook thất bại (Kiểm tra App ID)");
            }}
            render={({ onClick }) => (
              <button 
                className="btn-social" 
                type="button" 
                onClick={onClick} 
                title="Đăng nhập bằng Facebook"
              >
                 <svg className="social-icon" style={{color: '#1877F2'}} fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </button>
            )}
          />
        </div>

        <div className="login-footer">
          まだアカウントをお持ちではありませんか? 
          <a href="/register" className="link-register">レジスター</a>
        </div>
      </div>
    </div>
  );
};

export default Login;