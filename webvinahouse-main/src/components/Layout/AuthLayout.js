// src/components/Layout/AuthLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.css';

function AuthLayout() {
  return (
    <div className="auth-container">
      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;