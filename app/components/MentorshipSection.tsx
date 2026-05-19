import { FiVideo, FiMessageCircle, FiCalendar, FiTarget, FiAward, FiStar } from 'react-icons/fi';

const MentorMiniCard = ({ name, role, initial, color }: { name: string; role: string; initial: string; color: string }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
    <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-[#0F1C2E] font-bold mb-3 text-lg border-2 border-white shadow-sm`}>
      {initial}
    </div>
    <p className="font-bold text-sm text-[#0F1C2E]">{name}</p>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{role}</p>
    <div className="flex gap-0.5 text-orange-400 mt-2">
      {[...Array(5)].map((_, i) => <FiStar key={i} size={10} fill="currentColor" />)}
    </div>
  </div>
);

export const MentorshipSection = () => {
  const benefits = [
    { icon: FiVideo,
        text: "Live video sessions with your dedicated mentor",
        color: "bg-[#E8FAF3] text-[#1A8A5C]"
    },
    { icon: FiMessageCircle,
        text: "Direct messaging and Chats",
        color: "bg-[#EDE9FE] text-[#6D28D9]"
    },
    { icon: FiCalendar,
        text: "Flexible scheduling — your timezone, your pace",
        color: "bg-[#FEF3C7] text-[#B45309]"
    },
    { icon: FiTarget,
        text: "Custom learning plan built just for your goals",
        color: "bg-[#FEE2E2] text-[#B91C1C]"
    },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center font-sans">
      {/* Visual Side */}
      <div className="bg-[linear-gradient(135deg,#E8FAF3_0%,#EDE9FE_100%)] p-10 rounded-[3rem] h-110 grid grid-cols-2 gap-6 relative cursor-pointer ">
        <MentorMiniCard name="Fatima A." role="Senior UX Designer" initial="FA" color="bg-blue-100" />

        <MentorMiniCard name="Kelechi O." role="Data Scientist" initial="KO" color="bg-emerald-100" />

        <MentorMiniCard name="Tobi M." role="Full-Stack Dev" initial="TM" color="bg-violet-100" />

        <div className="bg-[#0F1C2E] p-6 rounded-2xl flex flex-col items-center justify-center text-center text-white shadow-xl">
            
          <FiAward size={32} className="mb-2 text-yellow-400" />

          <p className="font-bold text-sm leading-tight text-white/90 cursor-pointer ">180+ Expert Mentors Ready</p>
        </div>
      </div>

      {/* Content Side */}
      <div className="lg:pl-10">
        <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 w-fit px-3 py-1.5 rounded-md font-black text-[10px] uppercase tracking-widest mb-6">
          <FiAward /> Mentorship
        </div>
        <h2 className="text-3xl lg:text-4xl font-black text-[#0F1C2E] mb-6 leading-[1.1]">
          Need a 1-1 Private or Corporate Mentorship
        </h2>
        <p className="text-[#4A5E7A] mb-10 text-lg leading-relaxed max-w-lg">
          Get matched with industry professionals who give personalized feedback, career guidance, and accountability.
        </p>
        
        <ul className="space-y-5 mb-12">
          {benefits.map((item, i) => (
            <li key={i} className="flex items-center gap-4 text-[#0F1C2E] font-semibold text-sm">
              <div className={`p-2.5 rounded-xl ${item.color}`}>
                <item.icon size={20} />
              </div>
              {item.text}
            </li>
          ))}
        </ul>

        <button className="bg-[#1E40AF] text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 cursor-pointer ">
          Explore Mentorship <span className="text-xl">→</span>
        </button>
      </div>
    </section>
  );
};