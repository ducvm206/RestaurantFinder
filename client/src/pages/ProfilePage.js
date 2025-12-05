// ============================================
// FILE: client/src/pages/ProfilePage.js
// Updated with Edit Mode and Image Upload
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit form states
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
    avatar: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Update the fetchUserProfile function to add more debugging:
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('Fetching profile with token:', token.substring(0, 20) + '...');

    const response = await fetch('http://localhost:5000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    setUser(data.user);
    setEditData({
      fullName: data.user.fullName,
      email: data.user.email,
      avatar: data.user.avatar || ''
    });

    localStorage.setItem('user', JSON.stringify(data.user));
    setLoading(false);
  } catch (err) {
    console.error('Error details:', err);
    console.error('Error message:', err.message);
    setError(err.message);
    setLoading(false);
    
    if (err.message.includes('Token') || err.message.includes('unauthorized')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }
};

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ファイルサイズは5MB以下にしてください');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditData({
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar || ''
    });
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');

      // First, upload image if selected
      let avatarUrl = editData.avatar;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        const uploadResponse = await fetch('http://localhost:5000/api/profile/upload-avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const uploadData = await uploadResponse.json();
        
        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || 'Failed to upload avatar');
        }

        avatarUrl = uploadData.avatarUrl;
      }

      // Then update profile
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: editData.fullName,
          email: editData.email,
          avatar: avatarUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local state
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setIsEditMode(false);
      setPreviewImage(null);
      setSelectedFile(null);
      alert('プロフィールを更新しました');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(`エラー: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
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
          borderTop: '4px solid #ef4444',
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
        <span className="material-icons-outlined" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '1rem' }}>
          error_outline
        </span>
        <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>エラーが発生しました</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error}</p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#ef4444',
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
        {!isEditMode && (
          <button 
            onClick={handleEditClick}
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
        )}
        {isEditMode && <div style={{ width: '40px' }}></div>}
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
        <div style={{ margin: '0 auto 1rem', width: '100px', height: '100px', position: 'relative' }}>
          {(previewImage || editData.avatar) ? (
            <img 
              src={previewImage || editData.avatar} 
              alt="Profile" 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #ef4444'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 700
            }}>
              {editData.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          
          {isEditMode && (
            <>
              <button
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: '2px solid white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: '1.2rem' }}>camera_alt</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
            </>
          )}
        </div>

        {!isEditMode ? (
          <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0' }}>
              {user.fullName}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>こんにちは！</p>
            
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
          </>
        ) : (
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            写真をクリックして変更
          </p>
        )}
      </div>

      {/* Details Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
      }}>
        {!isEditMode ? (
          <>
            {/* Full Name */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <span className="material-icons-outlined" style={{ fontSize: '1.5rem', color: '#ef4444' }}>
                person
              </span>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem', fontWeight: 500 }}>
                  氏名
                </label>
                <p style={{ margin: 0, fontSize: '1rem', color: '#1f2937' }}>
                  {user.fullName}
                </p>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <span className="material-icons-outlined" style={{ fontSize: '1.5rem', color: '#ef4444' }}>
                email
              </span>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem', fontWeight: 500 }}>
                  メール
                </label>
                <p style={{ margin: 0, fontSize: '1rem', color: '#1f2937', wordBreak: 'break-word' }}>
                  {user.email}
                </p>
              </div>
            </div>

            {/* Account Created Date */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span className="material-icons-outlined" style={{ fontSize: '1.5rem', color: '#ef4444' }}>
                calendar_today
              </span>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem', fontWeight: 500 }}>
                  登録日
                </label>
                <p style={{ margin: 0, fontSize: '1rem', color: '#1f2937' }}>
                  {new Date(user.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Edit Full Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>
                氏名
              </label>
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                placeholder="氏名を入力"
              />
            </div>

            {/* Edit Email */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>
                メール
              </label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                placeholder="メールアドレスを入力"
              />
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {!isEditMode ? (
        <>
          <button 
            onClick={fetchUserProfile}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'white',
              color: '#ef4444',
              border: '2px solid #ef4444',
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
        </>
      ) : (
        <>
          <button 
            onClick={handleSaveProfile}
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: isSaving ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseOut={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            <span className="material-icons-outlined">
              {isSaving ? 'hourglass_empty' : 'save'}
            </span>
            {isSaving ? '保存中...' : '変更を保存'}
          </button>

          <button 
            onClick={handleCancelEdit}
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'white',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseOut={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <span className="material-icons-outlined">close</span>
            キャンセル
          </button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;