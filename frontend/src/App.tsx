import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import AdDetailPage from './pages/AdDetailPage';
import CreateAdPage from './pages/CreateAdPage';
import EditAdPage from './pages/EditAd';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/ads/create" element={<ProtectedRoute> <CreateAdPage /> </ProtectedRoute>} />
            <Route path="ads/:id" element={<AdDetailPage />} />
            <Route path="ads/edit/:id" element={<ProtectedRoute><EditAdPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
