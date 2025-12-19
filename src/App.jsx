import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Auth/Login.jsx"
import SignUp from "./Pages/Auth/SignUp.jsx"
import HomePage from "./Pages/HomePage.jsx";
import Footer from "./Components/Footer";
import ProductPage from "./Pages/ProductPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx"

function App() {
  return (
    <Router>
      {/* Universal App Wrapper */}
      <div className="bg-[#E7E0CE] h-screen">
        <Navbar />

        {/* Universal main layout */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product" element={<ProductPage/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="*" element={<NotFoundPage/>} />
            {/* other routes */}
          </Routes>
        </main>

        {/* Footer can stay here */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
