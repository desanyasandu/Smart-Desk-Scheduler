import React from 'react';
import { LayoutDashboard, Calendar, CheckSquare, BarChart3, LogOut, User } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside className="glass" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 20px',
      borderRight: '1px solid var(--glass-border)',
      height: '100vh'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'var(--accent-primary)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Calendar size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '18px', margin: 0 }}>SmartDesk</h2>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {menuItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '8px' }}>
              <button
                onClick={() => setActiveTab(item.id)}
                className="transition-all"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: activeTab === item.id ? 'var(--bg-accent)' : 'transparent',
                  border: activeTab === item.id ? '1px solid var(--glass-border)' : '1px solid transparent',
                  fontSize: '15px',
                  fontWeight: activeTab === item.id ? '500' : '400'
                }}
              >
                <item.icon size={20} color={activeTab === item.id ? 'var(--accent-primary)' : 'currentColor'} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{
        marginTop: 'auto',
        padding: '20px 0',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={18} color="var(--text-secondary)" />
          </div>
          <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>
            {user.username}
          </span>
        </div>
        
        <button
          onClick={onLogout}
          className="transition-all"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            color: 'var(--accent-danger)',
            fontSize: '15px'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
