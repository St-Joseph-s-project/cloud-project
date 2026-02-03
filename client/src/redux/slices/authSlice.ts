import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const loadUser = (): User | null => {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
};

const initialState: AuthState = {
  user: loadUser(),
  isAuthenticated: !!loadUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
