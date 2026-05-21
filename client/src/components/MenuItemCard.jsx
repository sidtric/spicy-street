import { useCart } from '../context/CartContext';

export default function MenuItemCard({ item }) {
  const { cart, addItem, removeItem } = useCart();
  const cartItem = cart.find((i) => i._id === item._id);
  const qty = cartItem?.quantity || 0;

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0', borderBottom: '1px solid #f0f0f0'
    }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{
            width: 14, height: 14, border: `2px solid ${item.isVeg ? '#22c55e' : '#ef4444'}`,
            borderRadius: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: item.isVeg ? '#22c55e' : '#ef4444', display: 'block'
            }} />
          </span>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a' }}>{item.name}</span>
        </div>
        {item.description && (
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 6px 0', lineHeight: 1.4 }}>{item.description}</p>
        )}
        <span style={{ fontWeight: 700, fontSize: 15, color: '#e85d04' }}>₹{item.price}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
        {qty === 0 ? (
          <button onClick={() => addItem(item)} style={{
            background: '#e85d04', color: '#fff', border: 'none', borderRadius: 8,
            padding: '8px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer'
          }}>
            ADD
          </button>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#e85d04', borderRadius: 8, padding: '6px 12px'
          }}>
            <button onClick={() => removeItem(item._id)} style={{
              background: 'none', border: 'none', color: '#fff',
              fontSize: 20, fontWeight: 700, cursor: 'pointer', lineHeight: 1, padding: 0
            }}>−</button>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, minWidth: 16, textAlign: 'center' }}>{qty}</span>
            <button onClick={() => addItem(item)} style={{
              background: 'none', border: 'none', color: '#fff',
              fontSize: 20, fontWeight: 700, cursor: 'pointer', lineHeight: 1, padding: 0
            }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}
