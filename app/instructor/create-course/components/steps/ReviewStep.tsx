import { FiCheckCircle } from "react-icons/fi";
import { ReviewRow } from "../ReviewRow";
import { stripHtml } from "@/lib/htmlUtils";
import type { Chapter } from "@/types";
import { useThemeStore } from "@/store/theme.store";

interface ReviewStepProps {
  courseName: string;
  description: string;
  price: string;
  duration: string;
  certificate: string;
  requirements: string[];
  chapters: Chapter[];
  submitError: string;
}

const lessonCount = (chapter: Chapter): number => chapter.videos.length + chapter.quizzes.length;

export const ReviewStep = ({
  courseName,
  description,
  price,
  duration,
  certificate,
  requirements,
  chapters,
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
          <ReviewRow label="Description" value={stripHtml(description)} multiline />
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

        {chapters.length === 0 ? (
          <div className={isDark ? "bg-slate-800 rounded-2xl p-5" : "bg-slate-50 rounded-2xl p-5"}>
            <p className="text-sm text-slate-400 italic">No chapters added — can be added after creating the course</p>
          </div>
        ) : (
          chapters.map((chapter, ci) => (
            <div key={ci} className={isDark ? "bg-slate-800 rounded-2xl p-5" : "bg-slate-50 rounded-2xl p-5"}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Chapter {ci + 1}: {chapter.title || "Untitled"} ({lessonCount(chapter)} lessons)
                </p>
              </div>

              {chapter.explanation && (
                <p className="text-xs text-slate-400 italic mb-3 line-clamp-2">{stripHtml(chapter.explanation)}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={isDark ? "bg-slate-900/60 rounded-xl p-3" : "bg-white rounded-xl p-3"}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Videos ({chapter.videos.length})</p>
                  {chapter.videos.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">None</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {chapter.videos.map((v, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span>
                          <span className="font-medium truncate">{v.videoTitle || "Untitled"}</span>
                          {v.isPreview && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold shrink-0">Preview</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={isDark ? "bg-slate-900/60 rounded-xl p-3" : "bg-white rounded-xl p-3"}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Codes ({chapter.programmingCodes.length})</p>
                  {chapter.programmingCodes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">None</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {chapter.programmingCodes.map((code, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span>
                          <span className="font-medium truncate">{code.fileName || "Untitled"}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={isDark ? "bg-slate-900/60 rounded-xl p-3" : "bg-white rounded-xl p-3"}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assets ({chapter.assets.length})</p>
                  {chapter.assets.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">None</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {chapter.assets.map((asset, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span>
                          <span className="font-medium truncate">{asset.name || "Untitled"}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={isDark ? "bg-slate-900/60 rounded-xl p-3" : "bg-white rounded-xl p-3"}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quizzes ({chapter.quizzes.length})</p>
                  {chapter.quizzes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">None</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {chapter.quizzes.map((quiz, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span>
                          <span className="font-medium truncate">{quiz.title || "Untitled"}</span>
                          <span className="text-[10px] text-slate-400">{quiz.questions.length} q</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

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
