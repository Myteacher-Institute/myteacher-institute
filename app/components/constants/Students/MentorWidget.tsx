import { FiUser as User } from "react-icons/fi";

export const MentorWidget = () => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
      <span className="text-white">
        <User size={24} strokeWidth={1.5} />
      </span>
    </div>
    <h4 className="text-lg font-bold mb-2 leading-tight text-white">
      Work with a mentor
    </h4>
    <p className="text-blue-100 text-xs mb-6 max-w-xs">
      Get guidance from industry experts Omeke Charles at Myteacher. Accelerate your growth.
    </p>
    <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl shadow-md active:bg-blue-50 transition-colors hover:bg-slate-50 cursor-pointer">
      Book Now
    </button>
  </div>
);