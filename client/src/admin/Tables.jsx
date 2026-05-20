import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const BASE_URL = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5175';

export default function Tables() {
  const [tableCount, setTableCount] = useState(10);

  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  const downloadQR = async (table) => {
    const QRCode = await import('qrcode');
    const url = `${BASE_URL}/?table=${table}`;
    const dataUrl = await QRCode.default.toDataURL(url, { color: { dark: '#e85d04', light: '#ffffff' }, width: 300, margin: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `table-${table}.png`;
    a.click();
  };

  const downloadAll = async () => {
    for (const t of tables) await downloadQR(t);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Tables & QR Codes</h1>
        <button onClick={downloadAll} style={{
          background: '#e85d04', color: '#fff', border: 'none', borderRadius: 10,
          padding: '10px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer'
        }}>⬇ Download All QRs</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <label style={{ fontWeight: 600, fontSize: 14 }}>Number of tables:</label>
        <input type="number" min={1} max={50} value={tableCount} onChange={(e) => setTableCount(Number(e.target.value))}
          style={{ width: 80, padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
        {tables.map((t) => (
          <div key={t} style={{ background: '#fff', borderRadius: 16, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 32, margin: '0 0 8px' }}>🪑</p>
            <p style={{ margin: '0 0 12px', fontWeight: 800, fontSize: 18 }}>Table {t}</p>
            <p style={{ margin: '0 0 12px', fontSize: 11, color: '#aaa', wordBreak: 'break-all' }}>{BASE_URL}/?table={t}</p>
            <button onClick={() => downloadQR(t)} style={{
              background: '#fff8f5', color: '#e85d04', border: '1px solid #fde8d8',
              borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer', width: '100%'
            }}>⬇ QR Code</button>
          </div>
        ))}
      </div>
    </div>
  );
}
