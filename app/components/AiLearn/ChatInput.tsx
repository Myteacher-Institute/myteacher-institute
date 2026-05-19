'use client';

import { FiPaperclip, FiSend } from 'react-icons/fi';

export const ChatInput = () => (
  <div className="p-6 lg:p-8 pt-0">
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center rounded-2xl p-2 pl-6 bg-white border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all"
      >
        <input
          type="text"
          placeholder="Type your message here..."
          className="flex-1 bg-transparent focus:outline-none text-[14.5px] py-4 text-[#0F172A] placeholder:text-[#94A3B8]"
        />
        <div className="flex items-center gap-1.5 pr-2">
          <button type="button" className="p-3 text-[#94A3B8] hover:text-[#2563EB] transition-colors rounded-xl hover:bg-slate-100">
            <FiPaperclip size={20} />
          </button>
          <button type="submit" className="bg-[#2563EB] text-white p-3.5 rounded-xl shadow-md shadow-blue-100 hover:bg-blue-700 transition-all">
            <FiSend size={20} />
          </button>
        </div>
      </form>
      <p className="text-center text-[10.5px] text-[#94A3B8] mt-4">
        AI Assistant may make mistakes. Please verify important information.
      </p>
    </div>
  </div>
);