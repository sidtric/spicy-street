import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Payments() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/orders`),
      axios.get(`${API}/api/orders/stats`),
    ]).then(([o, s]) => {
      setOrders(o.data.filter((x) => x.paymentId));
      setStats(s.data);
    });
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 800 }}>Payment Tracking</h1>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        {[
          { label: "Today's Revenue", value: stats ? `₹${stats.todayRevenue}` : '—', color: '#16a34a' },
          { label: 'Total Revenue', value: stats ? `₹${stats.totalRevenue}` : '—', color: '#0284c7' },
          { label: "Today's Orders", value: stats?.todayOrders ?? '—', color: '#e85d04' },
          { label: 'Total Paid Orders', value: stats?.totalOrders ?? '—', color: '#7c3aed' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', flex: 1, minWidth: 160, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#999' }}>{label}</p>
            <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 800, color }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #f0f0f0' }}>
              {['Time', 'Table', 'Items', 'Amount', 'Payment ID', 'Status'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '12px 16px', color: '#888', fontSize: 12 }}>{new Date(o.createdAt).toLocaleString()}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>T{o.tableNumber}</td>
                <td style={{ padding: '12px 16px', color: '#666' }}>{o.items.length} items</td>
                <td style={{ padding: '12px 16px', fontWeight: 800, color: '#16a34a' }}>₹{o.totalAmount}</td>
                <td style={{ padding: '12px 16px', fontSize: 11, color: '#aaa', fontFamily: 'monospace' }}>{o.paymentId?.slice(0, 20)}…</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: o.status === 'served' ? '#dcfce7' : '#fef3c7',
                    color: o.status === 'served' ? '#16a34a' : '#92400e',
                    borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700, textTransform: 'capitalize'
                  }}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p style={{ padding: 20, color: '#bbb', textAlign: 'center' }}>No payments yet.</p>}
      </div>
    </div>
  );
}
