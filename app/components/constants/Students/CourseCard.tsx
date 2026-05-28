export const CourseCard = ({ title, progress, icon, color, bg }: any) => (
  <div className="bg-white p-3 lg:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full hover:border-blue-200 transition-colors">
    <div className="flex items-center gap-2 lg:gap-4 mb-3 lg:mb-6 min-w-0">
      <div
        className={`w-8 h-8 lg:w-12 lg:h-12 ${bg} ${color} rounded-lg lg:rounded-xl flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <h4 className="font-bold text-[11px] lg:text-base leading-tight line-clamp-2 text-slate-800">
        {title}
      </h4>
    </div>
    <div className="mt-auto">
      <div className="flex justify-between text-[8px] lg:text-[11px] font-bold text-slate-400 mb-1.5 uppercase">
        <span>PROGRESS</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1 lg:h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <button className="w-full py-2 lg:py-3 bg-blue-600 text-white text-[10px] lg:text-sm font-bold rounded-lg lg:rounded-xl active:scale-95 transition-transform hover:bg-blue-700 cursor-pointer">
        Continue
      </button>
    </div>
  </div>
);