'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import {
  ChevronDown,
  Sparkles,
  Code,
  Users,
  DollarSign,
  Star,
  User,
  Users as GroupIcon,
  ArrowRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';

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
      <Navbar />

      {/* SECTION 1: How It Works - Steps */}
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-28">
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
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
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

                <h3 className="font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* SECTION 2: Request Details Form with AI Recommendation - COMPLETED */}
      <RequestDetailsPage />
    </div>
  );
}

// Common icon SVGs, simplified for portability.
const Icons = {
  ChevronDown: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>,
  AIRecommended: () => <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
  Code: () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>,
  Users: () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
  DollarSign: () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V7"></path></svg>,
};

// Simplified star icon
const StarIcon = () => <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

const RequestDetailsPage = () => {
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
    w-full p-4 bg-gray-100 border-none rounded-xl text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 outline-none
  `;

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT COLUMN: FORM DETAILS */}
          <div className="flex-1 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-10">Request Details</h1>

            <div className="space-y-8">
              {/* Skill Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Skill / Category</label>
                <div className="relative">
                  <select className="w-full bg-gray-100 border-none rounded-xl py-4 px-5 appearance-none text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    <option>Select a category</option>
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>UI/UX Design</option>
                    <option>Mobile Development</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Learning Goal */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Learning Goal</label>
                <div className="space-y-3">
                  {learningGoals.map((goal) => (
                    <label key={goal} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${learningGoal === goal ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${learningGoal === goal ? 'border-blue-500' : 'border-gray-300'}`}>
                        {learningGoal === goal && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      </div>
                      <input type="radio" className="hidden" name="goal" checked={learningGoal === goal} onChange={() => setLearningGoal(goal)} />
                      <span className={`font-medium ${learningGoal === goal ? 'text-blue-900' : 'text-gray-600'}`}>{goal}</span>
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
                      className={`py-3 rounded-xl font-semibold border-2 transition-all ${level === l ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 cursor-pointer'}`}
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
                    className={`flex items-center justify-center py-4 rounded-xl font-semibold border-2 transition-all ${type === 'Private' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500 cursor-pointer'}`}
                  >
                    <User className="w-5 h-5 mr-2" /> Private (1-on-1)
                  </button>
                  <button
                    onClick={() => setType('Group')}
                    className={`flex items-center justify-center py-4 rounded-xl font-semibold border-2 transition-all ${type === 'Group' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500 cursor-pointer'}`}
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Tell us more about your learning goals, expectations, or any specific requirements..."
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-xl shadow-blue-100 cursor-pointer">
                Request Mentor <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: AI RECOMMENDATION - UPDATED */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="max-w-[380px] bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">

              {/* AI Recommended Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-50 p-1.5 rounded-lg">
                  <Sparkles size={18} className="text-blue-600 fill-blue-600" />
                </div>
                <span className="text-blue-600 font-bold text-sm tracking-tight">
                  AI Recommended
                </span>
              </div>
              <div className="bg-[#DBEAFE] rounded-[24px] p-5 border border-blue-100/50">
                <div className="flex flex-col gap-5">
                  {/* Header: Avatar and Name */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={mentorData.profileImage}
                        alt="Richard Raphael"
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-50 shadow-sm"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">{mentorData.name}</h3>
                      <p className="text-gray-400 text-sm font-medium">{mentorData.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-gray-400 text-xs font-semibold ml-1">({mentorData.rating})</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Code size={18} className="text-blue-500" />
                      <span className="text-[15px] font-medium">{mentorData.skills}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users size={18} className="text-blue-500" />
                      <span className="text-[15px] font-medium">{mentorData.mentees}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 font-bold">
                      <DollarSign size={18} className="text-blue-500" />
                      <span className="text-[15px]">{mentorData.price}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
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