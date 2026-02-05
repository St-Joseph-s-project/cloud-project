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
    const response = await problemsAPI.getAll();
    return response.data; // key change: extracting the array
  },
);

export const createProblem = createAsyncThunk(
  "problems/createProblem",
  async (problemData: any, { rejectWithValue }) => {
    try {
      const data = await problemsAPI.create(problemData);
      return data.data; // Assuming API returns { success: true, data: ... }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create problem");
    }
  },
);

export const updateProblemThunk = createAsyncThunk(
  "problems/updateProblem",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await problemsAPI.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update problem");
    }
  },
);

export const deleteProblemThunk = createAsyncThunk(
  "problems/deleteProblem",
  async (id: string, { rejectWithValue }) => {
    try {
      await problemsAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete problem");
    }
  },
);

export const fetchProblemById = createAsyncThunk(
  "problems/fetchProblemById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await problemsAPI.getById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch problem");
    }
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
      })
      // Create Problem
      .addCase(createProblem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Problem
      .addCase(updateProblemThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Problem
      .addCase(deleteProblemThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
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
