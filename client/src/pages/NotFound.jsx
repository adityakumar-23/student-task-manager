import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
      <div className="card modern-card p-5 text-center shadow-lg" style={{ maxWidth: '480px' }}>
        <div 
          className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle text-warning bg-warning-subtle"
          style={{ width: '80px', height: '80px' }}
        >
          <FiAlertTriangle size={42} />
        </div>
        <h1 className="brand-font fw-bold text-dark display-4 mb-2">404</h1>
        <h4 className="fw-bold text-secondary mb-2">Page Not Found</h4>
        <p className="text-muted small mb-4">
          The academic page or task you are looking for does not exist or has been moved.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/dashboard" className="btn btn-gradient-primary rounded-pill px-4 d-flex align-items-center gap-2">
            <FiHome size={16} /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
