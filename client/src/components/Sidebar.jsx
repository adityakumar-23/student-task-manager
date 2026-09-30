import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiGrid, 
  FiList, 
  FiPlusCircle, 
  FiBookOpen, 
  FiUser, 
  FiLogOut,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
          style={{ zIndex: 1005 }}
          onClick={onClose}
        />
      )}

      <aside className={`app-sidebar d-flex flex-column p-3 ${isOpen ? 'show' : ''}`}>
        {/* Mobile Header inside Sidebar */}
        <div className="d-flex align-items-center justify-content-between d-lg-none mb-3 pb-2 border-bottom">
          <span className="fw-bold text-dark">Menu Navigation</span>
          <button 
            className="btn btn-sm btn-light p-1" 
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* User Mini Banner */}
        <div className="p-3 mb-3 bg-light rounded-3 d-flex align-items-center gap-3">
          <div 
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
            style={{ width: '42px', height: '42px', fontSize: '1.1rem' }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="overflow-hidden">
            <h6 className="mb-0 text-dark fw-bold text-truncate">{user?.name || 'Student'}</h6>
            <small className="text-muted text-truncate d-block" style={{ fontSize: '0.78rem' }}>
              {user?.email || 'student@university.edu'}
            </small>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav flex-column flex-grow-1">
          <NavLink 
            to="/dashboard" 
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            id="sidebar-dashboard"
          >
            <FiGrid size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/tasks" 
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            id="sidebar-tasks"
          >
            <FiList size={18} />
            <span>All Tasks</span>
          </NavLink>

          <NavLink 
            to="/tasks/add" 
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            id="sidebar-add-task"
          >
            <FiPlusCircle size={18} />
            <span>Add Task</span>
          </NavLink>

          <NavLink 
            to="/profile#subjects" 
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            id="sidebar-subjects"
          >
            <FiBookOpen size={18} />
            <span>Subjects</span>
          </NavLink>

          <NavLink 
            to="/profile" 
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            id="sidebar-profile"
          >
            <FiUser size={18} />
            <span>My Profile</span>
          </NavLink>
        </nav>

        {/* Bottom Actions */}
        <div className="pt-3 border-top mt-auto">
          <button
            onClick={handleLogout}
            className="sidebar-link w-100 text-danger border-0 bg-transparent text-start"
            id="sidebar-logout"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
