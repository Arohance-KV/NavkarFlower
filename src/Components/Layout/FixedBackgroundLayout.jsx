import React from "react";

const FixedBackgroundLayout = ({ children }) => {
  return (
    <div className="relative">

      {/* FIXED BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 bg-repeat bg-center"
        style={{
          backgroundImage: "url('/assets/BgImg.png')",
          backgroundSize: "cover",
        }}
      />

      {/* SCROLLABLE CONTENT */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default FixedBackgroundLayout;
