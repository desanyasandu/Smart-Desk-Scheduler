import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

const Timetable = ({ data, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    activity: '',
    subject: '',
    time: '',
    day: 'Monday'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now()
    };

    let newTimetable;
    if (editingItem) {
      newTimetable = data.timetable.map(item => item.id === editingItem.id ? newItem : item);
    } else {
      newTimetable = [...data.timetable, newItem];
    }

    onUpdate({ ...data, timetable: newTimetable });
    closeModal();
  };

  const deleteItem = (id) => {
    const newTimetable = data.timetable.filter(item => item.id !== id);
    onUpdate({ ...data, timetable: newTimetable });
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({ activity: '', subject: '', time: '', day: 'Monday' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Timetable</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Organize your weekly activities and classes.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add Activity
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {days.map(day => {
          const dayItems = data.timetable.filter(item => item.day === day).sort((a, b) => a.time.localeCompare(b.time));
          return (
            <section key={day}>
              <h3 style={{ marginBottom: '20px', color: 'var(--accent-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                {day}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {dayItems.length > 0 ? dayItems.map(item => (
                  <div key={item.id} className="glass" style={{
                    padding: '20px',
                    borderRadius: '16px',
                    position: 'relative',
                    group: 'true'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '13px' }}>{item.time}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openModal(item)} style={{ color: 'var(--text-muted)' }}><Edit2 size={14} /></button>
                        <button onClick={() => deleteItem(item.id)} style={{ color: 'var(--accent-danger)' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px' }}>{item.activity}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{item.subject}</div>
                  </div>
                )) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '10px 0' }}>No activities planned.</div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass" 
              style={{
                width: '100%',
                maxWidth: '450px',
                padding: '32px',
                borderRadius: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>{editingItem ? 'Edit Activity' : 'Add New Activity'}</h2>
                <button onClick={closeModal}><X /></button>
              </div>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Activity Name</label>
                  <input 
                    required
                    value={formData.activity}
                    onChange={(e) => setFormData({...formData, activity: e.target.value})}
                    placeholder="e.g. Physics Lecture"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Subject / Category</label>
                  <input 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g. Academic"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Time</label>
                    <input 
                      required
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Day</label>
                    <select 
                      value={formData.day}
                      onChange={(e) => setFormData({...formData, day: e.target.value})}
                    >
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                  {editingItem ? 'Save Changes' : 'Create Activity'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timetable;
