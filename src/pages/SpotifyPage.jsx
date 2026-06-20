import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSpotify } from 'react-icons/fa';
import { useCollection, firestoreService } from '../hooks/useFirestore';
import FormModal from '../components/FormModal';
import toast from 'react-hot-toast';

const emptyForm = { id: '', title: '', order: 0 };

const SpotifyPage = () => {
  const { data: tracks, loading, refetch } = useCollection('spotify_tracks');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: tracks.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (track) => {
    setEditing(track._id);
    setForm({ id: track.id, title: track.title, order: track.order || 0 });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.id || !form.title) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await firestoreService.update('spotify_tracks', editing, form);
        toast.success('Track updated!');
      } else {
        await firestoreService.add('spotify_tracks', form);
        toast.success('Track added!');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (track) => {
    if (!window.confirm(`Delete "${track.title}"?`)) return;
    try {
      await firestoreService.remove('spotify_tracks', track._id);
      toast.success('Track deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="page-header page-header-actions">
        <div>
          <h1>Spotify Tracks</h1>
          <p>Manage your Spotify embeds</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <FaPlus /> Add Track
        </button>
      </div>

      {loading ? (
        <div className="loading-inline"><div className="loading-spinner" /><span>Loading tracks...</span></div>
      ) : tracks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FaSpotify /></div>
          <p>No Spotify tracks added yet</p>
          <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Your First Track</button>
        </div>
      ) : (
        <motion.div className="data-table-wrapper glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Spotify ID</th>
                <th>Title</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, i) => (
                <tr key={track._id}>
                  <td>{i + 1}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{track.id}</td>
                  <td><strong>{track.title}</strong></td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-icon btn-sm" onClick={() => openEdit(track)} title="Edit"><FaEdit /></button>
                      <button className="btn btn-icon btn-sm" onClick={() => handleDelete(track)} title="Delete" style={{ color: 'var(--danger)' }}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Track' : 'Add Spotify Track'} onSubmit={handleSave} loading={saving}>
        <div className="form-group">
          <label className="form-label">Spotify Track ID *</label>
          <input className="form-input" placeholder="e.g. 1SEM8M8RDyH8Qt5E5eTwMy" value={form.id} onChange={(e) => {
            let val = e.target.value;
            const match = val.match(/track\/([a-zA-Z0-9]{22})/);
            if (match) val = match[1];
            updateField('id', val);
          }} />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Paste a Spotify URL or track ID</small>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="Track title" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input className="form-input" type="number" value={form.order} onChange={(e) => updateField('order', parseInt(e.target.value) || 0)} />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default SpotifyPage;
