import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Zap } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = ({ data, user, setActiveTab }) => {
  const today = format(new Date(), 'EEEE');
  const todayDate = format(new Date(), 'MMMM do, yyyy');

  const todayActivities = data.timetable.filter(item => item.day === today);
  const pendingTasks = data.tasks.filter(t => t.status === 'pending');
  const completedToday = data.tasks.filter(t => t.status === 'completed' && t.completion_date === format(new Date(), 'yyyy-MM-dd'));
  
  const completionRate = data.tasks.length > 0 
    ? Math.round((data.tasks.filter(t => t.status === 'completed').length / data.tasks.length) * 100) 
    : 0;

  const stats = [
    { label: 'Completion Rate', value: `${completionRate}%`, icon: Zap, color: 'var(--accent-primary)' },
    { label: 'Pending Tasks', value: pendingTasks.length, icon: Clock, color: 'var(--accent-warning)' },
    { label: 'Completed (Total)', value: data.tasks.filter(t => t.status === 'completed').length, icon: CheckCircle2, color: 'var(--accent-success)' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome back, {user.username}! 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Today is {today}, {todayDate}</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass" style={{
            padding: '24px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{stat.label}</span>
            <span style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px'
      }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px' }}>Today's Schedule</h2>
            <button onClick={() => setActiveTab('timetable')} style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {todayActivities.length > 0 ? todayActivities.map((act, i) => (
              <div key={i} className="glass" style={{
                padding: '16px 20px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '14px', minWidth: '90px' }}>
                  {act.time}
                </div>
                <div style={{ height: '20px', width: '2px', background: 'var(--border-color)' }}></div>
                <div>
                  <div style={{ fontWeight: '600' }}>{act.activity}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{act.subject || 'Activity'}</div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No activities scheduled for today.
              </div>
            )}
          </div>
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px' }}>Urgent Tasks</h2>
            <button onClick={() => setActiveTab('tasks')} style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>Manage Tasks</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingTasks.filter(t => t.priority === 'High').length > 0 ? pendingTasks.filter(t => t.priority === 'High').map((task, i) => (
              <div key={i} className="glass" style={{
                padding: '16px 20px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'var(--accent-danger)'
                  }}></div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{task.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Due: {task.deadline}</div>
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--accent-danger)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>High</div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No high-priority tasks pending. Great job!
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Dashboard;
