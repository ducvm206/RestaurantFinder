import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit2, ArrowLeft, Camera } from 'lucide-react';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: 'Peter Griffin',
    fullName: 'Peter Griffin',
    email: 'Petergriffin@example.com',
    phone: '000-000-0000',
    bio: 'I love Thai food!',
    profileImage: null
  });

  const [editedData, setEditedData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
  };

  const handleSave = () => {
    // API call would go here
    setProfileData({ ...editedData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={styles.title}>個人情報</h1>
        {!isEditing ? (
          <button style={styles.editButton} onClick={handleEdit}>
            <Edit2 size={18} style={{ marginRight: '6px' }} />
            編集
          </button>
        ) : (
          <div style={styles.actionButtons}>
            <button style={styles.cancelButton} onClick={handleCancel}>
              キャンセル
            </button>
            <button style={styles.saveButton} onClick={handleSave}>
              保存
            </button>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div style={styles.profileSection}>
        <div style={styles.profileImageContainer}>
          {isEditing && (
            <label style={styles.cameraIconLabel}>
              <Camera size={24} color="#fff" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={styles.fileInput}
              />
            </label>
          )}
          <div style={styles.profileImage}>
            {editedData.profileImage ? (
              <img
                src={editedData.profileImage}
                alt="Profile"
                style={styles.profileImg}
              />
            ) : (
              <div style={styles.profileImagePlaceholder}>
                <User size={80} color="#ccc" />
              </div>
            )}
          </div>
        </div>

        <div style={styles.profileInfo}>
          {isEditing ? (
            <input
              type="text"
              value={editedData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              style={styles.usernameInput}
            />
          ) : (
            <h2 style={styles.username}>{profileData.username}</h2>
          )}
          
          {isEditing ? (
            <textarea
              value={editedData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              style={styles.bioInput}
              placeholder="自己紹介を入力してください"
            />
          ) : (
            <p style={styles.bio}>{profileData.bio}</p>
          )}
        </div>
      </div>

      {/* Detailed Information Card */}
      <div style={styles.detailCard}>
        <h3 style={styles.cardTitle}>連絡先情報</h3>
        
        {/* Full Name */}
        <div style={styles.infoItem}>
          <div style={styles.infoIcon}>
            <User size={20} color="#666" />
          </div>
          <div style={styles.infoContent}>
            <label style={styles.infoLabel}>氏名</label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                style={styles.infoInput}
              />
            ) : (
              <p style={styles.infoValue}>{profileData.fullName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div style={styles.infoItem}>
          <div style={styles.infoIcon}>
            <Mail size={20} color="#666" />
          </div>
          <div style={styles.infoContent}>
            <label style={styles.infoLabel}>メール</label>
            {isEditing ? (
              <input
                type="email"
                value={editedData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={styles.infoInput}
              />
            ) : (
              <p style={styles.infoValue}>{profileData.email}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div style={styles.infoItem}>
          <div style={styles.infoIcon}>
            <Phone size={20} color="#666" />
          </div>
          <div style={styles.infoContent}>
            <label style={styles.infoLabel}>電話番号</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={styles.infoInput}
              />
            ) : (
              <p style={styles.infoValue}>{profileData.phone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    backgroundColor: '#fff',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    color: '#333'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    flex: 1,
    textAlign: 'center'
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px'
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: '24px'
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '4px solid #FF6B6B',
    backgroundColor: '#f0f0f0'
  },
  profileImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9'
  },
  cameraIconLabel: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    backgroundColor: '#FF6B6B',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 10
  },
  fileInput: {
    display: 'none'
  },
  profileInfo: {
    textAlign: 'center',
    width: '100%'
  },
  username: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px'
  },
  usernameInput: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
    textAlign: 'center',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '8px',
    width: '100%'
  },
  bio: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.5'
  },
  bioInput: {
    fontSize: '16px',
    color: '#666',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '12px',
    width: '100%',
    minHeight: '60px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f0f0f0'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  infoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
    flexShrink: 0
  },
  infoContent: {
    flex: 1
  },
  infoLabel: {
    fontSize: '13px',
    color: '#999',
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: '16px',
    color: '#333',
    margin: 0,
    fontWeight: '400'
  },
  infoInput: {
    fontSize: '16px',
    color: '#333',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '8px 12px',
    width: '100%',
    fontFamily: 'inherit'
  }
};

export default ProfileScreen;