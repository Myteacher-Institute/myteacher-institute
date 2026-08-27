"use client";

import { useState } from "react";
import {
  FiBookOpen,
  FiChevronDown,
  FiChevronUp,
  FiCode,
  FiFilm,
  FiHelpCircle,
  FiPaperclip,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { Field } from "../Field";
import { inputCls } from "../../utils";
import { useThemeStore } from "@/store/theme.store";
import { RichTextEditor } from "@/app/components/RichTextEditor";
import type { Chapter } from "@/types";
import { VideosStep } from "./VideosStep";
import { ProgrammingCodesStep } from "./ProgrammingCodesStep";
import { AssetsStep } from "./AssetsStep";
import { QuizzesStep } from "./QuizzesStep";

interface ChaptersStepProps {
  chapters: Chapter[];
  setChapters: (value: Chapter[]) => void;
  activeChapter: number;
  setActiveChapter: (value: number) => void;
  videoUploadState: Record<string, { uploading: boolean; progress: number; error: string; stage?: string }>;
  fieldErrors: Record<string, string>;
  onVideoFileSelect: (chapterIndex: number, videoIndex: number, file: File) => void;
  onYouTubeAuth: (authUrl?: string) => void;
  onDriveAuth: () => void;
}

type TabKey = "videos" | "codes" | "assets" | "quizzes";

const TABS: Array<{ key: TabKey; label: string; icon: typeof FiFilm }> = [
  { key: "videos", label: "Videos", icon: FiFilm },
  { key: "codes", label: "Programming Codes", icon: FiCode },
  { key: "assets", label: "Assets", icon: FiPaperclip },
  { key: "quizzes", label: "Quizzes", icon: FiHelpCircle },
];

export const ChaptersStep = ({
  chapters,
  setChapters,
  activeChapter,
  setActiveChapter,
  videoUploadState,
  fieldErrors,
  onVideoFileSelect,
  onYouTubeAuth,
  onDriveAuth,
}: ChaptersStepProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [tab, setTab] = useState<TabKey>("videos");

  const addChapter = () => {
    const next: Chapter = {
      title: `Chapter ${chapters.length + 1}`,
      explanation: "",
      videos: [],
      programmingCodes: [],
      assets: [],
      quizzes: [],
    };
    setChapters([...chapters, next]);
    setActiveChapter(chapters.length);
  };

  const removeChapter = (ci: number) => {
    const next = chapters.filter((_, idx) => idx !== ci);
    setChapters(next);
    if (activeChapter >= next.length) setActiveChapter(Math.max(0, next.length - 1));
    else if (ci < activeChapter) setActiveChapter(activeChapter - 1);
  };

  const moveChapter = (ci: number, dir: -1 | 1) => {
    const target = ci + dir;
    if (target < 0 || target >= chapters.length) return;
    const next = [...chapters];
    [next[ci], next[target]] = [next[target], next[ci]];
    setChapters(next);
    setActiveChapter(target);
  };

  const updateChapterField = <K extends keyof Chapter>(ci: number, field: K, value: Chapter[K]) => {
    const next = chapters.map((c, idx) => (idx === ci ? { ...c, [field]: value } : c));
    setChapters(next);
  };

  const active = chapters[activeChapter];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className={isDark ? "w-10 h-10 bg-indigo-900/30 rounded-xl flex items-center justify-center" : "w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"}>
          <FiBookOpen size={20} className="text-indigo-600" />
        </div>
        <div>
          <h2 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Course Chapters</h2>
          <p className="text-xs text-slate-400">Organize your course into chapters — each holds its own videos, code, assets and quizzes</p>
        </div>
      </div>

      {fieldErrors.chapters && <p className="text-red-500 text-xs mb-4">{fieldErrors.chapters}</p>}

      {chapters.length === 0 ? (
        <div className={isDark ? "text-center py-10 border-2 border-dashed border-slate-700 rounded-2xl mb-4" : "text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl mb-4"}>
          <FiBookOpen size={32} className={isDark ? "text-slate-600 mx-auto mb-3" : "text-slate-300 mx-auto mb-3"} />
          <p className="text-sm text-slate-400 font-medium">No chapters yet</p>
          <p className="text-xs text-slate-300 mt-1 mb-4">Organize your course into chapters — each holds its own videos, code, assets and quizzes</p>
          <button
            type="button"
            onClick={addChapter}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2.5 rounded-xl border border-dashed border-indigo-400/50 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            <FiPlus size={16} /> Add Chapter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Chapter list */}
          <div className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-2xl p-3 space-y-2" : "bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2"}>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Chapters ({chapters.length})</p>
            {chapters.map((chapter, ci) => {
              const isActive = ci === activeChapter;
              const lessonCount = chapter.videos.length + chapter.quizzes.length;
              return (
                <div
                  key={ci}
                  className={`group flex items-center gap-1 rounded-xl px-2 py-2 transition-colors ${
                    isActive
                      ? isDark
                        ? "bg-indigo-500/15 border border-indigo-500/40"
                        : "bg-indigo-50 border border-indigo-200"
                      : isDark
                        ? "hover:bg-slate-700/60 border border-transparent"
                        : "hover:bg-white border border-transparent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveChapter(ci)}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isActive ? "bg-indigo-600 text-white" : isDark ? "bg-slate-700 text-slate-300" : "bg-white border border-slate-200 text-slate-500"}`}>
                      {ci + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-xs font-semibold truncate ${isActive ? (isDark ? "text-white" : "text-[#111827]") : isDark ? "text-slate-300" : "text-slate-600"}`}>
                        {chapter.title || `Chapter ${ci + 1}`}
                      </span>
                      <span className="block text-[10px] text-slate-400">{lessonCount} lesson{lessonCount === 1 ? "" : "s"}</span>
                    </span>
                  </button>
                  <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => moveChapter(ci, -1)} disabled={ci === 0} className="p-0.5 text-slate-400 hover:text-indigo-500 disabled:opacity-30 cursor-pointer">
                      <FiChevronUp size={13} />
                    </button>
                    <button type="button" onClick={() => moveChapter(ci, 1)} disabled={ci === chapters.length - 1} className="p-0.5 text-slate-400 hover:text-indigo-500 disabled:opacity-30 cursor-pointer">
                      <FiChevronDown size={13} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChapter(ci)}
                    className="p-1 text-red-400 hover:text-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label={`Remove ${chapter.title || "chapter"}`}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addChapter}
              className="mt-2 w-full flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-2 rounded-xl border border-dashed border-indigo-400/50 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <FiPlus size={14} /> Add Chapter
            </button>
          </div>

          {/* Active chapter editor */}
          {active && (
            <div className="md:col-span-3 space-y-4 min-w-0">
              <div className={isDark ? "border border-slate-700 rounded-2xl p-5 space-y-4" : "border border-slate-200 rounded-2xl p-5 space-y-4"}>
                <div className="flex items-center justify-between">
                  <span className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-[#111827]"}>
                    Chapter {activeChapter + 1}
                  </span>
                </div>

                <Field label="Chapter Title" error={fieldErrors[`chapter_title_${activeChapter}`]}>
                  <input
                    type="text"
                    value={active.title}
                    onChange={(e) => updateChapterField(activeChapter, "title", e.target.value)}
                    placeholder="e.g. Getting Started"
                    className={inputCls(fieldErrors[`chapter_title_${activeChapter}`], isDark)}
                  />
                </Field>

                <Field label="Chapter Explanation">
                  <RichTextEditor
                    value={active.explanation}
                    onChange={(html) => updateChapterField(activeChapter, "explanation", html)}
                    placeholder="Introduce this chapter — what will students learn here?"
                  />
                </Field>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700 pb-2">
                  {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        tab === key
                          ? isDark
                            ? "bg-indigo-500/20 text-indigo-300"
                            : "bg-indigo-50 text-indigo-600"
                          : isDark
                            ? "text-slate-400 hover:text-white hover:bg-slate-700"
                            : "text-slate-500 hover:text-[#111827] hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  {tab === "videos" && (
                    <VideosStep
                      videos={active.videos}
                      setVideos={(videos) => updateChapterField(activeChapter, "videos", videos)}
                      statePrefix={String(activeChapter)}
                      videoUploadState={videoUploadState}
                      fieldErrors={fieldErrors}
                      onFileSelect={(vi, file) => onVideoFileSelect(activeChapter, vi, file)}
                      onYouTubeAuth={onYouTubeAuth}
                    />
                  )}
                  {tab === "codes" && (
                    <ProgrammingCodesStep
                      programmingCodes={active.programmingCodes}
                      setProgrammingCodes={(codes) => updateChapterField(activeChapter, "programmingCodes", codes)}
                    />
                  )}
                  {tab === "assets" && (
                    <AssetsStep
                      assets={active.assets}
                      setAssets={(assets) => updateChapterField(activeChapter, "assets", assets)}
                      onDriveAuth={onDriveAuth}
                    />
                  )}
                  {tab === "quizzes" && (
                    <QuizzesStep
                      quizzes={active.quizzes}
                      setQuizzes={(quizzes) => updateChapterField(activeChapter, "quizzes", quizzes)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
