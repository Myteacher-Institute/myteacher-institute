"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiAlignCenter, FiAlignLeft, FiAlignRight, FiBold, FiList, FiLink, FiImage, FiType } from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";
import { countWords } from "@/lib/htmlUtils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxHeight?: number;
  maxWords?: number;
  minHeight?: number;
  showImageUpload?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

const ALIGN_ACTIONS: Array<{ cmd: string; icon: typeof FiBold; label: string }> = [
  { cmd: "justifyLeft", icon: FiAlignLeft, label: "Align left" },
  { cmd: "justifyCenter", icon: FiAlignCenter, label: "Align center" },
  { cmd: "justifyRight", icon: FiAlignRight, label: "Align right" },
];

const LIST_ACTIONS: Array<{ cmd: string; icon: typeof FiBold; label: string }> = [
  { cmd: "insertUnorderedList", icon: FiList, label: "Bullet list" },
  { cmd: "insertOrderedList", icon: FiList, label: "Numbered list" },
];

const normalizeHtml = (html: string): string => (html || "").replace(/\uFEFF/g, "");

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write something...",
  maxHeight = 400,
  maxWords = 700,
  minHeight = 120,
  showImageUpload = false,
  onImageUpload,
}: RichTextEditorProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastValidRef = useRef(normalizeHtml(value));
  const initializedRef = useRef(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const runCommand = (cmd: string, value?: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false, value);
    const html = el.innerHTML;
    lastValidRef.current = html;
    autoGrow();
    onChange(html);
  };

  const handleAddLink = () => {
    if (!linkUrl) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || selectedText || linkUrl}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    }
    setShowLinkDialog(false);
    setLinkUrl("");
    setLinkText("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;
    
    setUploadingImage(true);
    try {
      const imageUrl = await onImageUpload(file);
      const imgHtml = `<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; height: auto;" />`;
      document.execCommand('insertHTML', false, imgHtml);
      setShowImageDialog(false);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
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
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand("italic")}
          title="Italic"
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isDark ? "text-slate-300 hover:bg-slate-700 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-[#111827]"
          }`}
        >
          <FiType size={14} />
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
        <span className={`mx-1 h-4 w-px ${isDark ? "bg-slate-600" : "bg-slate-200"}`} />
        {LIST_ACTIONS.map(({ cmd, icon: Icon, label }) => (
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
        <span className={`mx-1 h-4 w-px ${isDark ? "bg-slate-600" : "bg-slate-200"}`} />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowLinkDialog(true)}
          title="Add link"
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isDark ? "text-slate-300 hover:bg-slate-700 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-[#111827]"
          }`}
        >
          <FiLink size={14} />
        </button>
        {showImageUpload && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowImageDialog(true)}
            title="Add image"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isDark ? "text-slate-300 hover:bg-slate-700 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-[#111827]"
            }`}
          >
            <FiImage size={14} />
          </button>
        )}
        <span
          className={`ml-auto text-[11px] font-semibold ${words >= maxWords ? "text-amber-500" : isDark ? "text-slate-400" : "text-slate-400"}`}
        >
          {words}/{maxWords} words
        </span>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className={`absolute top-full left-0 mt-2 p-4 rounded-xl shadow-lg border z-50 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-medium mb-1 block ${isDark ? "text-slate-300" : "text-slate-600"}`}>Link URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className={`w-full px-3 py-2 rounded-lg text-sm border ${isDark ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-700 placeholder-slate-400"}`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium mb-1 block ${isDark ? "text-slate-300" : "text-slate-600"}`}>Link Text (optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Click here"
                className={`w-full px-3 py-2 rounded-lg text-sm border ${isDark ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-700 placeholder-slate-400"}`}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddLink}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                Add Link
              </button>
              <button
                onClick={() => setShowLinkDialog(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Dialog */}
      {showImageDialog && (
        <div className={`absolute top-full left-0 mt-2 p-4 rounded-xl shadow-lg border z-50 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-medium mb-1 block ${isDark ? "text-slate-300" : "text-slate-600"}`}>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className={`w-full px-3 py-2 rounded-lg text-sm border ${isDark ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-700 placeholder-slate-400"}`}
              />
            </div>
            {uploadingImage && (
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Uploading...</p>
            )}
            <button
              onClick={() => setShowImageDialog(false)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
