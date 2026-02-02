import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Problem } from "../../types";
import { INITIAL_PROBLEMS } from "../../data/problems";

interface ProblemState {
  items: Problem[];
  filter: {
    category: string;
    difficulty: string;
  };
  sortBy: string; // 'none', 'title', 'difficulty'
}

const loadProblems = (): Problem[] => {
  const saved = localStorage.getItem("problems");
  return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
};

const initialState: ProblemState = {
  items: loadProblems(),
  filter: {
    category: "All",
    difficulty: "All",
  },
  sortBy: "none",
};

const problemSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    addProblem: (state, action: PayloadAction<Problem>) => {
      state.items.push(action.payload);
      try {
        localStorage.setItem("problems", JSON.stringify(state.items));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }
    },
    updateProblem: (state, action: PayloadAction<Problem>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        try {
          localStorage.setItem("problems", JSON.stringify(state.items));
        } catch (e) {
          console.error("Failed to save to localStorage", e);
        }
      }
    },
    // Filtering Capabilities
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filter.category = action.payload;
    },
    setDifficultyFilter: (state, action: PayloadAction<string>) => {
      state.filter.difficulty = action.payload;
    },
    // "Shot by" (Sort by) Capability
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    // Session Feature Adder Functionality (Reset items)
    resetProblems: (state) => {
      state.items = INITIAL_PROBLEMS;
      try {
        localStorage.setItem("problems", JSON.stringify(INITIAL_PROBLEMS));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }
    },
    deleteProblem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      try {
        localStorage.setItem("problems", JSON.stringify(state.items));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }
    },
  },
});

export const {
  addProblem,
  updateProblem,
  setCategoryFilter,
  setDifficultyFilter,
  setSortBy,
  resetProblems,
  deleteProblem,
} = problemSlice.actions;

export default problemSlice.reducer;
