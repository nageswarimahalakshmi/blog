import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import { Calendar, User, Edit3, Trash2, ArrowLeft, AlertCircle, Compass } from 'lucide-react';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`http://localhost:5000/api/posts/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Could not fetch post details');
      }
      setPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('WARNING: This will permanently delete this post and all associated comments. Proceed?')) return;

    try {
      const res = await authFetch(`/posts/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCoverImage = () => {
    if (post.coverImage && post.coverImage.trim() !== '') {
      return post.coverImage;
    }
    const cat = (post.category || 'general').toLowerCase();
    if (cat.includes('tech') || cat.includes('code') || cat.includes('dev')) {
      return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80';
    }
    if (cat.includes('design') || cat.includes('art')) {
      return 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&auto=format&fit=crop&q=80';
    }
    if (cat.includes('travel') || cat.includes('life') || cat.includes('outdoor')) {
      return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80';
    }
    if (cat.includes('food') || cat.includes('cook')) {
      return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&auto=format&fit=crop&q=80';
  };

  // Helper function to render text content with simple formatting
  const renderContent = (content) => {
    if (!content) return null;
    
    // Split into paragraphs by double newlines
    const blocks = content.split('\n\n');
    
    return blocks.map((block, idx) => {
      // Check if it's a heading
      if (block.startsWith('### ')) {
        return <h3 key={idx} style={{ fontSize: '1.4rem', margin: '1.5rem 0 0.5rem 0' }}>{block.replace('### ', '')}</h3>;
      }
      if (block.startsWith('## ')) {
        return <h2 key={idx} style={{ fontSize: '1.8rem', margin: '2rem 0 1rem 0' }}>{block.replace('## ', '')}</h2>;
      }
      if (block.startsWith('# ')) {
        return <h1 key={idx} style={{ fontSize: '2.2rem', margin: '2.5rem 0 1rem 0' }}>{block.replace('# ', '')}</h1>;
      }
      
      // Check if it's a blockquote
      if (block.startsWith('> ')) {
        return <blockquote key={idx}>{block.replace('> ', '')}</blockquote>;
      }
      
      // Check if it's a list
      if (block.startsWith('- ') || block.startsWith('* ')) {
        const items = block.split('\n');
        return (
          <ul key={idx} style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^[-*]\s+/, '')}</li>
            ))}
          </ul>
        );
      }

      // Default paragraph, replace single newlines with <br/>
      const lines = block.split('\n');
      return (
        <p key={idx}>
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <AlertCircle size={48} style={{ color: 'var(--error)', marginBottom: '1rem' }} />
        <h2>Error Loading Article</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>{error || 'Article not found.'}</p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  const isAuthor = user && user._id === post.author?._id;

  return (
    <article className="container" style={{ maxWidth: '900px', animation: 'fadeIn 0.6s ease-out' }}>
      {/* Back button */}
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 500 }} className="nav-link">
        <ArrowLeft size={16} /> Back to articles
      </Link>

      {/* Header */}
      <header className="post-header">
        <div style={{ display: 'inline-block', marginBottom: '1rem' }} className="card-tag">
          {post.category}
        </div>
        <h1>{post.title}</h1>
        
        <div className="post-meta-details">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} />
            By <strong style={{ color: 'var(--text-primary)' }}>{post.author?.username || 'Anonymous'}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} />
            {formatDate(post.createdAt)}
          </span>
        </div>

        {isAuthor && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <Link to={`/edit/${post._id}`} className="btn btn-secondary btn-sm">
              <Edit3 size={14} /> Edit Post
            </Link>
            <button onClick={handleDeletePost} className="btn btn-danger btn-sm">
              <Trash2 size={14} /> Delete Post
            </button>
          </div>
        )}
      </header>

      {/* Cover Image */}
      <img src={getCoverImage()} alt={post.title} className="post-cover-img" />

      {/* Content */}
      <div className="post-content">
        <p style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-secondary)', borderLeft: '4px solid var(--accent-secondary)', paddingLeft: '1rem', marginBottom: '2rem' }}>
          {post.summary}
        </p>
        {renderContent(post.content)}
      </div>

      {/* Comment Section */}
      <CommentSection postId={post._id} postAuthorId={post.author?._id} />
    </article>
  );
};

export default PostDetails;
