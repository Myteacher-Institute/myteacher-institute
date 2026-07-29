"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLoader, FiCheckCircle, FiX } from "react-icons/fi";
import axiosInstance from "@/lib/axios";

export default function YouTubeCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const redirectUrl = sessionStorage.getItem('course_form_redirect_url');

      if (!code || !state) {
        setStatus("error");
        setMessage("Invalid callback parameters. Missing code or state.");
        return;
      }

      try {
        const res = await axiosInstance.post("/api/youtube/callback", { code, state });

        if (res.data.status === "success") {
          setStatus("success");
          setMessage("YouTube authentication successful! Redirecting...");
          
          // Redirect back to the original URL or course creation page
          setTimeout(() => {
            if (redirectUrl) {
              sessionStorage.removeItem('course_form_redirect_url');
              router.push(redirectUrl);
            } else {
              router.push("/instructor/create-course");
            }
          }, 2000);
        } else {
          setStatus("error");
          setMessage(res.data.message || "Authentication failed");
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || "An error occurred during authentication";
        setStatus("error");
        
        // Provide more user-friendly error messages
        if (errorMessage.includes("invalid_grant")) {
          setMessage("The authorization code has expired or already been used. Please try authenticating again.");
        } else if (errorMessage.includes("state")) {
          setMessage("Invalid state parameter. Please try authenticating again.");
        } else {
          setMessage(errorMessage);
        }
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-poppins flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <FiLoader size={32} className="text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Authenticating with YouTube</h2>
            <p className="text-sm text-slate-500">Please wait while we complete the authentication...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <FiCheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Authentication Successful</h2>
            <p className="text-sm text-slate-500">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <FiX size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Authentication Failed</h2>
            <p className="text-sm text-slate-500">{message}</p>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => {
                  const redirectUrl = sessionStorage.getItem('course_form_redirect_url');
                  if (redirectUrl) {
                    sessionStorage.removeItem('course_form_redirect_url');
                    router.push(redirectUrl);
                  } else {
                    router.push("/instructor/create-course");
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/instructor/create-course")}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Back to Course Creation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
