import { FiCheckCircle } from "react-icons/fi";
import { STEPS } from "../constants";

interface StepIndicatorProps {
  current: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator = ({ current, onStepClick }: StepIndicatorProps) => (
  <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      const clickable = done || i === current;
      return (
        <div key={label} className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => clickable && onStepClick(i)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${done ? "bg-blue-600 text-white" : active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"} ${clickable ? "hover:bg-blue-500" : ""}`}>
              <span suppressHydrationWarning>
                {done ? <span className="flex items-center justify-center"><FiCheckCircle size={15} /></span> : <span>{i + 1}</span>}
              </span>
            </div>
            <span className={`text-sm font-semibold hidden sm:block cursor-pointer ${active ? "text-[#111827]" : done ? "text-blue-600" : "text-slate-400"} ${clickable ? "hover:text-blue-500" : ""}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`h-px w-6 sm:w-12 shrink-0 ${i < current ? "bg-blue-600" : "bg-slate-200"}`} />}
        </div>
      );
    })}
  </div>
);
