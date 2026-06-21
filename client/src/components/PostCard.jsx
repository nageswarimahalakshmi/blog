import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pre-configured default fallback images based on common categories
  const getCoverImage = () => {
    if (post.coverImage && post.coverImage.trim() !== '') {
      return post.coverImage;
    }
    const cat = (post.category || 'general').toLowerCase();
    if (cat.includes('tech') || cat.includes('code') || cat.includes('dev')) {
      return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60';
    }
    if (cat.includes('design') || cat.includes('art')) {
      return 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=60';
    }
    if (cat.includes('travel') || cat.includes('life') || cat.includes('outdoor')) {
      return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=60';
    }
    if (cat.includes('food') || cat.includes('cook')) {
      return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=60';
    }
    // Default placeholder
    return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop&q=60';
  };

  return (
    <article className="card">
      <img src={getCoverImage()} alt={post.title} className="card-img" loading="lazy" />
      <div className="card-body">
        <span className="card-tag">{post.category || 'General'}</span>
        <h3 className="card-title">
          <Link to={`/post/${post._id}`}>{post.title}</Link>
        </h3>
        <p className="card-text">{post.summary}</p>
        
        <div className="card-meta">
          <span className="card-author">
            <User size={14} />
            {post.author?.username || 'Anonymous'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={14} />
            {formatDate(post.createdAt)}
          </span>
        </div>
        
        <div style={{ marginTop: '1.25rem' }}>
          <Link to={`/post/${post._id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            <span>Read Article</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
