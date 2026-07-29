import { FiHelpCircle, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { Field } from "../Field";
import { inputCls } from "../../utils";
import type { Quiz } from "@/types";
import { useThemeStore } from "@/store/theme.store";

interface QuizzesStepProps {
  quizzes: Quiz[];
  setQuizzes: (value: Quiz[]) => void;
}

export const QuizzesStep = ({ quizzes, setQuizzes }: QuizzesStepProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const addQuiz = () => setQuizzes([...quizzes, { title: "", questions: [{ question: "", options: [{ option: "", isCorrect: false }], correctAnswer: "" }] }]);
  const removeQuiz = (i: number) => setQuizzes(quizzes.filter((_, idx) => idx !== i));
  const updateQuiz = (i: number, field: keyof Quiz, value: any) => {
    const n = [...quizzes];
    (n[i] as any)[field] = value;
    setQuizzes(n);
  };

  const addQuestion = (quizIndex: number) => {
    const n = [...quizzes];
    n[quizIndex].questions.push({ question: "", options: [{ option: "", isCorrect: false }], correctAnswer: "" });
    setQuizzes(n);
  };

  const removeQuestion = (quizIndex: number, questionIndex: number) => {
    const n = [...quizzes];
    n[quizIndex].questions = n[quizIndex].questions.filter((_, idx) => idx !== questionIndex);
    setQuizzes(n);
  };

  const updateQuestion = (quizIndex: number, questionIndex: number, field: string, value: any) => {
    const n = [...quizzes];
    (n[quizIndex].questions[questionIndex] as any)[field] = value;
    setQuizzes(n);
  };

  const addOption = (quizIndex: number, questionIndex: number) => {
    const n = [...quizzes];
    n[quizIndex].questions[questionIndex].options.push({ option: "", isCorrect: false });
    setQuizzes(n);
  };

  const removeOption = (quizIndex: number, questionIndex: number, optionIndex: number) => {
    const n = [...quizzes];
    n[quizIndex].questions[questionIndex].options = n[quizIndex].questions[questionIndex].options.filter((_, idx) => idx !== optionIndex);
    setQuizzes(n);
  };

  const updateOption = (quizIndex: number, questionIndex: number, optionIndex: number, field: string, value: any) => {
    const n = [...quizzes];
    (n[quizIndex].questions[questionIndex].options[optionIndex] as any)[field] = value;
    setQuizzes(n);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className={isDark ? "w-10 h-10 bg-teal-900/30 rounded-xl flex items-center justify-center" : "w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center"}>
          <FiHelpCircle size={20} className="text-teal-600" />
        </div>
        <div>
          <h2 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Quizzes</h2>
          <p className="text-xs text-slate-400">Add quizzes to test knowledge — optional</p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className={isDark ? "text-center py-10 border-2 border-dashed border-slate-700 rounded-2xl mb-4" : "text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl mb-4"}>
          <FiHelpCircle size={32} className={isDark ? "text-slate-600 mx-auto mb-3" : "text-slate-300 mx-auto mb-3"} />
          <p className="text-sm text-slate-400 font-medium">No quizzes yet</p>
          <p className="text-xs text-slate-300 mt-1">Click "Add Quiz" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz, quizIndex) => (
            <div key={quizIndex} className={isDark ? "border border-slate-700 rounded-2xl p-5 space-y-4" : "border border-slate-200 rounded-2xl p-5 space-y-4"}>
              <div className="flex items-center justify-between">
                <span className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-[#111827]"}>Quiz {quizIndex + 1}</span>
                <button
                  type="button"
                  onClick={() => removeQuiz(quizIndex)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>

              <Field label="Quiz Title">
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) => updateQuiz(quizIndex, "title", e.target.value)}
                  placeholder="e.g. JavaScript Basics Quiz"
                  className={inputCls(undefined, isDark)}
                />
              </Field>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">Questions ({quiz.questions.length})</p>
                  <button
                    type="button"
                    onClick={() => addQuestion(quizIndex)}
                    className="text-xs text-teal-600 font-semibold hover:text-teal-700 cursor-pointer"
                  >
                    + Add Question
                  </button>
                </div>

                {quiz.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className={isDark ? "bg-slate-800 rounded-xl p-4 space-y-3" : "bg-slate-50 rounded-xl p-4 space-y-3"}>
                    <div className="flex items-center justify-between">
                      <span className={isDark ? "text-xs font-semibold text-white" : "text-xs font-semibold text-[#111827]"}>Question {questionIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(quizIndex, questionIndex)}
                        className="p-1 text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        <FiX size={12} />
                      </button>
                    </div>

                    <Field label="Question">
                      <textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(quizIndex, questionIndex, "question", e.target.value)}
                        placeholder="Enter your question..."
                        rows={2}
                        className={`${inputCls(undefined, isDark)} resize-none text-sm`}
                      />
                    </Field>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400">Options</p>
                        <button
                          type="button"
                          onClick={() => addOption(quizIndex, questionIndex)}
                          className="text-xs text-teal-600 font-semibold hover:text-teal-700 cursor-pointer"
                        >
                          + Add Option
                        </button>
                      </div>

                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) => updateOption(quizIndex, questionIndex, optionIndex, "isCorrect", e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                          />
                          <input
                            type="text"
                            value={option.option}
                            onChange={(e) => updateOption(quizIndex, questionIndex, optionIndex, "option", e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            className={isDark ? "flex-1 text-sm border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-800 text-white" : "flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"}
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(quizIndex, questionIndex, optionIndex)}
                            className="p-1 text-red-400 hover:text-red-600 cursor-pointer"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <Field label="Correct Answer">
                      <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(quizIndex, questionIndex, "correctAnswer", e.target.value)}
                        placeholder="Enter the correct answer"
                        className={inputCls(undefined, isDark)}
                      />
                    </Field>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addQuiz}
        className="mt-4 flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
      >
        <FiPlus size={16} /> Add Quiz
      </button>
    </div>
  );
};
