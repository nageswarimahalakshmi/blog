import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, LogOut, BookOpen, PlusCircle, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <BookOpen className="text-gradient" size={28} />
          <span className="text-gradient">AntigravityBlog</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <LayoutDashboard size={16} /> Dashboard
                </span>
              </Link>
              
              <Link to="/create" className="btn btn-primary btn-sm">
                <PlusCircle size={16} />
                <span>Write Post</span>
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <User size={16} />
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{user.username}</span>
                </div>
                <button onClick={handleLogout} className="theme-btn" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}

          <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle theme" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
