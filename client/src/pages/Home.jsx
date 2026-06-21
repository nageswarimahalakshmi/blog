import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Search, Compass, BookOpen, AlertCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Design', 'Travel', 'Food', 'General'];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, [category]); // Re-fetch on category changes

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      let url = 'http://localhost:5000/api/posts';
      const params = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (category && category !== 'All') params.push(`category=${encodeURIComponent(category)}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      {/* Hero Section */}
      <section className="hero">
        <h1 className="text-gradient">Share Your Stories. Inspire the World.</h1>
        <p>Explore articles, code tutorials, and design principles authored by creators across the globe.</p>
      </section>

      {/* Search & Category Filter Section */}
      <div className="search-bar-container">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-control"
            placeholder="Search by title, summary, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Compass size={18} />
            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Category:</span>
          </div>
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ margin: '2rem 0' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '4rem 0', color: 'var(--text-secondary)' }}>
          <BookOpen size={48} style={{ strokeWidth: 1.5, marginBottom: '1rem', color: 'var(--text-muted)' }} />
          <h3>No articles found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Try refining your search keyword or switching categories.
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
