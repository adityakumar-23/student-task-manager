import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiCheckSquare, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validations
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password, confirmPassword);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
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
          <h3 className="brand-font text-dark mb-1">Create Student Account</h3>
          <p className="text-muted small">Join Student Task Manager to stay on top of your assignments</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 small mb-4" role="alert">
            <FiAlertCircle className="flex-shrink-0" size={18} />
            <div>{error}</div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary" htmlFor="register-name">
              Full Name
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FiUser size={16} />
              </span>
              <input
                type="text"
                id="register-name"
                name="name"
                className="form-control border-start-0 ps-1"
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary" htmlFor="register-email">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FiMail size={16} />
              </span>
              <input
                type="email"
                id="register-email"
                name="email"
                className="form-control border-start-0 ps-1"
                placeholder="alex@university.edu"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary" htmlFor="register-password">
              Password (min. 6 characters)
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FiLock size={16} />
              </span>
              <input
                type="password"
                id="register-password"
                name="password"
                className="form-control border-start-0 ps-1"
                placeholder="••••••••"
                value={password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FiLock size={16} />
              </span>
              <input
                type="password"
                id="register-confirm-password"
                name="confirmPassword"
                className="form-control border-start-0 ps-1"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-gradient-primary w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
            disabled={isSubmitting}
            id="register-submit-btn"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register Account</span>
                <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-semibold text-decoration-none">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
