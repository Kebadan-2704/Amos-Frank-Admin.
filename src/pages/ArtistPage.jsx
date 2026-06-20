import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaUser } from 'react-icons/fa';
import { useDocument, firestoreService } from '../hooks/useFirestore';
import toast from 'react-hot-toast';

const ArtistPage = () => {
  const { data: artist, loading, refetch } = useDocument('artist_info', 'profile');
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    role: '',
    roles: '',
    bio: '',
    bioExtended: '',
    heroPhoto: '/amos-hero.jpg',
    aboutPhoto: '/amos-stage-bw.jpg',
    bassPhoto: '/amos-bass.jpg',
    keysPhoto: '/amos-keys.jpg',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (artist) {
      setForm({
        name: artist.name || '',
        tagline: artist.tagline || '',
        role: artist.role || '',
        roles: Array.isArray(artist.roles) ? artist.roles.join(', ') : (artist.roles || ''),
        bio: artist.bio || '',
        bioExtended: artist.bioExtended || '',
        heroPhoto: artist.heroPhoto || '/amos-hero.jpg',
        aboutPhoto: artist.aboutPhoto || '/amos-stage-bw.jpg',
        bassPhoto: artist.bassPhoto || '/amos-bass.jpg',
        keysPhoto: artist.keysPhoto || '/amos-keys.jpg',
      });
    }
  }, [artist]);

  const handleSave = async () => {
    if (!form.name) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      await firestoreService.set('artist_info', 'profile', {
        ...form,
        roles: form.roles.split(',').map((r) => r.trim()).filter(Boolean),
      });
      toast.success('Artist info saved!');
      refetch();
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  if (loading) {
    return <div className="loading-inline"><div className="loading-spinner" /><span>Loading artist info...</span></div>;
  }

  return (
    <div>
      <div className="page-header page-header-actions">
        <div>
          <h1>Artist Info</h1>
          <p>Edit your profile, bio, and photos</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>
          <FaUser style={{ marginRight: 8, opacity: 0.5 }} /> Profile
        </h3>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input className="form-input" placeholder="e.g. Teacher, Guitarist & Music Producer" value={form.tagline} onChange={(e) => updateField('tagline', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Primary Role</label>
            <input className="form-input" placeholder="e.g. Teacher" value={form.role} onChange={(e) => updateField('role', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Animated Roles (comma-separated)</label>
            <input className="form-input" placeholder="Music Producer, Performer, Teacher" value={form.roles} onChange={(e) => updateField('roles', e.target.value)} />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>These cycle in the hero type animation</small>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Bio (Main)</label>
          <textarea className="form-textarea" value={form.bio} onChange={(e) => updateField('bio', e.target.value)} rows={5} />
        </div>

        <div className="form-group">
          <label className="form-label">Bio (Extended)</label>
          <textarea className="form-textarea" value={form.bioExtended} onChange={(e) => updateField('bioExtended', e.target.value)} rows={4} />
        </div>
      </motion.div>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>Photo Paths</h3>
        <small style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 16 }}>
          These are paths to images in the portfolio's /public folder (e.g., /amos-hero.jpg)
        </small>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hero Photo</label>
            <input className="form-input" value={form.heroPhoto} onChange={(e) => updateField('heroPhoto', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">About Photo</label>
            <input className="form-input" value={form.aboutPhoto} onChange={(e) => updateField('aboutPhoto', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Bass Photo</label>
            <input className="form-input" value={form.bassPhoto} onChange={(e) => updateField('bassPhoto', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Keys Photo</label>
            <input className="form-input" value={form.keysPhoto} onChange={(e) => updateField('keysPhoto', e.target.value)} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArtistPage;
