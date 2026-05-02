import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Search, Filter, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const TaskManager = ({ data, onUpdate, notify }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [formData, setFormData] = useState({
    name: '',
    deadline: '',
    priority: 'Medium',
  });

  const addTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    onUpdate({ ...data, tasks: [...data.tasks, newTask] });
    notify('Task Added', `New task "${newTask.name}" has been created.`);
    setShowModal(false);
    setFormData({ name: '', deadline: '', priority: 'Medium' });
  };

  const toggleTask = (id) => {
    const newTasks = data.tasks.map(t => {
      if (t.id === id) {
        const isCompleting = t.status === 'pending';
        if (isCompleting) {
          notify('Task Completed', `Great job! You've finished "${t.name}".`);
        }
        return { 
          ...t, 
          status: isCompleting ? 'completed' : 'pending',
          completion_date: isCompleting ? format(new Date(), 'yyyy-MM-dd') : null
        };
      }
      return t;
    });
    onUpdate({ ...data, tasks: newTasks });
  };

  const deleteTask = (id) => {
    onUpdate({ ...data, tasks: data.tasks.filter(t => t.id !== id) });
  };

  const filteredTasks = data.tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || (filterStatus === 'Pending' ? t.status === 'pending' : t.status === 'completed');
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const priorities = ['Low', 'Medium', 'High'];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Task Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your progress and stay productive.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> New Task
        </button>
      </header>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
          <input 
            placeholder="Search tasks..." 
            style={{ paddingLeft: '40px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select style={{ width: '150px' }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="All">All Priorities</option>
          {priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select style={{ width: '150px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div 
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass"
              style={{
                padding: '16px 24px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                opacity: task.status === 'completed' ? 0.7 : 1
              }}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: `2px solid ${task.status === 'completed' ? 'var(--accent-success)' : 'var(--border-color)'}`,
                  background: task.status === 'completed' ? 'var(--accent-success)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                {task.status === 'completed' && <Check size={16} />}
              </button>
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '500', 
                  fontSize: '16px',
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)'
                }}>
                  {task.name}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {task.deadline}
                  </span>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    color: task.priority === 'High' ? 'var(--accent-danger)' : task.priority === 'Medium' ? 'var(--accent-warning)' : 'var(--accent-success)'
                  }}>
                    <AlertTriangle size={14} /> {task.priority}
                  </span>
                </div>
              </div>

              <button onClick={() => deleteTask(task.id)} style={{ color: 'var(--text-muted)' }} className="transition-all">
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
            <p>No tasks found. Time to relax!</p>
          </div>
        )}
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
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass" 
              style={{ width: '400px', padding: '32px', borderRadius: '24px' }}
            >
              <h2 style={{ marginBottom: '24px' }}>Add New Task</h2>
              <form onSubmit={addTask} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Task Description</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="What needs to be done?"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Deadline</label>
                  <input 
                    required
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Priority</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {priorities.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({...formData, priority: p})}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          background: formData.priority === p ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                          color: formData.priority === p ? 'white' : 'var(--text-secondary)',
                          fontSize: '13px'
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManager;
