"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// import Image from "next/image";
import {
  FiAward as Award,
  FiDownload as Download,
  FiEye as Eye,
  FiCalendar as Calendar,
  FiClock as Clock,
  FiBook,
  FiLoader,
  FiSearch,
  FiCheckCircle as CheckCircle,
} from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";
import { studentService, Certificate } from "@/services/student.service";
import StudentSidebar from "@/app/components/StudentSidebar";

const Skeleton: React.FC<{ className: string }> = ({ className }) => (
  <div className={`animate-pulse rounded-xl ${className}`} />
);

export default function StudentCertificatesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { theme } = useThemeStore();
  const { logout } = useAuthStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await studentService.getCertificates();
        if (res.status === "success" && res.certificates) {
          setCertificates(res.certificates);
        } else {
          setError(res.message || "Could not load your certificates");
        }
      } catch {
        setError("Could not load your certificates. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/get-started';
  };

  const handlePreview = (certificate: Certificate) => {
    // Validate certificate URL before preview
    if (!certificate.certificate || 
        certificate.certificate === 'No Certificate' || 
        !certificate.certificate.startsWith('http')) {
      alert('Invalid certificate URL');
      return;
    }
    
    setSelectedCertificate(certificate);
    setShowPreview(true);
  };

  const handleDownload = (certificate: Certificate) => {
    // Validate certificate URL before download
    if (!certificate.certificate || 
        certificate.certificate === 'No Certificate' || 
        !certificate.certificate.startsWith('http')) {
      alert('Invalid certificate URL');
      return;
    }
    
    // Create a download link for the certificate
    const link = document.createElement('a');
    link.href = certificate.certificate;
    link.download = `${certificate.courseName.replace(/\s+/g, '-')}-certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCertificates = certificates.filter(certificate =>
    searchQuery.trim() === "" ||
    certificate.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CertificateCardSkeleton = () => (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center gap-4 p-5">
        <Skeleton className={`w-16 h-16 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <div className="flex-1 space-y-3">
          <Skeleton className={`h-6 w-3/4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <Skeleton className={`h-4 w-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        </div>
        <div className="flex gap-2">
          <Skeleton className={`w-20 h-10 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <Skeleton className={`w-20 h-10 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen font-sans ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-[#1E293B]'}`}>
      <StudentSidebar
        isSidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/student/certificates"
        onLogout={handleLogout}
      />

      <main className={`grow p-5 lg:p-10 overflow-y-auto w-full lg:ml-72 min-w-0 z-10 relative`}>
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden cursor-pointer p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              aria-label="Open sidebar"
            >
              <FiLoader size={20} />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">My Certificates</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                View and download your course completion certificates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`relative flex-1 sm:flex-none`}>
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} size={18} />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500' 
                    : 'bg-white border-slate-200 text-[#1E293B] placeholder-slate-400 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CertificateCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className={`rounded-2xl border p-8 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <p className={`text-red-600 font-medium mb-4`}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <Award size={48} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
              {searchQuery ? 'No certificates found' : 'No certificates yet'}
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Complete courses to earn your certificates'}
            </p>
            {!searchQuery && (
              <Link
                href="/student/courses"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <FiBook size={20} />
                Browse Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate._id}
                className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
                  isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4 p-5">
                  {/* PDF Preview Thumbnail */}
                  <div className="w-32 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                    {certificate.certificate && certificate.certificate.startsWith('http') ? (
                      <iframe
                        src={certificate.certificate}
                        className="w-full h-full border-0"
                        title="Certificate Preview"
                        loading="lazy"
                      />
                    ) : (
                      <Award size={32} className="text-slate-400" />
                    )}
                  </div>

                  {/* Certificate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-lg truncate ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                        {certificate.courseName}
                      </h3>
                      <div className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                        <CheckCircle size={10} />
                        Completed
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-2 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {certificate.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Clock size={12} />
                        <span>{certificate.duration} weeks</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Calendar size={12} />
                        <span>{new Date(certificate.completionDate).toLocaleDateString()}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span className="font-medium">Instructor:</span>
                        <span>{certificate.instructorDetails.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handlePreview(certificate)}
                      className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownload(certificate)}
                      className="flex items-center gap-2 py-2 px-4 bg-slate-600 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* PDF Preview Modal */}
      {showPreview && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                {selectedCertificate.courseName} - Certificate
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                <FiLoader size={20} />
              </button>
            </div>
            <div className="p-4 h-[calc(90vh-80px)] overflow-auto">
              <iframe
                src={selectedCertificate.certificate}
                className="w-full h-full border-0 rounded-lg"
                title="Certificate Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}