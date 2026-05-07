'use client';
import Image from 'next/image';

export default function RequestMentorPage() {
  const steps = [
    { 
      number: 1, 
      title: "Tell Us Your Goal", 
      description: "Fill a simple form about what you want to learn", 
      iconSrc: "/Frame.svg"
    },
    { 
      number: 2, 
      title: "We Match You", 
      description: "We connect you with the right mentor", 
      iconSrc: "/Frame (1).svg"
    },
    { 
      number: 3, 
      title: "Get Approved", 
      description: "Receive mentor details and session plan", 
      iconSrc: "/Frame (2).svg"
    },
    { 
      number: 4, 
      title: "Start Learning", 
      description: "Begin your mentorship journey", 
      iconSrc: "/Frame (3).svg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 md:px-[8%] py-4 flex justify-between items-center sticky top-0 z-[60] border-b border-gray-100">
        <div className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Logo" className="w-28 md:w-44 h-10 object-contain" />
        </div>
        <nav className="hidden lg:flex gap-8 text-sm font-semibold text-gray-600">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="/courses" className="hover:text-blue-600 transition-colors">Courses</a>
          <a href="/request-mentor" className="text-blue-600 transition-colors">Request Mentor</a>
          <a href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <button className="text-[12px] md:text-sm font-bold text-gray-700 hover:text-blue-600">Log In</button>
          <button className="bg-[#1A1E2E] text-white px-3 py-2 md:px-6 md:py-2.5 rounded-lg text-[12px] md:text-sm font-bold hover:bg-black">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Request a Mentor
          </h1>
          <p className="text-xl text-gray-500">Get personalized guidance to grow faster</p>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">How It Works</h2>
          <p className="text-gray-400 mb-12">Simple steps to connect with your perfect mentor</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="bg-white p-8 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                {/* Icon from public folder */}
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img 
                    src={step.iconSrc} 
                    alt={step.title}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                
                {/* Step number */}
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.number}
                </div>
                
                <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}