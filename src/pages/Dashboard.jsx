import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import EditTaskModal from '../components/EditTaskModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completedPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState('');

  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/tasks', {
        params: {
          search: searchQuery,
          status: statusFilter,
          page,
          limit,
        },
      });

      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
      setStats(response.data.stats);
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err.response?.data?.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const delayDebounce = setTimeout(() => {
        fetchTasks();
      }, 300);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery, statusFilter, page, user]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newTitle.trim()) {
      setFormError('Task title is required');
      return;
    }

    try {
      setAdding(true);
      await api.post('/tasks', {
        title: newTitle,
        description: newDesc,
      });

      setNewTitle('');
      setNewDesc('');
      fetchTasks();
    } catch (err) {
      console.error('Create task error:', err);
      setFormError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.error('Toggle status error:', err);
      setError('Failed to update task status');
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (taskId, updatedData) => {
    try {
      await api.put(`/tasks/${taskId}`, updatedData);
      fetchTasks();
    } catch (err) {
      console.error('Save edit error:', err);
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Delete task error:', err);
      setError('Failed to delete task');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="dashboard-loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-main">
        <header className="dashboard-welcome">
          <h2>Dashboard</h2>
          <p className="welcome-text">Manage your day-to-day internship and college tasks here.</p>
        </header>

        {error && <div className="error-alert">{error}</div>}

        <section className="metrics-grid">
          <div className="metric-card total">
            <div className="metric-header">
              <span className="metric-title">Total Tasks</span>
              <span className="metric-icon">📋</span>
            </div>
            <div className="metric-value">{stats.total}</div>
          </div>
          
          <div className="metric-card pending">
            <div className="metric-header">
              <span className="metric-title">Pending</span>
              <span className="metric-icon">⏳</span>
            </div>
            <div className="metric-value">{stats.pending}</div>
          </div>

          <div className="metric-card completed">
            <div className="metric-header">
              <span className="metric-title">Completed</span>
              <span className="metric-icon">✅</span>
            </div>
            <div className="metric-value">{stats.completed}</div>
          </div>

          <div className="metric-card progress-card">
            <div className="metric-header">
              <span className="metric-title">Completion Rate</span>
              <span className="metric-icon">📈</span>
            </div>
            <div className="metric-value">{stats.completedPercentage}%</div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${stats.completedPercentage}%` }}
              ></div>
            </div>
          </div>
        </section>

        <div className="dashboard-content-grid">
          
          <section className="add-task-section">
            <div className="content-card">
              <h3>Create New Task</h3>
              <form onSubmit={handleCreateTask} className="add-task-form">
                {formError && <div className="form-error-alert">{formError}</div>}
                
                <div className="form-group">
                  <label htmlFor="task-title">Task Title *</label>
                  <input
                    type="text"
                    id="task-title"
                    placeholder="Enter task title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    disabled={adding}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="task-desc">Description</label>
                  <textarea
                    id="task-desc"
                    placeholder="Enter task details (optional)..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows="3"
                    disabled={adding}
                  ></textarea>
                </div>

                <button type="submit" className="add-task-btn" disabled={adding}>
                  {adding ? 'Adding Task...' : 'Add Task'}
                </button>
              </form>
            </div>
          </section>

          <section className="task-list-section">
            <div className="content-card">
              
              <div className="task-controls">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search tasks by title..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="filter-box">
                  <label htmlFor="status-filter">Status:</label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={handleFilterChange}
                  >
                    <option value="All">All Tasks</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="list-loading">
                  <div className="spinner"></div>
                  <p>Fetching tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="empty-tasks-container">
                  <span className="empty-icon">📂</span>
                  <h4>No Tasks Found</h4>
                  <p>
                    {searchQuery || statusFilter !== 'All' 
                      ? 'No tasks match your search filters.' 
                      : 'You have not created any tasks yet. Write one on the left to start!'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="tasks-grid">
                    {tasks.map((task) => (
                      <div 
                        key={task._id} 
                        className={`task-item-card ${task.status === 'Completed' ? 'completed' : ''}`}
                      >
                        <div className="task-card-header">
                          <span className={`status-badge ${task.status.toLowerCase()}`}>
                            {task.status}
                          </span>
                          <span className="task-date">{formatDate(task.createdAt)}</span>
                        </div>

                        <h4 className="task-title">{task.title}</h4>
                        {task.description && (
                          <p className="task-description">{task.description}</p>
                        )}

                        <div className="task-card-footer">
                          <button
                            onClick={() => handleToggleStatus(task._id, task.status)}
                            className={`toggle-status-btn ${task.status.toLowerCase()}`}
                            title={task.status === 'Pending' ? 'Mark Completed' : 'Mark Pending'}
                          >
                            {task.status === 'Pending' ? 'Complete ✓' : 'Undo ↺'}
                          </button>

                          <div className="task-actions-btn-group">
                            <button
                              onClick={() => handleOpenEdit(task)}
                              className="edit-btn"
                              title="Edit Task"
                            >
                              Edit ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="delete-btn"
                              title="Delete Task"
                            >
                              Delete 🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="page-nav-btn"
                      >
                        &laquo; Prev
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`page-num-btn ${page === p ? 'active' : ''}`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="page-nav-btn"
                      >
                        Next &raquo;
                      </button>
                    </div>
                  )}
                </>
              )}

            </div>
          </section>

        </div>
      </main>

      <EditTaskModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Dashboard;
