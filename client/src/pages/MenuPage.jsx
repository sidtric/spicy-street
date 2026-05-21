import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';
import CartDrawer from '../components/CartDrawer';
import { socket } from '../socket';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const CATEGORY_ICONS = {
  Starters: '🍢', 'Main Course': '🍛', Breads: '🫓',
  Drinks: '🥤', Desserts: '🍮', Specials: '⭐', Combos: '🎁',
};

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '?';
  const [menu, setMenu] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const categoryRefs = useRef({});

  const fetchMenu = () =>
    axios.get(`${API}/api/menu`)
      .then(({ data }) => { setMenu(data); setActiveCategory((c) => c || Object.keys(data)[0] || ''); })
      .catch((err) => { console.error('Menu fetch failed:', err.message); setError(`Could not load menu. Is the server running on ${API}?`); });

  useEffect(() => {
    fetchMenu().finally(() => setLoading(false));
    socket.on('menu_updated', fetchMenu);
    return () => socket.off('menu_updated', fetchMenu);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const categories = Object.keys(menu);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #f0f0f0', borderTop: '3px solid #e85d04', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#888', fontSize: 14 }}>Loading menu...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 12, padding: 24, textAlign: 'center' }}>
      <span style={{ fontSize: 40 }}>⚠️</span>
      <p style={{ color: '#e85d04', fontWeight: 700, fontSize: 16 }}>Failed to load menu</p>
      <p style={{ color: '#888', fontSize: 13 }}>{error}</p>
      <button onClick={() => window.location.reload()} style={{ marginTop: 8, background: '#e85d04', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#e85d04', padding: '20px 20px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ color: '#fff', margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>🌶 Spicy Street</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0', fontSize: 13 }}>Authentic Indian Flavors</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 12px', textAlign: 'center' }}>
            <p style={{ color: '#fff', margin: 0, fontSize: 11, opacity: 0.9 }}>TABLE</p>
            <p style={{ color: '#fff', margin: 0, fontSize: 20, fontWeight: 800 }}>{tableNumber}</p>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              style={{
                background: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.2)',
                color: activeCategory === cat ? '#e85d04' : '#fff',
                border: 'none', borderRadius: 20, padding: '6px 14px',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {CATEGORY_ICONS[cat] || '🍽'} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu sections */}
      <div style={{ padding: '0 20px 120px' }}>
        {categories.map((cat) => (
          <div key={cat} ref={(el) => (categoryRefs.current[cat] = el)} style={{ paddingTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{CATEGORY_ICONS[cat] || '🍽'}</span>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>{cat}</h2>
            </div>
            <p style={{ margin: '0 0 12px', color: '#aaa', fontSize: 12 }}>{menu[cat].length} items</p>
            {menu[cat].map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        ))}
      </div>

      <CartDrawer tableNumber={tableNumber} />
    </div>
  );
}
