import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaQuoteLeft, FaStar } from 'react-icons/fa';
import { useCollection, firestoreService } from '../hooks/useFirestore';
import FormModal from '../components/FormModal';
import toast from 'react-hot-toast';

const emptyForm = { name: '', role: '', text: '', stars: 5, order: 0 };

const TestimonialsPage = () => {
  const { data: testimonials, loading, refetch } = useCollection('testimonials');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: testimonials.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t._id);
    setForm({ name: t.name, role: t.role, text: t.text, stars: t.stars, order: t.order || 0 });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.text) {
      toast.error('Please fill in name and testimonial text');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await firestoreService.update('testimonials', editing, form);
        toast.success('Testimonial updated!');
      } else {
        await firestoreService.add('testimonials', form);
        toast.success('Testimonial added!');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete testimonial from "${t.name}"?`)) return;
    try {
      await firestoreService.remove('testimonials', t._id);
      toast.success('Testimonial deleted');
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
          <h1>Testimonials</h1>
          <p>Manage what people say about you</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Testimonial</button>
      </div>

      {loading ? (
        <div className="loading-inline"><div className="loading-spinner" /><span>Loading...</span></div>
      ) : testimonials.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FaQuoteLeft /></div>
          <p>No testimonials added yet</p>
          <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Your First Testimonial</button>
        </div>
      ) : (
        <motion.div className="data-table-wrapper glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Role</th>
                <th>Rating</th>
                <th>Text</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t, i) => (
                <tr key={t._id}>
                  <td>{i + 1}</td>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.role}</td>
                  <td>
                    <div className="stars">
                      {[...Array(t.stars || 5)].map((_, j) => <FaStar key={j} />)}
                    </div>
                  </td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-icon btn-sm" onClick={() => openEdit(t)} title="Edit"><FaEdit /></button>
                      <button className="btn btn-icon btn-sm" onClick={() => handleDelete(t)} title="Delete" style={{ color: 'var(--danger)' }}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} onSubmit={handleSave} loading={saving}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-input" placeholder="Person's name" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input className="form-input" placeholder="e.g. Worship Leader" value={form.role} onChange={(e) => updateField('role', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Testimonial Text *</label>
          <textarea className="form-textarea" placeholder="What they said about you..." value={form.text} onChange={(e) => updateField('text', e.target.value)} rows={4} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Stars (1-5)</label>
            <select className="form-select" value={form.stars} onChange={(e) => updateField('stars', parseInt(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
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

export default TestimonialsPage;
