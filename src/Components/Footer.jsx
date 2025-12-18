import React from "react";
import { MessageCircle, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const polaroidImages = [
    { id: 1, image: "./assets/kids.png", alt: "Happy customer 1" },
    { id: 2, image: "./assets/kids.png", alt: "Happy customer 2" },
    { id: 3, image: "./assets/kids.png", alt: "Happy customer 3" },
  ];

  return (
    <footer className="w-full bg-[#EFE6D4] relative">
      {/* Top Section - Message Box */}
      <div className="max-w-2xl mx-auto bg-white/30 backdrop-blur-sm rounded-[55px] [corner-shape:scoop] p-2 shadow-lg">
      <div className="max-w-2xl mx-auto bg-transparent backdrop-blur-sm rounded-[55px] [corner-shape:scoop] p-8 border-2 border-amber-900/40 shadow-lg">
        {/* Heading */}
        <h2 className="text-4xl font-slab text-amber-900 text-center">
          Navkar Flowers
        </h2>

        {/* Decorative Branch */}
        <div className="flex justify-center">
          <img
            src="./assets/flower.png"
            alt="Branch"
            className="w-30 h-30 object-fill"
          />
        </div>

        {/* Message Text */}
        <p className="text-center text-amber-900 font-script text-lg md:text-3xl leading-relaxed">
          Have a query about our products, custom orders, or bulk requirements?
          Reach out to us and we'll get back to you as soon as possible.
        </p>
      </div>
      </div>

      {/* Bottom Section - Background Image with Cards */}
      <div
        className="w-full py-10 relative min-h-96"
        style={{
          backgroundImage: "url('./assets/FooterBg.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
        }}
      >
        {/* Cards Container - Zig-Zag Layout */}
        <div className="px-4 max-w-6xl mx-auto mt-10">
          <div className="grid grid-cols-4 gap-20 items-start">
            {/* Left Card - Important Links */}
            <div className="flex justify-center md:col-span-1">
              <div
                className="bg-white/98 backdrop-blur-sm rounded-lg p-6 border-2 border-amber-900/40 shadow-xl w-full md:w-56 transform md:-translate-y-12"
                style={{
                  transform: "rotate(-5deg) translateY(20px)",
                }}
              >
                <h3 className="text-amber-900 font-script text-2xl text-center">
                  Important links
                </h3>

                <ul className="space-y-2 text-center">
                  <li>
                    <a
                      href="/products"
                      className="text-amber-900 hover:text-pink-600 font-slab transition-colors block"
                    >
                      Products
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="text-amber-900 hover:text-pink-600 font-slab transition-colors block"
                    >
                      About us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-amber-900 hover:text-pink-600 font-slab transition-colors block"
                    >
                      New Arrivals
                    </a>
                  </li>
                </ul>

                {/* Social Icons */}
                <div className="flex gap-3 justify-center pt-4 border-t border-amber-900/20">
                  <a
                    href="#"
                    className="text-amber-900 hover:text-pink-600 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle size={22} />
                  </a>
                  <a
                    href="#"
                    className="text-amber-900 hover:text-pink-600 transition-colors"
                    title="Instagram"
                  >
                    <Instagram size={22} />
                  </a>
                  <a
                    href="#"
                    className="text-amber-900 hover:text-pink-600 transition-colors"
                    title="Facebook"
                  >
                    <Facebook size={22} />
                  </a>
                </div>

                <p className="text-xs text-amber-900 mt-4 text-center font-script">
                  Love at first site
                </p>
              </div>
            </div>

            {/* Right Cards - Polaroid Images (Zig-Zag) */}
            <div className="md:col-span-3 flex flex-row gap-4 md:gap-20 flex-wrap md:flex-nowrap">
              {polaroidImages.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    transform: `rotate(${
                      index === 0 ? "5deg" : index === 1 ? "-5deg" : "5deg"
                    }) translateY(${
                      index === 0 ? "20px" : index === 1 ? "0px" : "20px"
                    })`,
                  }}
                >
                  <div
                    className="bg-white p-3 shadow-xl"
                    style={{
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-40 h-48 md:w-44 md:h-52 object-cover"
                    />
                    <p className="text-center text-amber-900 text-xl mt-2 font-script">
                      Love at first site
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="border-t border-amber-900/30 py-6 px-4 md:px-8 bg-[#EFE6D4]">
        <p className="text-left text-amber-900 font-slab text-sm md:text-base">
          All rights Reserved © Navkar Flowers
        </p>
      </div>
    </footer>
  );
}
