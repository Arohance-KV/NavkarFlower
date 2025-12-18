import React from "react";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/HeroImg.png')" }}
      />

      {/* CENTER LOGO */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-center z-20">
        <img
          src="/assets/logo1.png"
          alt="Navkar Flowers"
          className="w-40 h-40 bg-white/80 rounded-full p-4 shadow-lg"
        />
      </div>

      {/* LEFT CONTENT CARD */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 z-30">
        <div
          className="
            bg-white/50
            border border-[#B96B6B]
            rounded-4xl
            [corner-shape:scoop]
            px-10 py-12
            max-w-2xl
            relative
          ">

          {/* TEXT */}
          <h1 className="font-script text-3xl leading-relaxed text-[#8B3A4A] mb-8">
            Upgrade your <br />
            décor with <br />
            premium <br />
            artificial <br />
            florals
          </h1>

          {/* BUTTON */}
          <button
            className="
              bg-[#7BC0C7]
              text-[#8B3A4A]
              font-slab
              px-6 py-2
              rounded-md
              [corner-shape:scoop]
              border border-[#8B3A4A]
              hover:bg-[#6aaeb4]
              transition
            "
          >
            Shop Now
          </button>
        </div>
      </div>

    </section>
  );
}
