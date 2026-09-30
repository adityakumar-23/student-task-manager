import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle, 
  FiLayers, 
  FiPlus, 
  FiCalendar, 
  FiArrowRight, 
  FiRefreshCw,
  FiBook
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0
  });
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/tasks/stats');
      if (res.data && res.data.success) {
        setStats(res.data.stats);
        setUpcomingTasks(res.data.upcomingTasks || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to fetch dashboard statistics. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkComplete = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: 'Completed' });
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="brand-font fw-bold text-dark mb-1">
            Hello, {user?.name ? user.name.split(' ')[0] : 'Student'}! 👋
          </h2>
          <p className="text-secondary mb-0 small">
            Here is your academic overview and upcoming assignment deadlines.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button 
            onClick={fetchDashboardData} 
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 rounded-3 px-3 py-2"
            title="Refresh Data"
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'spin' : ''} size={15} />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
          <Link 
            to="/tasks/add" 
            className="btn btn-gradient-primary btn-sm d-flex align-items-center gap-1 rounded-3 px-3 py-2"
            id="dash-add-task-btn"
          >
            <FiPlus size={18} />
            <span>Add Task</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning py-2 px-3 rounded-3 small mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="row g-3 mb-4">
        {/* Total Tasks */}
        <div className="col-12 col-sm-6 col-xl">
          <div className="stat-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small fw-semibold text-uppercase">Total Tasks</span>
              <div className="stat-icon-wrapper" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <FiLayers size={22} />
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-1">{loading ? '...' : stats.total}</h3>
            <span className="small text-muted">All registered tasks</span>
          </div>
        </div>

        {/* Pending */}
        <div className="col-12 col-sm-6 col-xl">
          <div className="stat-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small fw-semibold text-uppercase">Pending</span>
              <div className="stat-icon-wrapper" style={{ background: '#fffbeb', color: '#d97706' }}>
                <FiClock size={22} />
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-1">{loading ? '...' : stats.pending}</h3>
            <span className="small text-warning fw-semibold">Awaiting action</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="col-12 col-sm-6 col-xl">
          <div className="stat-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small fw-semibold text-uppercase">In Progress</span>
              <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <FiRefreshCw size={22} />
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-1">{loading ? '...' : stats.inProgress}</h3>
            <span className="small text-primary fw-semibold">Currently working</span>
          </div>
        </div>

        {/* Completed */}
        <div className="col-12 col-sm-6 col-xl">
          <div className="stat-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small fw-semibold text-uppercase">Completed</span>
              <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
                <FiCheckCircle size={22} />
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-1">{loading ? '...' : stats.completed}</h3>
            <span className="small text-success fw-semibold">Successfully finished</span>
          </div>
        </div>

        {/* High Priority */}
        <div className="col-12 col-sm-6 col-xl">
          <div className="stat-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small fw-semibold text-uppercase">High Priority</span>
              <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#dc2626' }}>
                <FiAlertTriangle size={22} />
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-1">{loading ? '...' : stats.highPriority}</h3>
            <span className="small text-danger fw-semibold">Requires attention</span>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines Section */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card modern-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">Upcoming Assignment Deadlines</h5>
                <p className="text-secondary small mb-0">Assignments due soon, ordered by closest deadline</p>
              </div>
              <Link to="/tasks" className="btn btn-sm btn-light text-primary fw-semibold d-flex align-items-center gap-1 rounded-pill px-3 py-1">
                View All Tasks <FiArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                <span className="ms-2 text-muted small">Loading assignments...</span>
              </div>
            ) : upcomingTasks.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-4 my-2">
                <FiCheckCircle className="text-success mb-2" size={38} />
                <h6 className="fw-bold text-dark mb-1">No Pending Deadlines!</h6>
                <p className="text-muted small mb-3">You are all caught up on your assignments.</p>
                <Link to="/tasks/add" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                  Create a new task
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-uppercase text-secondary">
                    <tr>
                      <th scope="col" style={{ width: '40%' }}>Assignment</th>
                      <th scope="col">Subject</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Deadline</th>
                      <th scope="col" className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingTasks.map((t) => {
                      const d = new Date(t.deadline);
                      const isOverdue = d < new Date();
                      return (
                        <tr key={t._id}>
                          <td>
                            <div className="fw-semibold text-dark">{t.title}</div>
                            {t.description && (
                              <small className="text-muted text-truncate d-block" style={{ maxWidth: '240px' }}>
                                {t.description}
                              </small>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border px-2 py-1 rounded-pill">
                              {t.subject}
                            </span>
                          </td>
                          <td>
                            <span className={`badge px-2 py-1 rounded-pill badge-priority-${t.priority.toLowerCase()}`}>
                              {t.priority}
                            </span>
                          </td>
                          <td>
                            <div className={`small fw-semibold ${isOverdue ? 'text-danger' : 'text-secondary'}`}>
                              {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {isOverdue && <span className="badge bg-danger-subtle text-danger ms-1">Overdue</span>}
                            </div>
                          </td>
                          <td className="text-end">
                            <button
                              onClick={() => handleMarkComplete(t._id)}
                              className="btn btn-sm btn-outline-success rounded-pill px-3 py-1"
                              title="Mark as Completed"
                            >
                              <FiCheckCircle size={13} className="me-1" /> Done
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Productivity Actions & Advice */}
        <div className="col-12 col-lg-4">
          <div className="card modern-card p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3">Quick Actions</h5>
            <div className="d-grid gap-2">
              <Link to="/tasks/add" className="btn btn-gradient-primary rounded-3 py-2 text-center text-decoration-none">
                <FiPlus className="me-2 mb-1" /> Create New Assignment
              </Link>
              <Link to="/tasks" className="btn btn-light border rounded-3 py-2 text-center text-secondary text-decoration-none">
                <FiLayers className="me-2 mb-1" /> View & Filter Tasks
              </Link>
              <Link to="/profile#subjects" className="btn btn-light border rounded-3 py-2 text-center text-secondary text-decoration-none">
                <FiBook className="me-2 mb-1" /> Manage Course Subjects
              </Link>
            </div>
          </div>

          <div className="card border-0 rounded-4 p-4 text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
            <h6 className="fw-bold mb-2">🎓 Study Pro-Tip</h6>
            <p className="small mb-0 opacity-90" style={{ lineHeight: '1.6' }}>
              Break complex semester projects into smaller daily tasks. Tackle "High Priority" assignments first thing in the morning to maintain top academic performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
