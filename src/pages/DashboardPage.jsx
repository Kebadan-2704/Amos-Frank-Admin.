import { motion } from 'framer-motion';
import { FaYoutube, FaSpotify, FaQuoteLeft, FaNewspaper, FaMusic, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCollection } from '../hooks/useFirestore';

const DashboardPage = () => {
  const { data: videos, loading: vLoading } = useCollection('youtube_videos');
  const { data: spotify, loading: sLoading } = useCollection('spotify_tracks');
  const { data: testimonials, loading: tLoading } = useCollection('testimonials');
  const { data: news, loading: nLoading } = useCollection('latest_news');

  const stats = [
    {
      icon: <FaYoutube />,
      label: 'YouTube Videos',
      count: vLoading ? '...' : videos.length,
      color: '#ef4444',
      to: '/videos',
    },
    {
      icon: <FaSpotify />,
      label: 'Spotify Tracks',
      count: sLoading ? '...' : spotify.length,
      color: '#22c55e',
      to: '/spotify',
    },
    {
      icon: <FaQuoteLeft />,
      label: 'Testimonials',
      count: tLoading ? '...' : testimonials.length,
      color: '#a78bfa',
      to: '/testimonials',
    },
    {
      icon: <FaNewspaper />,
      label: 'News Items',
      count: nLoading ? '...' : news.length,
      color: '#60a5fa',
      to: '/news',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your portfolio content</p>
      </div>

      <motion.div
        className="stats-grid"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Link to={stat.to} style={{ textDecoration: 'none' }}>
              <div className="stat-card">
                <div
                  className="stat-card-icon"
                  style={{ background: `${stat.color}18`, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div className="stat-card-number">{stat.count}</div>
                <div className="stat-card-label">{stat.label}</div>
                <div className="stat-card-glow" style={{ background: stat.color }} />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ marginTop: 12 }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 16, fontSize: '1.1rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/videos" className="btn btn-secondary">
            <FaYoutube /> Manage Videos
          </Link>
          <Link to="/artist" className="btn btn-secondary">
            <FaMusic /> Edit Artist Info
          </Link>
          <a
            href="https://amosfrank.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <FaExternalLinkAlt /> View Live Site
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
