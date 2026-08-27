import { FiPaperclip, FiPlus, FiTrash2, FiUpload, FiCheckCircle } from "react-icons/fi";
import { Field } from "../Field";
import { inputCls } from "../../utils";
import type { Asset } from "@/types";
import { useThemeStore } from "@/store/theme.store";

interface AssetsStepProps {
  assets: Asset[];
  setAssets: (value: Asset[]) => void;
  onDriveAuth: () => void;
}

export const AssetsStep = ({ assets, setAssets, onDriveAuth }: AssetsStepProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const addAsset = () => setAssets([...assets, { name: "", url: "", file: undefined }]);
  const removeAsset = (i: number) => setAssets(assets.filter((_, idx) => idx !== i));
  const updateAsset = <K extends keyof Asset>(i: number, field: K, value: Asset[K]) => {
    const n = [...assets];
    n[i] = { ...n[i], [field]: value };
    setAssets(n);
  };

  const handleAssetFileSelect = (i: number, file: File) => {
    const n = [...assets];
    n[i] = { ...n[i], file, name: file.name };
    setAssets(n);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={isDark ? "w-10 h-10 bg-orange-900/30 rounded-xl flex items-center justify-center" : "w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"}>
            <FiPaperclip size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Course Assets</h2>
            <p className="text-xs text-slate-400">Add downloadable resources — optional</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDriveAuth}
          className={isDark ? "px-3 py-1.5 rounded-lg border border-orange-800 text-xs font-semibold text-orange-400 hover:bg-orange-900/20 transition-colors cursor-pointer" : "px-3 py-1.5 rounded-lg border border-orange-200 text-xs font-semibold text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"}
        >
          Authenticate Google Drive
        </button>
      </div>

      {assets.length === 0 ? (
        <div className={isDark ? "text-center py-10 border-2 border-dashed border-slate-700 rounded-2xl mb-4" : "text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl mb-4"}>
          <FiPaperclip size={32} className={isDark ? "text-slate-600 mx-auto mb-3" : "text-slate-300 mx-auto mb-3"} />
          <p className="text-sm text-slate-400 font-medium">No assets yet</p>
          <p className="text-xs text-slate-300 mt-1">Click &quot;Add Asset&quot; to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assets.map((asset, i) => (
            <div key={i} className={isDark ? "border border-slate-700 rounded-2xl p-5 space-y-4" : "border border-slate-200 rounded-2xl p-5 space-y-4"}>
              <div className="flex items-center justify-between">
                <span className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-[#111827]"}>Asset {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeAsset(i)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>

              <Field label="Asset Name">
                <input
                  type="text"
                  value={asset.name}
                  onChange={(e) => updateAsset(i, "name", e.target.value)}
                  placeholder="e.g. Course Slides"
                  className={inputCls(undefined, isDark)}
                />
              </Field>

              <Field label="Upload File">
                <div className={isDark ? "border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-orange-700 transition-colors" : "border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-orange-300 transition-colors"}>
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
                        <p className={isDark ? "text-sm text-slate-300 font-medium" : "text-sm text-slate-600 font-medium"}>Click to upload file</p>
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

      <button
        type="button"
        onClick={addAsset}
        className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
      >
        <FiPlus size={16} /> Add Asset
      </button>
    </div>
  );
};
