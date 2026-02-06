import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import problemReducer from "./slices/problemsSlice"; // Renamed
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemReducer,
    ui: uiReducer,
  },
});

export type RootState = {
  auth: ReturnType<typeof authReducer>;
  problems: ReturnType<typeof problemReducer>;
  ui: ReturnType<typeof uiReducer>;
};
export type AppDispatch = typeof store.dispatch;

// Data Statements - Subscribing to store persistence
store.subscribe(() => {
  const state = store.getState();
  // Explicitly cast state to RootState to allow property access
  const rootState = state as RootState;

  if (rootState.auth && rootState.auth.user) {
    localStorage.setItem("user", JSON.stringify(rootState.auth.user));
  } else {
    localStorage.removeItem("user");
  }

  if (rootState.problems && rootState.problems.items) {
    localStorage.setItem("problems", JSON.stringify(rootState.problems.items));
  }

  if (rootState.ui) {
    localStorage.setItem("ui", JSON.stringify(rootState.ui));
  }
});
