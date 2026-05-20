import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const CATEGORIES = ['Starters', 'Main Course', 'Breads', 'Drinks', 'Desserts'];
const EMPTY_FORM = { name: '', description: '', price: '', category: 'Starters', isVeg: true, isAvailable: true };

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = () => axios.get(`${API}/api/menu/all`).then(({ data }) => setItems(data));
  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.patch(`${API}/api/menu/${editId}`, form);
    } else {
      await axios.post(`${API}/api/menu`, form);
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
    fetchItems();
  };

  const startEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', price: item.price, category: item.category, isVeg: item.isVeg, isAvailable: item.isAvailable });
    setEditId(item._id);
    setShowForm(true);
  };

  const toggleAvailable = async (item) => {
    await axios.patch(`${API}/api/menu/${item._id}`, { isAvailable: !item.isAvailable });
    fetchItems();
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this item?')) return;
    await axios.delete(`${API}/api/menu/${id}`);
    fetchItems();
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Menu Items</h1>
        <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); }} style={{
          background: '#e85d04', color: '#fff', border: 'none', borderRadius: 10,
          padding: '10px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer'
        }}>+ Add Item</button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>{editId ? 'Edit Item' : 'Add New Item'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Name *</label>
                <input required style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Butter Chicken" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Price (₹) *</label>
                <input required type="number" style={inputStyle} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="320" />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Description</label>
              <input style={inputStyle} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Category *</label>
                <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 22 }}>
                <input type="checkbox" id="isVeg" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} />
                <label htmlFor="isVeg" style={{ fontSize: 14, fontWeight: 600 }}>Veg</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 22 }}>
                <input type="checkbox" id="isAvail" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
                <label htmlFor="isAvail" style={{ fontSize: 14, fontWeight: 600 }}>Available</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ background: '#e85d04', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                {editId ? 'Update' : 'Add Item'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: '#f5f5f5', color: '#555', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #f0f0f0' }}>
              {['Item', 'Category', 'Price', 'Type', 'Available', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '12px 16px' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{item.name}</p>
                  {item.description && <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>{item.description}</p>}
                </td>
                <td style={{ padding: '12px 16px', color: '#666' }}>{item.category}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#e85d04' }}>₹{item.price}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: item.isVeg ? '#dcfce7' : '#fee2e2', color: item.isVeg ? '#16a34a' : '#ef4444', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => toggleAvailable(item)} style={{
                    background: item.isAvailable ? '#dcfce7' : '#f5f5f5',
                    color: item.isAvailable ? '#16a34a' : '#999',
                    border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                  }}>{item.isAvailable ? 'On' : 'Off'}</button>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => startEdit(item)} style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteItem(item._id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p style={{ padding: 20, color: '#bbb', textAlign: 'center', fontSize: 14 }}>No items found.</p>}
      </div>
    </div>
  );
}
