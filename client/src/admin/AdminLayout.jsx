import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/orders', label: '🧾 Live Orders' },
  { to: '/admin/kitchen', label: '👨‍🍳 Kitchen' },
  { to: '/admin/menu', label: '🍽 Menu Items' },
  { to: '/admin/payments', label: '💰 Payments' },
  { to: '/admin/tables', label: '🪑 Tables' },
];

const activeStyle = { background: '#e85d04', color: '#fff' };
const baseStyle = { display: 'block', padding: '10px 16px', borderRadius: 10, fontWeight: 600, fontSize: 14, color: '#555', textDecoration: 'none', marginBottom: 4 };

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #f0f0f0', padding: '24px 12px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 28, paddingLeft: 8 }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: '#e85d04' }}>🌶 Spicy Street</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#aaa' }}>Admin Panel</p>
        </div>
        {NAV.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} style={({ isActive }) => ({ ...baseStyle, ...(isActive ? activeStyle : {}) })}>
            {label}
          </NavLink>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={handleLogout} style={{
          width: '100%', background: '#fee2e2', color: '#ef4444', border: 'none',
          borderRadius: 10, padding: '10px', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 16
        }}>Logout</button>
      </aside>
      <main style={{ flex: 1, background: '#f9f9f9', padding: 28, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
