'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiVideo, FiMessageCircle, FiCalendar, FiTarget, FiAward, FiStar } from 'react-icons/fi';
import { useThemeStore } from '@/store/theme.store';
import { mentorService, Mentor } from '@/services/mentor.service';

const MentorMiniCard = ({ name, role, initial, color }: { name: string; role: string; initial: string; color: string }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? "bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-700 flex flex-col items-center text-center" : "bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"}>
      <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-[#0F1C2E] font-bold mb-3 text-lg border-2 border-white shadow-sm`}>
        {initial}
      </div>
      <p className={isDark ? "font-bold text-base text-white" : "font-bold text-base text-[#0F1C2E]"}>{name}</p>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">{role}</p>
      <div className="flex gap-0.5 text-orange-400 mt-2">
        {[...Array(5)].map((_, i) => <FiStar key={i} size={12} fill="currentColor" />)}
      </div>
    </div>
  );
};

// Avatar colors cycled per mentor card
const AVATAR_COLORS = ['bg-blue-100', 'bg-emerald-100', 'bg-violet-100'];

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const MentorshipSection = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [totalMentors, setTotalMentors] = useState(0);

  // Fetch a preview of available mentors from the backend — max 3 shown here
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await mentorService.getMentors(3);
        if (!cancelled && res.status === 'success') {
          setMentors(res.mentors ?? []);
          setTotalMentors(res.total ?? 0);
        }
      } catch {
        // Section still renders with fallback content when the API is unreachable
      }
    };
    const t = setTimeout(load, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

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
      <div className={isDark ? "bg-[linear-gradient(135deg,#1e3a5f_0%,#2d1f4e_100%)] p-10 rounded-[3rem] h-110 grid grid-cols-2 gap-6 relative cursor-pointer" : "bg-[linear-gradient(135deg,#E8FAF3_0%,#EDE9FE_100%)] p-10 rounded-[3rem] h-110 grid grid-cols-2 gap-6 relative cursor-pointer"}>
        {mentors.length > 0 ? (
          <>
            {mentors.slice(0, 3).map((mentor, index) => (
              <MentorMiniCard
                key={mentor._id}
                name={mentor.name}
                role={mentor.specialization}
                initial={getInitials(mentor.name)}
                color={AVATAR_COLORS[index % AVATAR_COLORS.length]}
              />
            ))}
            {/* Fill remaining grid slots up to 4 so the layout stays balanced */}
            {mentors.length < 3 &&
              Array.from({ length: 3 - Math.max(mentors.length, 1) }).map((_, i) => (
                <div key={`placeholder-${i}`} />
              ))}
          </>
        ) : (
          <>
            <MentorMiniCard name="Fatima A." role="Senior UX Designer" initial="FA" color="bg-blue-100" />

            <MentorMiniCard name="Kelechi O." role="Data Scientist" initial="KO" color="bg-emerald-100" />

            <MentorMiniCard name="Tobi M." role="Full-Stack Dev" initial="TM" color="bg-violet-100" />
          </>
        )}

        <div
          onClick={() => router.push('/mentors')}
          role="button"
          aria-label="Browse all expert mentors"
          className={isDark ? "bg-slate-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center text-white shadow-xl hover:bg-slate-600 transition-colors cursor-pointer" : "bg-[#0F1C2E] p-6 rounded-2xl flex flex-col items-center justify-center text-center text-white shadow-xl hover:bg-slate-800 transition-colors cursor-pointer"}>

          <FiAward size={32} className="mb-2 text-yellow-400" />

          <p className="font-bold text-base leading-tight text-white/90 cursor-pointer ">
            {totalMentors > 0 ? `${totalMentors}+ Expert Mentors Ready` : '180+ Expert Mentors Ready'}
          </p>
        </div>
      </div>

      {/* Content Side */}
      <div className="lg:pl-10">
        <div className={isDark ? "flex items-center gap-2 text-indigo-400 bg-indigo-900/30 w-fit px-3 py-1.5 rounded-md font-black text-[11px] uppercase tracking-widest mb-6" : "flex items-center gap-2 text-indigo-700 bg-indigo-50 w-fit px-3 py-1.5 rounded-md font-black text-[11px] uppercase tracking-widest mb-6"}>
          <FiAward /> Mentorship
        </div>
        <h2 className={isDark ? "text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.1]" : "text-4xl lg:text-5xl font-black text-[#0F1C2E] mb-6 leading-[1.1]"}>
          Need a 1-1 Private or Corporate Mentorship
        </h2>
        <p className={isDark ? "text-slate-400 mb-10 text-xl leading-relaxed max-w-lg" : "text-[#4A5E7A] mb-10 text-xl leading-relaxed max-w-lg"}>
          Get matched with industry professionals who give personalized feedback, career guidance, and accountability.
        </p>

        <ul className="space-y-5 mb-12">
          {benefits.map((item, i) => (
            <li key={i} className={isDark ? "flex items-center gap-4 text-white font-semibold text-base" : "flex items-center gap-4 text-[#0F1C2E] font-semibold text-base"}>
              <div className={`p-2.5 rounded-xl ${item.color}`}>
                <item.icon size={20} />
              </div>
              {item.text}
            </li>
          ))}
        </ul>

        <button onClick={() => router.push('/mentors')} className={isDark ? "bg-[#1E40AF] text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center gap-3 cursor-pointer" : "bg-[#1E40AF] text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 cursor-pointer"}>
          Explore Mentorship <span className="text-xl">&rarr;</span>
        </button>
      </div>
    </section>
  );
};
