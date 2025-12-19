import React from "react";

export default function ContactUs() {
  return (
    <section className="w-full bg-[#EFE6D4] py-20 px-4 md:px-10">
      {/* Heading Section */}
      <div className="relative text-center mb-14 overflow-hidden">
        <h2 className="relative z-10 text-4xl md:text-5xl font-script font-bold text-amber-900 mb-4">
          Contact Us
        </h2>

        <p className="relative z-10 max-w-6xl mx-auto text-amber-900 text-2xl md:text-3xl font-slab">
          We'd love to hear from you. Whether you have a question, need
          assistance, or want help choosing the perfect floral décor, our team
          is here for you.
        </p>
      </div>

      {/* Main Container with Separate Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Form Card */}
        <div className="border border-[#C58C8C] bg-transparent p-10 md:p-14 flex flex-col justify-center gap-6 h-full rounded-4xl [corner-shape:scoop]">
          <Input placeholder="Name" />
          <Input placeholder="Number" />
          <Input placeholder="E mail" />

          <textarea
            placeholder="About"
            rows="4"
            className="w-full rounded-md border border-[#C58C8C] bg-transparent px-4 py-3 text-[#8B3A3A] placeholder-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#C58C8C]"
          />

          <button className="mt-4 w-fit px-8 py-3 bg-[#C9A04F] text-white font-slab rounded-md hover:opacity-90 transition">
            Send
          </button>
        </div>

        {/* Right Image Card */}
        <div className="border border-[#C58C8C] overflow-hidden bg-white h-full rounded-4xl [corner-shape:scoop]">
          <img
            src="/assets/HeroImg.png"
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}

/* Reusable Input */
function Input({ placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full rounded-md border border-[#C58C8C] bg-transparent px-4 py-3 text-[#8B3A3A] placeholder-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#C58C8C]"
    />
  );
}