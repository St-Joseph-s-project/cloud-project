import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Problem } from "../types";
import { INITIAL_PROBLEMS } from "../data/problems";

interface ProblemContextType {
  problems: Problem[];
  addProblem: (problem: Problem) => void;
  updateProblem: (problem: Problem) => void;
  getProblem: (id: string) => Problem | undefined;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider = ({ children }: { children: ReactNode }) => {
  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem("problems");
    return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
  });

  useEffect(() => {
    localStorage.setItem("problems", JSON.stringify(problems));
  }, [problems]);

  const addProblem = (problem: Problem) => {
    setProblems((prev) => [...prev, problem]);
  };

  const updateProblem = (updatedProblem: Problem) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === updatedProblem.id ? updatedProblem : p)),
    );
  };

  const getProblem = (id: string) => {
    return problems.find((p) => p.id === id);
  };

  return (
    <ProblemContext.Provider
      value={{ problems, addProblem, updateProblem, getProblem }}
    >
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblems = () => {
  const context = useContext(ProblemContext);
  if (!context)
    throw new Error("useProblems must be used within a ProblemProvider");
  return context;
};
