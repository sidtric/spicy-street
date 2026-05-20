import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import OrderSuccess from './pages/OrderSuccess';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import LiveOrders from './admin/LiveOrders';
import Kitchen from './admin/Kitchen';
import MenuManager from './admin/MenuManager';
import Payments from './admin/Payments';
import Tables from './admin/Tables';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer */}
          <Route path="/" element={<MenuPage />} />
          <Route path="/success" element={<OrderSuccess />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<LiveOrders />} />
            <Route path="kitchen" element={<Kitchen />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="payments" element={<Payments />} />
            <Route path="tables" element={<Tables />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
