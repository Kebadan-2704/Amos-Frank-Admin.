import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaNewspaper } from 'react-icons/fa';
import { useCollection, firestoreService } from '../hooks/useFirestore';
import FormModal from '../components/FormModal';
import toast from 'react-hot-toast';

const emptyForm = { date: '', title: '', description: '', type: 'release', order: 0 };

const NewsPage = () => {
  const { data: news, loading, refetch } = useCollection('latest_news');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: news.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ date: item.date, title: item.title, description: item.description, type: item.type, order: item.order || 0 });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      toast.error('Please fill in title and description');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await firestoreService.update('latest_news', editing, form);
        toast.success('News updated!');
      } else {
        await firestoreService.add('latest_news', form);
        toast.success('News added!');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await firestoreService.remove('latest_news', item._id);
      toast.success('News deleted');
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
          <h1>Latest News</h1>
          <p>Manage your news and announcements</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add News</button>
      </div>

      {loading ? (
        <div className="loading-inline"><div className="loading-spinner" /><span>Loading...</span></div>
      ) : news.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FaNewspaper /></div>
          <p>No news items added yet</p>
          <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Your First News</button>
        </div>
      ) : (
        <motion.div className="data-table-wrapper glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date Label</th>
                <th>Title</th>
                <th>Type</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{item.date}</td>
                  <td><strong>{item.title}</strong></td>
                  <td><span className={`badge badge-${item.type}`}>{item.type}</span></td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-icon btn-sm" onClick={() => openEdit(item)} title="Edit"><FaEdit /></button>
                      <button className="btn btn-icon btn-sm" onClick={() => handleDelete(item)} title="Delete" style={{ color: 'var(--danger)' }}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit News' : 'Add News Item'} onSubmit={handleSave} loading={saving}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date Label</label>
            <input className="form-input" placeholder="e.g. Recent Release" value={form.date} onChange={(e) => updateField('date', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={(e) => updateField('type', e.target.value)}>
              <option value="release">Release</option>
              <option value="video">Video</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" placeholder="News headline" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-textarea" placeholder="Describe the news..." value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={3} />
        </div>
        <div className="form-group">
          <label className="form-label">Display Order</label>
          <input className="form-input" type="number" value={form.order} onChange={(e) => updateField('order', parseInt(e.target.value) || 0)} />
        </div>
      </FormModal>
    </div>
  );
};

export default NewsPage;
