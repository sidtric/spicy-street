import { useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const table = searchParams.get('table');
  const amount = searchParams.get('amount');
  const order = JSON.parse(sessionStorage.getItem('last_order') || 'null');

  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', minHeight: '100vh',
      padding: 24, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: '#fff'
    }}>
      <div style={{ textAlign: 'center', padding: '40px 0 28px' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>Order Placed!</h1>
        <p style={{ color: '#888', fontSize: 15, margin: 0 }}>
          Your food is on its way to <strong>Table {table}</strong>
        </p>
      </div>

      {/* Receipt */}
      <div style={{ background: '#f9f9f9', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 15, color: '#555' }}>Order Summary</p>
        {order?.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#e85d04', color: '#fff', borderRadius: 20, padding: '2px 8px', fontSize: 12, fontWeight: 800 }}>×{item.quantity}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
            </div>
            <span style={{ fontSize: 14, color: '#555' }}>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '2px solid #e0e0e0' }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>Total Paid</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#e85d04' }}>₹{amount}</span>
        </div>
      </div>

      <p style={{ color: '#ccc', fontSize: 13, textAlign: 'center', marginBottom: 24 }}>🌶 Thank you for dining at Spicy Street</p>

      <button
        onClick={() => window.location.href = `/?table=${table}`}
        style={{ width: '100%', background: 'none', border: '2px solid #e85d04', color: '#e85d04', borderRadius: 12, padding: 13, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
      >Order More</button>
    </div>
  );
}
