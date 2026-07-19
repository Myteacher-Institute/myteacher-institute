"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiBook, FiArrowLeft, FiArrowRight, FiPlus, FiTrash2,
  FiCheckCircle, FiDollarSign, FiClock, FiAward, FiX,
  FiLoader, FiVideo, FiLink, FiUpload, FiYoutube,
  FiCode, FiPaperclip, FiHelpCircle,
} from "react-icons/fi";
import { courseService } from "@/services/course.service";
import axiosInstance from "@/lib/axios";
import type { CreateCourseRequest, CourseVideo, ProgrammingCode, Asset, Quiz } from "@/types";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

const DRAFT_KEY = "create_course_draft";

// ── Persist helpers ───────────────────────────────────────────────────────────
const saveDraft = (data: object) => {
  try { 
    // Save to both sessionStorage and localStorage for long-term persistence
    const draftString = JSON.stringify(data);
    sessionStorage.setItem(DRAFT_KEY, draftString);
    localStorage.setItem(DRAFT_KEY, draftString);
  } catch {}
};
const loadDraft = () => {
  try {
    // Try localStorage first (long-term), fallback to sessionStorage
    const raw = localStorage.getItem(DRAFT_KEY) || sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};
const clearDraft = () => {
  try { 
    sessionStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
};

// ── Constants ─────────────────────────────────────────────────────────────────
const STEPS = ["Basic Info", "Requirements", "Course Videos", "Programming Codes", "Assets", "Quizzes", "Review & Submit"];

const CERTIFICATE_OPTIONS = [
  "Certificate of Completion",
  "Certificate of Achievement",
  "Professional Certificate",
  "No Certificate",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = (err?: string) =>
  `w-full px-4 py-3 border ${
    err ? "border-red-400" : "border-slate-200"
  } rounded-xl text-sm text-[#111827] placeholder-slate-400 bg-white focus:outline-none focus:border-blue-500 transition-colors`;

// ── Sub-components ────────────────────────────────────────────────────────────
const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <div key={label} className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${done ? "bg-blue-600 text-white" : active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              <span suppressHydrationWarning>
                {done ? <span className="flex items-center justify-center"><FiCheckCircle size={15} /></span> : <span>{i + 1}</span>}
              </span>
            </div>
            <span className={`text-sm font-semibold hidden sm:block ${active ? "text-[#111827]" : done ? "text-blue-600" : "text-slate-400"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`h-px w-6 sm:w-12 shrink-0 ${i < current ? "bg-blue-600" : "bg-slate-200"}`} />}
        </div>
      );
    })}
  </div>
);

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-semibold text-[#111827] mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ReviewRow = ({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) => (
  <div>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
    <p className={`text-sm font-semibold text-[#111827] ${multiline ? "leading-relaxed" : ""}`}>
      {value || <span className="text-slate-300 font-normal italic">—</span>}
    </p>
  </div>
);

// ── Empty video template ──────────────────────────────────────────────────────
const emptyVideo = (): CourseVideo => ({
  videoUrl: "",
  videoTitle: "",
  videoDescription: "",
  videoDuration: 0,
  isProgrammingVideo: false,
  isPreview: false,
});

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CreateCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const editCourseId = searchParams.get("courseId");

  // ── State — initialise from sessionStorage draft if available (after hydration) ─────────────
  const [step, setStep]               = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState("");
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);
  const [fieldErrors, setFieldErrors]   = useState<Record<string, string>>({});
  const [showYouTubeAuthModal, setShowYouTubeAuthModal] = useState(false);
  const [showDriveAuthModal, setShowDriveAuthModal] = useState(false);
  const [showUploadConfirmModal, setShowUploadConfirmModal] = useState(false);
  const [pendingUploadFile, setPendingUploadFile] = useState<{ i: number; file: File } | null>(null);

  // Step 0 — Basic info
  const [courseName,   setCourseName]   = useState<string>("");
  const [description,  setDescription]  = useState<string>("");
  const [price,        setPrice]        = useState<string>("");
  const [duration,     setDuration]     = useState<string>("");
  const [certificate,  setCertificate]  = useState<string>("");

  // Step 1 — Requirements
  const [requirements, setRequirements] = useState<string[]>([""]);

  // Step 2 — Videos (upload state is transient — not persisted)
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [videoUploadState, setVideoUploadState] = useState<
    Record<number, { uploading: boolean; progress: number; error: string }>
  >({});
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Step 3 — Programming Codes
  const [programmingCodes, setProgrammingCodes] = useState<ProgrammingCode[]>([]);

  // Step 4 — Assets
  const [assets, setAssets] = useState<Asset[]>([]);
  const assetFileInputRef = useRef<HTMLInputElement | null>(null);

  // Step 5 — Quizzes
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

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
            setVideos(formData.videos || []);
            setProgrammingCodes(formData.programmingCodes || []);
            setAssets(formData.assets || []);
            setQuizzes(formData.quizzes || []);
            setStep(formData.step || 0);
            setIsEditMode(formData.isEditMode || false);
            setEditCourseId(formData.editCourseId || "");
            
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
            setVideos(courseData.courseVideos || []);
            setProgrammingCodes(courseData.programmingCodes || []);
            setAssets(courseData.assets || []);
            setQuizzes(courseData.quizzes || []);
          }
        } catch (err: any) {
          console.error("Failed to load course for editing:", err);
        } finally {
          setIsLoadingCourse(false);
        }
      } else {
        const draft = loadDraft();
        if (draft) {
          setStep(draft.step ?? 0);
          setCourseName(draft.courseName ?? "");
          setDescription(draft.description ?? "");
          setPrice(draft.price ?? "");
          setDuration(draft.duration ?? "");
          setCertificate(draft.certificate ?? "");
          setRequirements(draft.requirements ?? [""]);
          setVideos(draft.videos ?? []);
          setProgrammingCodes(draft.programmingCodes ?? []);
          setAssets(draft.assets ?? []);
          setQuizzes(draft.quizzes ?? []);
        }
      }
    };

    loadData();
  }, [isEditMode, editCourseId]);

  // ── Auto-save draft whenever any field changes ────────────────────────────
  useEffect(() => {
    saveDraft({ step, courseName, description, price, duration, certificate, requirements, videos, programmingCodes, assets, quizzes });
  }, [step, courseName, description, price, duration, certificate, requirements, videos, programmingCodes, assets, quizzes]);

  // ── Warn user before leaving if upload is in progress ───────────────────────
  useEffect(() => {
    const hasUploadingVideo = Object.values(videoUploadState).some(state => state.uploading);
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUploadingVideo) {
        e.preventDefault();
        e.returnValue = "A video upload is in progress. Leaving this page will cancel the upload.";
        return "A video upload is in progress. Leaving this page will cancel the upload.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [videoUploadState]);

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
    // Videos are optional, but if added they must have a URL and title
    const errs: Record<string, string> = {};
    videos.forEach((v, i) => {
      if (!v.videoUrl.trim()) errs[`video_url_${i}`] = "Video URL is required";
      if (!v.videoTitle.trim()) errs[`video_title_${i}`] = "Video title is required";
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

  // ── Requirements helpers ──────────────────────────────────────────────────
  const updateReq = (i: number, val: string) => { const n = [...requirements]; n[i] = val; setRequirements(n); };
  const addReq = () => setRequirements([...requirements, ""]);
  const removeReq = (i: number) => setRequirements(requirements.filter((_, idx) => idx !== i));

  // ── Video helpers ─────────────────────────────────────────────────────────
  const addVideo = () => setVideos([...videos, emptyVideo()]);
  const removeVideo = (i: number) => setVideos(videos.filter((_, idx) => idx !== i));
  const updateVideo = (i: number, field: keyof CourseVideo, value: any) => {
    const n = [...videos];
    (n[i] as any)[field] = value;
    setVideos(n);
  };
  const handleVideoFileSelect = (i: number, file: File) => {
    updateVideo(i, "file", file);
    if (!videos[i].videoTitle) {
      updateVideo(i, "videoTitle", file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  // ── Programming Codes helpers ─────────────────────────────────────────────
  const addProgrammingCode = () => setProgrammingCodes([...programmingCodes, { code: "", language: "", explanation: "", fileName: "" }]);
  const removeProgrammingCode = (i: number) => setProgrammingCodes(programmingCodes.filter((_, idx) => idx !== i));
  const updateProgrammingCode = (i: number, field: keyof ProgrammingCode, value: any) => {
    const n = [...programmingCodes];
    (n[i] as any)[field] = value;
    setProgrammingCodes(n);
  };

  // ── Assets helpers ─────────────────────────────────────────────────────────
  const addAsset = () => setAssets([...assets, { name: "", url: "", file: undefined }]);
  const removeAsset = (i: number) => setAssets(assets.filter((_, idx) => idx !== i));
  const updateAsset = (i: number, field: keyof Asset, value: any) => {
    const n = [...assets];
    (n[i] as any)[field] = value;
    setAssets(n);
  };
  const handleAssetFileSelect = (i: number, file: File) => {
    updateAsset(i, "file", file);
    updateAsset(i, "name", file.name);
  };

  // ── Quizzes helpers ───────────────────────────────────────────────────────
  const addQuiz = () => setQuizzes([...quizzes, { title: "", questions: [{ question: "", options: [{ option: "", isCorrect: false }], correctAnswer: "" }] }]);
  const removeQuiz = (i: number) => setQuizzes(quizzes.filter((_, idx) => idx !== i));
  const updateQuiz = (i: number, field: keyof Quiz, value: any) => {
    const n = [...quizzes];
    (n[i] as any)[field] = value;
    setQuizzes(n);
  };
  const addQuestion = (quizIndex: number) => {
    const n = [...quizzes];
    n[quizIndex].questions.push({ question: "", options: [{ option: "", isCorrect: false }], correctAnswer: "" });
    setQuizzes(n);
  };
  const removeQuestion = (quizIndex: number, questionIndex: number) => {
    const n = [...quizzes];
    n[quizIndex].questions = n[quizIndex].questions.filter((_, idx) => idx !== questionIndex);
    setQuizzes(n);
  };
  const updateQuestion = (quizIndex: number, questionIndex: number, field: string, value: any) => {
    const n = [...quizzes];
    (n[quizIndex].questions[questionIndex] as any)[field] = value;
    setQuizzes(n);
  };
  const addOption = (quizIndex: number, questionIndex: number) => {
    const n = [...quizzes];
    n[quizIndex].questions[questionIndex].options.push({ option: "", isCorrect: false });
    setQuizzes(n);
  };
  const removeOption = (quizIndex: number, questionIndex: number, optionIndex: number) => {
    const n = [...quizzes];
    n[quizIndex].questions[questionIndex].options = n[quizIndex].questions[questionIndex].options.filter((_, idx) => idx !== optionIndex);
    setQuizzes(n);
  };
  const updateOption = (quizIndex: number, questionIndex: number, optionIndex: number, field: string, value: any) => {
    const n = [...quizzes];
    (n[quizIndex].questions[questionIndex].options[optionIndex] as any)[field] = value;
    setQuizzes(n);
  };

  // Authenticate with YouTube
  const handleYouTubeAuth = async () => {
    try {
      const res = await axiosInstance.get("/api/youtube/auth");
      if (res.data.status === "success" && res.data.authUrl) {
        // Show modal first to inform user
        setShowYouTubeAuthModal(true);
        // Store auth URL for when user confirms
        (window as any).youtubeAuthUrl = res.data.authUrl;
      }
    } catch (err: any) {
      console.error("YouTube auth error:", err);
      alert("Failed to initiate YouTube authentication. Please try again.");
    }
  };

  // Confirm and proceed with YouTube auth
  const confirmYouTubeAuth = () => {
    setShowYouTubeAuthModal(false);
    const authUrl = (window as any).youtubeAuthUrl;
    if (authUrl) {
      // Save current form state before redirecting
      const formData = {
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
        step,
        isEditMode,
        editCourseId
      };
      sessionStorage.setItem('course_form_state', JSON.stringify(formData));
      sessionStorage.setItem('course_form_redirect', 'true');
      
      // Open in popup instead of full redirect to prevent data loss
      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      window.open(authUrl, 'youtube-auth', `width=${width},height=${height},left=${left},top=${top}`);
    }
  };

  // Handle Google Drive authentication
  const handleDriveAuth = async () => {
    try {
      const res = await axiosInstance.get("/api/drive/auth");
      if (res.data.authenticated) {
        alert("Already authenticated with Google Drive!");
      } else {
        // Show modal first to inform user
        setShowDriveAuthModal(true);
        // Store auth URL for when user confirms
        (window as any).driveAuthUrl = res.data.authUrl;
      }
    } catch (err: any) {
      console.error("Google Drive auth error:", err);
      alert("Failed to initiate Google Drive authentication. Please try again.");
    }
  };

  // Confirm and proceed with Google Drive auth
  const confirmDriveAuth = () => {
    setShowDriveAuthModal(false);
    const authUrl = (window as any).driveAuthUrl;
    if (authUrl) {
      // Save current form state before redirecting
      const formData = {
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
        step,
        isEditMode,
        editCourseId
      };
      sessionStorage.setItem('course_form_state', JSON.stringify(formData));
      sessionStorage.setItem('course_form_redirect', 'true');
      
      // Open in popup instead of full redirect to prevent data loss
      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      window.open(authUrl, 'drive-auth', `width=${width},height=${height},left=${left},top=${top}`);
    }
  };

  // Handle file selection - show confirmation modal
  const handleFileSelect = (i: number, file: File) => {
    setPendingUploadFile({ i, file });
    setShowUploadConfirmModal(true);
  };

  // Confirm and proceed with video upload
  const confirmVideoUpload = async () => {
    if (!pendingUploadFile) return;
    
    const { i, file } = pendingUploadFile;
    setShowUploadConfirmModal(false);
    setPendingUploadFile(null);

    setVideoUploadState((prev) => ({
      ...prev,
      [i]: { uploading: true, progress: 0, error: "" },
    }));

    // Pre-fill title from filename if empty
    if (!videos[i].videoTitle) {
      updateVideo(i, "videoTitle", file.name.replace(/\.[^/.]+$/, ""));
    }

    try {
      // Auto-trigger YouTube auth if needed
      const authCheck = await axiosInstance.get("/api/youtube/auth");
      if (authCheck.data.status === "success" && !authCheck.data.authUrl && authCheck.data.authenticated) {
        // Already authenticated, proceed with upload
      } else if (authCheck.data.status === "success" && authCheck.data.authUrl) {
        // Show modal to inform user before redirecting
        setShowYouTubeAuthModal(true);
        (window as any).youtubeAuthUrl = authCheck.data.authUrl;
        // Store the file and index for after auth
        (window as any).pendingVideoUpload = { i, file };
        setVideoUploadState((prev) => ({
          ...prev,
          [i]: { uploading: false, progress: 0, error: "" },
        }));
        return;
      }

      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", videos[i].videoTitle || file.name);
      formData.append("description", videos[i].videoDescription || "");
      formData.append("privacyStatus", "unlisted");
      formData.append("tags", "course");

      const res = await axiosInstance.post("/api/youtube/upload", formData, {
        timeout: 0,
        onUploadProgress: (e) => {
          const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
          setVideoUploadState((prev) => ({
            ...prev,
            [i]: { uploading: true, progress: pct, error: "" },
          }));
        },
      });

      if (res.data.status === "success" && res.data.videoUrl) {
        updateVideo(i, "videoUrl", res.data.videoUrl);
        setVideoUploadState((prev) => ({
          ...prev,
          [i]: { uploading: false, progress: 100, error: "" },
        }));
      } else {
        throw new Error(res.data.message || "Upload failed");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Upload failed. Please try again.";
      setVideoUploadState((prev) => ({
        ...prev,
        [i]: { uploading: false, progress: 0, error: msg },
      }));
    }
  };

  // Old handleVideoFileUpload - kept for reference but replaced by handleFileSelect + confirmVideoUpload
  const handleVideoFileUpload = async (i: number, file: File) => {
    handleFileSelect(i, file);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Check YouTube authentication before uploading videos
      const youtubeAuthCheck = await axiosInstance.get("/api/youtube/auth");
      if (!youtubeAuthCheck.data.authenticated) {
        setSubmitError("YouTube authentication required. Please authenticate with YouTube first.");
        setIsSubmitting(false);
        return;
      }

      // Check Google Drive authentication before uploading assets
      const assetsWithFiles = assets.filter(a => a.file);
      if (assetsWithFiles.length > 0) {
        const driveAuthCheck = await axiosInstance.get("/api/drive/auth");
        if (!driveAuthCheck.data.authenticated) {
          setSubmitError("Google Drive authentication required. Please authenticate with Google Drive first.");
          setIsSubmitting(false);
          return;
        }
      }

      // First, upload all videos with files to YouTube
      const videosWithFiles = videos.filter(v => v.file);
      const updatedVideos = [...videos];
      
      for (let i = 0; i < videosWithFiles.length; i++) {
        const video = videosWithFiles[i];
        const videoIndex = videos.indexOf(video);
        
        setVideoUploadState(prev => ({
          ...prev,
          [videoIndex]: { uploading: true, progress: 0, error: "" }
        }));

        try {
          const formData = new FormData();
          formData.append("video", video.file!);
          formData.append("title", video.videoTitle || video.file!.name);
          formData.append("description", video.videoDescription || "");
          formData.append("privacyStatus", "unlisted");
          formData.append("tags", "course");

          const res = await axiosInstance.post("/api/youtube/upload", formData, {
            timeout: 0,
            onUploadProgress: (e) => {
              const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
              setVideoUploadState(prev => ({
                ...prev,
                [videoIndex]: { uploading: true, progress: pct, error: "" }
              }));
            },
          });

          if (res.data.status === "success" && res.data.videoUrl) {
            updatedVideos[videoIndex] = { ...video, videoUrl: res.data.videoUrl, file: undefined };
            setVideoUploadState(prev => ({
              ...prev,
              [videoIndex]: { uploading: false, progress: 100, error: "" }
            }));
          } else {
            throw new Error(res.data.message || "Upload failed");
          }
        } catch (err: any) {
          const msg = err?.response?.data?.message || err?.message || "Upload failed";
          setVideoUploadState(prev => ({
            ...prev,
            [videoIndex]: { uploading: false, progress: 0, error: msg }
          }));
          throw new Error(`Failed to upload video ${video.videoTitle}: ${msg}`);
        }
      }

      setVideos(updatedVideos);

      // Next, upload all assets with files to Google Drive
      const updatedAssets = [...assets];
      
      for (let i = 0; i < assetsWithFiles.length; i++) {
        const asset = assetsWithFiles[i];
        const assetIndex = assets.indexOf(asset);
        
        try {
          const formData = new FormData();
          formData.append("file", asset.file!);
          formData.append("name", asset.name || asset.file!.name);

          const res = await axiosInstance.post("/api/drive/upload", formData, {
            timeout: 0,
          });

          if (res.data.status === "success" && res.data.url) {
            updatedAssets[assetIndex] = { ...asset, url: res.data.url, file: undefined };
          } else {
            throw new Error(res.data.message || "Upload failed");
          }
        } catch (err: any) {
          const msg = err?.response?.data?.message || err?.message || "Upload failed";
          throw new Error(`Failed to upload asset ${asset.name}: ${msg}`);
        }
      }

      setAssets(updatedAssets);

      // Now create/update the course with all URLs
      const payload: CreateCourseRequest = {
        courseName: courseName.trim(),
        description: description.trim(),
        price: Number(price),
        duration: Number(duration),
        certificate,
        courseRequirements: requirements.filter((r) => r.trim()),
        courseVideos: updatedVideos.map(v => ({ ...v, file: undefined })),
        programmingCodes,
        assets: updatedAssets.map(a => ({ ...a, file: undefined })),
        quizzes,
      };

      let res;
      if (isEditMode && editCourseId) {
        const axiosRes = await axiosInstance.put(`/api/course/edit/${editCourseId}`, payload);
        res = axiosRes.data;
      } else {
        res = await courseService.createCourse(payload);
      }
      
      if (res.status === "success") {
        clearDraft();
        router.push("/instructor");
      } else {
        setSubmitError(res.message || "Failed to save course");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (isLoadingCourse) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-poppins p-4 md:p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => { clearDraft(); router.back(); }} className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#111827] hover:bg-slate-50 transition-colors cursor-pointer">
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">{isEditMode ? "Edit Course" : "Create New Course"}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{isEditMode ? "Update your course details" : "Share your knowledge with students worldwide"}</p>
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
              className="px-4 py-2 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Clear Draft
            </button>
          )}
        </div>

        <StepIndicator current={step} />

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">

          {/* ── Step 0: Basic Info ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><FiBook size={20} className="text-blue-600" /></div>
                <div><h2 className="text-lg font-bold text-[#111827]">Basic Information</h2><p className="text-xs text-slate-400">Tell students what your course is about</p></div>
              </div>

              <Field label="Course Name" error={fieldErrors.courseName}>
                <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g. Complete UI/UX Design Bootcamp" className={inputCls(fieldErrors.courseName)} />
              </Field>

              <Field label="Description" error={fieldErrors.description}>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what students will learn, who it's for, and what makes it unique..." rows={4} className={`${inputCls(fieldErrors.description)} resize-none`} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (₦)" error={fieldErrors.price}>
                  <div className="relative">
                    <FiDollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className={`${inputCls(fieldErrors.price)} pl-9`} />
                  </div>
                </Field>
                <Field label="Duration (hours)" error={fieldErrors.duration}>
                  <div className="relative">
                    <FiClock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 12" className={`${inputCls(fieldErrors.duration)} pl-9`} />
                  </div>
                </Field>
              </div>

              <Field label="Certificate Type" error={fieldErrors.certificate}>
                <div className="relative">
                  <FiAward size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select value={certificate} onChange={(e) => setCertificate(e.target.value)} className={`${inputCls(fieldErrors.certificate)} pl-9 appearance-none cursor-pointer`}>
                    <option value="">Select certificate type</option>
                    {CERTIFICATE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </Field>
            </div>
          )}

          {/* ── Step 1: Requirements ── */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><FiCheckCircle size={20} className="text-blue-600" /></div>
                <div><h2 className="text-lg font-bold text-[#111827]">Course Requirements</h2><p className="text-xs text-slate-400">What should students know before starting?</p></div>
              </div>

              {fieldErrors.requirements && <p className="text-red-500 text-xs mb-4">{fieldErrors.requirements}</p>}

              <div className="space-y-3">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <input type="text" value={req} onChange={(e) => updateReq(i, e.target.value)} placeholder={`Requirement ${i + 1}`} className={inputCls()} />
                    {requirements.length > 1 && (
                      <button type="button" onClick={() => removeReq(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"><FiTrash2 size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addReq} className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                <FiPlus size={16} /> Add Requirement
              </button>
            </div>
          )}

          {/* ── Step 2: Videos ── */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><FiVideo size={20} className="text-blue-600" /></div>
                <div><h2 className="text-lg font-bold text-[#111827]">Course Videos</h2><p className="text-xs text-slate-400">Upload video files or paste a YouTube URL — optional, can be added later</p></div>
              </div>

              {videos.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl mb-4">
                  <FiVideo size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">No video lessons yet</p>
                  <p className="text-xs text-slate-300 mt-1">Click "Add Video Lesson" to get started</p>
                </div>
              )}

              <div className="space-y-4">
                {videos.map((v, i) => {
                  const us = videoUploadState[i];
                  return (
                    <div key={i} className="border border-slate-200 rounded-2xl p-5 space-y-4">
                      {/* Lesson header */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#111827]">Lesson {i + 1}</span>
                        <button type="button" onClick={() => removeVideo(i)} disabled={us?.uploading} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40"><FiTrash2 size={15} /></button>
                      </div>

                      {/* ── Upload area ── */}
                      {!v.videoUrl && !us?.uploading && (
                        <div
                          className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
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
                              <FiCheckCircle size={20} />
                              <span className="text-sm font-semibold">{v.file.name}</span>
                            </div>
                          ) : (
                            <>
                              <FiUpload size={24} className="text-blue-400 mx-auto mb-2" />
                              <p className="text-sm font-semibold text-[#111827]">Drag & drop or click to upload</p>
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

                      {/* ── Upload progress ── */}
                      {us?.uploading && (
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <FiLoader size={16} className="text-blue-600 animate-spin shrink-0" />
                            <span className="text-sm font-semibold text-blue-700">Uploading to YouTube… {us.progress}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${us.progress}%` }} />
                          </div>
                          <p className="text-[11px] text-blue-500 mt-2">Do not close this page while uploading</p>
                        </div>
                      )}

                      {/* ── Upload error ── */}
                      {us?.error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                          <FiX size={15} className="text-red-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-red-700">Upload failed</p>
                            <p className="text-xs text-red-500 mt-0.5">{us.error}</p>
                            {us.error.includes("YouTube authentication") && (
                              <button
                                type="button"
                                onClick={handleYouTubeAuth}
                                className="mt-2 flex items-center gap-2 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer"
                              >
                                <FiYoutube size={12} /> Authenticate with YouTube
                              </button>
                            )}
                            <button type="button" onClick={() => fileInputRefs.current[i]?.click()} className="text-xs text-red-600 font-bold underline mt-1 cursor-pointer">Try again</button>
                            <input type="file" accept="video/*" className="hidden" ref={(el) => { fileInputRefs.current[i] = el; }} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelect(i, file); }} />
                          </div>
                        </div>
                      )}

                      {/* ── Uploaded / URL result ── */}
                      {v.videoUrl && !us?.uploading && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                          <FiYoutube size={18} className="text-red-500 shrink-0" />
                          <a href={v.videoUrl} target="_blank" rel="noreferrer" className="text-sm text-green-700 font-semibold truncate hover:underline flex-1">{v.videoUrl}</a>
                          <button type="button" onClick={() => updateVideo(i, "videoUrl", "")} className="p-1 text-slate-400 hover:text-red-500 cursor-pointer shrink-0"><FiX size={14} /></button>
                        </div>
                      )}

                      {/* Manual URL fallback */}
                      {!v.videoUrl && !us?.uploading && (
                        <Field label="Or paste a URL manually" error={fieldErrors[`video_url_${i}`]}>
                          <div className="relative">
                            <FiLink size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input type="url" value={v.videoUrl} onChange={(e) => updateVideo(i, "videoUrl", e.target.value)} placeholder="https://youtube.com/watch?v=..." className={`${inputCls(fieldErrors[`video_url_${i}`])} pl-9`} />
                          </div>
                        </Field>
                      )}

                      {/* Metadata fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Video Title" error={fieldErrors[`video_title_${i}`]}>
                          <input type="text" value={v.videoTitle} onChange={(e) => updateVideo(i, "videoTitle", e.target.value)} placeholder="e.g. Introduction" className={inputCls(fieldErrors[`video_title_${i}`])} />
                        </Field>
                        <Field label="Duration (min)">
                          <div className="relative">
                            <FiClock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input type="number" min="0" value={v.videoDuration || ""} onChange={(e) => updateVideo(i, "videoDuration", Number(e.target.value))} placeholder="0" className={`${inputCls()} pl-9`} />
                          </div>
                        </Field>
                      </div>

                      <Field label="Description">
                        <textarea value={v.videoDescription} onChange={(e) => updateVideo(i, "videoDescription", e.target.value)} placeholder="What will students learn in this lesson?" rows={2} className={`${inputCls()} resize-none`} />
                      </Field>

                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input type="checkbox" checked={v.isPreview} onChange={(e) => updateVideo(i, "isPreview", e.target.checked)} className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
                          <span className="text-sm text-[#111827] font-medium">Free preview</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input type="checkbox" checked={v.isProgrammingVideo} onChange={(e) => updateVideo(i, "isProgrammingVideo", e.target.checked)} className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
                          <span className="text-sm text-[#111827] font-medium">Programming video</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button type="button" onClick={addVideo} className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                <FiPlus size={16} /> Add Video Lesson
              </button>
            </div>
          )}

          {/* ── Step 3: Programming Codes ── */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><FiCode size={20} className="text-purple-600" /></div>
                <div><h2 className="text-lg font-bold text-[#111827]">Programming Codes</h2><p className="text-xs text-slate-400">Add code snippets and examples — optional</p></div>
              </div>

              {programmingCodes.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl mb-4">
                  <FiCode size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">No code snippets yet</p>
                  <p className="text-xs text-slate-300 mt-1">Click "Add Code Snippet" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {programmingCodes.map((code, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#111827]">Code Snippet {i + 1}</span>
                        <button type="button" onClick={() => removeProgrammingCode(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><FiTrash2 size={15} /></button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Language">
                          <input type="text" value={code.language} onChange={(e) => updateProgrammingCode(i, "language", e.target.value)} placeholder="e.g. JavaScript, Python" className={inputCls()} />
                        </Field>
                        <Field label="File Name">
                          <input type="text" value={code.fileName} onChange={(e) => updateProgrammingCode(i, "fileName", e.target.value)} placeholder="e.g. main.js" className={inputCls()} />
                        </Field>
                      </div>

                      <Field label="Code">
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <CodeMirror
                            value={code.code}
                            height="200px"
                            onChange={(value: string) => updateProgrammingCode(i, "code", value)}
                            extensions={[
                              code.language?.toLowerCase() === "javascript" ? javascript() :
                              code.language?.toLowerCase() === "python" ? python() :
                              code.language?.toLowerCase() === "html" ? html() :
                              code.language?.toLowerCase() === "css" ? css() :
                              javascript()
                            ]}
                            theme="light"
                            basicSetup={{
                              lineNumbers: true,
                              highlightActiveLineGutter: true,
                              highlightSpecialChars: true,
                              foldGutter: true,
                              drawSelection: true,
                              dropCursor: true,
                              allowMultipleSelections: true,
                              indentOnInput: true,
                              syntaxHighlighting: true,
                              bracketMatching: true,
                              closeBrackets: true,
                              autocompletion: true,
                              rectangularSelection: true,
                              crosshairCursor: true,
                              highlightActiveLine: true,
                              highlightSelectionMatches: true,
                              closeBracketsKeymap: true,
                              searchKeymap: true,
                              foldKeymap: true,
                              completionKeymap: true,
                              lintKeymap: true,
                            }}
                            className="text-sm"
                          />
                        </div>
                      </Field>

                      <Field label="Explanation">
                        <textarea value={code.explanation} onChange={(e) => updateProgrammingCode(i, "explanation", e.target.value)} placeholder="Explain what this code does..." rows={2} className={`${inputCls()} resize-none`} />
                      </Field>
                    </div>
                  ))}
                </div>
              )}

              <button type="button" onClick={addProgrammingCode} className="mt-4 flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 cursor-pointer">
                <FiPlus size={16} /> Add Code Snippet
              </button>
            </div>
          )}

          {/* ── Step 4: Assets ── */}
          {step === 4 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><FiPaperclip size={20} className="text-orange-600" /></div>
                  <div><h2 className="text-lg font-bold text-[#111827]">Course Assets</h2><p className="text-xs text-slate-400">Add downloadable resources — optional</p></div>
                </div>
                <button
                  type="button"
                  onClick={handleDriveAuth}
                  className="px-3 py-1.5 rounded-lg border border-orange-200 text-xs font-semibold text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  Authenticate Google Drive
                </button>
              </div>

              {assets.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl mb-4">
                  <FiPaperclip size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">No assets yet</p>
                  <p className="text-xs text-slate-300 mt-1">Click "Add Asset" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assets.map((asset, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#111827]">Asset {i + 1}</span>
                        <button type="button" onClick={() => removeAsset(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><FiTrash2 size={15} /></button>
                      </div>

                      <Field label="Asset Name">
                        <input type="text" value={asset.name} onChange={(e) => updateAsset(i, "name", e.target.value)} placeholder="e.g. Course Slides" className={inputCls()} />
                      </Field>

                      <Field label="Upload File">
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-orange-300 transition-colors">
                          <input
                            type="file"
                            accept=".zip,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                            className="hidden"
                            id={`asset-file-${i}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleAssetFileSelect(i, file);
                            }}
                          />
                          <label htmlFor={`asset-file-${i}`} className="cursor-pointer">
                            {asset.file ? (
                              <div className="flex items-center justify-center gap-2 text-green-600">
                                <FiCheckCircle size={16} />
                                <span className="text-sm font-medium">{asset.file.name}</span>
                              </div>
                            ) : (
                              <div>
                                <FiUpload size={24} className="text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 font-medium">Click to upload file</p>
                                <p className="text-xs text-slate-400 mt-1">ZIP, PDF, DOC, PPT, images (max 50MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </Field>
                    </div>
                  ))}
                </div>
              )}

              <button type="button" onClick={addAsset} className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 cursor-pointer">
                <FiPlus size={16} /> Add Asset
              </button>
            </div>
          )}

          {/* ── Step 5: Quizzes ── */}
          {step === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center"><FiHelpCircle size={20} className="text-teal-600" /></div>
                <div><h2 className="text-lg font-bold text-[#111827]">Quizzes</h2><p className="text-xs text-slate-400">Add quizzes to test knowledge — optional</p></div>
              </div>

              {quizzes.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl mb-4">
                  <FiHelpCircle size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">No quizzes yet</p>
                  <p className="text-xs text-slate-300 mt-1">Click "Add Quiz" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz, quizIndex) => (
                    <div key={quizIndex} className="border border-slate-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#111827]">Quiz {quizIndex + 1}</span>
                        <button type="button" onClick={() => removeQuiz(quizIndex)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><FiTrash2 size={15} /></button>
                      </div>

                      <Field label="Quiz Title">
                        <input type="text" value={quiz.title} onChange={(e) => updateQuiz(quizIndex, "title", e.target.value)} placeholder="e.g. JavaScript Basics Quiz" className={inputCls()} />
                      </Field>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-400">Questions ({quiz.questions.length})</p>
                          <button type="button" onClick={() => addQuestion(quizIndex)} className="text-xs text-teal-600 font-semibold hover:text-teal-700 cursor-pointer">+ Add Question</button>
                        </div>

                        {quiz.questions.map((question, questionIndex) => (
                          <div key={questionIndex} className="bg-slate-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#111827]">Question {questionIndex + 1}</span>
                              <button type="button" onClick={() => removeQuestion(quizIndex, questionIndex)} className="p-1 text-red-400 hover:text-red-600 cursor-pointer"><FiX size={12} /></button>
                            </div>

                            <Field label="Question">
                              <textarea value={question.question} onChange={(e) => updateQuestion(quizIndex, questionIndex, "question", e.target.value)} placeholder="Enter your question..." rows={2} className={`${inputCls()} resize-none text-sm`} />
                            </Field>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-slate-400">Options</p>
                                <button type="button" onClick={() => addOption(quizIndex, questionIndex)} className="text-xs text-teal-600 font-semibold hover:text-teal-700 cursor-pointer">+ Add Option</button>
                              </div>

                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={option.isCorrect}
                                    onChange={(e) => updateOption(quizIndex, questionIndex, optionIndex, "isCorrect", e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                  />
                                  <input
                                    type="text"
                                    value={option.option}
                                    onChange={(e) => updateOption(quizIndex, questionIndex, optionIndex, "option", e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                  />
                                  <button type="button" onClick={() => removeOption(quizIndex, questionIndex, optionIndex)} className="p-1 text-red-400 hover:text-red-600 cursor-pointer"><FiX size={12} /></button>
                                </div>
                              ))}
                            </div>

                            <Field label="Correct Answer">
                              <input type="text" value={question.correctAnswer} onChange={(e) => updateQuestion(quizIndex, questionIndex, "correctAnswer", e.target.value)} placeholder="Enter the correct answer" className={inputCls()} />
                            </Field>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button type="button" onClick={addQuiz} className="mt-4 flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">
                <FiPlus size={16} /> Add Quiz
              </button>
            </div>
          )}

          {/* ── Step 6: Review ── */}
          {step === 6 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><FiCheckCircle size={20} className="text-green-600" /></div>
                <div><h2 className="text-lg font-bold text-[#111827]">Review & Submit</h2><p className="text-xs text-slate-400">Confirm everything looks good before publishing</p></div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <ReviewRow label="Course Name" value={courseName} />
                  <ReviewRow label="Description" value={description} multiline />
                  <div className="grid grid-cols-2 gap-3">
                    <ReviewRow label="Price" value={`₦${Number(price).toLocaleString()}`} />
                    <ReviewRow label="Duration" value={`${duration} hours`} />
                  </div>
                  <ReviewRow label="Certificate" value={certificate} />
                </div>

                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Requirements ({requirements.filter((r) => r.trim()).length})</p>
                  <ul className="space-y-2">
                    {requirements.filter((r) => r.trim()).map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#111827]">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Videos ({videos.length})</p>
                  {videos.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No videos added — can be added after creating the course</p>
                  ) : (
                    <ul className="space-y-2">
                      {videos.map((v, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-[#111827]">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                          <span className="font-medium truncate">{v.videoTitle || "Untitled"}</span>
                          {v.isPreview && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold shrink-0">Preview</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Programming Codes ({programmingCodes.length})</p>
                  {programmingCodes.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No code snippets added</p>
                  ) : (
                    <ul className="space-y-2">
                      {programmingCodes.map((code, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-[#111827]">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                          <span className="font-medium truncate">{code.fileName || "Untitled"}</span>
                          <span className="text-xs text-slate-400">{code.language}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Assets ({assets.length})</p>
                  {assets.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No assets added</p>
                  ) : (
                    <ul className="space-y-2">
                      {assets.map((asset, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-[#111827]">
                          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                          <span className="font-medium truncate">{asset.name || "Untitled"}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quizzes ({quizzes.length})</p>
                  {quizzes.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No quizzes added</p>
                  ) : (
                    <ul className="space-y-2">
                      {quizzes.map((quiz, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-[#111827]">
                          <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                          <span className="font-medium truncate">{quiz.title || "Untitled"}</span>
                          <span className="text-xs text-slate-400">{quiz.questions.length} questions</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <FiX size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{submitError}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#111827] hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-200"
              >
                Continue <FiArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-200 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <><FiLoader size={16} className="animate-spin" /> Creating...</>
                ) : (
                  <><FiCheckCircle size={16} /> Create Course</>
                )}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* YouTube Auth Modal */}
      {showYouTubeAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <FiYoutube size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">YouTube Authentication Required</h3>
                <p className="text-sm text-slate-500">To upload videos to YouTube</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <p className="text-sm text-[#111827]">
                You need to authenticate with YouTube to upload your course videos. This will:
              </p>
              <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                <li>Redirect you to Google's secure login page</li>
                <li>Request permission to upload videos to your YouTube account</li>
                <li>Store your authentication tokens securely</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowYouTubeAuthModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#111827] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmYouTubeAuth}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors cursor-pointer"
              >
                <FiYoutube size={16} /> Authenticate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Drive Authentication Modal */}
      {showDriveAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <FiPaperclip size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Google Drive Authentication Required</h3>
                <p className="text-sm text-slate-500">To upload assets to Google Drive</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <p className="text-sm text-[#111827]">
                You need to authenticate with Google Drive to upload your course assets. This will:
              </p>
              <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                <li>Redirect you to Google's secure login page</li>
                <li>Request permission to upload files to your Google Drive</li>
                <li>Store your authentication tokens securely</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDriveAuthModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#111827] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDriveAuth}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition-colors cursor-pointer"
              >
                <FiPaperclip size={16} /> Authenticate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Upload Confirmation Modal */}
      {showUploadConfirmModal && pendingUploadFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FiVideo size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Confirm Video Upload</h3>
                <p className="text-sm text-slate-500">Lesson {pendingUploadFile.i + 1}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <p className="text-sm text-[#111827]">
                You are about to upload the following video to YouTube:
              </p>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-sm font-semibold text-[#111827] truncate">{pendingUploadFile.file.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {(pendingUploadFile.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                ⚠️ This will upload the video to your YouTube account. Make sure you want to proceed.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowUploadConfirmModal(false);
                  setPendingUploadFile(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#111827] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmVideoUpload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <FiUpload size={16} /> Upload Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
