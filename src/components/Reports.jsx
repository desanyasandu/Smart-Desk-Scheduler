import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';

const Reports = ({ data }) => {
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Simple grouping by priority
  const priorityStats = {
    High: data.tasks.filter(t => t.priority === 'High').length,
    Medium: data.tasks.filter(t => t.priority === 'Medium').length,
    Low: data.tasks.filter(t => t.priority === 'Low').length,
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Productivity Reports</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Visualize your progress and efficiency over time.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Tasks', value: totalTasks, icon: BarChart, color: 'var(--accent-primary)' },
          { label: 'Completed', value: completedTasks, icon: CheckCircle, color: 'var(--accent-success)' },
          { label: 'Completion %', value: `${completionRate}%`, icon: TrendingUp, color: 'var(--accent-secondary)' },
          { label: 'Productivity Level', value: completionRate > 80 ? 'Elite' : completionRate > 50 ? 'Good' : 'Improving', icon: Award, color: 'var(--accent-warning)' },
        ].map((stat, i) => (
          <div key={i} className="glass" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
            <div style={{ margin: '0 auto 12px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <section className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} color="var(--accent-primary)" /> Task Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {['High', 'Medium', 'Low'].map(p => {
              const count = priorityStats[p];
              const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              const color = p === 'High' ? 'var(--accent-danger)' : p === 'Medium' ? 'var(--accent-warning)' : 'var(--accent-success)';
              return (
                <div key={p}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>{p} Priority</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{count} tasks ({Math.round(percentage)}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ height: '100%', background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="glass" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            border: '8px solid var(--bg-tertiary)', 
            borderTopColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            transform: `rotate(${completionRate * 3.6}deg)`
          }}>
             <span style={{ fontSize: '24px', fontWeight: '700', transform: `rotate(-${completionRate * 3.6}deg)` }}>{completionRate}%</span>
          </div>
          <h3 style={{ marginBottom: '8px' }}>Task Efficiency</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ratio of completed vs pending tasks.</p>
        </section>
      </div>

      <section className="glass" style={{ marginTop: '32px', padding: '32px', borderRadius: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Task History</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '12px' }}>Task Name</th>
                <th style={{ padding: '12px' }}>Completed Date</th>
                <th style={{ padding: '12px' }}>Priority</th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.filter(t => t.status === 'completed').sort((a,b) => new Date(b.completion_date) - new Date(a.completion_date)).map(task => (
                <tr key={task.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px' }}>{task.name}</td>
                  <td style={{ padding: '12px' }}>{task.completion_date}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      background: 'var(--bg-tertiary)',
                      color: task.priority === 'High' ? 'var(--accent-danger)' : 'var(--text-primary)'
                    }}>{task.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.tasks.filter(t => t.status === 'completed').length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No completed tasks in history.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reports;
