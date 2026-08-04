import { FiBook, FiDollarSign, FiClock, FiAward } from "react-icons/fi";
import { Field } from "../Field";
import { CERTIFICATE_OPTIONS } from "../../constants";
import { inputCls } from "../../utils";
import { useThemeStore } from "@/store/theme.store";
import { RichTextEditor } from "@/app/components/RichTextEditor";
import { countWords } from "@/lib/htmlUtils";

interface BasicInfoStepProps {
  courseName: string;
  setCourseName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  certificate: string;
  setCertificate: (value: string) => void;
  fieldErrors: Record<string, string>;
}

export const BasicInfoStep = ({
  courseName,
  setCourseName,
  description,
  setDescription,
  price,
  setPrice,
  duration,
  setDuration,
  certificate,
  setCertificate,
  fieldErrors
}: BasicInfoStepProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className={isDark ? "w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center" : "w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"}>
          <FiBook size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Basic Information</h2>
          <p className="text-xs text-slate-200">Tell students what your course is about</p>
        </div>
      </div>

      <Field label="Course Name" error={fieldErrors.courseName}>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="e.g. Complete UI/UX Design Bootcamp"
          className={inputCls(fieldErrors.courseName, isDark)}
        />
      </Field>

      <Field label="Description" error={fieldErrors.description}>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Describe what students will learn, who it's for, and what makes it unique..."
          maxWords={700}
        />
        <p className="text-[11px] text-slate-400 mt-1">{countWords(description)}/700 words</p>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₦)" error={fieldErrors.price}>
          <div className="relative">
            <FiDollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className={`${inputCls(fieldErrors.price, isDark)} pl-9`}
            />
          </div>
        </Field>
        <Field label="Duration (hours)" error={fieldErrors.duration}>
          <div className="relative">
            <FiClock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 12"
              className={`${inputCls(fieldErrors.duration, isDark)} pl-9`}
            />
          </div>
        </Field>
      </div>

      <Field label="Certificate Type" error={fieldErrors.certificate}>
        <div className="relative">
          <FiAward size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={certificate}
            onChange={(e) => setCertificate(e.target.value)}
            className={`${inputCls(fieldErrors.certificate, isDark)} pl-9 appearance-none cursor-pointer`}
          >
            <option value="">Select certificate type</option>
            {CERTIFICATE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </Field>
    </div>
  );
};
