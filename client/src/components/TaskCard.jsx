import React from 'react';
import { 
  FiCalendar, 
  FiBook, 
  FiEdit2, 
  FiTrash2, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle 
} from 'react-icons/fi';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { _id, title, description, subject, priority, status, deadline } = task;

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const isOverdue = deadlineDate < now && status !== 'Completed';

  // Format date readable
  const formattedDate = deadlineDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Priority CSS classes
  const getPriorityBadgeClass = (p) => {
    switch (p) {
      case 'High':
        return 'badge-priority-high';
      case 'Low':
        return 'badge-priority-low';
      default:
        return 'badge-priority-medium';
    }
  };

  // Status CSS classes
  const getStatusBadgeClass = (s) => {
    switch (s) {
      case 'Completed':
        return 'badge-status-completed';
      case 'In Progress':
        return 'badge-status-in-progress';
      default:
        return 'badge-status-pending';
    }
  };

  const getPriorityCardClass = (p) => {
    switch (p) {
      case 'High':
        return 'priority-high';
      case 'Low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  return (
    <div className={`card task-card ${getPriorityCardClass(priority)} p-4 mb-3`} id={`task-card-${_id}`}>
      {/* Top Header: Subject & Badges */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-primary border border-primary-subtle px-2 py-1 rounded-pill d-flex align-items-center gap-1">
            <FiBook size={12} /> {subject}
          </span>
          <span className={`badge px-2 py-1 rounded-pill ${getPriorityBadgeClass(priority)}`}>
            {priority} Priority
          </span>
        </div>
        <span className={`badge px-2 py-1 rounded-pill ${getStatusBadgeClass(status)}`}>
          {status}
        </span>
      </div>

      {/* Task Title */}
      <h5 className={`card-title fw-bold text-dark mb-2 ${status === 'Completed' ? 'text-decoration-line-through text-muted' : ''}`}>
        {title}
      </h5>

      {/* Task Description */}
      {description && (
        <p className="card-text text-secondary mb-3 small" style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
          {description}
        </p>
      )}

      {/* Deadline Info */}
      <div className="d-flex align-items-center gap-2 mb-3 mt-auto">
        <span className={`small fw-semibold d-flex align-items-center gap-1 ${isOverdue ? 'text-danger' : 'text-muted'}`}>
          {isOverdue ? <FiAlertCircle size={14} /> : <FiClock size={14} />}
          Deadline: {formattedDate}
          {isOverdue && <span className="badge bg-danger-subtle text-danger ms-1">Overdue</span>}
        </span>
      </div>

      {/* Bottom Actions Bar */}
      <div className="d-flex align-items-center justify-content-between pt-3 border-top gap-2 flex-wrap">
        <div>
          {status !== 'Completed' ? (
            <button
              onClick={() => onStatusChange(_id, 'Completed')}
              className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 d-flex align-items-center gap-1"
              title="Mark as Completed"
              id={`complete-task-${_id}`}
            >
              <FiCheckCircle size={14} /> Mark Complete
            </button>
          ) : (
            <button
              onClick={() => onStatusChange(_id, 'In Progress')}
              className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 d-flex align-items-center gap-1"
              title="Reopen Task"
              id={`reopen-task-${_id}`}
            >
              <FiClock size={14} /> Reopen
            </button>
          )}
        </div>

        <div className="d-flex align-items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="btn btn-sm btn-light text-primary p-2 rounded-circle"
            title="Edit Task"
            aria-label="Edit Task"
            id={`edit-task-${_id}`}
          >
            <FiEdit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(_id, title)}
            className="btn btn-sm btn-light text-danger p-2 rounded-circle"
            title="Delete Task"
            aria-label="Delete Task"
            id={`delete-task-${_id}`}
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
