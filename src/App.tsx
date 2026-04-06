import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CategoryListing from './pages/CategoryListing';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ProductsList from './pages/Admin/ProductsList';
import AddProduct from './pages/Admin/AddProduct';
import Categories from './pages/Admin/Categories';
import Inventory from './pages/Admin/Inventory';
import Orders from './pages/Admin/Orders';
import AdminLayout from './components/Admin/AdminLayout';
import './index.css';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <Router>
      <WishlistProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:id" element={<CategoryListing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
            
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<AddProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </Router>
  );
}

export default App;
