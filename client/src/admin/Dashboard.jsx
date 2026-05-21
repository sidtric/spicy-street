import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const StatCard = ({ label, value, sub, color = '#e85d04' }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', flex: 1, minWidth: 160, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
    <p style={{ margin: 0, fontSize: 13, color: '#999' }}>{label}</p>
    <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 800, color }}>{value}</p>
    {sub && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#bbb' }}>{sub}</p>}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/orders/stats`),
      axios.get(`${API}/api/orders?status=paid`),
    ]).then(([s, o]) => {
      setStats(s.data);
      setRecent(o.data.slice(0, 5));
    });
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 800 }}>Dashboard</h1>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatCard label="Today's Orders" value={stats?.todayOrders ?? '—'} />
        <StatCard label="Today's Revenue" value={stats ? `₹${stats.todayRevenue}` : '—'} color="#16a34a" />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? '—'} color="#7c3aed" />
        <StatCard label="Total Revenue" value={stats ? `₹${stats.totalRevenue}` : '—'} color="#0284c7" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Recent Orders</h2>
        {recent.length === 0 && <p style={{ color: '#bbb', fontSize: 14 }}>No orders yet.</p>}
        {recent.map((o) => (
          <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Table {o.tableNumber}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>{o.items.length} items · {new Date(o.createdAt).toLocaleTimeString()}</p>
            </div>
            <p style={{ margin: 0, fontWeight: 700, color: '#16a34a' }}>₹{o.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
