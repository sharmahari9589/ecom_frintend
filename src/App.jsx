import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/signUp";

// Admin Pages
import AdminProductPage from "./pages/admin/Products";
import AdminOrderPage from "./pages/admin/Orders";
import AdminStockPage from "./pages/admin/Stocks";
import AdminLayout from "./pages/admin/AdminLayout";

// User Pages
import ProductList from "./pages/user/ProductList";
import ProductCard from "./pages/user/ProductCard";
import CartPage from "./pages/user/cartPage";
import UserLayout from "./pages/user/UserLayout";

// Protected Route
import SalesDashboard from "./pages/admin/SalesDsahboard";
import ProtectedRoute from "./protected/ProtectedRoute";
import MyOrdersPage from "./pages/user/MyOrders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<UserLayout />}>
            <Route path="products" element={<ProductList />} />
            <Route path="product/:id" element={<ProductCard />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<MyOrdersPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="products" element={<AdminProductPage />} />
            <Route path="orders" element={<AdminOrderPage />} />
            <Route path="stocks" element={<AdminStockPage />} />
            <Route path="dashboard" element={<SalesDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
