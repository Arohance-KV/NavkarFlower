import React from "react";
import { useNavigate } from "react-router-dom";

export default function NewCollection() {
  const navigate = useNavigate();

  const smallImages = [
    "./assets/Flower1.png",
    "./assets/Flower2.png",
    "./assets/Lleaf.png",
    "./assets/Flower3.png",
  ];

  return (
    <section>
      <div className="text-center">
        {/* OUTER DECORATIVE BOX */}
        <div className="max-w-5xl mx-auto p-8 bg-[#FFFDF6]">
          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-script text-amber-900 mb-3">
            New Collection
          </h2>

          <p className="text-lg font-slab text-amber-900 mb-3">
            Your space deserves beauty that endures
          </p>

          {/* INNER GRID */}
          <div className="grid grid-cols-2">
            {/* TOP LEFT – 4 SMALL */}
            <div className="grid grid-cols-2">
              {smallImages.map((img, i) => (
                <ImageFrame key={i} img={img} />
              ))}
            </div>

            {/* TOP RIGHT – BIG */}
            <ImageFrame img="./assets/Flower4.png" large />

            {/* BOTTOM LEFT – BIG */}
            <ImageFrame img="./assets/Flower4.png" large />

            {/* BOTTOM RIGHT – 4 SMALL */}
            <div className="grid grid-cols-2">
              {smallImages.map((img, i) => (
                <ImageFrame key={i} img={img} />
              ))}
            </div>
          </div>

          {/* SHOP NOW BUTTON */}
          <button
            onClick={() => navigate("/product")}
            className="border border-amber-900 text-amber-900 font-slab rounded-xl mt-10 px-10 py-3 hover:bg-amber-900 hover:text-white transition"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- REUSABLE IMAGE FRAME ---------------- */

function ImageFrame({ img, large = false }) {
  return (
    <div
      className={`bg-white p-2 shadow-md border border-green-900 ${
        large ? "" : ""
      }`}
    >
      <div className={`overflow-hidden ${large ? "" : ""}`}>
        <img
          src={img}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Optional text */}
      <div className="mt-2 text-left">
        <p className="text-xs font-semibold font-slab text-green-900">
          Pink Flower
        </p>
        <p className="text-xs text-green-900">
          Rs.399/- <span className="line-through ml-1">Rs.899/-</span>
        </p>
      </div>
    </div>
  );
}
