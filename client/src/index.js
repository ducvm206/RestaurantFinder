// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// GOOGLE AUTH
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App';

// 👉 IMPORT LocationProvider
import { LocationProvider } from "./context/LocationContext";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>

        {/* ⭐⭐ BỌC TOÀN BỘ APP BẰNG LOCATION PROVIDER ⭐⭐ */}
        <LocationProvider>
          <App />
        </LocationProvider>

      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
