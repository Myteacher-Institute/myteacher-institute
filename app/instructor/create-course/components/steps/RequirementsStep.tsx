import { FiCheckCircle, FiPlus, FiTrash2 } from "react-icons/fi";
import { inputCls } from "../../utils";
import { useThemeStore } from "@/store/theme.store";

interface RequirementsStepProps {
  requirements: string[];
  setRequirements: (value: string[]) => void;
  fieldErrors: Record<string, string>;
}

export const RequirementsStep = ({ requirements, setRequirements, fieldErrors }: RequirementsStepProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const updateReq = (i: number, val: string) => {
    const n = [...requirements];
    n[i] = val;
    setRequirements(n);
  };

  const addReq = () => setRequirements([...requirements, ""]);
  const removeReq = (i: number) => setRequirements(requirements.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className={isDark ? "w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center" : "w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"}>
          <FiCheckCircle size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Course Requirements</h2>
          <p className="text-xs text-slate-400">What should students know before starting?</p>
        </div>
      </div>

      {fieldErrors.requirements && <p className="text-red-500 text-xs mb-4">{fieldErrors.requirements}</p>}

      <div className="space-y-3">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={isDark ? "w-6 h-6 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0" : "w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0"}>
              {i + 1}
            </span>
            <input
              type="text"
              value={req}
              onChange={(e) => updateReq(i, e.target.value)}
              placeholder={`Requirement ${i + 1}`}
              className={inputCls(undefined, isDark)}
            />
            {requirements.length > 1 && (
              <button
                type="button"
                onClick={() => removeReq(i)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <FiTrash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addReq}
        className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
      >
        <FiPlus size={16} /> Add Requirement
      </button>
    </div>
  );
};
