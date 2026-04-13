import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CategoryListing from './pages/CategoryListing';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ProductsList from './pages/Admin/ProductsList';
import AddProduct from './pages/Admin/AddProduct';
import Categories from './pages/Admin/Categories';
import Inventory from './pages/Admin/Inventory';
import Orders from './pages/Admin/Orders';
import Customers from './pages/Admin/Customers';
import Marketing from './pages/Admin/Marketing';
import Reports from './pages/Admin/Reports';
import Payments from './pages/Admin/Payments';
import Shipping from './pages/Admin/Shipping';
import Vendors from './pages/Admin/Vendors';
import CMS from './pages/Admin/CMS';
import AdminLayout from './components/Admin/AdminLayout';
import './index.css';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:id" element={<CategoryListing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/account" element={<Account />} />
            <Route path="/wishlist" element={<Wishlist />} />
            
            {/* Admin Portal Routes */}
            <Route path="/admin">
              <Route index element={<AdminLogin />} />
              <Route path="login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductsList />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<AddProduct />} />
                <Route path="categories" element={<Categories />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:status" element={<Orders />} />
                <Route path="orders/details/:id" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="marketing" element={<Marketing />} />
                <Route path="marketing/:type" element={<Marketing />} />
                <Route path="reports" element={<Reports />} />
                <Route path="payments" element={<Payments />} />
                <Route path="shipping" element={<Shipping />} />
                <Route path="vendors" element={<Vendors />} />
                <Route path="cms" element={<CMS />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
