import React from 'react';
import { User, Camera } from 'lucide-react';

const ProfileBasicInfo = ({ 
  profileData, 
  isEditing, 
  onInputChange, 
  onImageUpload 
}) => {
  return (
    <div style={styles.profileSection}>
      <div style={styles.profileImageContainer}>
        {isEditing && (
          <label style={styles.cameraIconLabel}>
            <Camera size={24} color="#fff" />
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              style={styles.fileInput}
            />
          </label>
        )}
        <div style={styles.profileImage}>
          {profileData.profileImage ? (
            <img
              src={profileData.profileImage}
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
            value={profileData.username}
            onChange={(e) => onInputChange('username', e.target.value)}
            style={styles.usernameInput}
          />
        ) : (
          <h2 style={styles.username}>{profileData.username}</h2>
        )}
        
        {isEditing ? (
          <textarea
            value={profileData.bio}
            onChange={(e) => onInputChange('bio', e.target.value)}
            style={styles.bioInput}
            placeholder="自己紹介を入力してください"
          />
        ) : (
          <p style={styles.bio}>{profileData.bio}</p>
        )}
      </div>
    </div>
  );
};

const styles = {
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
  }
};

export default ProfileBasicInfo;