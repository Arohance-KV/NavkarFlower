import { Link } from "react-router-dom";
import { FiAlertTriangle, FiHome } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
          <FiAlertTriangle className="text-amber-600" size={32} />
        </div>
      </div>

      {/* Text */}
      <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
        404
      </h1>

      <p className="text-gray-600 text-base mb-8">
        Oops! The page you’re looking for doesn’t exist or may have
        been moved.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
          bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
        >
          <FiHome />
          Go Home
        </Link>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
          bg-amber-600 text-white hover:bg-amber-700 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
