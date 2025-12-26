import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";

import HomePage from "./Pages/HomePage";
import ProductPage from "./Pages/ProductPage";
import ProductDetails from "./Pages/ProductDetailPage";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishlistPage";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUs from "./Pages/ContactUsPage";
import ProfilePage from "./Pages/ProfilePage";
import MyOrdersPage from "./Pages/MyOrdersPage";
import CheckoutPage from "./Pages/CheckoutPage";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage";
import NotFoundPage from "./Pages/NotFoundPage";

/* Layout WITH Navbar & Footer */
const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    <main className="flex-1">
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="orders" element={<MyOrdersPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>

    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ALL pages with Navbar & Footer (including 404) */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
