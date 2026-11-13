import { BiStar as Star, BiUpArrowAlt as ArrowUpRight } from 'react-icons/bi';
import { useThemeStore } from '@/store/theme.store';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ScrollAnimate } from '@/components/ScrollAnimate';
import { useEffect, useRef, useState } from 'react';

const Testimonial = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollSyncIndex = useRef(-1);
  
  const testimonials = [
    {
      name: "Amara M.",
      location: "Lagos · UI/UX Design Path",
      initials: "AM",
      color: "bg-[#eff6ff] text-[#3b82f6]",
      text: "The AI tutor explained things 5 different ways until I actually got it. I never felt judged for asking basic questions. It's like having a genius friend available at 3am.",
      achievement: "Landed job at Flutterwave · 4 months after enrolling"
    },
    {
      name: "Chukwuemeka E.",
      location: "Enugu · Data Analysis Path",
      initials: "CE",
      color: "bg-[#ecfdf5] text-[#10b981]",
      text: "I went from knowing nothing about data to building dashboards for an NGO in 3 months. My mentor Kelechi reviewed every project personally and pushed me beyond my comfort zone.",
      achievement: "Freelancing at ₦180k/month · Started from zero"
    },
    {
      name: "Sadia A.",
      location: "Abuja · Web Development Path",
      initials: "SA",
      color: "bg-[#f5f3ff] text-[#8b5cf6]",
      text: "I tried YouTube tutorials for 6 months and got nowhere. MyTeacher's structured path + AI feedback changed everything. The AI noticed I kept making the same CSS mistake and fixed it.",
      achievement: "Junior Dev role at a fintech startup"
    }
  ];

  // Auto-scroll functionality - only advances while the section is on screen
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const el = elementRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      }
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length, elementRef]);

  // Scroll carousel horizontally to the active card (never touches page scroll)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Index change came from a user swipe - the carousel is already there
    if (scrollSyncIndex.current === currentIndex) {
      scrollSyncIndex.current = -1;
      return;
    }
    scrollSyncIndex.current = -1;

    if (container.scrollWidth <= container.clientWidth) return;

    const card = container.children[currentIndex] as HTMLElement | undefined;
    if (!card) return;

    const left = card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2;
    container.scrollTo({ left: Math.max(left, 0), behavior: 'smooth' });
  }, [currentIndex]);

  // Keep the active dot in sync when the user swipes the carousel manually
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];
    if (!cards.length) return;

    const viewportCenter = container.scrollLeft + container.clientWidth / 2;
    let nearest = 0;
    let minDistance = Infinity;

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = i;
      }
    });

    if (nearest !== currentIndex) {
      scrollSyncIndex.current = nearest;
      setCurrentIndex(nearest);
    }
  };

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);
  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <section 
      ref={elementRef}
      className={`w-full ${isDark ? "bg-slate-900" : "bg-[#FDFCF8]"} py-12 sm:py-16 overflow-x-hidden overflow-y-hidden transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-16">
        
        {/* Header Section */}
        <div className="text-center space-y-3 mb-8">
          <ScrollAnimate delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9ea] border border-[#fef3c7] text-[11px] font-bold text-[#d97706] uppercase tracking-[0.2em]">
              <Star size={14} fill="#d97706" /> Student Stories
            </div>
          </ScrollAnimate>
          <ScrollAnimate delay={100}>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${isDark ? "text-white" : "text-[#0f172a]"}`}>
              Careers transformed. Lives changed.
            </h2>
          </ScrollAnimate>
          <ScrollAnimate delay={200}>
            <p className="text-slate-500 text-base sm:text-lg font-medium max-w-xl mx-auto">
              Don&apos;t take our word for it — here&apos;s what our students achieved.
            </p>
          </ScrollAnimate>
        </div>

        {/* Testimonials - swipeable carousel on mobile/tablet, 3-col row on desktop */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="relative flex gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible overflow-x-hidden overflow-y-hidden pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {testimonials.map((item, index) => (
            <ScrollAnimate 
              key={index} 
              delay={300 + index * 100}
              className="w-[85%] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] flex-shrink-0 snap-center lg:snap-align-none"
            >
              <div 
                className={`${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow w-full h-full`}
              >
                <div className="space-y-4">
                  {/* Professional Star Rating */}
                  <div className="flex gap-0.5 text-[#f59e0b]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" strokeWidth={0} />
                    ))}
                  </div>

                  <p className={`${isDark ? "text-white" : "text-[#0f172a]"} text-sm sm:text-base font-medium leading-relaxed italic`}>
                    &quot;{item.text}&quot;
                  </p>

                  {/* Profile Section */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center font-bold text-sm`}>
                      {item.initials}
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-[#0f172a]"}`}>{item.name}</h4>
                      <p className="text-slate-400 text-xs sm:text-sm font-medium">{item.location}</p>
                    </div>
                  </div>
                </div>

                {/* Achievement Badge */}
                <div className={`mt-4 pt-4 border-t ${isDark ? "border-slate-700" : "border-slate-50"}`}>
                  <div className="flex items-center gap-1.5 text-[#10b981] font-bold text-xs">
                    <ArrowUpRight size={14} strokeWidth={3} />
                    {item.achievement}
                  </div>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>

        {/* Auto-scroll indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
