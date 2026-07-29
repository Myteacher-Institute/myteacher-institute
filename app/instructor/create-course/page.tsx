"use client";



import { useState, useRef, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {

  FiArrowLeft, FiArrowRight, FiCheckCircle, FiLoader, FiX, FiYoutube, FiVideo, FiUpload, FiHelpCircle

} from "react-icons/fi";

import { courseService } from "@/services/course.service";

import axiosInstance from "@/lib/axios";

import type { CreateCourseRequest, CourseVideo, ProgrammingCode, Asset, Quiz } from "@/types";

import { activityTracker } from "@/utils/activityTracker";
import { useThemeStore } from "@/store/theme.store";



// Import from refactored modules

import { DRAFT_KEY, STEPS } from "./constants";

import { saveDraft, loadDraft, clearDraft } from "./hooks/useDraft";

import { useOAuth } from "./hooks/useOAuth";

import {

  StepIndicator,

  Field,

  ReviewRow,

  YouTubeAuthModal,

  DriveAuthModal,

  UploadConfirmModal,

  BasicInfoStep,

  RequirementsStep,

  VideosStep,

  ProgrammingCodesStep,

  AssetsStep,

  QuizzesStep,

  ReviewStep

} from "./components";

import { inputCls } from "./utils";



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

  const { theme } = useThemeStore();
  const isDark = theme === 'dark';



  // ── State — initialise from sessionStorage draft if available (after hydration) ─────────────

  const [step, setStep] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [showUploadConfirmModal, setShowUploadConfirmModal] = useState(false);

  const [pendingUploadFile, setPendingUploadFile] = useState<{ i: number; file: File } | null>(null);

  const [showDeletionErrorsModal, setShowDeletionErrorsModal] = useState(false);

  const [deletionErrors, setDeletionErrors] = useState<string[]>([]);

  const [failedVideoUrls, setFailedVideoUrls] = useState<string[]>([]);

  const [isRetryingDeletion, setIsRetryingDeletion] = useState(false);

  const [shouldRetryAfterAuth, setShouldRetryAfterAuth] = useState(false);

  const [skipDeletion, setSkipDeletion] = useState(false);



  // OAuth hook

  const {

    showYouTubeAuthModal,

    setShowYouTubeAuthModal,

    showDriveAuthModal,

    setShowDriveAuthModal,

    handleYouTubeAuth,

    confirmYouTubeAuth,

    handleDriveAuth,

    confirmDriveAuth

  } = useOAuth();



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

    // Videos are optional, but if added they must have either a URL or a file, and a title

    const errs: Record<string, string> = {};

    videos.forEach((v, i) => {

      if (!v.videoUrl.trim() && !v.file) {

        errs[`video_url_${i}`] = "Video URL or file is required";

      }

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



  // ── Video helpers ─────────────────────────────────────────────────────────

  const handleVideoFileSelect = (i: number, file: File) => {

    const n = [...videos];

    n[i] = { ...n[i], file };

    if (!n[i].videoTitle) {

      n[i].videoTitle = file.name.replace(/\.[^/.]+$/, "");

    }

    setVideos(n);

  };



  // Form data for OAuth redirect

  const getFormData = () => ({

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

  });



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

    const n = [...videos];

    if (!n[i].videoTitle) {

      n[i].videoTitle = file.name.replace(/\.[^/.]+$/, "");

    }

    setVideos(n);



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

        const updated = [...videos];

        updated[i] = { ...updated[i], videoUrl: res.data.videoUrl, file: undefined };

        setVideos(updated);

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



  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {

    setIsSubmitting(true);

    setSubmitError("");



    try {

      // Check YouTube authentication before uploading videos

      const youtubeAuthCheck = await axiosInstance.get("/api/youtube/auth");

      if (!youtubeAuthCheck.data.authenticated) {

        setIsSubmitting(false);

        // Trigger YouTube authentication modal

        if (youtubeAuthCheck.data.authUrl) {

          setShowYouTubeAuthModal(true);

          (window as any).youtubeAuthUrl = youtubeAuthCheck.data.authUrl;

        }

        return;

      }



      // Check Google Drive authentication before uploading assets

      const assetsWithFiles = assets.filter(a => a.file);

      if (assetsWithFiles.length > 0) {

        const driveAuthCheck = await axiosInstance.get("/api/drive/auth");

        if (!driveAuthCheck.data.authenticated) {

          setIsSubmitting(false);

          // Trigger Google Drive authentication modal

          if (driveAuthCheck.data.authUrl) {

            setShowDriveAuthModal(true);

            (window as any).driveAuthUrl = driveAuthCheck.data.authUrl;

          } else {

            setSubmitError("Failed to get Google Drive authentication URL");

          }

          return;

        }

      }



      // In edit mode, first delete old videos/assets before uploading new ones

      if (isEditMode && editCourseId && !skipDeletion) {

        const deletePayload = {

          courseVideos: videos.map(v => ({ ...v, file: undefined })),

          assets: assets.map(a => ({ ...a, file: undefined }))

        };

        

        const deleteRes = await axiosInstance.post(`/api/course/delete-only/${editCourseId}`, deletePayload);

        

        if (deleteRes.data.status === "success" && deleteRes.data.deletionErrors && deleteRes.data.deletionErrors.length > 0) {

          setDeletionErrors(deleteRes.data.deletionErrors);

          const videoErrors = deleteRes.data.deletionErrors.filter((err: string) => err.includes("YouTube video"));

          const failedUrls = videoErrors.map((err: string) => {

            const match = err.match(/https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/);

            return match ? match[0] : "";

          }).filter((url: string) => url);

          setFailedVideoUrls(failedUrls);

          setShowDeletionErrorsModal(true);

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

        // Track activity for course creation/editing

        if (isEditMode) {

          activityTracker.addActivity(

            "Course updated",

            `Updated course: ${courseName.trim()}`,

            "instructor"

          );

        } else {

          activityTracker.addActivity(

            "Course created",

            `Created new course: ${courseName.trim()}`,

            "instructor"

          );

        }



        // Check if there were deletion errors

        if (res.deletionErrors && res.deletionErrors.length > 0) {

          setDeletionErrors(res.deletionErrors);

          // Extract failed video URLs from error messages

          const videoErrors = res.deletionErrors.filter((err: string) => err.includes("YouTube video"));

          const failedUrls = videoErrors.map((err: string) => {

            const match = err.match(/https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/);

            return match ? match[0] : "";

          }).filter((url: string) => url);

          setFailedVideoUrls(failedUrls);

          setShowDeletionErrorsModal(true);

        } else {

          clearDraft();

          router.push("/instructor");

        }

      } else {

        setSubmitError(res.message || "Failed to save course");

      }

    } catch (err: any) {

      setSubmitError(err?.message || "Something went wrong. Please try again.");

    } finally {

      setIsSubmitting(false);

    }

  };



  const handleRetryDeletion = async () => {

    if (!editCourseId || failedVideoUrls.length === 0) return;

    

    setIsRetryingDeletion(true);

    try {

      const res = await axiosInstance.post(`/api/course/retry-deletion/${editCourseId}`, {

        videoUrls: failedVideoUrls

      });

      

      if (res.data.status === "success") {

        setShowDeletionErrorsModal(false);

        setShouldRetryAfterAuth(false);

        setSkipDeletion(true); // Skip deletion on next submit

        // Continue with the original submit flow

        await handleSubmit();

      } else {

        setDeletionErrors(res.data.deletionErrors || ["Failed to retry deletion"]);

      }

    } catch (error: any) {

      setDeletionErrors([error.response?.data?.message || "Failed to retry deletion"]);

    } finally {

      setIsRetryingDeletion(false);

    }

  };



  // Override confirmYouTubeAuth to auto-retry deletion after auth

  const handleConfirmYouTubeAuth = async (formData: any) => {

    await confirmYouTubeAuth(formData);

    if (shouldRetryAfterAuth) {

      // Wait a moment for tokens to be saved

      await new Promise(resolve => setTimeout(resolve, 500));

      await handleRetryDeletion();

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

            <VideosStep

              videos={videos}

              setVideos={setVideos}

              videoUploadState={videoUploadState}

              setVideoUploadState={setVideoUploadState}

              fieldErrors={fieldErrors}

              onFileSelect={handleFileSelect}

              onYouTubeAuth={handleYouTubeAuth}

            />

          )}



          {step === 3 && (

            <ProgrammingCodesStep

              programmingCodes={programmingCodes}

              setProgrammingCodes={setProgrammingCodes}

            />

          )}



          {step === 4 && (

            <AssetsStep

              assets={assets}

              setAssets={setAssets}

              onDriveAuth={handleDriveAuth}

            />

          )}



          {step === 5 && (

            <QuizzesStep

              quizzes={quizzes}

              setQuizzes={setQuizzes}

            />

          )}



          {step === 6 && (

            <ReviewStep

              courseName={courseName}

              description={description}

              price={price}

              duration={duration}

              certificate={certificate}

              requirements={requirements}

              videos={videos}

              programmingCodes={programmingCodes}

              assets={assets}

              quizzes={quizzes}

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

        onConfirm={() => handleConfirmYouTubeAuth(getFormData())}

        onCancel={() => setShowYouTubeAuthModal(false)}

      />

      <DriveAuthModal

        show={showDriveAuthModal}

        onConfirm={() => confirmDriveAuth(getFormData())}

        onCancel={() => setShowDriveAuthModal(false)}

      />

      <UploadConfirmModal

        show={showUploadConfirmModal}

        file={pendingUploadFile?.file || null}

        lessonIndex={pendingUploadFile?.i || 0}

        onConfirm={confirmVideoUpload}

        onCancel={() => {

          setShowUploadConfirmModal(false);

          setPendingUploadFile(null);

        }}

      />



      {/* Deletion Errors Modal */}

      {showDeletionErrorsModal && (

        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center backdrop-blur-sm">

          <div className={`rounded-2xl p-6 lg:p-8 max-w-lg w-full mx-4 shadow-xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>

            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">

                <FiHelpCircle className="text-amber-600" size={20} />

              </div>

              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Course Updated with Warnings</h3>

            </div>

            <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>

              The course data has been saved successfully, but some resources could not be deleted from external services:

            </p>

            <div className={`rounded-xl p-4 mb-6 max-h-60 overflow-y-auto ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>

              <ul className="space-y-2">

                {deletionErrors.map((error, index) => (

                  <li key={index} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>

                    <span className="text-amber-500 mt-0.5">•</span>

                    <span>{error}</span>

                  </li>

                ))}

              </ul>

            </div>

            <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>

              Click "Authenticate" to re-authenticate with YouTube and get fresh tokens. After authentication, you can retry the deletion or manually clean up the resources from those platforms.

            </p>

            <button

              onClick={async () => {

                setShouldRetryAfterAuth(true);

                setShowDeletionErrorsModal(false);

                try {

                  const res = await axiosInstance.get("/api/youtube/auth?force=true");

                  if (res.data.status === "success" && res.data.authUrl) {

                    // Store the current URL for redirect after auth

                    sessionStorage.setItem('course_form_redirect_url', window.location.href);

                    const width = 500;

                    const height = 600;

                    const left = (window.screen.width - width) / 2;

                    const top = (window.screen.height - height) / 2;

                    window.open(res.data.authUrl, 'youtube-auth', `width=${width},height=${height},left=${left},top=${top}`);

                  } else {

                    alert("Failed to get YouTube authentication URL");

                  }

                } catch (err: any) {

                  console.error("YouTube auth error:", err);

                  alert("Failed to initiate YouTube authentication. Please try again.");

                }

              }}

              className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors mb-3"

            >

              Authenticate

            </button>

            <button

              onClick={handleRetryDeletion}

              disabled={isRetryingDeletion}

              className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 mb-3 ${isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}

            >

              {isRetryingDeletion ? "Retrying..." : "Retry Deletion"}

            </button>

            <button

              onClick={() => {

                setShowDeletionErrorsModal(false);

                setSkipDeletion(true);

                handleSubmit();

              }}

              className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}

            >

              Skip & Continue

            </button>

          </div>

        </div>

      )}

    </div>

  );

}

