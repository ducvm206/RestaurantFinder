// File: client/src/components/profile/ProfileHeader.js
import React from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';

const ProfileHeader = ({ isEditing, onEdit, onCancel, onSave }) => {
  return (
    <div style={styles.header}>
      <button style={styles.backButton}>
        <ArrowLeft size={24} />
      </button>
      <h1 style={styles.title}>個人情報</h1>
      {!isEditing ? (
        <button style={styles.editButton} onClick={onEdit}>
          <Edit2 size={18} style={{ marginRight: '6px' }} />
          編集
        </button>
      ) : (
        <div style={styles.actionButtons}>
          <button style={styles.cancelButton} onClick={onCancel}>
            キャンセル
          </button>
          <button style={styles.saveButton} onClick={onSave}>
            保存
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
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
    fontWeight: '500'
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
  }
};

export default ProfileHeader;