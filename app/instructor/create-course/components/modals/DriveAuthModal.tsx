import { FiPaperclip } from "react-icons/fi";

interface DriveAuthModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DriveAuthModal = ({ show, onConfirm, onCancel }: DriveAuthModalProps) => {
  if (!show) return null;

  return (
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
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#111827] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition-colors cursor-pointer"
          >
            <FiPaperclip size={16} /> Authenticate
          </button>
        </div>
      </div>
    </div>
  );
};
