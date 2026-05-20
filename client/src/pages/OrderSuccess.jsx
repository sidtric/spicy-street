import { useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const table = searchParams.get('table');
  const amount = searchParams.get('amount');

  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', minHeight: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      textAlign: 'center', background: '#fff'
    }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>Order Placed!</h1>
      <p style={{ color: '#888', fontSize: 15, margin: '0 0 32px', lineHeight: 1.6 }}>
        Your food is being prepared.<br />We'll bring it to <strong>Table {table}</strong> soon.
      </p>

      <div style={{ background: '#fff8f5', border: '2px solid #fde8d8', borderRadius: 16, padding: '20px 32px', marginBottom: 32 }}>
        <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Amount Paid</p>
        <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 28, color: '#e85d04' }}>₹{amount}</p>
      </div>

      <p style={{ color: '#ccc', fontSize: 13 }}>🌶 Thank you for dining at Spicy Street</p>

      <button
        onClick={() => window.location.href = `/?table=${table}`}
        style={{
          marginTop: 24, background: 'none', border: '2px solid #e85d04',
          color: '#e85d04', borderRadius: 12, padding: '12px 24px',
          fontWeight: 700, fontSize: 14, cursor: 'pointer'
        }}
      >
        Order More
      </button>
    </div>
  );
}
