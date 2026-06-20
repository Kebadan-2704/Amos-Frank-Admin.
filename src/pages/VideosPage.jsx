import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaYoutube, FaStar } from 'react-icons/fa';
import { useCollection, useDocument, firestoreService } from '../hooks/useFirestore';
import FormModal from '../components/FormModal';
import toast from 'react-hot-toast';

const emptyForm = { id: '', title: '', artist: '', category: 'original', order: 0 };

const VideosPage = () => {
  const { data: videos, loading, refetch } = useCollection('youtube_videos');
  const { data: settings, refetch: refetchSettings } = useDocument('site_settings', 'general');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: videos.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (video) => {
    setEditing(video._id);
    setForm({
      id: video.id,
      title: video.title,
      artist: video.artist,
      category: video.category,
      order: video.order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.id || !form.title || !form.artist) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await firestoreService.update('youtube_videos', editing, form);
        toast.success('Video updated!');
      } else {
        await firestoreService.add('youtube_videos', form);
        toast.success('Video added!');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (video) => {
    if (!window.confirm(`Delete "${video.title}"?`)) return;
    try {
      await firestoreService.remove('youtube_videos', video._id);
      toast.success('Video deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const setFeatured = async (videoId) => {
    try {
      await firestoreService.set('site_settings', 'general', { featuredVideoId: videoId });
      toast.success('Featured video updated!');
      refetchSettings();
    } catch (err) {
      toast.error('Failed to update featured video');
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="page-header page-header-actions">
        <div>
          <h1>YouTube Videos</h1>
          <p>Manage your YouTube video collection</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <FaPlus /> Add Video
        </button>
      </div>

      {loading ? (
        <div className="loading-inline">
          <div className="loading-spinner" />
          <span>Loading videos...</span>
        </div>
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FaYoutube /></div>
          <p>No videos added yet</p>
          <button className="btn btn-primary" onClick={openAdd}>
            <FaPlus /> Add Your First Video
          </button>
        </div>
      ) : (
        <motion.div
          className="data-table-wrapper glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Category</th>
                <th>Featured</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, i) => (
                <tr key={video._id}>
                  <td>{i + 1}</td>
                  <td>
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt={video.title}
                      className="thumbnail-preview"
                    />
                  </td>
                  <td><strong>{video.title}</strong></td>
                  <td>{video.artist}</td>
                  <td>
                    <span className={`badge badge-${video.category}`}>
                      {video.category}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-icon btn-sm ${settings?.featuredVideoId === video.id ? 'featured-active' : ''}`}
                      onClick={() => setFeatured(video.id)}
                      title="Set as featured"
                      style={settings?.featuredVideoId === video.id ? { color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)' } : {}}
                    >
                      <FaStar />
                    </button>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-icon btn-sm" onClick={() => openEdit(video)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="btn btn-icon btn-sm" onClick={() => handleDelete(video)} title="Delete" style={{ color: 'var(--danger)' }}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Video' : 'Add New Video'}
        onSubmit={handleSave}
        loading={saving}
      >
        <div className="form-group">
          <label className="form-label">YouTube Video ID *</label>
          <input
            className="form-input"
            placeholder="e.g. dQw4w9WgXcQ or full YouTube URL"
            value={form.id}
            onChange={(e) => {
              let val = e.target.value;
              // Extract ID from YouTube URL if pasted
              const match = val.match(/(?:youtu\.be\/|v=|live\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/);
              if (match) val = match[1];
              updateField('id', val);
            }}
          />
          {form.id && (
            <img
              src={`https://img.youtube.com/vi/${form.id}/mqdefault.jpg`}
              alt="Preview"
              style={{ marginTop: 8, borderRadius: 8, maxWidth: '100%', height: 'auto' }}
            />
          )}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="Song title" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Artist *</label>
            <input className="form-input" placeholder="Artist name" value={form.artist} onChange={(e) => updateField('artist', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => updateField('category', e.target.value)}>
              <option value="original">Original</option>
              <option value="cover">Cover</option>
              <option value="featured">Featured</option>
            </select>
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

export default VideosPage;
