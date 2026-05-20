import { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function CartDrawer({ tableNumber }) {
  const { cart, addItem, removeItem, clearCart, total, itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!cart.length) return;
    setLoading(true);
    try {
      const ready = await loadRazorpay();
      if (!ready) { alert('Failed to load payment gateway. Check your connection.'); return; }

      // Create Razorpay order
      const { data } = await axios.post(`${API}/api/payment/create-order`, { amount: total });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Spicy Street',
        description: `Table ${tableNumber} Order`,
        order_id: data.orderId,
        handler: async (response) => {
          // Verify payment
          const verify = await axios.post(`${API}/api/payment/verify`, response);
          if (verify.data.verified) {
            // Save order
            await axios.post(`${API}/api/orders`, {
              tableNumber,
              items: cart.map((i) => ({ menuItem: i._id, name: i.name, price: i.price, quantity: i.quantity })),
              totalAmount: total,
              paymentId: verify.data.paymentId,
              razorpayOrderId: data.orderId,
            });
            sessionStorage.setItem('last_order', JSON.stringify({ items: cart, total, tableNumber }));
            clearCart();
            setOpen(false);
            window.location.href = `/success?table=${tableNumber}&amount=${total}`;
          }
        },
        prefill: { name: `Table ${tableNumber}` },
        theme: { color: '#e85d04' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Cart Button */}
      {itemCount > 0 && !open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: '#e85d04', color: '#fff', border: 'none', borderRadius: 50,
            padding: '14px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(232,93,4,0.4)', zIndex: 100,
            display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap'
          }}
        >
          <span style={{
            background: '#fff', color: '#e85d04', borderRadius: '50%',
            width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13
          }}>{itemCount}</span>
          View Cart · ₹{total}
        </button>
      )}

      {/* Drawer Overlay */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end'
        }} onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', background: '#fff', borderRadius: '20px 20px 0 0',
              padding: '24px 20px 32px', maxHeight: '80vh', overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Your Cart</h2>
              <button onClick={() => setOpen(false)} style={{
                background: '#f5f5f5', border: 'none', borderRadius: '50%',
                width: 32, height: 32, cursor: 'pointer', fontSize: 16
              }}>✕</button>
            </div>

            <p style={{ margin: '0 0 16px', color: '#888', fontSize: 13 }}>Table {tableNumber}</p>

            {cart.map((item) => (
              <div key={item._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid #f5f5f5'
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                  <p style={{ margin: 0, color: '#e85d04', fontSize: 13 }}>₹{item.price} × {item.quantity}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => removeItem(item._id)} style={{
                    width: 28, height: 28, background: '#f5f5f5', border: 'none',
                    borderRadius: '50%', cursor: 'pointer', fontSize: 16, fontWeight: 700
                  }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => addItem(item)} style={{
                    width: 28, height: 28, background: '#f5f5f5', border: 'none',
                    borderRadius: '50%', cursor: 'pointer', fontSize: 16, fontWeight: 700
                  }}>+</button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: '16px 0', borderTop: '2px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#e85d04' }}>₹{total}</span>
              </div>
              <button
                onClick={handlePayment}
                disabled={loading}
                style={{
                  width: '100%', background: '#e85d04', color: '#fff', border: 'none',
                  borderRadius: 12, padding: '16px', fontWeight: 700, fontSize: 16,
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Processing...' : `Pay ₹${total} via Razorpay`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
