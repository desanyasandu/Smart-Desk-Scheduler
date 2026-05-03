import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Timetable from './components/Timetable';
import TaskManager from './components/TaskManager';
import TaskCalendar from './components/TaskCalendar';
import Reports from './components/Reports';
import Login from './components/Login';

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({
    users: [],
    timetable: [],
    tasks: [],
    history: []
  });

  useEffect(() => {
    // Load data from Electron store
    if (window.electronAPI) {
      window.electronAPI.getData().then(loadedData => {
        setData(loadedData);
      });
    }
  }, []);

  const handleSave = (newData) => {
    setData(newData);
    if (window.electronAPI) {
      window.electronAPI.saveData(newData);
    }
  };

  const notify = (title, body) => {
    if (window.electronAPI) {
      window.electronAPI.notify({ title, body });
    }
  };

  if (!user) {
    return <Login onLogin={setUser} data={data} onUpdateData={handleSave} />;
  }

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setUser(null)} user={user} />
      <main style={{ overflowY: 'auto', padding: '40px' }}>
        {activeTab === 'dashboard' && <Dashboard data={data} user={user} setActiveTab={setActiveTab} />}
        {activeTab === 'timetable' && <Timetable data={data} onUpdate={handleSave} />}
        {activeTab === 'tasks' && <TaskManager data={data} onUpdate={handleSave} notify={notify} />}
        {activeTab === 'calendar' && <TaskCalendar data={data} />}
        {activeTab === 'reports' && <Reports data={data} />}
      </main>
    </div>
  );
};

export default App;
