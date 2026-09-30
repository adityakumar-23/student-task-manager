import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiGrid, 
  FiList, 
  FiAlertCircle, 
  FiX, 
  FiCheck,
  FiEdit3
} from 'react-icons/fi';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline_asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Task Editing Modal State
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    subject: '',
    priority: 'Medium',
    status: 'Pending',
    deadline: ''
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch subjects for filter dropdown
  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      if (res.data && res.data.subjects) {
        setSubjects(res.data.subjects);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  // Fetch tasks with all query parameters
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (priorityFilter !== 'All') params.append('priority', priorityFilter);
      if (subjectFilter !== 'All') params.append('subject', subjectFilter);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await api.get(`/tasks?${params.toString()}`);
      if (res.data && res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to fetch tasks. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch tasks when filters or sort change, debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, priorityFilter, subjectFilter, sortBy]);

  // Mark task status (e.g. Complete)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setNotification(`Task marked as ${newStatus}!`);
      setTimeout(() => setNotification(''), 3000);
      fetchTasks();
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update task status.');
    }
  };

  // Open edit modal
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    // Format date for <input type="date" />
    const formattedDate = task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
    setEditFormData({
      title: task.title,
      description: task.description || '',
      subject: task.subject,
      priority: task.priority,
      status: task.status,
      deadline: formattedDate
    });
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim() || !editFormData.subject.trim() || !editFormData.deadline) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setEditSubmitting(true);
      await api.put(`/tasks/${editingTask._id}`, editFormData);
      setEditingTask(null);
      setNotification('Task updated successfully!');
      setTimeout(() => setNotification(''), 3000);
      fetchTasks();
      fetchSubjects();
    } catch (err) {
      console.error('Failed to update task:', err);
      alert('Error updating task. Please try again.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await api.delete(`/tasks/${taskToDelete.id}`);
      setTaskToDelete(null);
      setNotification('Task deleted successfully.');
      setTimeout(() => setNotification(''), 3000);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Error deleting task.');
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSubjectFilter('All');
    setSortBy('deadline_asc');
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      {/* Page Title & Add Button */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="brand-font fw-bold text-dark mb-1">Academic Tasks</h2>
          <p className="text-secondary small mb-0">
            Manage, filter, and track assignments across all your enrolled subjects.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {/* View Mode Toggle */}
          <div className="btn-group shadow-sm me-2" role="group">
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-light border text-muted'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FiGrid size={16} />
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-light border text-muted'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <FiList size={16} />
            </button>
          </div>

          <Link to="/tasks/add" className="btn btn-gradient-primary btn-sm rounded-3 px-3 py-2 d-flex align-items-center gap-1" id="add-task-btn">
            <FiPlus size={18} />
            <span>Add Task</span>
          </Link>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="alert alert-success alert-dismissible fade show py-2 px-3 rounded-3 small mb-3 shadow-sm" role="alert">
          <FiCheck className="me-2 mb-1" size={16} />
          {notification}
          <button type="button" className="btn-close p-2" onClick={() => setNotification('')} aria-label="Close"></button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card modern-card p-3 p-md-4 mb-4">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FiSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-1"
                placeholder="Search by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="tasks-search-input"
              />
              {search && (
                <button className="btn btn-light border border-start-0" onClick={() => setSearch('')}>
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              id="filter-status-select"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              id="filter-priority-select"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              id="filter-subject-select"
            >
              <option value="All">All Subjects</option>
              {subjects.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="filter-sort-select"
            >
              <option value="deadline_asc">Nearest Deadline</option>
              <option value="deadline_desc">Furthest Deadline</option>
              <option value="createdAt_desc">Recently Added</option>
              <option value="createdAt_asc">Oldest Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted small">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card modern-card text-center py-5 px-3">
          <FiAlertCircle className="mx-auto text-secondary mb-3" size={48} />
          <h5 className="fw-bold text-dark mb-1">No Tasks Found</h5>
          <p className="text-muted small mb-3">
            {search || statusFilter !== 'All' || priorityFilter !== 'All' || subjectFilter !== 'All'
              ? 'No tasks match your current filter criteria.'
              : 'You have not created any academic tasks yet.'}
          </p>
          <div className="d-flex justify-content-center gap-2">
            {search || statusFilter !== 'All' || priorityFilter !== 'All' || subjectFilter !== 'All' ? (
              <button onClick={handleResetFilters} className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                Reset All Filters
              </button>
            ) : (
              <Link to="/tasks/add" className="btn btn-primary btn-sm rounded-pill px-4">
                Create First Task
              </Link>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="row g-3">
          {tasks.map((task) => (
            <div key={task._id} className="col-12 col-md-6 col-xl-4 d-flex">
              <div className="w-100">
                <TaskCard
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleOpenEdit}
                  onDelete={(id, title) => setTaskToDelete({ id, title })}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card modern-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase text-secondary">
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Status</th>
                  <th scope="col">Deadline</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const d = new Date(task.deadline);
                  const isOverdue = d < new Date() && task.status !== 'Completed';
                  return (
                    <tr key={task._id}>
                      <td>
                        <span className={`fw-semibold ${task.status === 'Completed' ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                          {task.title}
                        </span>
                        {task.description && (
                          <small className="text-muted d-block text-truncate" style={{ maxWidth: '280px' }}>
                            {task.description}
                          </small>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1 rounded-pill">
                          {task.subject}
                        </span>
                      </td>
                      <td>
                        <span className={`badge px-2 py-1 rounded-pill badge-priority-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge px-2 py-1 rounded-pill badge-status-${task.status.toLowerCase().replace(' ', '-')}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <div className={`small fw-semibold ${isOverdue ? 'text-danger' : 'text-secondary'}`}>
                          {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {task.status !== 'Completed' && (
                            <button
                              onClick={() => handleStatusChange(task._id, 'Completed')}
                              className="btn btn-outline-success"
                              title="Mark Complete"
                            >
                              <FiCheck size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(task)}
                            className="btn btn-outline-primary"
                            title="Edit"
                          >
                            <FiEdit3 size={14} />
                          </button>
                          <button
                            onClick={() => setTaskToDelete({ id: task._id, title: task.title })}
                            className="btn btn-outline-danger"
                            title="Delete"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-bottom pb-3">
                <h5 className="modal-title fw-bold brand-font text-dark">Edit Academic Task</h5>
                <button type="button" className="btn-close" onClick={() => setEditingTask(null)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">Task Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Subject *</label>
                      <input
                        type="text"
                        list="edit-subjects-list"
                        className="form-control"
                        placeholder="e.g. Data Structures"
                        value={editFormData.subject}
                        onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                        required
                      />
                      <datalist id="edit-subjects-list">
                        {subjects.map((s) => (
                          <option key={s._id} value={s.name} />
                        ))}
                      </datalist>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Deadline Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editFormData.deadline}
                        onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary">Priority</label>
                      <select
                        className="form-select"
                        value={editFormData.priority}
                        onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary">Status</label>
                      <select
                        className="form-select"
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top pt-3">
                  <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setEditingTask(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={editSubmitting}>
                    {editSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {taskToDelete && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content rounded-4 border-0 shadow-lg p-3 text-center">
              <div className="mx-auto mb-2 text-danger">
                <FiAlertCircle size={44} />
              </div>
              <h5 className="fw-bold text-dark mb-1">Delete Task?</h5>
              <p className="text-secondary small mb-3">
                Are you sure you want to permanently delete "<strong>{taskToDelete.title}</strong>"? This action cannot be undone.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3"
                  onClick={() => setTaskToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill px-3"
                  onClick={handleConfirmDelete}
                  id="confirm-delete-btn"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
