"use client";



import { useState, useRef, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {

  FiArrowLeft, FiArrowRight, FiCheckCircle, FiLoader

} from "react-icons/fi";

import axiosInstance from "@/lib/axios";

import { getSocket } from "@/lib/socket";

import type { CourseVideo, Chapter, Asset } from "@/types";

import { activityTracker } from "@/utils/activityTracker";
import { useThemeStore } from "@/store/theme.store";



declare global {

  interface Window {

    youtubeAuthUrl?: string;

    driveAuthUrl?: string;

    pendingVideoUpload?: { ci: number; vi: number; g: number; file: File };

    pendingReauth?: { authUrl?: string; videoIndex: number; video: CourseVideo; retryCount: number } | null;

  }

}



// Import from refactored modules

import { STEPS } from "./constants";

import { saveDraft, loadDraft, clearDraft } from "./hooks/useDraft";

import { useOAuth } from "./hooks/useOAuth";

import {

  StepIndicator,

  YouTubeAuthModal,

  DriveAuthModal,

  UploadConfirmModal,

  BasicInfoStep,

  RequirementsStep,

  ChaptersStep,

  ReviewStep

} from "./components";



// Result a socket waiter resolves with once the background worker finishes.

type UploadResult = {

  ok: boolean;

  status?: string;

  message?: string;

  authUrl?: string;

  requiresReauth?: boolean;

  videoId?: string;

  videoUrl?: string;

  url?: string;

  fileId?: string;

};



// ── Main page ─────────────────────────────────────────────────────────────────

// Restored state comes from JSON (draft/sessionStorage) where File objects
// collapse to `{}`. Clear every phantom `file` so a restored course never
// submits garbage or shows a false "selected" state; files must be re-picked.
const sanitizeRestoredChapters = (chapters: unknown): Chapter[] => {
  if (!Array.isArray(chapters)) return [];
  return chapters.map((c) => {
    const ch = c as Chapter | null | undefined;
    if (!ch || typeof ch !== 'object') return ch as unknown as Chapter;
    return {
      ...ch,
      videos: (ch.videos || []).map((v) => ({ ...v, file: undefined })),
      assets: (ch.assets || []).map((a) => ({ ...a, file: undefined })),
    };
  });
};

export default function CreateCoursePage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const isEditMode = searchParams.get("edit") === "true";

  const editCourseId = searchParams.get("courseId");

  const { theme } = useThemeStore();
  const isDark = theme === 'dark';



  // ── State — initialise from sessionStorage draft if available (after hydration) ─────────────

  const [step, setStep] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [showUploadConfirmModal, setShowUploadConfirmModal] = useState(false);

  const [pendingUploadFile, setPendingUploadFile] = useState<{ ci: number; vi: number; g: number; file: File } | null>(null);



  // OAuth hook

  const {

    showYouTubeAuthModal,

    setShowYouTubeAuthModal,

    showDriveAuthModal,

    setShowDriveAuthModal,

    handleYouTubeAuth,

    confirmYouTubeAuth,

    handleDriveAuth,

    confirmDriveAuth,

    onYouTubeAuthSuccessRef

  } = useOAuth();



  // Step 0 — Basic info

  const [courseName,   setCourseName]   = useState<string>("");

  const [description,  setDescription]  = useState<string>("");

  const [price,        setPrice]        = useState<string>("");

  const [duration,     setDuration]     = useState<string>("");

  const [certificate,  setCertificate]  = useState<string>("");



  // Step 1 — Requirements

  const [requirements, setRequirements] = useState<string[]>([""]);



  // Step 2 — Chapters (each chapter owns its videos / codes / assets / quizzes)

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [activeChapter, setActiveChapter] = useState(0);

  const [videoUploadState, setVideoUploadState] = useState<

    Record<string, { uploading: boolean; progress: number; error: string; stage?: string }>

  >({});

  const [assetUploadState, setAssetUploadState] = useState<

    Record<number, { uploading: boolean; progress: number; error: string; stage?: string }>

  >({});

  const [isYouTubeReauth, setIsYouTubeReauth] = useState(false);

  // Completion waiters — the upload handlers register a resolver keyed by
  // "youtube-<index>" / "drive-<index>" BEFORE posting, then await it. The
  // socket listeners below resolve it when the background worker emits done/failed.
  const uploadWaitersRef = useRef<Record<string, (result: UploadResult) => void>>({});

  const chaptersRef = useRef<Chapter[]>([]);

  useEffect(() => { chaptersRef.current = chapters; }, [chapters]);

  // Maps a global flat upload index (echoed back by the server) to its
  // chapter/video (or chapter/asset) location, so socket events can be routed.
  const uploadTargetRef = useRef<Record<number, { ci: number; vi: number }>>({});

  const assetTargetRef = useRef<Record<number, { ci: number; ai: number }>>({});



  // ── Live upload progress via socket ────────────────────────────────────────

  // The server runs the actual YouTube/Drive upload on a background worker and
  // emits progress/done/failed events over socket.io. Progress is purely visual;
  // done/failed also resolve the waiters registered by the upload handlers.
  useEffect(() => {
    const videoStateKey = (g: number) => {
      const target = uploadTargetRef.current[g];
      return target ? `${target.ci}-${target.vi}` : String(g);
    };

    const handleYtProgress = (data: { videoIndex?: number; percent?: number; stage?: string }) => {
      const videoIndex = data.videoIndex;
      if (typeof videoIndex !== "number") return;

      const key = videoStateKey(videoIndex);
      setVideoUploadState(prev => {
        const current = prev[key];
        if (!current?.uploading) return prev;
        const pct = data.stage === "done"
          ? 100
          : typeof data.percent === "number" && data.percent > current.progress
            ? data.percent
            : current.progress;
        return { ...prev, [key]: { ...current, progress: pct, stage: data.stage ?? current.stage } };
      });
    };

    const handleYtDone = (data: { videoIndex?: number; videoId?: string; videoUrl?: string }) => {
      const videoIndex = data.videoIndex;
      if (typeof videoIndex !== "number") return;

      const key = videoStateKey(videoIndex);
      setVideoUploadState(prev => ({
        ...prev,
        [key]: { uploading: false, progress: 100, error: "", stage: "done" },
      }));
      const target = uploadTargetRef.current[videoIndex];
      if (target) {
        setChapters(prev => {
          const next = prev.map((ch, ci) => {
            if (ci !== target.ci) return ch;
            const nextVideos = ch.videos.map((v, vi) =>
              vi === target.vi ? { ...v, videoUrl: data.videoUrl || "", file: undefined } : v
            );
            return { ...ch, videos: nextVideos };
          });
          return next;
        });
      }

      const resolve = uploadWaitersRef.current[`youtube-${videoIndex}`];
      if (resolve) {
        delete uploadWaitersRef.current[`youtube-${videoIndex}`];
        resolve({ ok: true, videoId: data.videoId, videoUrl: data.videoUrl });
      }
    };

    const handleYtFailed = (data: { videoIndex?: number; status?: string; message?: string; authUrl?: string; requiresReauth?: boolean }) => {
      const videoIndex = data.videoIndex;
      if (typeof videoIndex !== "number") return;

      const msg = data.message || "Upload failed";
      const key = videoStateKey(videoIndex);
      setVideoUploadState(prev => ({
        ...prev,
        [key]: { uploading: false, progress: 0, error: msg, stage: "failed" },
      }));

      const resolve = uploadWaitersRef.current[`youtube-${videoIndex}`];
      if (resolve) {
        delete uploadWaitersRef.current[`youtube-${videoIndex}`];
        resolve({
          ok: false,
          status: data.status || "failed",
          message: msg,
          authUrl: data.authUrl,
          requiresReauth: data.requiresReauth,
        });
      }
    };

    const handleDriveProgress = (data: { assetIndex?: number; percent?: number; stage?: string }) => {
      const assetIndex = data.assetIndex;
      if (typeof assetIndex !== "number") return;

      setAssetUploadState(prev => {
        const current = prev[assetIndex];
        if (!current?.uploading) return prev;
        const pct = data.stage === "done"
          ? 100
          : typeof data.percent === "number" && data.percent > current.progress
            ? data.percent
            : current.progress;
        return { ...prev, [assetIndex]: { ...current, progress: pct, stage: data.stage ?? current.stage } };
      });
    };

    const handleDriveDone = (data: { assetIndex?: number; url?: string; fileId?: string }) => {
      const assetIndex = data.assetIndex;
      if (typeof assetIndex !== "number") return;

      setAssetUploadState(prev => ({
        ...prev,
        [assetIndex]: { uploading: false, progress: 100, error: "", stage: "done" },
      }));
      const target = assetTargetRef.current[assetIndex];
      if (target) {
        setChapters(prev => {
          const next = prev.map((ch, ci) => {
            if (ci !== target.ci) return ch;
            const nextAssets = ch.assets.map((a, ai) =>
              ai === target.ai ? { ...a, url: data.url || "", file: undefined } : a
            );
            return { ...ch, assets: nextAssets };
          });
          return next;
        });
      }

      const resolve = uploadWaitersRef.current[`drive-${assetIndex}`];
      if (resolve) {
        delete uploadWaitersRef.current[`drive-${assetIndex}`];
        resolve({ ok: true, url: data.url, fileId: data.fileId });
      }
    };

    const handleDriveFailed = (data: { assetIndex?: number; message?: string }) => {
      const assetIndex = data.assetIndex;
      if (typeof assetIndex !== "number") return;

      const msg = data.message || "Upload failed";
      setAssetUploadState(prev => ({
        ...prev,
        [assetIndex]: { uploading: false, progress: 0, error: msg, stage: "failed" },
      }));

      const resolve = uploadWaitersRef.current[`drive-${assetIndex}`];
      if (resolve) {
        delete uploadWaitersRef.current[`drive-${assetIndex}`];
        resolve({ ok: false, status: "failed", message: msg });
      }
    };

    let pollTimer: ReturnType<typeof setInterval> | null = null;
    const attach = (): boolean => {
      const socket = getSocket();
      if (!socket?.connected) return false;
      socket.on("youtube-upload:progress", handleYtProgress);
      socket.on("youtube-upload:done", handleYtDone);
      socket.on("youtube-upload:failed", handleYtFailed);
      socket.on("drive-upload:progress", handleDriveProgress);
      socket.on("drive-upload:done", handleDriveDone);
      socket.on("drive-upload:failed", handleDriveFailed);
      return true;
    };

    if (!attach()) {
      pollTimer = setInterval(() => {
        if (attach() && pollTimer) clearInterval(pollTimer);
      }, 1500);
    }

    return () => {
      if (pollTimer) clearInterval(pollTimer);
      const socket = getSocket();
      if (socket) {
        socket.off("youtube-upload:progress", handleYtProgress);
        socket.off("youtube-upload:done", handleYtDone);
        socket.off("youtube-upload:failed", handleYtFailed);
        socket.off("drive-upload:progress", handleDriveProgress);
        socket.off("drive-upload:done", handleDriveDone);
        socket.off("drive-upload:failed", handleDriveFailed);
      }
    };
  }, []);

  // Resolve when the background worker finishes an enqueued upload. Registers the
  // waiter BEFORE the POST so a fast (in-process fallback) worker can't beat us.
  const waitForUpload = (type: "youtube" | "drive", index: number, timeoutMs = 20 * 60 * 1000): Promise<UploadResult> => {
    return new Promise(resolve => {
      const key = `${type}-${index}`;
      const timer = setTimeout(() => {
        delete uploadWaitersRef.current[key];
        resolve({ ok: false, status: "timeout", message: "Upload timed out. Please try again." });
      }, timeoutMs);
      uploadWaitersRef.current[key] = (result) => {
        clearTimeout(timer);
        resolve(result);
      };
    });
  };



  // Load draft from sessionStorage after hydration OR load course for edit mode

  useEffect(() => {

    const loadData = async () => {

      // Check if returning from OAuth redirect

      const isRedirect = sessionStorage.getItem('course_form_redirect');

      if (isRedirect) {

        const savedState = sessionStorage.getItem('course_form_state');

        if (savedState) {

          try {

            const formData = JSON.parse(savedState);

            setCourseName(formData.courseName || "");

            setDescription(formData.description || "");

            setPrice(formData.price || "");

            setDuration(formData.duration || "");

            setCertificate(formData.certificate || "");

            setRequirements(formData.requirements || [""]);

            setChapters(sanitizeRestoredChapters(formData.chapters));

            setActiveChapter(0);

            setStep(Math.min(formData.step || 0, STEPS.length - 1));

            

            // Clear the saved state

            sessionStorage.removeItem('course_form_state');

            sessionStorage.removeItem('course_form_redirect');

          } catch (err) {

            console.error("Failed to restore form state:", err);

          }

        }

        return;

      }



      if (isEditMode && editCourseId) {

        setIsLoadingCourse(true);

        try {

          const res = await axiosInstance.get(`/api/course/${editCourseId}`);

          if (res.data.status === "success" && res.data.course) {

            const courseData = res.data.course;

            setCourseName(courseData.courseName || "");

            setDescription(courseData.description || "");

            setPrice(String(courseData.price || ""));

            setDuration(String(courseData.duration || ""));

            setCertificate(courseData.certificate || "");

            setRequirements(courseData.courseRequirements || [""]);

            const legacyChapters = courseData.chapters?.length
              ? courseData.chapters
              : [
                  {
                    title: "Chapter 1",
                    explanation: "",
                    videos: courseData.courseVideos || [],
                    programmingCodes: courseData.programmingCodes || [],
                    assets: courseData.assets || [],
                    quizzes: courseData.quizzes || [],
                  },
                ];
            setChapters(legacyChapters);

            setActiveChapter(0);

          }

        } catch (err: unknown) {

          console.error("Failed to load course for editing:", err);

        } finally {

          setIsLoadingCourse(false);

        }

      } else {

        const draft = loadDraft();

        if (draft) {

          setStep(Math.min(draft.step ?? 0, STEPS.length - 1));

          setCourseName(draft.courseName ?? "");

          setDescription(draft.description ?? "");

          setPrice(draft.price ?? "");

          setDuration(draft.duration ?? "");

          setCertificate(draft.certificate ?? "");

          setRequirements(draft.requirements ?? [""]);

          setChapters(sanitizeRestoredChapters(draft.chapters));

          setActiveChapter(0);

        }

      }

    };



    loadData();

  }, [isEditMode, editCourseId]);



  // ── Auto-save draft whenever any field changes ────────────────────────────

  useEffect(() => {

    saveDraft({ step, courseName, description, price, duration, certificate, requirements, chapters });

  }, [step, courseName, description, price, duration, certificate, requirements, chapters]);



  // ── Validation ────────────────────────────────────────────────────────────

  const validateStep0 = () => {

    const errs: Record<string, string> = {};

    if (!courseName.trim()) errs.courseName = "Course name is required";

    if (!description.trim()) errs.description = "Description is required";

    if (!price || isNaN(Number(price)) || Number(price) < 0) errs.price = "Enter a valid price";

    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) errs.duration = "Enter a valid duration in hours";

    if (!certificate) errs.certificate = "Select a certificate type";

    setFieldErrors(errs);

    return Object.keys(errs).length === 0;

  };



  const validateStep1 = () => {

    if (!requirements.some((r) => r.trim())) {

      setFieldErrors({ requirements: "Add at least one requirement" });

      return false;

    }

    setFieldErrors({});

    return true;

  };



  const validateStep2 = () => {

    // Chapters are optional, but if any exist they must have a title; a video
    // is only valid when it has either a URL or a file, and a title.

    const errs: Record<string, string> = {};

    chapters.forEach((ch, ci) => {

      if (!ch.title.trim()) errs[`chapter_title_${ci}`] = "Chapter title is required";

      ch.videos.forEach((v, vi) => {

        if (!v.videoUrl.trim() && !(v.file instanceof File)) {

          errs[`video_url_${ci}-${vi}`] = "Video URL or file is required";

        }

        if (!v.videoTitle.trim()) errs[`video_title_${ci}-${vi}`] = "Video title is required";

      });

    });

    setFieldErrors(errs);

    return Object.keys(errs).length === 0;

  };



  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {

    if (step === 0 && !validateStep0()) return;

    if (step === 1 && !validateStep1()) return;

    if (step === 2 && !validateStep2()) return;

    setStep((s) => s + 1);

  };



  const handleBack = () => { setFieldErrors({}); setStep((s) => s - 1); };



  // ── Chapter helpers ───────────────────────────────────────────────────────

  // Global flat index of a video across all chapters (the server echoes this
  // number back on socket events, so we can route uploads back to chapters).
  const globalVideoIndex = (ci: number, vi: number) => {
    const chs = chaptersRef.current;
    let g = 0;
    for (let c = 0; c < chs.length; c++) {
      if (c === ci) return g + vi;
      g += chs[c].videos.length;
    }
    return g + vi;
  };

  const globalAssetIndex = (ci: number, ai: number) => {
    const chs = chaptersRef.current;
    let g = 0;
    for (let c = 0; c < chs.length; c++) {
      if (c === ci) return g + ai;
      g += chs[c].assets.length;
    }
    return g + ai;
  };

  // String key for upload-state, mapping a global flat index to its chapter/video.
  const videoUploadKey = (g: number) => {
    const target = uploadTargetRef.current[g];
    return target ? `${target.ci}-${target.vi}` : String(g);
  };

  const flattenVideos = (chs: Chapter[]) => chs.flatMap(c => c.videos);

  const flattenAssets = (chs: Chapter[]) => chs.flatMap(c => c.assets);

  const flattenCodes = (chs: Chapter[]) => chs.flatMap(c => c.programmingCodes);

  const flattenQuizzes = (chs: Chapter[]) => chs.flatMap(c => c.quizzes);



  // Form data for OAuth redirect

  const getFormData = () => ({

    courseName,

    description,

    price,

    duration,

    certificate,

    requirements,

    chapters,

    step,

    isEditMode,

    editCourseId

  });



  // Handle file selection - show confirmation modal

  const handleFileSelect = (ci: number, vi: number, file: File) => {

    const g = globalVideoIndex(ci, vi);

    uploadTargetRef.current[g] = { ci, vi };

    setPendingUploadFile({ ci, vi, g, file });

    setShowUploadConfirmModal(true);

  };



  // Confirm and proceed with video upload

  const confirmVideoUpload = async () => {

    if (!pendingUploadFile) return;

    

    const { ci, vi, g, file } = pendingUploadFile;

    setShowUploadConfirmModal(false);

    setPendingUploadFile(null);

    const stateKey = `${ci}-${vi}`;

    setVideoUploadState((prev) => ({

      ...prev,

      [stateKey]: { uploading: true, progress: 0, error: "" },

    }));



    // Pre-fill title from filename if empty

    setChapters(prev => prev.map((ch, c) => {

      if (c !== ci) return ch;

      const nextVideos = ch.videos.map((v, vx) =>

        vx === vi && !v.videoTitle ? { ...v, videoTitle: file.name.replace(/\.[^/.]+$/, "") } : v

      );

      return { ...ch, videos: nextVideos };

    }));



    try {

      // Auto-trigger YouTube auth if needed

      const authCheck = await axiosInstance.get("/api/youtube/auth");

      if (authCheck.data.status === "success" && !authCheck.data.authUrl && authCheck.data.authenticated) {

        // Already authenticated, proceed with upload

      } else if (authCheck.data.status === "success" && authCheck.data.authUrl) {

        // Show modal to inform user before redirecting

        setShowYouTubeAuthModal(true);

        window.youtubeAuthUrl = authCheck.data.authUrl;

        // Store the file and index for after auth

        window.pendingVideoUpload = { ci, vi, g, file };

        setVideoUploadState((prev) => ({

          ...prev,

          [stateKey]: { uploading: false, progress: 0, error: "" },

        }));

        return;

      }



      // Register the completion waiter BEFORE posting so a fast worker
      // (in-process fallback) can't finish before we start waiting.
      const uploadPromise = waitForUpload("youtube", g);



      const formData = new FormData();

      formData.append("video", file);

      formData.append("title", chaptersRef.current[ci]?.videos[vi]?.videoTitle || file.name);

      formData.append("description", chaptersRef.current[ci]?.videos[vi]?.videoDescription || "");

      formData.append("privacyStatus", "unlisted");

      formData.append("tags", "course");

      formData.append("clientVideoIndex", String(g));



      const res = await axiosInstance.post("/api/youtube/upload", formData, {

        timeout: 0,

        onUploadProgress: (e) => {

          const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0;

          setVideoUploadState((prev) => ({

            ...prev,

            [stateKey]: { uploading: true, progress: pct, error: "" },

          }));

        },

      });



      if (res.data.status !== "queued") {

        // Server didn't accept the job — drop the waiter so it can't leak.
        const drop = uploadWaitersRef.current[`youtube-${g}`];
        if (drop) { delete uploadWaitersRef.current[`youtube-${g}`]; drop({ ok: false, status: "failed", message: res.data.message || "Upload failed" }); }
        throw new Error(res.data.message || "Upload failed");

      }



      // Upload enqueued — hand over to server-side progress events
      setVideoUploadState((prev) => ({

        ...prev,

        [stateKey]: { uploading: true, progress: 0, stage: "preparing", error: "" },

      }));



      const result = await uploadPromise;



      if (!result.ok) {

        if (result.status === "reauth_required" || result.requiresReauth || (result.message || "").toLowerCase().includes("re-authentication")) {

          window.pendingReauth = {

            authUrl: result.authUrl,

            videoIndex: g,

            video: chaptersRef.current[ci]?.videos[vi],

            retryCount: ((window.pendingReauth as { retryCount?: number })?.retryCount || 0) + 1

          };

          setVideoUploadState((prev) => ({

            ...prev,

            [stateKey]: { uploading: false, progress: 0, error: result.message || "" },

          }));

          setIsYouTubeReauth(true);

          handleYouTubeAuth(undefined, result.authUrl);

          return;

        }

        throw new Error(result.message || "Upload failed");

      }



      // Success — the socket handler already set videoUrl on the chapter; keep state consistent
      setVideoUploadState((prev) => ({

        ...prev,

        [stateKey]: { uploading: false, progress: 100, error: "", stage: "done" },

      }));



    } catch (err: unknown) {

      const responseData = (err as { response?: { data?: { status?: string; authUrl?: string; message?: string } } })?.response?.data;

      const msg = responseData?.message || (err as Error)?.message || "Upload failed. Please try again.";

      setVideoUploadState((prev) => ({

        ...prev,

        [stateKey]: { uploading: false, progress: 0, error: msg },

      }));

    }

  };



  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {

    setIsSubmitting(true);

    setSubmitError("");



    try {

      // Edit mode uploads synchronously, so we verify YouTube/Drive auth up
      // front. New courses use the background pipeline, which handles auth
      // server-side and fails the job with a clear message if re-auth is needed.
      if (isEditMode) {

        const youtubeAuthCheck = await axiosInstance.get("/api/youtube/auth");

        if (!youtubeAuthCheck.data.authenticated) {

          setIsSubmitting(false);

          // Trigger YouTube authentication modal

          if (youtubeAuthCheck.data.authUrl) {

            setShowYouTubeAuthModal(true);

            window.youtubeAuthUrl = youtubeAuthCheck.data.authUrl;

          }

          return;

        }

      }



      // Newly-created courses use the background, resumable pipeline: one
      // multipart POST with the metadata JSON plus all video/asset files. The
      // server persists a job, uploads sequentially, and creates the course
      // even if this tab is closed, so we redirect to the dashboard right away.
      if (!isEditMode) {

        const videosWithFiles: { video: CourseVideo; ci: number; vi: number; g: number }[] = [];

        const assetsWithFiles: { asset: Asset; ci: number; ai: number; g: number }[] = [];

        chapters.forEach((ch, ci) => {

          ch.videos.forEach((v, vi) => {

            if (v.file instanceof File) videosWithFiles.push({ video: v, ci, vi, g: globalVideoIndex(ci, vi) });

          });

          ch.assets.forEach((a, ai) => {

            if (a.file instanceof File) assetsWithFiles.push({ asset: a, ci, ai, g: globalAssetIndex(ci, ai) });

          });

        });



        const creationPayload = {

          courseName: courseName.trim(),

          description: description.trim(),

          price: Number(price),

          duration: Number(duration),

          certificate,

          courseRequirements: requirements.filter((r) => r.trim()),

          chapters: chapters.map(c => ({

            ...c,

            videos: c.videos.map(v => ({ ...v, file: undefined })),

            assets: c.assets.map(a => ({ ...a, file: undefined })),

          })),

          courseVideos: flattenVideos(chapters).map(v => ({ ...v, file: undefined })),

          programmingCodes: flattenCodes(chapters),

          assets: flattenAssets(chapters).map(a => ({ ...a, file: undefined })),

          quizzes: flattenQuizzes(chapters),

        };



        const formData = new FormData();

        console.log("[course-creation-client] videosWithFiles:", videosWithFiles.map(({ video, g, ci, vi }) => ({ g, ci, vi, name: video.file?.name, title: video.videoTitle })));
        console.log("[course-creation-client] assetsWithFiles:", assetsWithFiles.map(({ asset, g, ci, ai }) => ({ g, ci, ai, name: asset.file?.name, assetName: asset.name })));
        console.log("[course-creation-client] isEditMode:", isEditMode, "| chapters total videos:", chapters.reduce((n, c) => n + c.videos.length, 0), "| total assets:", chapters.reduce((n, c) => n + c.assets.length, 0));

        formData.append("metadata", JSON.stringify(creationPayload));

        for (const { video, g } of videosWithFiles) formData.append(`video_${g}`, video.file!);

        for (const { asset, g } of assetsWithFiles) formData.append(`asset_${g}`, asset.file!);



        const res = await axiosInstance.post("/api/course/creation", formData, { timeout: 0 });



        if (res.data.status === "success" && res.data.jobId) {

          activityTracker.addActivity("Course creation started", `Started creating course: ${courseName.trim()}`, "instructor");

          clearDraft();

          router.push("/instructor");

          return;

        }

        setSubmitError(res.data.message || "Failed to start course creation");

        return;

      }



      // ── Edit mode: background, resumable pipeline (mirrors create) ──
      // The server persists an edit job, uploads the new files in the background
      // and applies the update, so the dashboard shows progress and the instructor
      // can leave the page safely.

      const videosWithFiles: { video: CourseVideo; ci: number; vi: number; g: number }[] = [];

      const assetsWithFiles: { asset: Asset; ci: number; ai: number; g: number }[] = [];

      chapters.forEach((ch, ci) => {

        ch.videos.forEach((v, vi) => {

          if (v.file instanceof File) videosWithFiles.push({ video: v, ci, vi, g: globalVideoIndex(ci, vi) });

        });

        ch.assets.forEach((a, ai) => {

          if (a.file instanceof File) assetsWithFiles.push({ asset: a, ci, ai, g: globalAssetIndex(ci, ai) });

        });

      });

      const editPayload = {

        courseName: courseName.trim(),

        description: description.trim(),

        price: Number(price),

        duration: Number(duration),

        certificate,

        courseRequirements: requirements.filter((r) => r.trim()),

        chapters: chapters.map(c => ({

          ...c,

          videos: c.videos.map(v => ({ ...v, file: undefined })),

          assets: c.assets.map(a => ({ ...a, file: undefined })),

        })),

        courseVideos: flattenVideos(chapters).map(v => ({ ...v, file: undefined })),

        programmingCodes: flattenCodes(chapters),

        assets: flattenAssets(chapters).map(a => ({ ...a, file: undefined })),

        quizzes: flattenQuizzes(chapters),

      };

      const formData = new FormData();

      formData.append("metadata", JSON.stringify(editPayload));

      for (const { video, g } of videosWithFiles) formData.append(`video_${g}`, video.file!);

      for (const { asset, g } of assetsWithFiles) formData.append(`asset_${g}`, asset.file!);

      const res = await axiosInstance.post(`/api/course/edit-job/${editCourseId}`, formData, { timeout: 0 });

      if (res.data.status === "success" && res.data.jobId) {

        activityTracker.addActivity("Course update started", `Started updating course: ${courseName.trim()}`, "instructor");

        clearDraft();

        router.push("/instructor");

        return;

      }

      setSubmitError(res.data.message || "Failed to start course update");

      return;

    } catch (err: unknown) {

      setSubmitError((err as Error)?.message || "Something went wrong. Please try again.");

    } finally {

      setIsSubmitting(false);

    }

  };



  const retryPendingYouTubeUpload = async (pendingReauth: { videoIndex: number; video: CourseVideo; retryCount: number }) => {
    const { videoIndex, video } = pendingReauth;

    const stateKey = videoUploadKey(videoIndex);

    setVideoUploadState(prev => ({
      ...prev,
      [stateKey]: { uploading: true, progress: 0, error: "" }
    }));

    const formDataForUpload = new FormData();
    formDataForUpload.append("video", video.file!);
    formDataForUpload.append("title", video.videoTitle || video.file!.name);
    formDataForUpload.append("description", video.videoDescription || "");
    formDataForUpload.append("privacyStatus", "unlisted");
    formDataForUpload.append("tags", "course");
    formDataForUpload.append("clientVideoIndex", String(videoIndex));

    let reauthTriggered = false;

    try {
      // Register the waiter BEFORE posting (worker may finish fast)
      const uploadPromise = waitForUpload("youtube", videoIndex);

      const res = await axiosInstance.post("/api/youtube/upload", formDataForUpload, {
        timeout: 0,
        onUploadProgress: (e) => {
          const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
          setVideoUploadState(prev => ({
            ...prev,
            [stateKey]: { uploading: true, progress: pct, error: "" }
          }));
        },
      });

      if (res.data.status !== "queued") {
        const drop = uploadWaitersRef.current[`youtube-${videoIndex}`];
        if (drop) { delete uploadWaitersRef.current[`youtube-${videoIndex}`]; drop({ ok: false, status: "failed", message: res.data.message || "Upload failed" }); }
        throw new Error(res.data.message || "Upload failed");
      }

      setVideoUploadState(prev => ({
        ...prev,
        [stateKey]: { uploading: true, progress: 0, stage: "preparing", error: "" }
      }));

      const result = await uploadPromise;

      if (!result.ok) {
        if (result.status === "reauth_required" || result.requiresReauth || (result.message || "").toLowerCase().includes("re-authentication")) {
          reauthTriggered = true;
          window.pendingReauth = {
            authUrl: result.authUrl,
            videoIndex,
            video,
            retryCount: pendingReauth.retryCount + 1
          };
          setVideoUploadState(prev => ({
            ...prev,
            [stateKey]: { uploading: false, progress: 0, error: result.message || "" }
          }));
          setIsYouTubeReauth(true);
          if (result.authUrl) {
            window.youtubeAuthUrl = result.authUrl;
            setShowYouTubeAuthModal(true);
          } else {
            handleYouTubeAuth();
          }
          return;
        }
        throw new Error(result.message || "Upload failed");
      }

      setVideoUploadState(prev => ({
        ...prev,
        [stateKey]: { uploading: false, progress: 100, error: "", stage: "done" }
      }));
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error)?.message || "Upload failed";
      setVideoUploadState(prev => ({
        ...prev,
        [stateKey]: { uploading: false, progress: 0, error: msg }
      }));
    } finally {
      // Clear the pending reauth (unless we just queued a new reauth round)
      if (!reauthTriggered) {
        window.pendingReauth = null;
      }
    }
  };

  // Override confirmYouTubeAuth to auto-retry deletion after auth and handle video upload retry
  const handleConfirmYouTubeAuth = async (formData: Record<string, unknown>) => {
    await confirmYouTubeAuth(formData);

    // If there's a pending upload, retry it once the OAuth popup reports success
    const pendingReauth = window.pendingReauth;
    if (pendingReauth && pendingReauth.videoIndex !== undefined) {
      onYouTubeAuthSuccessRef.current = () => { retryPendingYouTubeUpload(pendingReauth); };
      return;
    }
  };



  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoadingCourse) {

    return (

      <div className={`min-h-screen font-poppins p-4 md:p-8 lg:p-12 ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>

        <div className="max-w-4xl mx-auto">

          {/* Header Skeleton */}

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-4">

              <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse"></div>

              <div className="space-y-2">

                <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse"></div>

                <div className="h-4 w-64 bg-slate-200 rounded-lg animate-pulse"></div>

              </div>

            </div>

          </div>



          {/* Step Indicator Skeleton */}

          <div className="flex items-center justify-between mb-8">

            {[1, 2, 3, 4, 5].map((i) => (

              <div key={i} className="flex-1 flex items-center gap-2">

                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>

                <div className="flex-1 h-1 bg-slate-200 rounded-full animate-pulse"></div>

              </div>

            ))}

          </div>



          {/* Form Content Skeleton */}

          <div className={`rounded-3xl border shadow-sm p-6 md:p-8 space-y-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>

            <div className="space-y-4">

              <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse"></div>

              <div className="space-y-3">

                <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>

                <div className="h-32 w-full bg-slate-200 rounded-xl animate-pulse"></div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>

                  <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>

                </div>

              </div>

            </div>

          </div>



          {/* Navigation Buttons Skeleton */}

          <div className="flex items-center justify-between mt-8">

            <div className="h-10 w-24 bg-slate-200 rounded-xl animate-pulse"></div>

            <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse"></div>

          </div>

        </div>

      </div>

    );

  }



  // ── Bottom progress bar (visible during uploads / submission) ──────────────

  const activeUploads = Object.entries(videoUploadState).filter(([, s]) => s.uploading);

  const activeAssetUploads = Object.entries(assetUploadState).filter(([, s]) => s.uploading);

  const showBottomProgress = isSubmitting || activeUploads.length > 0 || activeAssetUploads.length > 0;

  const activeUpload = activeUploads[0]?.[1] ?? activeAssetUploads[0]?.[1];

  const activeUploadPct = activeUpload?.progress ?? 0;

  const activeUploadStage = activeUpload?.stage;

  const isAssetPhase = activeUploads.length === 0 && activeAssetUploads.length > 0;

  const stageLabel = activeUploadStage === "preparing"
    ? "Verifying connection..."
    : activeUploadStage === "finalizing"
      ? "Finalizing upload..."
      : activeUploadStage === "done"
        ? "Upload complete!"
        : isAssetPhase
          ? "Uploading file to Google Drive..."
          : "Uploading video to YouTube...";



  return (

    <div className={`min-h-screen font-poppins p-4 md:p-8 lg:p-12 ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>

      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-4">

            <button type="button" onClick={() => { clearDraft(); router.back(); }} className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-200 text-[#111827] hover:bg-slate-50'}`}>

              <FiArrowLeft size={20} />

            </button>

            <div>

              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{isEditMode ? "Edit Course" : "Create New Course"}</h1>

              <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{isEditMode ? "Update your course details" : "Share your knowledge with students worldwide"}</p>

            </div>

          </div>

          {!isEditMode && (

            <button

              type="button"

              onClick={() => {

                if (confirm("Are you sure you want to clear all draft data and start fresh?")) {

                  clearDraft();

                  window.location.reload();

                }

              }}

              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${isDark ? 'border-slate-700 text-red-400 hover:bg-slate-700' : 'border-red-200 text-red-600 hover:bg-red-50'}`}

            >

              Clear Draft

            </button>

          )}

        </div>



        <StepIndicator current={step} onStepClick={setStep} />



        {/* Card */}

        <div className={`rounded-3xl border shadow-sm p-6 md:p-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>

          {step === 0 && (

            <BasicInfoStep

              courseName={courseName}

              setCourseName={setCourseName}

              description={description}

              setDescription={setDescription}

              price={price}

              setPrice={setPrice}

              duration={duration}

              setDuration={setDuration}

              certificate={certificate}

              setCertificate={setCertificate}

              fieldErrors={fieldErrors}

            />

          )}



          {step === 1 && (

            <RequirementsStep

              requirements={requirements}

              setRequirements={setRequirements}

              fieldErrors={fieldErrors}

            />

          )}



          {step === 2 && (

            <ChaptersStep

              chapters={chapters}

              setChapters={setChapters}

              activeChapter={activeChapter}

              setActiveChapter={setActiveChapter}

              videoUploadState={videoUploadState}

              fieldErrors={fieldErrors}

              onVideoFileSelect={handleFileSelect}

              onYouTubeAuth={(authUrl?: string) => { setIsYouTubeReauth(true); handleYouTubeAuth(undefined, authUrl); }}

              onDriveAuth={handleDriveAuth}

            />

          )}



          {step === 3 && (

            <ReviewStep

              courseName={courseName}

              description={description}

              price={price}

              duration={duration}

              certificate={certificate}

              requirements={requirements}

              chapters={chapters}

              submitError={submitError}

            />

          )}



          {/* ── Navigation buttons ── */}

          <div className={`flex items-center justify-between mt-8 pt-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>

            {step > 0 ? (

              <button

                type="button"

                onClick={handleBack}

                disabled={isSubmitting}

                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 ${isDark ? 'border-slate-700 text-white hover:bg-slate-700' : 'border-slate-200 text-[#111827] hover:bg-slate-50'}`}

              >

                <FiArrowLeft size={16} /> Back

              </button>

            ) : (

              <div />

            )}



            {step < STEPS.length - 1 ? (

              <button

                type="button"

                onClick={handleNext}

                className={isDark ? "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-transparent border border-blue-600 text-white text-sm font-bold hover:bg-blue-600 transition-colors cursor-pointer" : "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-200"}

              >

                Continue <FiArrowRight size={16} />

              </button>

            ) : (

              <button

                type="button"

                onClick={handleSubmit}

                disabled={isSubmitting}

                className={isDark ? "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-transparent border border-blue-600 text-white text-sm font-bold hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-60" : "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-200 disabled:opacity-60"}

              >

                {isSubmitting ? (

                  <><FiLoader size={16} className="animate-spin" /> {isEditMode ? "Saving..." : "Creating..."}</>

                ) : (

                  <><FiCheckCircle size={16} /> {isEditMode ? "Save Edit" : "Create Course"}</>

                )}

              </button>

            )}

          </div>



        </div>

      </div>



      {/* Modals */}

      <YouTubeAuthModal

        show={showYouTubeAuthModal}

        reauth={isYouTubeReauth}

        onConfirm={() => handleConfirmYouTubeAuth(getFormData())}

        onCancel={() => { setShowYouTubeAuthModal(false); setIsYouTubeReauth(false); }}

      />

      <DriveAuthModal

        show={showDriveAuthModal}

        onConfirm={() => confirmDriveAuth(getFormData())}

        onCancel={() => setShowDriveAuthModal(false)}

      />

      <UploadConfirmModal

        show={showUploadConfirmModal}

        file={pendingUploadFile?.file || null}

        lessonIndex={pendingUploadFile?.vi || 0}

        onConfirm={confirmVideoUpload}

        onCancel={() => {

          setShowUploadConfirmModal(false);

          setPendingUploadFile(null);

        }}

      />



      {/* Fixed bottom progress loader — stays visible while the server uploads videos */}
      {showBottomProgress && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 border-t px-4 py-3 backdrop-blur-md ${isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <FiLoader size={16} className="text-blue-600 animate-spin shrink-0" />
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{stageLabel}</p>
              <span className={`ml-auto text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{activeUploadPct}%</span>
            </div>
            <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${activeUploadPct}%` }}
              />
            </div>
            <p className={`text-[11px] mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Do not close or refresh this page while uploading — large videos can take a few minutes.
            </p>
          </div>
        </div>
      )}

    </div>

  );

}

