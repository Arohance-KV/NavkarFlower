import { useEffect, useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState("login");

  // 🔒 Disable background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ⛔ If modal is closed, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose} // 👈 clicking outside closes modal
      />

      {/* Modal Card Wrapper */}
      <div
        className="relative z-10 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {view === "login" ? (
          <Login
            onClose={onClose}               
            switchToSignup={() => setView("signup")}
          />
        ) : (
          <SignUp
            onClose={onClose}                 
            switchToLogin={() => setView("login")}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
