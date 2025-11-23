// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// 1. IMPORT THƯ VIỆN GOOGLE (Quan trọng)
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import App from './App';

// Mã Client ID của bạn (Code bạn gửi)
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. BỌC PROVIDER Ở NGOÀI CÙNG VÀ TRUYỀN CLIENT ID VÀO */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);