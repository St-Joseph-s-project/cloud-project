import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  theme: "light" | "dark";
}

const initialState: UiState = {
  theme: "light", // Default to light
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state: UiState) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      // simple persistence can be handled here or in store subscription
      if (typeof window !== "undefined") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(state.theme);
      }
    },
    setTheme: (state: UiState, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(state.theme);
      }
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
