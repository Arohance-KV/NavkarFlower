import React from "react";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

const ContactUs = () => {
  return (
    <section className="bg-[#EFE6D4] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ===== Heading ===== */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-script font-bold text-amber-900 mb-4">
            Contact Us
          </h1>
          <p className="max-w-2xl mx-auto text-gray-700 text-lg font-slab">
            We’d love to hear from you. Whether you have a question,
            need help choosing flowers, or want to place a bulk order —
            our team is here for you.
          </p>
        </div>

        {/* ===== Content Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* ===== Left: Contact Info ===== */}
          <div className="border-2 border-[#C58C8C] p-2 rounded-4xl [corner-shape:scoop]">
          <div className="bg-white rounded-4xl [corner-shape:scoop] shadow-lg p-8">
            <h2 className="text-2xl font-slab font-semibold text-amber-900 mb-6">
              Get in Touch
            </h2>

            <div className="space-y-5 text-gray-700">
              <div className="flex items-start gap-4">
                <FiPhone className="text-amber-700 mt-1" size={22} />
                <div>
                  <p className="font-medium">Phone</p>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiMail className="text-amber-700 mt-1" size={22} />
                <div>
                  <p className="font-medium">Email</p>
                  <p>support@navkarflowers.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiMapPin className="text-amber-700 mt-1" size={22} />
                <div>
                  <p className="font-medium">Address</p>
                  <p>
                    Navkar Flowers,  
                    MG Road, Ahmedabad, Gujarat – 380001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiClock className="text-amber-700 mt-1" size={22} />
                <div>
                  <p className="font-medium">Working Hours</p>
                  <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* ===== Right: Contact Form ===== */}
          <div className="border-2 border-[#C58C8C] p-2 rounded-4xl [corner-shape:scoop]">
          <div className="bg-white rounded-4xl [corner-shape:scoop] shadow-lg p-8">
            <h2 className="text-2xl font-slab font-semibold text-amber-900 mb-6">
              Send Us a Message
            </h2>

            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />

              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
              />

              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
          </div>
        </div>

        {/* ===== Bottom Note ===== */}
        <div className="text-center mt-16 text-gray-700">
          <p className="text-lg font-script text-amber-900">
            “Flowers speak the language of the heart — let us help you
            express it beautifully.”
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
