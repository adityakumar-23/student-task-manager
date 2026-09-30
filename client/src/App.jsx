import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AddTask from './pages/AddTask';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine if on public auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      {!isAuthPage && (
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      )}

      {/* Main Body Area */}
      <div className="d-flex flex-grow-1">
        {isAuthenticated && !isAuthPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className="flex-grow-1 overflow-x-hidden bg-main">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/add"
              element={
                <ProtectedRoute>
                  <AddTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
