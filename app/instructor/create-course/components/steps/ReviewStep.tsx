import { FiCheckCircle } from "react-icons/fi";
import { ReviewRow } from "../ReviewRow";
import type { CourseVideo, ProgrammingCode, Asset, Quiz } from "@/types";
import { useThemeStore } from "@/store/theme.store";

interface ReviewStepProps {
  courseName: string;
  description: string;
  price: string;
  duration: string;
  certificate: string;
  requirements: string[];
  videos: CourseVideo[];
  programmingCodes: ProgrammingCode[];
  assets: Asset[];
  quizzes: Quiz[];
  submitError: string;
}

export const ReviewStep = ({
  courseName,
  description,
  price,
  duration,
  certificate,
  requirements,
  videos,
  programmingCodes,
  assets,
  quizzes,
  submitError
}: ReviewStepProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className={isDark ? "w-10 h-10 bg-green-900/30 rounded-xl flex items-center justify-center" : "w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"}>
          <FiCheckCircle size={20} className="text-green-600" />
        </div>
        <div>
          <h2 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Review & Submit</h2>
          <p className="text-xs text-slate-400">Confirm everything looks good before publishing</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={isDark ? "bg-slate-800 rounded-2xl p-5 space-y-3" : "bg-slate-50 rounded-2xl p-5 space-y-3"}>
          <ReviewRow label="Course Name" value={courseName} />
          <ReviewRow label="Description" value={description} multiline />
          <div className="grid grid-cols-2 gap-3">
            <ReviewRow label="Price" value={`₦${Number(price).toLocaleString()}`} />
            <ReviewRow label="Duration" value={`${duration} hours`} />
          </div>
          <ReviewRow label="Certificate" value={certificate} />
        </div>

        <div className={isDark ? "bg-slate-800 rounded-2xl p-5" : "bg-slate-50 rounded-2xl p-5"}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Requirements ({requirements.filter((r) => r.trim()).length})
          </p>
          <ul className="space-y-2">
            {requirements.filter((r) => r.trim()).map((r, i) => (
              <li key={i} className={isDark ? "flex items-start gap-2 text-sm text-white" : "flex items-start gap-2 text-sm text-[#111827]"}>
                <span className={isDark ? "w-5 h-5 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5" : "w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"}>
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className={isDark ? "bg-slate-800 rounded-2xl p-5" : "bg-slate-50 rounded-2xl p-5"}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Videos ({videos.length})
          </p>
          {videos.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No videos added — can be added after creating the course</p>
          ) : (
            <ul className="space-y-2">
              {videos.map((v, i) => (
                <li key={i} className={isDark ? "flex items-center gap-3 text-sm text-white" : "flex items-center gap-3 text-sm text-[#111827]"}>
                  <span className={isDark ? "w-5 h-5 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0" : "w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0"}>
                    {i + 1}
                  </span>
                  <span className="font-medium truncate">{v.videoTitle || "Untitled"}</span>
                  {v.isPreview && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold shrink-0">Preview</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={isDark ? "bg-slate-800 rounded-2xl p-5" : "bg-slate-50 rounded-2xl p-5"}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Programming Codes ({programmingCodes.length})
          </p>
          {programmingCodes.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No code snippets added</p>
          ) : (
            <ul className="space-y-2">
              {programmingCodes.map((code, i) => (
                <li key={i} className={isDark ? "flex items-center gap-3 text-sm text-white" : "flex items-center gap-3 text-sm text-[#111827]"}>
                  <span className={isDark ? "w-5 h-5 rounded-full bg-purple-900/30 text-purple-400 flex items-center justify-center text-[10px] font-bold shrink-0" : "w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0"}>
                    {i + 1}
                  </span>
                  <span className="font-medium truncate">{code.fileName || "Untitled"}</span>
                  <span className="text-xs text-slate-400">{code.language}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={isDark ? "bg-slate-800 rounded-2xl p-5" : "bg-slate-50 rounded-2xl p-5"}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Assets ({assets.length})
          </p>
          {assets.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No assets added</p>
          ) : (
            <ul className="space-y-2">
              {assets.map((asset, i) => (
                <li key={i} className={isDark ? "flex items-center gap-3 text-sm text-white" : "flex items-center gap-3 text-sm text-[#111827]"}>
                  <span className={isDark ? "w-5 h-5 rounded-full bg-orange-900/30 text-orange-400 flex items-center justify-center text-[10px] font-bold shrink-0" : "w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold shrink-0"}>
                    {i + 1}
                  </span>
                  <span className="font-medium truncate">{asset.name || "Untitled"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={isDark ? "bg-slate-800 rounded-2xl p-5" : "bg-slate-50 rounded-2xl p-5"}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Quizzes ({quizzes.length})
          </p>
          {quizzes.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No quizzes added</p>
          ) : (
            <ul className="space-y-2">
              {quizzes.map((quiz, i) => (
                <li key={i} className={isDark ? "flex items-center gap-3 text-sm text-white" : "flex items-center gap-3 text-sm text-[#111827]"}>
                  <span className={isDark ? "w-5 h-5 rounded-full bg-teal-900/30 text-teal-400 flex items-center justify-center text-[10px] font-bold shrink-0" : "w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-[10px] font-bold shrink-0"}>
                    {i + 1}
                  </span>
                  <span className="font-medium truncate">{quiz.title || "Untitled"}</span>
                  <span className="text-xs text-slate-400">{quiz.questions.length} questions</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <FiCheckCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        )}
      </div>
    </div>
  );
};
