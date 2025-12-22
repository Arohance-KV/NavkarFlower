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
            We'd love to hear from you. Whether you have a question,
            need help choosing flowers, or want to place a bulk order –
            our team is here for you.
          </p>
        </div>

        {/* ===== Content Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* ===== Left: Contact Info ===== */}
          <div className="border-2 border-[#C58C8C] p-2 rounded-4xl [corner-shape:scoop]">
            <div className="bg-white font-slab rounded-4xl [corner-shape:scoop] shadow-lg p-8 min-h-125 flex flex-col">
              <h2 className="text-2xl text-center font-semibold text-amber-900 mb-8">
                Get in Touch
              </h2>

              <div className="flex-1 flex flex-col justify-between">
                {/* Phone */}
                <div className="flex items-start gap-4 py-4">
                  <FiPhone className="text-amber-700 flex shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-gray-700">+91 98765 43210</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 py-4">
                  <FiMail className="text-amber-700 flex shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-700">support@navkarflowers.com</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 py-4">
                  <FiMapPin className="text-amber-700 flex shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Address</p>
                    <p className="text-gray-700">
                      Navkar Flowers, MG Road, Ahmedabad, Gujarat – 380001
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4 py-4 ">
                  <FiClock className="text-amber-700 flex shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Working Hours</p>
                    <p className="text-gray-700">Mon – Sat: 9:00 AM – 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Right: Contact Form ===== */}
          <div className="border-2 border-[#C58C8C] p-2 rounded-4xl [corner-shape:scoop]">
            <div className="bg-white font-slab rounded-4xl [corner-shape:scoop] shadow-lg p-8 min-h-125 flex flex-col">
              <h2 className="text-2xl text-center font-semibold text-amber-900 mb-8">
                Send Us a Message
              </h2>

              <form className="space-y-5 flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-900 focus:outline-none"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-900 focus:outline-none"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-900 focus:outline-none"
                />

                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-900 focus:outline-none resize-none"
                />

                <button
                  type="submit"
                  className="w-full bg-amber-700 text-white py-3 rounded-lg font-slab font-semibold hover:bg-amber-900 transition mt-auto"
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
            "Flowers speak the language of the heart – let us help you
            express it beautifully."
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;