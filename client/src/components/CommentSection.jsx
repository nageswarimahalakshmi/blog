import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Trash2, MessageSquare, Send, AlertCircle } from 'lucide-react';

const CommentSection = ({ postId, postAuthorId }) => {
  const { user, authFetch } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/comments/post/${postId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Could not fetch comments');
      }
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitLoading(true);
      setError('');
      const res = await authFetch(`/comments/post/${postId}`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to post comment');
      }
      setContent('');
      // Prepend or append. Append is standard chronologically
      setComments([...comments, data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await authFetch(`/comments/${commentId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete comment');
      }
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comments-container">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <MessageSquare size={22} className="text-gradient" />
        <span>Discussion ({comments.length})</span>
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-group" style={{ position: 'relative' }}>
            <textarea
              className="form-control"
              placeholder="Join the conversation..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="3"
              style={{ paddingRight: '3.5rem', minHeight: '80px' }}
              disabled={submitLoading}
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{
                position: 'absolute',
                right: '0.5rem',
                bottom: '0.5rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px'
              }}
              disabled={submitLoading || !content.trim()}
            >
              {submitLoading ? '...' : <Send size={16} />}
            </button>
          </div>
        </form>
      ) : (
        <div className="alert alert-error" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
          <AlertCircle size={18} />
          <span>Please <a href="/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>login</a> to share your thoughts.</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="loader-container" style={{ minHeight: '100px' }}>
          <div className="loader" style={{ width: '32px', height: '32px' }}></div>
        </div>
      ) : comments.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => {
            const isCommentAuthor = user && user._id === comment.author?._id;
            const isPostAuthor = user && user._id === postAuthorId;
            const canDelete = isCommentAuthor || isPostAuthor;

            return (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-user">
                    <div className="comment-avatar">
                      {comment.author?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span>{comment.author?.username || 'Deleted User'}</span>
                    {isPostAuthor && comment.author?._id === postAuthorId && (
                      <span className="card-tag" style={{ fontSize: '0.65rem', margin: 0, padding: '0.05rem 0.4rem' }}>
                        Author
                      </span>
                    )}
                  </div>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                <div className="comment-text">
                  {comment.content}
                </div>
                {canDelete && (
                  <div className="comment-actions">
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="theme-btn"
                      title="Delete Comment"
                      style={{ color: 'var(--error)', padding: '0.25rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
