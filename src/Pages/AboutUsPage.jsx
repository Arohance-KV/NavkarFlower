import { Link } from "react-router-dom";

/* ---------------- STATIC DATA ---------------- */

const missionItems = [
  {
    icon: "🌱",
    title: "Sustainability",
    desc: "Eco-friendly sourcing and practices for a greener tomorrow.",
  },
  {
    icon: "💐",
    title: "Excellence",
    desc: "Uncompromising quality in every petal and stem.",
  },
  {
    icon: "❤️",
    title: "Passion",
    desc: "Infusing heart into every floral creation.",
  },
];

const teamMembers = [
  {
    name: "Navkar Singh",
    role: "Founder & Master Florist",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Priya Patel",
    role: "Creative Director",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Rajesh Kumar",
    role: "Sustainability Lead",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
];

const AboutUsPage = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('./assets/ProdBgImg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* CONTENT */}
      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-10 pb-15 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-6xl font-semibold font-script text-amber-900 mb-6 relative ">
              About Navkar Flowers
            </h1>
            <p className="text-xl text-amber-800 max-w-2xl mx-auto font-slab leading-relaxed">
              Where every petal tells a story of passion, elegance, and timeless beauty.
            </p>
            <nav className="flex justify-center mt-4 text-md text-[#8B3A4A] font-slab">
              <Link to="/" className="hover:text-[#8B3A4A] transition">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className=" text-gray-500">About Us</span>
            </nav>
          </div>
        </section>

        {/* Story */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-script text-[#8B3A4A] font-bold">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 font-slab leading-relaxed">
                Founded in 1995 by Navkar Singh, Navkar Flowers grew from a small
                flower stall into a premier floral destination across India.
              </p>
              <p className="text-lg text-gray-700 font-slab leading-relaxed">
                Today, we curate moments of joy through sustainable sourcing and
                thoughtful craftsmanship.
              </p>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80"
                alt="Floral workshop"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#8B3A4A]/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-10 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-5xl font-script font-bold text-[#8B3A4A] mb-5">
              Our Mission
            </h2>

            <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto font-slab">
              {missionItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition"
                >
                  <div className="w-12 h-12 bg-[#C48B9F] rounded-full flex items-center justify-center mb-4 mx-auto text-white text-xl">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-10 text-center font-slab">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-5xl font-script font-bold text-[#8B3A4A] mb-8">
              Meet Our Team
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition"
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-[#8B3A4A] font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
