import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import HomePage from "./Pages/HomePage";
import ProductPage from "./Pages/ProductPage";
import ContactUs from "./Pages/ContactUsPage";
import ProfilePage from "./Pages/ProfilePage";
import NotFoundPage from "./Pages/NotFoundPage";

/* Layout WITH Navbar & Footer */
const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#E7E0CE]">
    <Navbar />

    <main className="flex-1">
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="profile" element={<ProfilePage />} />
      </Routes>
    </main>

    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* ALL valid pages */}
        <Route path="/*" element={<MainLayout />} />

        {/* 404 page (NO Navbar & Footer) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
