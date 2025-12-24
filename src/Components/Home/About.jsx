import React from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- CONSTANT DATA ---------------- */

const flowerCards = [
  { img: "/assets/Flower1.png", top: true },
  { img: "/assets/Flower2.png", top: true },
  { img: "/assets/Flower3.png", top: false },
  { img: "/assets/Flower4.png", top: false },
];

const kidsCards = Array(4).fill({
  img: "/assets/kids.png",
  text: "Love at first sight",
});

/* ---------------- COMPONENT ---------------- */

const About = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-[#EFE6D4] overflow-hidden py-20">

      {/* ====== ADDED HEADING ====== */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20">
        <h1 className="text-5xl font-script font-bold text-amber-900">
          About Us
        </h1>
      </div>
      {/* ====== END HEADING ====== */}

      {/* CENTER BACKGROUND IMAGE */}
      <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden">
        <div className="border-2 border-amber-800 p-2 rounded-4xl [corner-shape:scoop]">
          <img
            src="/assets/aboutBg.png"
            alt="Navkar Flowers"
            className="w-full rounded-4xl [corner-shape:scoop]"
          />
        </div>
      </div>

      {/* TOP LEFT CARD */}
      <div className="absolute top-8 left-50 w-72 bg-[#FFFDF9] border-2 border-amber-800 p-2 shadow-md">
        <div className="border-2 border-amber-800 p-2">

          {/* FLOWER GRID */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {flowerCards.map((item, index) => (
              <div
                key={index}
                className={`bg-[#FFFDF9] border-2 border-amber-900 p-2 relative
                  ${
                    item.top
                      ? "rounded-[150px_150px_0px_0px]"
                      : "rounded-[0px_0px_150px_150px]"
                  }`}
              >
                <div className="relative z-10 p-2 text-center">
                  {item.top && (
                    <img
                      src={item.img}
                      className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-amber-800"
                      alt="Flower"
                    />
                  )}

                  <p className="text-xs font-script text-amber-900 leading-tight py-2">
                    Real-looking flowers Zero maintenance
                  </p>
                  <p className="text-xs font-slab text-amber-900 leading-tight">
                    Moment fade flowers don't
                  </p>

                  {!item.top && (
                    <img
                      src={item.img}
                      className="w-20 h-20 rounded-full mx-auto mt-2 border-2 border-amber-800"
                      alt="Flower"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-center font-slab font-medium text-amber-900 text-lg mb-2">
            Real-looking flowers
          </h3>
          <p className="text-xl text-center font-script text-amber-900 mb-3">
            Luxury artificial flowers designed for those who appreciate elegance,
            realism, and effortless beauty.
          </p>
        </div>
      </div>

      {/* TOP RIGHT CARD */}
      <div className="absolute top-8 right-50 w-72 bg-[#FFFDF9] border-2 border-amber-800 p-2">
        <div className="border-2 border-amber-800 p-2">

          <div className="bg-[#FFFDF9] border-2 border-amber-800 rounded-2xl [corner-shape:scoop] p-3 mb-3 text-center">
            <h3 className="font-slab text-amber-900 text-xl mb-2 font-bold">
              Where beauty never fades.
            </h3>
            <p className="text-xl font-script text-[#7A3E3E]/80 mb-4">
              Navkar flowers perfected for every moment.
            </p>
            <button
            onClick={() => navigate("/product")}
            className="border border-amber-900 text-amber-900 font-slab rounded-xl mt-4 px-10 py-3 hover:bg-amber-900 hover:text-white transition"
          >
            Shop Now
          </button>
          </div>

          <div className="bg-[#FFFDF9] border-2 border-amber-800 rounded-2xl [corner-shape:scoop] overflow-hidden">
            <img
              src="/assets/girl.png"
              alt="Woman with flowers"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM CARD */}
      <div className="absolute bottom-5 right-50 w-72 bg-[#FFFDF9] border-2 border-amber-800 p-2">
        <div className="border-2 border-amber-800 p-2">

          <p className="text-xl text-amber-900 font-script mb-4 text-center">
            Inspired by nature and perfected by design, our flowers celebrate
            love, memories, and everyday beauty without ever fading
          </p>

          <div className="grid grid-cols-2 gap-2">
            {kidsCards.map((item, index) => (
              <div
                key={index}
                className="bg-white p-1"
                style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
              >
                <div className="text-center">
                  <img src={item.img} className="w-full mb-1" />
                  <p className="text-sm font-script text-amber-900">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
