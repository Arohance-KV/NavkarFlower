import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const products = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  name: "Pink Flower",
  price: "₹ 399/-",
  image: "/assets/Bukey.png",
}));

export default function Product() {
  return (
    <section
      className="min-h-screen py-16 px-4 md:px-5 bg-[#FBF5ED]"
      style={{
        backgroundImage: "url('/assets/ProdBgImg.png')",
        backgroundSize: "cover",
      }}
    >
      {/* PAGE HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-script font-bold text-amber-900 mb-2">
          Our Products
        </h1>
        <p className="text-sm font-slab text-[#6F8A6D]">
          <Link
            to="/"
            className="hover:underline hover:text-[#8B3A4A] transition"
          >
            Home
          </Link>
          <span className="mx-1">/</span>
          <span>Products</span>
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-7xl mx-auto bg-[#FFFDF8] border border-[#D6B6A5] rounded-xl p-4 flex flex-wrap gap-3 justify-between items-center mb-10">
        
        {/* Search Input with Icon */}
        <div className="relative w-full md:w-64">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B3A4A]"
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-[#D6B6A5] pl-10 pr-4 py-2 rounded-md text-sm
                       focus:outline-none focus:ring-1 focus:ring-[#B79C5A]"
          />
        </div>

        <select className="border border-[#D6B6A5] px-3 py-2 rounded-md text-sm">
          <option>All Categories</option>
        </select>

        <select className="border border-[#D6B6A5] px-3 py-2 rounded-md text-sm">
          <option>Sort by: Best Selling</option>
        </select>

        <button className="bg-[#B79C5A] text-white px-6 py-2 rounded-md text-sm hover:bg-[#a6894f] transition">
          Filter
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* LEFT SIDEBAR */}
        <aside className="md:col-span-1 space-y-6">
          {/* Categories */}
          <div className="border border-[#C58C8C] p-2 rounded-[18px]">
            <div className="bg-[#eae5d7] border border-[#C58C8C] rounded-[14px] [corner-shape:scoop] p-5">
              <h3 className="text-center font-slab text-lg text-[#6F8A6D] mb-2">
                Categories
              </h3>

              <img
                src="./assets/Lleaf.png"
                alt="leaf"
                className="w-20 mx-auto mb-4 opacity-80"
              />

              <ul className="space-y-3 text-sm text-[#6F8A6D]">
                {[
                  "All Flowers",
                  "Rose",
                  "Sun flower",
                  "Blue flowers",
                  "Red Rose",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 border-b border-[#C9B6A4] pb-2 last:border-b-0"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#C9A25D] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price Range */}
          <div className="border border-[#C58C8C] p-2 rounded-[18px]">
            <div className="bg-[#eae5d7] border border-[#C58C8C] rounded-[14px] [corner-shape:scoop] p-5">
              <h3 className="text-center font-slab text-lg text-[#6F8A6D] mb-2">
                Price range
              </h3>

              <img
                src="./assets/Lleaf.png"
                alt="leaf"
                className="w-20 mx-auto mb-4 opacity-80"
              />

              <div className="flex justify-between text-sm text-[#6F8A6D] mb-2">
                <span>Rs.200/-</span>
                <span>Rs.1200/-</span>
              </div>

              <div className="relative h-2 bg-[#b38530] rounded-full mb-6">
                <span className="absolute left-1/2 -top-1 w-4 h-4 bg-white border-2 border-[#C58C8C] rounded-full" />
              </div>

              <button className="w-full bg-[#C9A25D] text-white py-2 rounded-md text-sm font-slab hover:bg-[#b48f52] transition">
                Apply
              </button>
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="md:col-span-3">
          <div className="border-2 border-amber-700 p-2 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#FFFDF8] border border-[#c07a54] rounded-xl p-4 text-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />

                  <h4 className="font-slab text-[#8B3A4A] text-left">
                    {product.name}
                  </h4>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-[#8B3A4A]/70">
                      {product.price}
                    </p>
                    <button className="bg-[#B79C5A] text-white text-xs px-4 py-1 rounded-full hover:bg-[#a6894f] transition">
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-10 text-sm gap-2">
              {[1, 2, 3, 4, 5, "...", 10].map((p, i) => (
                <button
                  key={i}
                  className="px-3 py-1 border border-[#D6B6A5] rounded hover:bg-[#B79C5A] hover:text-white transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
