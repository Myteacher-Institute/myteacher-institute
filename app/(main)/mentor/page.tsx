'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { useThemeStore } from '@/store/theme.store';
import {
  BiChevronDown as ChevronDown,
  BiChevronUp as ChevronUp,
  BiCode as Code,                   
  BiGroup as Users,        
  BiDollarCircle as DollarSign,    
  BiStar as Star,    
  BiUser as User,                    
  BiGroup as GroupIcon,           
  BiRightArrowAlt as ArrowRight,     
  BiSolidMagicWand as Sparkles,
  BiBulb as AIRecommended,
  BiCodeAlt as CodeIcon,
  BiDollar as DollarSignIcon,
  BiTargetLock as Target,              // Icon for step 1
  BiGitMerge as Merge,                 // Icon for step 2
  BiCheckCircle as CheckCircle,        // Icon for step 3
  BiBookOpen as Graduation            // Icon for step 4
} from 'react-icons/bi';
import Navbar from '../../components/Navbar';

export default function RequestMentorPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const steps = [
    {
      number: 1,
      title: "Tell Us Your Goal",
      description: "Fill a simple form about what you want to learn",
      icon: <Target size={40} className="text-blue-500" />
    },
    {
      number: 2,
      title: "We Match You",
      description: "We connect you with the right mentor",
      icon: <Merge size={40} className="text-blue-500" />
    },
    {
      number: 3,
      title: "Get Approved",
      description: "Receive mentor details and session plan",
      icon: <CheckCircle size={40} className="text-blue-500" />
    },
    {
      number: 4,
      title: "Start Learning",
      description: "Begin your mentorship journey",
      icon: <Graduation size={40} className="text-blue-500" />
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Navbar />

      {/* SECTION 1: How It Works - Steps */}
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="text-center mb-20">
          <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Request a Mentor
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Get personalized guidance to grow faster</p>
        </div>

        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>How It Works</h2>
          <p className={`mb-12 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Simple steps to connect with your perfect mentor</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className={`p-8 rounded-2xl border text-center hover:shadow-lg transition-shadow ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                {/* Icon from react-icons */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-700' : 'bg-blue-50'}`}>
                  {step.icon}
                </div>

                {/* Step number */}
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.number}
                </div>

                <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* SECTION 2: Request Details Form with AI Recommendation */}
      <RequestDetailsPage />
    </div>
  );
}

// Icons object updated with react-icons
const Icons = {
  ChevronDown: () => <ChevronDown className="w-5 h-5 text-gray-400" />,
  AIRecommended: () => <AIRecommended className="w-5 h-5 text-blue-500" />,
  Code: () => <CodeIcon className="w-4 h-4 text-gray-500" />,
  Users: () => <Users className="w-4 h-4 text-gray-500" />,
  DollarSign: () => <DollarSignIcon className="w-4 h-4 text-gray-500" />,
};

// Star icon component using react-icons
const StarIcon = () => <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />;

const RequestDetailsPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [learningGoal, setLearningGoal] = useState('Career Change');
  const [level, setLevel] = useState('Beginner');
  const [type, setType] = useState('Private');

  const learningGoals = [
    'Career Change',
    'Skill Enhancement',
    'Project Guidance',
    'Interview Preparation',
  ];

  const mentorData = {
    name: 'Richard Raphael',
    title: 'Senior Web Developer',
    rating: 4.9,
    stars: 5,
    skills: 'React, Node.js, TypeScript',
    mentees: '120+ mentees',
    price: '$75/session',
    bio: '10+ years experience in full-stack development. Specialized in helping beginners transition to web development careers.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150',
  };

  const inputStyles = `
    w-full p-4 border-none rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}
  `;

  return (
    <div className={`${isDark ? 'bg-slate-900' : 'bg-gray-50'} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT COLUMN: FORM DETAILS */}
          <div className={`flex-1 rounded-3xl p-8 md:p-12 shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            <h1 className={`text-3xl font-bold mb-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>Request Details</h1>

            <div className="space-y-8">
              {/* Skill Category */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Skill / Category</label>
                <div className="relative">
                  <select className={`w-full border-none rounded-xl py-4 px-5 appearance-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
                    <option>Select a category</option>
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>UI/UX Design</option>
                    <option>Mobile Development</option>
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Learning Goal */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Learning Goal</label>
                <div className="space-y-3">
                  {learningGoals.map((goal) => (
                    <label key={goal} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${learningGoal === goal ? 'border-blue-500 bg-blue-50' : `border-gray-100 hover:border-gray-200 ${isDark ? 'border-slate-700 hover:border-slate-600' : ''}`}`}>
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${learningGoal === goal ? 'border-blue-500' : `border-gray-300 ${isDark ? 'border-slate-600' : ''}`}`}>
                        {learningGoal === goal && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      </div>
                      <input type="radio" className="hidden" name="goal" checked={learningGoal === goal} onChange={() => setLearningGoal(goal)} />
                      <span className={`font-medium ${learningGoal === goal ? 'text-blue-900' : isDark ? 'text-slate-400' : 'text-gray-600'}`}>{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Skill Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`py-3 rounded-xl font-semibold border-2 transition-all ${level === l ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 cursor-pointer' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 cursor-pointer'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mentorship Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Mentorship Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setType('Private')}
                    className={`flex items-center justify-center py-4 rounded-xl font-semibold border-2 transition-all ${type === 'Private' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-pointer' : 'bg-white border-gray-100 text-gray-500 cursor-pointer'}`}
                  >
                    <User className="w-5 h-5 mr-2" /> Private (1-on-1)
                  </button>
                  <button
                    onClick={() => setType('Group')}
                    className={`flex items-center justify-center py-4 rounded-xl font-semibold border-2 transition-all ${type === 'Group' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-pointer' : 'bg-white border-gray-100 text-gray-500 cursor-pointer'}`}
                  >
                    <GroupIcon className="w-5 h-5 mr-2" /> Group
                  </button>
                </div>
              </div>

              {/* Budget Range Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Budget Range (per session)</label>
                <div className="relative">
                  <select className={inputStyles + " cursor-pointer appearance-none"}>
                    <option>Select budget range</option>
                    <option>$20 - $50</option>
                    <option>$50 - $100</option>
                    <option>$100+</option>
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Availability Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Availability</label>
                <div className="relative">
                  <select className={inputStyles + " cursor-pointer appearance-none"}>
                    <option>Select your availability</option>
                    <option>Weekdays</option>
                    <option>Weekends</option>
                    <option>Evenings</option>
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Tell us more about your learning goals, expectations, or any specific requirements..."
                  className={`w-full p-4 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-gray-200 text-gray-600'}`}
                />
              </div>

              {/* Submit Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-xl shadow-blue-100 cursor-pointer">
                Request Mentor <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: AI RECOMMENDATION */}
          <div className="w-full lg:w-105 shrink-0">
            <div className={`max-w-95 rounded-4xl p-6 shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>

              {/* AI Recommended Badge */}
              <div className={`flex items-center gap-2 mb-6 ${isDark ? 'text-slate-400' : ''}`}>
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-blue-50'}`}>
                  <Sparkles size={18} className="text-blue-600" />
                </div>
                <span className={`font-bold text-sm tracking-tight ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  AI Recommended
                </span>
              </div>
              <div className={`rounded-3xl p-5 border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-[#DBEAFE] border-blue-100/50'}`}>
                <div className="flex flex-col gap-5">
                  {/* Header: Avatar and Name */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        width={80}
                        height={80}
                        alt="Richard Raphael"
                        src={mentorData.profileImage}
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-50 shadow-sm"
                      />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{mentorData.name}</h3>
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{mentorData.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className={`text-xs font-semibold ml-1 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>({mentorData.rating})</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      <Code size={18} className="text-blue-500" />
                      <span className="text-[15px] font-medium">{mentorData.skills}</span>
                    </div>
                    <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      <Users size={18} className="text-blue-500" />
                      <span className="text-[15px] font-medium">{mentorData.mentees}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 font-bold">
                      <DollarSign size={18} className="text-blue-500" />
                      <span className="text-[15px]">{mentorData.price}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {mentorData.bio}
                  </p>

                  {/* Action Button */}
                  <button className="w-full bg-[#1d61ff] hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-100 mt-2 cursor-pointer">
                    Request This Mentor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};