import { FiVideo, FiUpload } from "react-icons/fi";

interface UploadConfirmModalProps {
  show: boolean;
  file: File | null;
  lessonIndex: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UploadConfirmModal = ({ show, file, lessonIndex, onConfirm, onCancel }: UploadConfirmModalProps) => {
  if (!show || !file) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <FiVideo size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#111827]">Confirm Video Upload</h3>
            <p className="text-sm text-slate-500">Lesson {lessonIndex + 1}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <p className="text-sm text-[#111827]">
            You are about to upload the following video to YouTube:
          </p>
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <p className="text-sm font-semibold text-[#111827] truncate">{file.name}</p>
            <p className="text-xs text-slate-500 mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            ⚠️ This will upload the video to your YouTube account. Make sure you want to proceed.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#111827] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <FiUpload size={16} /> Upload Video
          </button>
        </div>
      </div>
    </div>
  );
};
