import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiEdit2, 
  FiCheck, 
  FiAlertCircle, 
  FiBook, 
  FiPlus, 
  FiTrash2, 
  FiCheckCircle 
} from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Subjects state
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [subjectMsg, setSubjectMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load subjects
  const fetchSubjects = async () => {
    try {
      setSubjectLoading(true);
      const res = await api.get('/subjects');
      if (res.data && res.data.subjects) {
        setSubjects(res.data.subjects);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setSubjectLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Update profile handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    if (!name.trim() || !email.trim()) {
      setProfileMsg({ type: 'danger', text: 'Name and email are required.' });
      return;
    }

    setProfileSaving(true);
    const res = await updateProfile(name, email);
    setProfileSaving(false);

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditingProfile(false);
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 3500);
    } else {
      setProfileMsg({ type: 'danger', text: res.message });
    }
  };

  // Add subject handler
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    try {
      setSubjectMsg({ type: '', text: '' });
      const res = await api.post('/subjects', { name: newSubjectName.trim() });
      if (res.data && res.data.success) {
        setSubjects([...subjects, res.data.subject]);
        setNewSubjectName('');
        setSubjectMsg({ type: 'success', text: `Subject "${res.data.subject.name}" added successfully.` });
        setTimeout(() => setSubjectMsg({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setSubjectMsg({ type: 'danger', text: err.response?.data?.message || 'Error adding subject.' });
    }
  };

  // Update subject handler
  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    if (!editSubjectName.trim() || !editingSubject) return;

    try {
      const res = await api.put(`/subjects/${editingSubject._id}`, { name: editSubjectName.trim() });
      if (res.data && res.data.success) {
        setSubjects(subjects.map((s) => (s._id === editingSubject._id ? res.data.subject : s)));
        setEditingSubject(null);
        setEditSubjectName('');
        setSubjectMsg({ type: 'success', text: 'Subject updated successfully.' });
        setTimeout(() => setSubjectMsg({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating subject');
    }
  };

  // Delete subject handler
  const handleDeleteSubject = async (id, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete "${subjectName}"? Tasks using this subject will remain.`)) {
      return;
    }

    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(subjects.filter((s) => s._id !== id));
      setSubjectMsg({ type: 'success', text: `Subject "${subjectName}" deleted.` });
      setTimeout(() => setSubjectMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setSubjectMsg({ type: 'danger', text: 'Error deleting subject.' });
    }
  };

  const accountCreatedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="container-fluid px-3 px-md-4 py-4" style={{ maxWidth: '1000px' }}>
      <div className="mb-4">
        <h2 className="brand-font fw-bold text-dark mb-1">Student Profile & Settings</h2>
        <p className="text-secondary small mb-0">Manage your student credentials and academic subjects</p>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-12 col-lg-5">
          <div className="card modern-card p-4">
            <div className="text-center mb-4">
              <div 
                className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow mx-auto mb-3"
                style={{
                  width: '76px',
                  height: '76px',
                  fontSize: '2rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <h4 className="fw-bold text-dark mb-1">{user?.name || 'Student'}</h4>
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1">
                Student Account
              </span>
            </div>

            {profileMsg.text && (
              <div className={`alert alert-${profileMsg.type} d-flex align-items-center gap-2 py-2 px-3 rounded-3 small mb-3`}>
                {profileMsg.type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
                <div>{profileMsg.text}</div>
              </div>
            )}

            {!isEditingProfile ? (
              <div className="list-group list-group-flush border-top border-bottom py-2 mb-4">
                <div className="list-group-item d-flex align-items-center justify-content-between px-0 py-2 border-0">
                  <div className="d-flex align-items-center gap-2 text-secondary small">
                    <FiUser size={16} /> <span>Full Name</span>
                  </div>
                  <span className="fw-semibold text-dark">{user?.name}</span>
                </div>
                <div className="list-group-item d-flex align-items-center justify-content-between px-0 py-2 border-0">
                  <div className="d-flex align-items-center gap-2 text-secondary small">
                    <FiMail size={16} /> <span>Email</span>
                  </div>
                  <span className="fw-semibold text-dark">{user?.email}</span>
                </div>
                <div className="list-group-item d-flex align-items-center justify-content-between px-0 py-2 border-0">
                  <div className="d-flex align-items-center gap-2 text-secondary small">
                    <FiCalendar size={16} /> <span>Joined</span>
                  </div>
                  <span className="fw-semibold text-dark">{accountCreatedDate}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="mb-3">
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-light flex-fill rounded-pill"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setName(user.name);
                      setEmail(user.email);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary flex-fill rounded-pill"
                    disabled={profileSaving}
                  >
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="btn btn-outline-primary rounded-3 w-100 d-flex align-items-center justify-content-center gap-2"
                id="edit-profile-btn"
              >
                <FiEdit2 size={16} /> Edit Profile Info
              </button>
            )}
          </div>
        </div>

        {/* Subjects Management Section */}
        <div className="col-12 col-lg-7" id="subjects">
          <div className="card modern-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">Academic Subjects & Courses</h5>
                <p className="text-secondary small mb-0">Organize your assignments by subjects</p>
              </div>
              <span className="badge bg-light text-dark border px-3 py-1 rounded-pill">
                {subjects.length} Subjects
              </span>
            </div>

            {subjectMsg.text && (
              <div className={`alert alert-${subjectMsg.type} py-2 px-3 rounded-3 small mb-3`}>
                {subjectMsg.text}
              </div>
            )}

            {/* Add Subject Form */}
            <form onSubmit={handleAddSubject} className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <FiBook size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-1"
                  placeholder="e.g. Data Structures, DBMS, Java, DAA..."
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  id="new-subject-input"
                />
                <button
                  type="submit"
                  className="btn btn-gradient-primary d-flex align-items-center gap-1 px-3"
                  id="add-subject-btn"
                >
                  <FiPlus size={18} />
                  <span>Add Subject</span>
                </button>
              </div>
            </form>

            {/* Subject List */}
            {subjectLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                <span className="ms-2 text-muted small">Loading subjects...</span>
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-4 bg-light rounded-4">
                <FiBook className="text-secondary mb-2" size={32} />
                <p className="text-muted small mb-0">No subjects created yet. Add your courses above!</p>
              </div>
            ) : (
              <div className="list-group">
                {subjects.map((sub) => (
                  <div
                    key={sub._id}
                    className="list-group-item d-flex align-items-center justify-content-between py-3 px-3 rounded-3 mb-2 border"
                  >
                    {editingSubject?._id === sub._id ? (
                      <form onSubmit={handleUpdateSubject} className="d-flex align-items-center gap-2 w-100">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editSubjectName}
                          onChange={(e) => setEditSubjectName(e.target.value)}
                          autoFocus
                          required
                        />
                        <button type="submit" className="btn btn-sm btn-success rounded-circle p-2">
                          <FiCheck size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-light rounded-circle p-2"
                          onClick={() => setEditingSubject(null)}
                        >
                          ✕
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="d-flex align-items-center gap-2">
                          <div 
                            className="rounded-3 d-flex align-items-center justify-content-center bg-primary-subtle text-primary"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <FiBook size={16} />
                          </div>
                          <span className="fw-semibold text-dark">{sub.name}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingSubject(sub);
                              setEditSubjectName(sub.name);
                            }}
                            className="btn btn-sm btn-light text-primary p-2 rounded-circle"
                            title="Rename Subject"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(sub._id, sub.name)}
                            className="btn btn-sm btn-light text-danger p-2 rounded-circle"
                            title="Delete Subject"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
