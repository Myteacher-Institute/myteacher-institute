import { FiX as X, FiMessageCircle as MessageCircle } from "react-icons/fi";
import { MentorWidget } from "./MentorWidget";

interface FloatingActionButtonProps {
  mentorOpen: boolean;
  setMentorOpen: (open: boolean) => void;
}

export const FloatingActionButton = ({ mentorOpen, setMentorOpen }: FloatingActionButtonProps) => (
  <div className="lg:hidden fixed bottom-6 right-6 z-60">
    {mentorOpen && (
      <div className="absolute bottom-20 right-0 w-[calc(100vw-48px)] max-w-[320px] bg-blue-600 rounded-4xl p-7 shadow-2xl animate-in slide-in-from-bottom-10 z-110">
        <div className="absolute top-5 right-5 z-120">
          <button
            onClick={() => setMentorOpen(false)}
            className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 cursor-pointer"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
        <MentorWidget />
      </div>
    )}
    <button
      onClick={() => setMentorOpen(!mentorOpen)}
      className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center border-4 border-white active:scale-95 transition-all z-100 relative cursor-pointer"
    >
      {mentorOpen ? <X size={26} strokeWidth={2.5} /> : <MessageCircle size={26} strokeWidth={2.5} />}
    </button>
  </div>
);