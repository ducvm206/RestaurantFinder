// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Thêm Routes, Route
import './App.css'; 

import Login from './pages/Login';
import Register from './pages/Register'; // Import trang mới

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} /> {/* Tạm thời để Login là trang chủ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;