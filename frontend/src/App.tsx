import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import AdDetailPage from './pages/AdDetailPage';

const NewAdPage = () => <h1>Create ad</h1>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/ads/create" element={<ProtectedRoute> <NewAdPage /> </ProtectedRoute>} />
            <Route path="ads/:id" element={<AdDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
