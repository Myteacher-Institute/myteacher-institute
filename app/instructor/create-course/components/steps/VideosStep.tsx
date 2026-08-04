import { useRef } from "react";
import { FiVideo, FiPlus, FiTrash2, FiUpload, FiYoutube, FiLink, FiClock, FiX, FiLoader } from "react-icons/fi";
import { Field } from "../Field";
import { inputCls } from "../../utils";
import type { CourseVideo } from "@/types";
import { useThemeStore } from "@/store/theme.store";

interface VideosStepProps {
  videos: CourseVideo[];
  setVideos: (value: CourseVideo[]) => void;
  statePrefix: string;
  videoUploadState: Record<string, { uploading: boolean; progress: number; error: string; stage?: string }>;
  fieldErrors: Record<string, string>;
  onFileSelect: (i: number, file: File) => void;
  onYouTubeAuth: (authUrl?: string) => void;
}

const emptyVideo = (): CourseVideo => ({
  videoUrl: "",
  videoTitle: "",
  videoDescription: "",
  videoDuration: 0,
  isProgrammingVideo: false,
  isPreview: false,
});

export const VideosStep = ({
  videos,
  setVideos,
  statePrefix,
  videoUploadState,
  fieldErrors,
  onFileSelect,
  onYouTubeAuth
}: VideosStepProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const addVideo = () => setVideos([...videos, emptyVideo()]);
  const removeVideo = (i: number) => setVideos(videos.filter((_, idx) => idx !== i));
  const updateVideo = <K extends keyof CourseVideo>(
    i: number,
    field: K,
    value: CourseVideo[K]
  ) => {
    const n = [...videos];
    n[i] = {
      ...n[i],
      [field]: value
    };
    setVideos(n);
  };

  const handleVideoFileSelect = (i: number, file: File) => {
    updateVideo(i, "file", file);
    if (!videos[i].videoTitle) {
      updateVideo(i, "videoTitle", file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className={isDark ? "w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center" : "w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"}>
          <FiVideo size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Course Videos</h2>
          <p className="text-xs text-slate-400">Upload video files or paste a YouTube URL — optional, can be added later</p>
        </div>
      </div>

      {videos.length === 0 && (
        <div className={isDark ? "text-center py-10 border-2 border-dashed border-slate-700 rounded-2xl mb-4" : "text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl mb-4"}>
          <FiVideo size={32} className={isDark ? "text-slate-600 mx-auto mb-3" : "text-slate-300 mx-auto mb-3"} />
          <p className="text-sm text-slate-400 font-medium">No video lessons yet</p>
          <p className="text-xs text-slate-300 mt-1">Click &quot;Add Video Lesson&quot; to get started</p>
        </div>
      )}

      <div className="space-y-4">
        {videos.map((v, i) => {
          const us = videoUploadState[`${statePrefix}-${i}`];
          return (
            <div key={i} className={isDark ? "border border-slate-700 rounded-2xl p-5 space-y-4" : "border border-slate-200 rounded-2xl p-5 space-y-4"}>
              <div className="flex items-center justify-between">
                <span className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-[#111827]"}>Lesson {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeVideo(i)}
                  disabled={us?.uploading}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>

              {!v.videoUrl && !us?.uploading && (
                <div
                  className={isDark ? "border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-900/20 transition-colors" : "border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"}
                  onClick={() => fileInputRefs.current[i]?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleVideoFileSelect(i, file);
                  }}
                >
                  {v.file ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FiPlus size={20} />
                      <span className="text-sm font-semibold">{v.file.name}</span>
                    </div>
                  ) : (
                    <>
                      <FiUpload size={24} className="text-blue-400 mx-auto mb-2" />
                      <p className={isDark ? "text-sm font-semibold text-white" : "text-sm font-semibold text-[#111827]"}>Drag & drop or click to upload</p>
                      <p className="text-xs text-slate-400 mt-1">MP4, MOV, AVI, MKV — up to 2 GB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[i] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoFileSelect(i, file);
                    }}
                  />
                </div>
              )}

              {us?.uploading && (
                <div className={isDark ? "rounded-xl bg-blue-900/30 border border-blue-800 p-4" : "rounded-xl bg-blue-50 border border-blue-100 p-4"}>
                  <div className="flex items-center gap-3 mb-2">
                    <FiLoader size={16} className="text-blue-600 animate-spin shrink-0" />
                    <span className="text-sm font-semibold text-blue-700">
                      {us.stage === "preparing" ? "Verifying YouTube connection…" : us.stage === "done" ? "Upload complete!" : `Uploading to YouTube… ${us.progress}%`}
                    </span>
                  </div>
                  <div className={isDark ? "w-full bg-blue-800 rounded-full h-1.5" : "w-full bg-blue-200 rounded-full h-1.5"}>
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${us.progress}%` }} />
                  </div>
                  <p className="text-[11px] text-blue-500 mt-2">Do not close this page while uploading</p>
                </div>
              )}

              {us?.error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <FiX size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700">Upload failed</p>
                    <p className="text-xs text-red-500 mt-0.5">{us.error}</p>
                    {(us.error.includes("YouTube authentication") || us.error.includes("re-authentication")) && (
                      <button
                        type="button"
                        onClick={() => onYouTubeAuth()}
                        className="mt-2 flex items-center gap-2 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        <FiYoutube size={12} /> Authenticate with YouTube
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[i]?.click()}
                      className="text-xs text-red-600 font-bold underline mt-1 cursor-pointer"
                    >
                      Try again
                    </button>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[i] = el; }}
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) onFileSelect(i, file); }}
                    />
                  </div>
                </div>
              )}

              {v.videoUrl && !us?.uploading && (
                <div className={isDark ? "flex items-center gap-3 p-3 bg-green-900/30 border border-green-800 rounded-xl" : "flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl"}>
                  <FiYoutube size={18} className="text-red-500 shrink-0" />
                  <a href={v.videoUrl} target="_blank" rel="noreferrer" className="text-sm text-green-700 font-semibold truncate hover:underline flex-1">
                    {v.videoUrl}
                  </a>
                  <button
                    type="button"
                    onClick={() => updateVideo(i, "videoUrl", "")}
                    className="p-1 text-slate-400 hover:text-red-500 cursor-pointer shrink-0"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}

              {!v.videoUrl && !us?.uploading && (
                <Field label="Or paste a URL manually" error={fieldErrors[`video_url_${i}`]}>
                  <div className="relative">
                    <FiLink size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="url"
                      value={v.videoUrl}
                      onChange={(e) => updateVideo(i, "videoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className={`${inputCls(fieldErrors[`video_url_${i}`], isDark)} pl-9`}
                    />
                  </div>
                </Field>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field label="Video Title" error={fieldErrors[`video_title_${i}`]}>
                  <input
                    type="text"
                    value={v.videoTitle}
                    onChange={(e) => updateVideo(i, "videoTitle", e.target.value)}
                    placeholder="e.g. Introduction"
                    className={inputCls(fieldErrors[`video_title_${i}`], isDark)}
                  />
                </Field>
                <Field label="Duration (min)">
                  <div className="relative">
                    <FiClock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="number"
                      min="0"
                      value={v.videoDuration || ""}
                      onChange={(e) => updateVideo(i, "videoDuration", Number(e.target.value))}
                      placeholder="0"
                      className={`${inputCls(undefined, isDark)} pl-9`}
                    />
                  </div>
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  value={v.videoDescription}
                  onChange={(e) => updateVideo(i, "videoDescription", e.target.value)}
                  placeholder="What will students learn in this lesson?"
                  rows={2}
                  className={`${inputCls(undefined, isDark)} resize-none`}
                />
              </Field>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={v.isPreview}
                    onChange={(e) => updateVideo(i, "isPreview", e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                  <span className={isDark ? "text-sm text-white font-medium" : "text-sm text-[#111827] font-medium"}>Free preview</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={v.isProgrammingVideo}
                    onChange={(e) => updateVideo(i, "isProgrammingVideo", e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                  <span className={isDark ? "text-sm text-white font-medium" : "text-sm text-[#111827] font-medium"}>Programming video</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addVideo}
        className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
      >
        <FiPlus size={16} /> Add Video Lesson
      </button>
    </div>
  );
};
