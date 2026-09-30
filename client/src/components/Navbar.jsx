import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiCheckSquare, 
  FiUser, 
  FiLogOut, 
  FiGrid, 
  FiList, 
  FiMenu 
} from 'react-icons/fi';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg app-navbar px-3 py-2">
      <div className="container-fluid">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="d-flex align-items-center gap-2">
          {isAuthenticated && (
            <button
              className="btn btn-outline-secondary d-lg-none border-0 p-2"
              onClick={onToggleSidebar}
              aria-label="Toggle Sidebar"
              id="sidebar-toggle-btn"
            >
              <FiMenu size={22} />
            </button>
          )}

          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="navbar-brand d-flex align-items-center gap-2 m-0 text-decoration-none">
            <div 
              className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
              }}
            >
              <FiCheckSquare size={20} />
            </div>
            <div>
              <span className="brand-font fs-5 text-dark fw-bold">StudentTask</span>
              <span className="brand-font fs-5 text-primary fw-bold">Hub</span>
            </div>
          </Link>
        </div>

        {/* Center / Right Links */}
        <div className="d-flex align-items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Desktop quick navigation */}
              <div className="d-none d-md-flex align-items-center gap-1">
                <Link
                  to="/dashboard"
                  className={`btn btn-sm ${isActive('/dashboard') ? 'btn-primary' : 'btn-light text-secondary'} fw-semibold px-3 py-2 rounded-3`}
                  id="nav-link-dashboard"
                >
                  <FiGrid className="me-1 mb-1" /> Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className={`btn btn-sm ${isActive('/tasks') ? 'btn-primary' : 'btn-light text-secondary'} fw-semibold px-3 py-2 rounded-3`}
                  id="nav-link-tasks"
                >
                  <FiList className="me-1 mb-1" /> Tasks
                </Link>
              </div>

              {/* User Dropdown / Profile Quick Access */}
              <div className="d-flex align-items-center gap-2 ms-2 ps-2 border-start">
                <Link
                  to="/profile"
                  className={`btn btn-sm ${isActive('/profile') ? 'btn-outline-primary' : 'btn-light text-secondary'} rounded-pill px-3 py-1 d-flex align-items-center gap-2 text-decoration-none`}
                  title="View Profile"
                  id="nav-profile-btn"
                >
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="d-none d-sm-inline fw-semibold text-truncate" style={{ maxWidth: '120px' }}>
                    {user?.name || 'Student'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger rounded-3 px-3 py-2 d-flex align-items-center gap-1"
                  title="Log out"
                  id="nav-logout-btn"
                >
                  <FiLogOut size={16} />
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm px-3 py-2 fw-semibold rounded-3">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-gradient-primary btn-sm px-3 py-2 fw-semibold rounded-3">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
