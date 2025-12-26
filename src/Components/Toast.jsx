import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const Toast = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      gradient: "from-[#B76E79] to-[#E3C1B6]",
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-white" />,
      gradient: "from-red-500 to-rose-400",
    },
    info: {
      icon: <Info className="w-5 h-5 text-white" />,
      gradient: "from-blue-500 to-sky-400",
    },
  };

  const { icon, gradient } = config[type];

  return (
    <div className="fixed top-22 right-2 z-50">
      <div
        className={`
          flex items-center gap-3
          px-5 py-4
          rounded-xl
          shadow-2xl
          text-white
          bg-linear-to-r ${gradient}
          backdrop-blur-md
          transition-all duration-300 ease-out
          ${visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
        `}
      >
        {icon}

        <p className="text-sm font-medium">{message}</p>

        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-white/80 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
