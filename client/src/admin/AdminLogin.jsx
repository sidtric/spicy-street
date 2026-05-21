import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(password);
      navigate('/admin');
    } catch {
      setError('Wrong password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f9f9f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', width: 360, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontSize: 40, margin: '0 0 8px' }}>🌶</p>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Spicy Street</h1>
          <p style={{ margin: '4px 0 0', color: '#999', fontSize: 14 }}>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            style={{
              width: '100%', padding: '12px 14px', border: `1.5px solid ${error ? '#ef4444' : '#e0e0e0'}`,
              borderRadius: 10, fontSize: 15, boxSizing: 'border-box', marginBottom: 8, outline: 'none'
            }}
          />
          {error && <p style={{ margin: '0 0 12px', color: '#ef4444', fontSize: 13 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%', background: '#e85d04', color: '#fff', border: 'none',
              borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 15,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.7 : 1, marginTop: error ? 0 : 4
            }}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
