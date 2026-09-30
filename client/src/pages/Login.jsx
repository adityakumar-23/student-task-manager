import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiCheckSquare, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center text-white rounded-4 shadow-sm mb-3"
            style={{
              width: '54px',
              height: '54px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
            }}
          >
            <FiCheckSquare size={28} />
          </div>
          <h3 className="brand-font text-dark mb-1">Welcome Back</h3>
          <p className="text-muted small">Sign in to manage your assignments & academic schedule</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 small mb-4" role="alert">
            <FiAlertCircle className="flex-shrink-0" size={18} />
            <div>{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary" htmlFor="login-email">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FiMail size={16} />
              </span>
              <input
                type="email"
                id="login-email"
                className="form-control border-start-0 ps-1"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary" htmlFor="login-password">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FiLock size={16} />
              </span>
              <input
                type="password"
                id="login-password"
                className="form-control border-start-0 ps-1"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-gradient-primary w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
            disabled={isSubmitting}
            id="login-submit-btn"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Link to Register */}
        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary fw-semibold text-decoration-none">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
