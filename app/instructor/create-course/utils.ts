export const inputCls = (err?: string, isDark?: boolean) => {
  const baseClasses = "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors";
  
  if (isDark) {
    return `${baseClasses} ${err ? "border-red-400" : "border-slate-600"} text-white placeholder-slate-400 bg-slate-800`;
  }
  
  return `${baseClasses} ${err ? "border-red-400" : "border-black"} text-[#111827] placeholder-slate-400 bg-white`;
};
