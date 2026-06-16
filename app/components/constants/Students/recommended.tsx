import { FiCpu as Bot, FiSmartphone as Smartphone, FiTerminal as Terminal, FiDatabase as Database } from "react-icons/fi";

export const recommended = [
  {
    t: "ML Basics",
    d: "Next in Data Science",
    i: <Bot size={20} strokeWidth={1.5} />,
    c: "bg-indigo-50 text-indigo-600",
  },
  {
    t: "Mobile Apps",
    d: "Expand React skills",
    i: <Smartphone size={20} strokeWidth={1.5} />,
    c: "bg-rose-50 text-rose-600",
  },
  {
    t: "Backend Dev",
    d: "Server-side logic",
    i: <Terminal size={20} strokeWidth={1.5} />,
    c: "bg-teal-50 text-teal-600",
  },
  {
    t: "Cloud Computing",
    d: "Scale your apps",
    i: <Database size={20} strokeWidth={1.5} />,
    c: "bg-sky-50 text-sky-600",
  },
];