"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import type { Course, CreateCourseRequest } from "@/types";

export default function EditCoursePage() {
  const router = useRouter();
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/api/course/${courseId}`);
        if (res.data.status === "success" && res.data.course) {
          setCourse(res.data.course);
        } else {
          setError("Failed to load course");
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <p className="text-red-600 font-semibold mb-4">{error || "Course not found"}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Redirect to create-course page with pre-filled data
  // We'll use query params to pass the course data
  router.push(`/instructor/create-course?edit=true&courseId=${courseId}`);

  return null;
}
