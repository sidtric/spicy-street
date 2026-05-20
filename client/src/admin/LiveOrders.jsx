import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const STATUS_COLORS = { paid: '#f59e0b', preparing: '#3b82f6', served: '#16a34a', cancelled: '#ef4444' };
const NEXT_STATUS = { paid: 'preparing', preparing: 'served' };

export default function LiveOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchOrders = () =>
    axios.get(`${API}/api/orders${filter !== 'all' ? `?status=${filter}` : ''}`).then(({ data }) => setOrders(data));

  useEffect(() => { fetchOrders(); }, [filter]);
  useEffect(() => { const t = setInterval(fetchOrders, 8000); return () => clearInterval(t); }, [filter]);

  const updateStatus = async (id, status) => {
    await axios.patch(`${API}/api/orders/${id}/status`, { status });
    fetchOrders();
  };

  const filtered = orders;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Live Orders</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'paid', 'preparing', 'served', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? '#e85d04' : '#fff', color: filter === s ? '#fff' : '#555',
              border: '1px solid #e0e0e0', borderRadius: 20, padding: '6px 14px',
              fontWeight: 600, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize'
            }}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <p style={{ color: '#bbb', fontSize: 14 }}>No orders found.</p>}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {filtered.map((order) => (
          <div key={order._id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${STATUS_COLORS[order.status] || '#ccc'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>Table {order.tableNumber}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#aaa' }}>{new Date(order.createdAt).toLocaleTimeString()}</p>
              </div>
              <span style={{ background: STATUS_COLORS[order.status], color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, height: 'fit-content', textTransform: 'capitalize' }}>
                {order.status}
              </span>
            </div>

            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0' }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ color: '#888' }}>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontWeight: 800, color: '#e85d04' }}>₹{order.totalAmount}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {NEXT_STATUS[order.status] && (
                  <button onClick={() => updateStatus(order._id, NEXT_STATUS[order.status])} style={{
                    background: '#e85d04', color: '#fff', border: 'none', borderRadius: 8,
                    padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
                  }}>
                    → {NEXT_STATUS[order.status]}
                  </button>
                )}
                {order.status !== 'cancelled' && order.status !== 'served' && (
                  <button onClick={() => updateStatus(order._id, 'cancelled')} style={{
                    background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8,
                    padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                  }}>Cancel</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
