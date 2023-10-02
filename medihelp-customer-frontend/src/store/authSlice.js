import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    token: null,
    user: {},
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout(state, action) {
      state.isLoggedIn = false;
      state.token = null;
      state.user = {};
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
