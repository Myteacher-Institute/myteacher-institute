'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiVideo, FiMessageCircle, FiCalendar, FiTarget, FiAward, FiStar } from 'react-icons/fi';
import { useThemeStore } from '@/store/theme.store';
import { mentorService, Mentor } from '@/services/mentor.service';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ScrollAnimate } from '@/components/ScrollAnimate';

const MentorMiniCard = ({ name, role, initial, color }: { name: string; role: string; initial: string; color: string }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? "bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-700 flex flex-col items-center text-center" : "bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"}>
      <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full ${color} flex items-center justify-center text-[#0F1C2E] font-bold mb-3 text-base sm:text-lg border-2 border-white shadow-sm`}>
        {initial}
      </div>
      <p className={isDark ? "font-bold text-sm sm:text-base text-white" : "font-bold text-sm sm:text-base text-[#0F1C2E]"}>{name}</p>
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
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

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
    <section
      ref={elementRef}
      className={`py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-20 items-center font-sans transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Visual Side */}
      <ScrollAnimate delay={0}>
        <div className={`${isDark ? "bg-[linear-gradient(135deg,#1e3a5f_0%,#2d1f4e_100%)]" : "bg-[linear-gradient(135deg,#E8FAF3_0%,#EDE9FE_100%]"} p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] h-auto sm:h-110 grid grid-cols-2 gap-4 sm:gap-6 relative cursor-pointer`}>
          {mentors.length > 0 ? (
            <>
              {mentors.slice(0, 3).map((mentor, index) => (
                <ScrollAnimate key={mentor._id} delay={100 + index * 50}>
                  <MentorMiniCard
                    name={mentor.name}
                    role={mentor.specialization}
                    initial={getInitials(mentor.name)}
                    color={AVATAR_COLORS[index % AVATAR_COLORS.length]}
                  />
                </ScrollAnimate>
              ))}
              {/* Fill remaining grid slots up to 4 so the layout stays balanced */}
              {mentors.length < 3 &&
                Array.from({ length: 3 - Math.max(mentors.length, 1) }).map((_, i) => (
                  <div key={`placeholder-${i}`} />
                ))}
            </>
          ) : (
            <>
              <ScrollAnimate delay={100}>
                <MentorMiniCard name="Fatima A." role="Senior UX Designer" initial="FA" color="bg-blue-100" />
              </ScrollAnimate>
              <ScrollAnimate delay={150}>
                <MentorMiniCard name="Kelechi O." role="Data Scientist" initial="KO" color="bg-emerald-100" />
              </ScrollAnimate>
              <ScrollAnimate delay={200}>
                <MentorMiniCard name="Tobi M." role="Full-Stack Dev" initial="TM" color="bg-violet-100" />
              </ScrollAnimate>
            </>
          )}

          <ScrollAnimate delay={250}>
            <div
              onClick={() => router.push('/mentors')}
              role="button"
              aria-label="Browse all expert mentors"
              className={isDark ? "bg-slate-700 p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-center text-center text-white shadow-xl hover:bg-slate-600 transition-colors cursor-pointer" : "bg-[#0F1C2E] p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-center text-center text-white shadow-xl hover:bg-slate-800 transition-colors cursor-pointer"}>

              <FiAward size={32} className="mb-2 text-yellow-400" />

              <p className="font-bold text-sm sm:text-base leading-tight text-white/90 cursor-pointer">
                {totalMentors > 0 ? `${totalMentors}+ Expert Mentors Ready` : '180+ Expert Mentors Ready'}
              </p>
            </div>
          </ScrollAnimate>
        </div>
      </ScrollAnimate>

      {/* Content Side */}
      <div className="lg:pl-10">
        <ScrollAnimate delay={300}>
          <div className={isDark ? "flex items-center gap-2 text-indigo-400 bg-indigo-900/30 w-fit px-3 py-1.5 rounded-md font-black text-[11px] uppercase tracking-widest mb-6" : "flex items-center gap-2 text-indigo-700 bg-indigo-50 w-fit px-3 py-1.5 rounded-md font-black text-[11px] uppercase tracking-widest mb-6"}>
            <FiAward /> Mentorship
          </div>
        </ScrollAnimate>
        <ScrollAnimate delay={400}>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-[1.1] ${isDark ? "text-white" : "text-[#0F1C2E]"}`}>
            Need a 1-1 Private or Corporate Mentorship
          </h2>
        </ScrollAnimate>
        <ScrollAnimate delay={500}>
          <p className={isDark ? "text-slate-400 mb-8 sm:mb-10 text-lg sm:text-xl leading-relaxed max-w-lg" : "text-[#4A5E7A] mb-8 sm:mb-10 text-lg sm:text-xl leading-relaxed max-w-lg"}>
            Get matched with industry professionals who give personalized feedback, career guidance, and accountability.
          </p>
        </ScrollAnimate>

        <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-12">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <ScrollAnimate key={i} delay={600 + i * 100}>
                <li className={`flex items-center gap-4 font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-[#0F1C2E]"}`}>
                  <div className={`p-2 sm:p-2.5 rounded-xl ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  {item.text}
                </li>
              </ScrollAnimate>
            );
          })}
        </ul>

        <ScrollAnimate delay={1000}>
          <button onClick={() => router.push('/mentors')} className={`${isDark ? "bg-[#1E40AF] hover:bg-blue-800" : "bg-[#1E40AF] hover:bg-slate-800"} text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer w-full sm:w-auto justify-center`}>
            Explore Mentorship <span className="text-xl">&rarr;</span>
          </button>
        </ScrollAnimate>
      </div>
    </section>
  );
};
