import { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from '../socket';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const chime = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);
    osc.start(ctx.currentTime + i * 0.15);
    osc.stop(ctx.currentTime + i * 0.15 + 0.4);
  });
};

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchOrders = () =>
    axios.get(`${API}/api/orders?status=paid`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('admin_token')}` }
    }).then(({ data }) => {
      setOrders(data);
      setLastRefresh(new Date());
    });

  useEffect(() => {
    fetchOrders();

    const handleNewOrder = (order) => {
      setOrders((prev) => [order, ...prev]);
      setLastRefresh(new Date());
      chime();
    };

    const handleUpdated = (order) => {
      setOrders((prev) =>
        order.status === 'paid' ? prev : prev.filter((o) => o._id !== order._id)
      );
    };

    socket.on('new_order', handleNewOrder);
    socket.on('order_updated', handleUpdated);
    return () => { socket.off('new_order', handleNewOrder); socket.off('order_updated', handleUpdated); };
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`${API}/api/orders/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('admin_token')}` }
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>👨‍🍳 Kitchen Display</h1>
        <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>Live · {lastRefresh.toLocaleTimeString()}</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 40, margin: '0 0 12px' }}>✅</p>
          <p style={{ fontWeight: 700, fontSize: 16, color: '#16a34a' }}>All clear! No pending orders.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {orders.map((order) => {
            const mins = Math.floor((Date.now() - new Date(order.createdAt)) / 60000);
            return (
              <div key={order._id} style={{
                background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                border: `2px solid ${mins > 10 ? '#ef4444' : '#f59e0b'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>Table {order.tableNumber}</p>
                  <span style={{
                    background: mins > 10 ? '#fee2e2' : '#fef3c7',
                    color: mins > 10 ? '#ef4444' : '#92400e',
                    borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 700
                  }}>{mins}m ago</span>
                </div>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ background: '#e85d04', color: '#fff', borderRadius: 20, padding: '2px 10px', fontWeight: 800, fontSize: 13 }}>×{item.quantity}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button onClick={() => updateStatus(order._id, 'preparing')} style={{
                    flex: 1, background: '#3b82f6', color: '#fff', border: 'none',
                    borderRadius: 8, padding: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer'
                  }}>🔥 Start Cooking</button>
                  <button onClick={() => updateStatus(order._id, 'served')} style={{
                    flex: 1, background: '#16a34a', color: '#fff', border: 'none',
                    borderRadius: 8, padding: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer'
                  }}>✅ Served</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
