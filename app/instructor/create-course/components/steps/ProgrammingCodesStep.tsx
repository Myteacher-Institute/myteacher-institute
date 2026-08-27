import { FiCode, FiPlus, FiTrash2 } from "react-icons/fi";
import { Field } from "../Field";
import { inputCls } from "../../utils";
import type { ProgrammingCode } from "@/types";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { useThemeStore } from "@/store/theme.store";
import { RichTextEditor } from "@/app/components/RichTextEditor";

interface ProgrammingCodesStepProps {
  programmingCodes: ProgrammingCode[];
  setProgrammingCodes: (value: ProgrammingCode[]) => void;
}

export const ProgrammingCodesStep = ({ programmingCodes, setProgrammingCodes }: ProgrammingCodesStepProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const addProgrammingCode = () => setProgrammingCodes([...programmingCodes, { code: "", language: "", explanation: "", fileName: "" }]);
  const removeProgrammingCode = (i: number) => setProgrammingCodes(programmingCodes.filter((_, idx) => idx !== i));
  const updateProgrammingCode = <K extends keyof ProgrammingCode>(i: number, field: K, value: ProgrammingCode[K]) => {
    const n = [...programmingCodes];
    n[i] = { ...n[i], [field]: value };
    setProgrammingCodes(n);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className={isDark ? "w-10 h-10 bg-purple-900/30 rounded-xl flex items-center justify-center" : "w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"}>
          <FiCode size={20} className="text-purple-600" />
        </div>
        <div>
          <h2 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Programming Codes</h2>
          <p className="text-xs text-slate-400">Add code snippets and examples — optional</p>
        </div>
      </div>

      {programmingCodes.length === 0 ? (
        <div className={isDark ? "text-center py-10 border-2 border-dashed border-slate-700 rounded-2xl mb-4" : "text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl mb-4"}>
          <FiCode size={32} className={isDark ? "text-slate-600 mx-auto mb-3" : "text-slate-300 mx-auto mb-3"} />
          <p className="text-sm text-slate-400 font-medium">No code snippets yet</p>
          <p className="text-xs text-slate-300 mt-1">Click &quot;Add Code Snippet&quot; to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {programmingCodes.map((code, i) => (
            <div key={i} className={isDark ? "border border-slate-700 rounded-2xl p-5 space-y-4" : "border border-slate-200 rounded-2xl p-5 space-y-4"}>
              <div className="flex items-center justify-between">
                <span className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-[#111827]"}>Code Snippet {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeProgrammingCode(i)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Language">
                  <input
                    type="text"
                    value={code.language}
                    onChange={(e) => updateProgrammingCode(i, "language", e.target.value)}
                    placeholder="e.g. JavaScript, Python"
                    className={inputCls(undefined, isDark)}
                  />
                </Field>
                <Field label="File Name">
                  <input
                    type="text"
                    value={code.fileName}
                    onChange={(e) => updateProgrammingCode(i, "fileName", e.target.value)}
                    placeholder="e.g. main.js"
                    className={inputCls(undefined, isDark)}
                  />
                </Field>
              </div>

              <Field label="Code">
                <div className={isDark ? "border border-slate-700 rounded-xl overflow-hidden" : "border border-slate-200 rounded-xl overflow-hidden"}>
                  <CodeMirror
                    value={code.code}
                    height="200px"
                    onChange={(value: string) => updateProgrammingCode(i, "code", value)}
                    extensions={[
                      code.language?.toLowerCase() === "javascript" ? javascript() :
                      code.language?.toLowerCase() === "python" ? python() :
                      code.language?.toLowerCase() === "html" ? html() :
                      code.language?.toLowerCase() === "css" ? css() :
                      javascript()
                    ]}
                    theme="dark"
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLineGutter: true,
                      highlightSpecialChars: true,
                      foldGutter: true,
                      drawSelection: true,
                      dropCursor: true,
                      allowMultipleSelections: true,
                      indentOnInput: true,
                      syntaxHighlighting: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: true,
                      rectangularSelection: true,
                      crosshairCursor: true,
                      highlightActiveLine: true,
                      highlightSelectionMatches: true,
                      closeBracketsKeymap: true,
                      searchKeymap: true,
                      foldKeymap: true,
                      completionKeymap: true,
                      lintKeymap: true,
                    }}
                    className="text-sm"
                  />
                </div>
              </Field>

              <Field label="Explanation">
                <RichTextEditor
                  value={code.explanation}
                  onChange={(html) => updateProgrammingCode(i, "explanation", html)}
                  placeholder="Explain what this code does... You can add lists, links, and format the text."
                  minHeight={80}
                  maxHeight={200}
                  maxWords={300}
                />
              </Field>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addProgrammingCode}
        className="mt-4 flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
      >
        <FiPlus size={16} /> Add Code Snippet
      </button>
    </div>
  );
};
