import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  FaHome,
  FaYoutube,
  FaSpotify,
  FaUser,
  FaQuoteLeft,
  FaNewspaper,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: <FaHome />, label: 'Dashboard' },
  { to: '/videos', icon: <FaYoutube />, label: 'YouTube Videos' },
  { to: '/spotify', icon: <FaSpotify />, label: 'Spotify Tracks' },
  { to: '/artist', icon: <FaUser />, label: 'Artist Info' },
  { to: '/testimonials', icon: <FaQuoteLeft />, label: 'Testimonials' },
  { to: '/news', icon: <FaNewspaper />, label: 'Latest News' },
  { to: '/settings', icon: <FaCog />, label: 'Settings' },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <motion.aside
        className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">AF</div>
          <div>
            <div className="sidebar-logo-title">Amos Frank</div>
            <div className="sidebar-logo-subtitle">Admin Panel</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-link-icon"><FaSignOutAlt /></span>
            <span className="sidebar-link-label">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
