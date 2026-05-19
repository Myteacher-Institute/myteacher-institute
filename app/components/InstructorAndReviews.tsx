import React from 'react';
import { Star, Users, PlayCircle, ArrowRight, Bot } from 'lucide-react';

const InstructorAndReviews = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Junior UI Designer",
      content: '"This course completely changed my approach to design. The practical exercises and Figma tips were exactly what I needed to land my first junior role."',
      avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "David Miller",
      role: "Web Developer",
      content: '"Marcus explains complex UX concepts in such an easy-to-understand way. The module on auto-layout saved me hours of work."',
      avatar: "https://i.pravatar.cc/150?u=david"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#FDFBF7] font-sans text-[#1A1E2E]">
      
      {/* Meet Your Instructor Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Meet your instructor</h2>
        <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col md:flex-row gap-8">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Omeke" 
            alt="Omeke Charles" 
            className="w-32 h-32 rounded-xl bg-blue-100 object-cover self-start"
          />
          <div>
            <h3 className="text-xl font-bold">Omeke Charles</h3>
            <p className="text-[#059669] font-semibold text-sm mb-4">Senior Product Designer</p>
            
            <div className="flex flex-wrap gap-4 mb-6 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 4.9 Rating</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 45k Students</span>
              <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> 12 Courses</span>
            </div>
            
            <p className="text-gray-500 text-[14px] leading-relaxed">
              Marcus is a passionate designer with over 10 years of experience building products for top tech companies. 
              He focuses on creating practical, project-based learning experiences that help students land their dream jobs.
            </p>
          </div>
        </div>
      </section>

      {/* Mentorship & AI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* 1-on-1 Mentorship */}
        <div className="bg-[#101827] text-white rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-3">1-on-1 Mentorship</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Get personalized feedback on your portfolio and career advice directly from Marcus.
            </p>
          </div>
          <button className="w-full bg-[#2546BD] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors border border-blue-400/30 cursor-pointer">
            Book a Session
          </button>
        </div>

        {/* AI Learning Assistant */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50">
          <div className="bg-[#F3E8FF] w-10 h-10 rounded-lg flex items-center justify-center mb-6">
            <Bot className="w-6 h-6 text-[#9333EA]" />
          </div>
          <h3 className="text-xl font-bold mb-3">24/7 AI Learning Assistant</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Stuck on a concept? Ask our specialized AI tutor for instant explanations and coding examples.
          </p>
          <button className="flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all cursor-pointer">
            Try it out <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Student Reviews Section */}
      <section>
        <h2 className="text-2xl font-bold mb-8">Student Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-[14px] italic leading-relaxed mb-8">
                {review.content}
              </p>
              <div className="flex items-center gap-3">
                <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                <div>
                  <p className="font-bold text-sm">{review.name}</p>
                  <p className="text-xs text-gray-400 font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default InstructorAndReviews;