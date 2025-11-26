// ============================================
// FILE: client/src/pages/ProfilePage.js
// Updated to fetch from backend API
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token, redirect to login
        navigate('/login');
        return;
      }

      // Call backend API with Authorization header
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // Token invalid or expired
        throw new Error(data.message || 'Failed to fetch profile');
      }

      // Update user state with data from backend
      setUser(data.user);
      
      // Also update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      setLoading(false);
      
      // If token is invalid, clear localStorage and redirect
      if (err.message.includes('Token') || err.message.includes('unauthorized')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('ログアウトしました');
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid var(--primary-color)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>読み込み中...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <span className="material-icons-outlined" style={{ fontSize: '4rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
          error_outline
        </span>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>エラーが発生しました</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ログインページへ戻る
        </button>
      </div>
    );
  }

  // Main profile display
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '1rem',
      fontFamily: "'Noto Sans JP', sans-serif",
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <button 
          onClick={() => navigate('/home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
        >
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>個人情報</h1>
        <button 
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
        >
          <span className="material-icons-outlined">edit</span>
        </button>
      </div>

      {/* Profile Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ margin: '0 auto 1rem', width: '100px', height: '100px' }}>
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profile" 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary-color)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color) 0%, #dc2626 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 700
            }}>
              {user.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0' }}>
          {user.fullName}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>こんにちは！</p>
        
        {/* Auth Type Badge */}
        <div style={{
          display: 'inline-block',
          padding: '0.25rem 0.75rem',
          backgroundColor: user.authType === 'google' ? '#4285F4' : user.authType === 'facebook' ? '#1877F2' : '#6B7280',
          color: 'white',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          marginTop: '0.5rem'
        }}>
          {user.authType === 'google' && '🔗 Google'}
          {user.authType === 'facebook' && '🔗 Facebook'}
          {user.authType === 'local' && '📧 Email'}
        </div>
      </div>

      {/* Details Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
      }}>
        {/* Full Name */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <span className="material-icons-outlined" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>
            person
          </span>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>
              氏名
            </label>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>
              {user.fullName}
            </p>
          </div>
        </div>

        {/* Email */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <span className="material-icons-outlined" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>
            email
          </span>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>
              メール
            </label>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>
              {user.email}
            </p>
          </div>
        </div>
        {/* Account Created Date */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <span className="material-icons-outlined" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>
            calendar_today
          </span>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>
              登録日
            </label>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>
              {new Date(user.createdAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <button 
        onClick={fetchUserProfile}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: 'white',
          color: 'var(--primary-color)',
          border: '2px solid var(--primary-color)',
          borderRadius: '0.75rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#fef2f2';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
      >
        <span className="material-icons-outlined">refresh</span>
        プロフィールを更新
      </button>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '0.75rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#dc2626';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#ef4444';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span className="material-icons-outlined">logout</span>
        ログアウト
      </button>
    </div>
  );
};

export default ProfilePage;