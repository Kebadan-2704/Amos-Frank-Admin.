import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaCog, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaMusic, FaChartBar } from 'react-icons/fa';
import { useDocument, firestoreService } from '../hooks/useFirestore';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { data: settings, loading, refetch } = useDocument('site_settings', 'general');
  const [form, setForm] = useState({
    email: '',
    phone: '',
    location: '',
    instagram: '',
    musikHub: '',
    tracks: 29,
    videos: 26,
    spotifyTracks: 3,
    yearsPerforming: 11,
    yearsActive: 20,
    featuredVideoId: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        email: settings.email || '',
        phone: settings.phone || '',
        location: settings.location || '',
        instagram: settings.instagram || '',
        musikHub: settings.musikHub || '',
        tracks: settings.tracks ?? 29,
        videos: settings.videos ?? 26,
        spotifyTracks: settings.spotifyTracks ?? 3,
        yearsPerforming: settings.yearsPerforming ?? 11,
        yearsActive: settings.yearsActive ?? 20,
        featuredVideoId: settings.featuredVideoId || '',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await firestoreService.set('site_settings', 'general', {
        ...form,
        tracks: parseInt(form.tracks) || 0,
        videos: parseInt(form.videos) || 0,
        spotifyTracks: parseInt(form.spotifyTracks) || 0,
        yearsPerforming: parseInt(form.yearsPerforming) || 0,
        yearsActive: parseInt(form.yearsActive) || 0,
      });
      toast.success('Settings saved!');
      refetch();
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  if (loading) {
    return <div className="loading-inline"><div className="loading-spinner" /><span>Loading settings...</span></div>;
  }

  return (
    <div>
      <div className="page-header page-header-actions">
        <div>
          <h1>Settings</h1>
          <p>Contact info, social links, and stats</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Contact Info */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>
          <FaEnvelope style={{ marginRight: 8, opacity: 0.5 }} /> Contact Info
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label"><FaEnvelope style={{ marginRight: 4 }} /> Email</label>
            <input className="form-input" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label"><FaPhone style={{ marginRight: 4 }} /> Phone</label>
            <input className="form-input" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label"><FaMapMarkerAlt style={{ marginRight: 4 }} /> Location</label>
          <input className="form-input" value={form.location} onChange={(e) => updateField('location', e.target.value)} />
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>
          <FaInstagram style={{ marginRight: 8, opacity: 0.5 }} /> Social Links
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Instagram URL</label>
            <input className="form-input" value={form.instagram} onChange={(e) => updateField('instagram', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Musik Hub Instagram URL</label>
            <input className="form-input" value={form.musikHub} onChange={(e) => updateField('musikHub', e.target.value)} />
          </div>
        </div>
      </motion.div>

      {/* Stats Numbers */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>
          <FaChartBar style={{ marginRight: 8, opacity: 0.5 }} /> Stats Numbers
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Original Tracks</label>
            <input className="form-input" type="number" value={form.tracks} onChange={(e) => updateField('tracks', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Music Videos</label>
            <input className="form-input" type="number" value={form.videos} onChange={(e) => updateField('videos', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Spotify Tracks</label>
            <input className="form-input" type="number" value={form.spotifyTracks} onChange={(e) => updateField('spotifyTracks', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Years Performing</label>
            <input className="form-input" type="number" value={form.yearsPerforming} onChange={(e) => updateField('yearsPerforming', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Years in Music</label>
            <input className="form-input" type="number" value={form.yearsActive} onChange={(e) => updateField('yearsActive', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label"><FaMusic style={{ marginRight: 4 }} /> Featured Video ID</label>
            <input className="form-input" placeholder="YouTube video ID" value={form.featuredVideoId} onChange={(e) => updateField('featuredVideoId', e.target.value)} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
