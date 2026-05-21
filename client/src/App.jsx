import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import MenuPage from './pages/MenuPage';
import OrderSuccess from './pages/OrderSuccess';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import RequireAuth from './admin/RequireAuth';
import Dashboard from './admin/Dashboard';
import LiveOrders from './admin/LiveOrders';
import Kitchen from './admin/Kitchen';
import MenuManager from './admin/MenuManager';
import Payments from './admin/Payments';
import Tables from './admin/Tables';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer */}
            <Route path="/" element={<MenuPage />} />
            <Route path="/success" element={<OrderSuccess />} />

            {/* Admin login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin */}
            <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
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
    </AuthProvider>
  );
}
