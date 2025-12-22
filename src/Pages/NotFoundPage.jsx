import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: "url('/assets/ProdBgImg.png')",
      }}
    >
      {/* Card */}
      <div className="relative z-10 bg-[#fbf7f3] rounded-2xl shadow-2xl
                      px-10 py-12 max-w-md w-full text-center
                      border border-[#eadfda]">
        
        {/* Heading */}
        <h1 className="text-6xl font-slab text-amber-800 mb-4">
          404
        </h1>

        {/* Subtitle */}
        <p className="text-[#7b5a45] font-slab text-base mb-8 leading-relaxed">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2
                     bg-[#c89664] text-white px-8 py-3 rounded-lg
                     font-slab font-medium tracking-wide
                     hover:bg-[#af6c29] transition shadow-md"
        >
          <FiHome size={18} />
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
