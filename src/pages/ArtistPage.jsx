import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaUser } from 'react-icons/fa';
import { useDocument, firestoreService } from '../hooks/useFirestore';
import ImageUpload from '../components/ImageUpload';
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
        <div className="form-group-full">
          <div className="card-header" style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
            <h3 className="card-title">Photo Uploads</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Upload new images directly from your device, or paste an existing link.
            </p>
          </div>
          <div className="form-row" style={{ gap: '1.5rem' }}>
            <ImageUpload
              label="Hero Photo (Main Banner)"
              value={form.heroPhoto}
              onChange={(val) => updateField('heroPhoto', val)}
            />
            <ImageUpload
              label="About Photo (Live on Stage)"
              value={form.aboutPhoto}
              onChange={(val) => updateField('aboutPhoto', val)}
            />
            <ImageUpload
              label="Bass Photo"
              value={form.bassPhoto}
              onChange={(val) => updateField('bassPhoto', val)}
            />
            <ImageUpload
              label="Keys Photo"
              value={form.keysPhoto}
              onChange={(val) => updateField('keysPhoto', val)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArtistPage;
