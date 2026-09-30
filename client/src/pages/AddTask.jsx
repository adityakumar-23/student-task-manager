import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  FiPlusCircle, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiCalendar, 
  FiBook, 
  FiFileText 
} from 'react-icons/fi';

const AddTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    priority: 'Medium',
    status: 'Pending',
    deadline: ''
  });

  const [subjects, setSubjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const { title, description, subject, priority, status, deadline } = formData;

  // Load registered subjects to help autocomplete
  useEffect(() => {
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
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form validations
    if (!title.trim()) {
      setError('Task Title is required.');
      return;
    }

    if (!subject.trim()) {
      setError('Please assign or specify a subject for this task.');
      return;
    }

    if (!deadline) {
      setError('Please select a deadline date.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/tasks', {
        title: title.trim(),
        description: description.trim(),
        subject: subject.trim(),
        priority,
        status,
        deadline
      });

      if (res.data && res.data.success) {
        setSuccess('Task created successfully! Redirecting to tasks list...');
        setTimeout(() => {
          navigate('/tasks');
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(err.response?.data?.message || 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-3 px-md-4 py-4" style={{ maxWidth: '800px' }}>
      {/* Back button */}
      <div className="mb-3">
        <Link to="/tasks" className="btn btn-light btn-sm text-secondary d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1">
          <FiArrowLeft size={14} /> Back to Tasks
        </Link>
      </div>

      <div className="card modern-card p-4 p-md-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div 
            className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
            style={{
              width: '46px',
              height: '46px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
            }}
          >
            <FiPlusCircle size={24} />
          </div>
          <div>
            <h3 className="brand-font fw-bold text-dark mb-0">Create Academic Task</h3>
            <p className="text-secondary small mb-0">Add a new assignment, project, or homework with deadline tracking</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 small mb-4">
            <FiAlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 rounded-3 small mb-4">
            <FiCheckCircle size={18} />
            <div>{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary" htmlFor="task-title">
              Task Title <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FiFileText size={16} />
              </span>
              <input
                type="text"
                id="task-title"
                name="title"
                className="form-control border-start-0 ps-1"
                placeholder="e.g. Implement Binary Search Tree in C++"
                value={title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary" htmlFor="task-description">
              Description / Requirements (Optional)
            </label>
            <textarea
              id="task-description"
              name="description"
              className="form-control"
              rows="4"
              placeholder="Outline homework questions, reference links, lecture notes, or project milestones..."
              value={description}
              onChange={handleChange}
            />
          </div>

          {/* Subject & Deadline row */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary" htmlFor="task-subject">
                Subject / Course <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <FiBook size={16} />
                </span>
                <input
                  type="text"
                  list="subjects-datalist"
                  id="task-subject"
                  name="subject"
                  className="form-control border-start-0 ps-1"
                  placeholder="e.g. Data Structures, DBMS, OS"
                  value={subject}
                  onChange={handleChange}
                  required
                />
                <datalist id="subjects-datalist">
                  {subjects.map((s) => (
                    <option key={s._id} value={s.name} />
                  ))}
                  <option value="Data Structures" />
                  <option value="DBMS" />
                  <option value="Computer Networks" />
                  <option value="Operating Systems" />
                  <option value="Java" />
                  <option value="DAA" />
                </datalist>
              </div>
              <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                Pick from list or type a new subject. It will automatically be saved to your subjects.
              </small>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary" htmlFor="task-deadline">
                Submission Deadline <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <FiCalendar size={16} />
                </span>
                <input
                  type="date"
                  id="task-deadline"
                  name="deadline"
                  className="form-control border-start-0 ps-1"
                  value={deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Priority and Status row */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary" htmlFor="task-priority">
                Priority Level
              </label>
              <select
                id="task-priority"
                name="priority"
                className="form-select"
                value={priority}
                onChange={handleChange}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority 🔥</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary" htmlFor="task-status">
                Initial Status
              </label>
              <select
                id="task-status"
                name="status"
                className="form-select"
                value={status}
                onChange={handleChange}
              >
                <option value="Pending">Pending (Not Started)</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top">
            <Link to="/tasks" className="btn btn-light rounded-pill px-4">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-gradient-primary rounded-pill px-4 d-flex align-items-center gap-2"
              disabled={isSubmitting}
              id="submit-add-task-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Saving Task...</span>
                </>
              ) : (
                <>
                  <FiPlusCircle size={18} />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
