import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = ({ onLogin, data, onUpdateData }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (data.users.find(u => u.username === username)) {
        setError('Username already exists');
        return;
      }
      const newUser = { username, password };
      onUpdateData({ ...data, users: [...data.users, newUser] });
      setIsRegistering(false);
      setError('Account created! Please login.');
    } else {
      const user = data.users.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, var(--bg-tertiary) 0%, var(--bg-primary) 100%)'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{
          width: '400px',
          padding: '48px',
          borderRadius: '32px',
          textAlign: 'center'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          background: 'var(--accent-primary)',
          borderRadius: '20px',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Lock size={32} color="white" />
        </div>
        
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
          {isRegistering ? 'Join SmartDesk Scheduler today' : 'Please enter your details to sign in'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              required
              placeholder="Username" 
              style={{ paddingLeft: '40px' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              required
              type="password"
              placeholder="Password" 
              style={{ paddingLeft: '40px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div style={{ color: error.includes('created') ? 'var(--accent-success)' : 'var(--accent-danger)', fontSize: '13px' }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {isRegistering ? 'Register' : 'Login'} <ArrowRight size={18} />
          </button>
        </form>

        <button 
          onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}
        >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
