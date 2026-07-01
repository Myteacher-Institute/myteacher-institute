"use client";

import { FiMessageSquare as MessageSquare } from "react-icons/fi";

export const FloatingActionButton = ({ mentorOpen, setMentorOpen }: any) => {
  return (
    <button
      onClick={() => setMentorOpen(!mentorOpen)}
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg shadow-green-200 flex items-center justify-center hover:bg-green-700 transition-colors z-50 cursor-pointer"
    >
      <MessageSquare size={24} strokeWidth={2} />
    </button>
  );
};
