"use client";

import { useCallback, useEffect, useRef } from "react";
import { FiAlignCenter, FiAlignLeft, FiAlignRight, FiBold } from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";
import { countWords } from "@/lib/htmlUtils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxHeight?: number;
  maxWords?: number;
  minHeight?: number;
}

const ALIGN_ACTIONS: Array<{ cmd: string; icon: typeof FiBold; label: string }> = [
  { cmd: "justifyLeft", icon: FiAlignLeft, label: "Align left" },
  { cmd: "justifyCenter", icon: FiAlignCenter, label: "Align center" },
  { cmd: "justifyRight", icon: FiAlignRight, label: "Align right" },
];

const normalizeHtml = (html: string): string => (html || "").replace(/\uFEFF/g, "");

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write something...",
  maxHeight = 400,
  maxWords = 700,
  minHeight = 120,
}: RichTextEditorProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastValidRef = useRef(normalizeHtml(value));
  const initializedRef = useRef(false);

  const autoGrow = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.maxHeight = `${maxHeight}px`;
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${Math.max(next, minHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [maxHeight, minHeight]);

  // Push external value changes into the editor (skip while the user is typing).
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const incoming = normalizeHtml(value);
    if (document.activeElement !== el && el.innerHTML !== incoming) {
      el.innerHTML = incoming;
      lastValidRef.current = incoming;
      autoGrow();
    }
    initializedRef.current = true;
  }, [value, autoGrow]);

  const handleInput = () => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    if (maxWords > 0 && countWords(el.innerText || "") > maxWords) {
      el.innerHTML = lastValidRef.current;
      return;
    }
    lastValidRef.current = html;
    autoGrow();
    onChange(html);
  };

  const runCommand = (cmd: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false);
    const html = el.innerHTML;
    lastValidRef.current = html;
    autoGrow();
    onChange(html);
  };

  const words = countWords(value);

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-colors ${
        isDark ? "bg-slate-800 border-slate-600 focus-within:border-blue-500" : "bg-white border-black focus-within:border-blue-500"
      }`}
    >
      <div className={`flex items-center gap-1 px-2 py-1.5 border-b ${isDark ? "border-slate-600" : "border-slate-200"}`}>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand("bold")}
          title="Bold"
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isDark ? "text-slate-300 hover:bg-slate-700 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-[#111827]"
          }`}
        >
          <FiBold size={14} />
        </button>
        <span className={`mx-1 h-4 w-px ${isDark ? "bg-slate-600" : "bg-slate-200"}`} />
        {ALIGN_ACTIONS.map(({ cmd, icon: Icon, label }) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand(cmd)}
            title={label}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isDark ? "text-slate-300 hover:bg-slate-700 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-[#111827]"
            }`}
          >
            <Icon size={14} />
          </button>
        ))}
        <span
          className={`ml-auto text-[11px] font-semibold ${words >= maxWords ? "text-amber-500" : isDark ? "text-slate-400" : "text-slate-400"}`}
        >
          {words}/{maxWords} words
        </span>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        onInput={handleInput}
        onPaste={handleInput}
        data-placeholder={placeholder}
        className={`p-3 text-sm outline-none whitespace-pre-wrap ${
          isDark ? "text-white placeholder-slate-400" : "text-[#111827]"
        } [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-slate-400 [&:empty:before]:pointer-events-none`}
        style={{ minHeight: `${minHeight}px`, height: `${minHeight}px` }}
      />
    </div>
  );
};
