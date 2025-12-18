function BelowHeroSection() {
  return (
    <section>
    <div className="bg-white max-w-5xl mx-auto p-4 flex justify-center items-center ">
      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* LEFT CONTENT CARD */}
        <div className="border border-[#C58C8C] p-12 md:p-15
                        flex flex-col justify-center items-center text-center
                        rounded-[36px] [corner-shape:scoop] relative">
          {/* Decorative leaf */}
          <img
            src="/assets/Lleaf.png"
            alt="leaf"
            className="w-20 mb-6 opacity-80"
          />

          {/* Text */}
          <h2 className="font-script text-3xl md:text-4xl leading-relaxed text-[#7A8F6A] mb-8">
            Create moments that
            <br />
            last with flowers
            <br />
            that stay
          </h2>

          {/* Button */}
          <button
            className="bg-amber-700 text-white text-sm tracking-widest
                             px-8 py-4 rounded shadow-sm font-slab
                             hover:bg-amber-900 transition"
          >
            SHOP NOW
          </button>
        </div>

        {/* RIGHT IMAGE CARD */}
        <div
          className="border border-[#C58C8C] overflow-hidden
                        rounded-[36px] [corner-shape:scoop]  bg-white"
        >
          <img
            src="/assets/HeroImg.png"
            alt="Floral Door"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      </div>
    </section>
  );
}

export default BelowHeroSection;
