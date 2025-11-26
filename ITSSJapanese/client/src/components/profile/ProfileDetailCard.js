// =====================================
// File: client/src/components/profile/ProfileDetailCard.js
// =====================================

import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

const ProfileDetailCard = ({ profileData, isEditing, onInputChange }) => {
  return (
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
              value={profileData.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
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
              value={profileData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
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
              value={profileData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              style={styles.infoInput}
            />
          ) : (
            <p style={styles.infoValue}>{profileData.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
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

export default ProfileDetailCard;