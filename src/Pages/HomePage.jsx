import React from "react";
import HeroSection from "../Components/Home/HeroSection.jsx";
import NewCollection from "../Components/Home/NewCollection.jsx";
import BelowHeroSection from "../Components/Home/BelowHeroSection.jsx";
import ContactUs from "../Components/Home/ContactUs.jsx";
import About from "../Components/Home/About.jsx";
import FixedBackgroundLayout from "../Components/Layout/FixedBackgroundLayout.jsx";

function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <FixedBackgroundLayout>
        <BelowHeroSection />
        <NewCollection />
      </FixedBackgroundLayout>
      <About />
      <ContactUs />
    </div>
  );
}

export default HomePage;
