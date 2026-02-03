import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { Problem } from "../../types";
import { problemsAPI } from "../../utils/axios";

export const fetchProblems = createAsyncThunk(
  "problems/fetchProblems",
  async () => {
    const data = await problemsAPI.getAll();
    return data as Problem[];
  },
);

interface ProblemState {
  items: Problem[];
  loading: boolean;
  error: string | null;
  filter: {
    category: string;
    difficulty: string;
  };
  sortBy: string; // 'none', 'title', 'difficulty'
}

const initialState: ProblemState = {
  items: [],
  loading: false,
  error: null,
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
    },
    updateProblem: (state, action: PayloadAction<Problem>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
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
      state.items = [];
    },
    deleteProblem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch problems";
      });
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
