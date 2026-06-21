import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PenTool, Image, BookOpen, AlertCircle, Save, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['General', 'Technology', 'Design', 'Travel', 'Food'];

const CreateEditPost = () => {
  const { id } = useParams(); // Exists if in editing mode
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { user, authFetch, loading: authLoading } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [coverImage, setCoverImage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  // Protect page
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Load existing post if in edit mode
  useEffect(() => {
    if (isEditMode && user) {
      fetchPostToEdit();
    }
  }, [id, user]);

  const fetchPostToEdit = async () => {
    try {
      setFetchLoading(true);
      setError('');
      const res = await fetch(`http://localhost:5000/api/posts/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch article details');
      }

      // Check authorization
      if (data.author?._id !== user._id) {
        throw new Error('Not authorized to edit this article');
      }

      setTitle(data.title);
      setSummary(data.summary);
      setContent(data.content);
      setCategory(data.category);
      setCoverImage(data.coverImage || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary || !content) {
      return setError('Please fill in all required fields');
    }

    try {
      setLoading(true);
      setError('');

      const postData = {
        title,
        summary,
        content,
        category,
        coverImage,
      };

      const url = isEditMode ? `/posts/${id}` : '/posts';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save post');
      }

      navigate(`/post/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', animation: 'fadeIn 0.6s ease-out' }}>
      {/* Back link */}
      <Link 
        to={isEditMode ? `/post/${id}` : '/'} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 500 }} 
        className="nav-link"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PenTool size={32} className="text-gradient" />
          <span className="text-gradient">{isEditMode ? 'Edit Article' : 'Create New Article'}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isEditMode ? 'Modify and publish updates for your blog post' : 'Draft a new blog post and publish it to the platform'}
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
        <div className="form-group">
          <label className="form-label">Title <span style={{ color: 'var(--error)' }}>*</span></label>
          <input
            type="text"
            className="form-control"
            placeholder="A Catchy and Engaging Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={14} /> Category
            </label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Image size={14} /> Cover Image URL
            </label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/photo-..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Brief Summary <span style={{ color: 'var(--error)' }}>*</span></label>
          <textarea
            className="form-control"
            placeholder="A short snippet (1-2 sentences) describing this article on the feed card..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows="2"
            maxLength="200"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content (Supports simple Markdown) <span style={{ color: 'var(--error)' }}>*</span></label>
          <textarea
            className="form-control"
            placeholder="Write your article body here...
- Use ## for Section Headers
- Use - for bullet points
- Use > for quotes"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            required
            disabled={loading}
            style={{ minHeight: '280px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <Link to={isEditMode ? `/post/${id}` : '/'} className="btn btn-secondary" style={{ pointerEvents: loading ? 'none' : 'auto' }}>
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} />
            <span>{loading ? 'Saving...' : 'Publish Article'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPost;
