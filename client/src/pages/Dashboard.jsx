import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit3, PlusCircle, LayoutDashboard, FileText, Calendar, Compass, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { user, authFetch, loading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`http://localhost:5000/api/posts?author=${user._id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Could not fetch dashboard data');
      }
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await authFetch(`/posts/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutDashboard size={28} className="text-gradient" />
          <span className="text-gradient">Creator Dashboard</span>
        </h1>
        <Link to="/create" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>New Article</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', height: '100px' }}>
          <div className="comment-avatar" style={{ width: '48px', height: '48px', fontSize: '1.25rem', flexShrink: 0 }}>
            <FileText size={22} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Published Articles</h4>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{posts.length}</h2>
          </div>
        </div>
      </div>

      {/* Articles List Table */}
      <div className="card" style={{ padding: '1.5rem 2rem', overflowX: 'auto' }}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Manage Your Articles</h3>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            <FileText size={40} style={{ strokeWidth: 1.5, marginBottom: '0.75rem', color: 'var(--text-muted)' }} />
            <p>You haven't written any articles yet.</p>
            <Link to="/create" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: '0.5rem', textDecoration: 'underline' }}>
              Create your first post now <ExternalLink size={14} />
            </Link>
          </div>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td style={{ fontWeight: 600 }}>
                    <Link to={`/post/${post._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', hover: { color: 'var(--accent-primary)' } }} className="nav-link">
                      {post.title} <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
                    </Link>
                  </td>
                  <td>
                    <span className="card-tag" style={{ margin: 0, fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                      {post.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <Calendar size={14} /> {formatDate(post.createdAt)}
                    </span>
                  </td>
                  <td>
                    <div className="dashboard-actions">
                      <Link to={`/edit/${post._id}`} className="btn btn-secondary btn-sm" title="Edit Article">
                        <Edit3 size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id, post.title)}
                        className="btn btn-danger btn-sm"
                        title="Delete Article"
                        style={{ padding: '0.4rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
