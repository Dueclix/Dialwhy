import { createReducer } from "@reduxjs/toolkit";

export const userReducer = createReducer(
  {},
  {
    getAllUsersPendingRequest: (state) => {
      state.loading = true;
    },
    getAllUsersPendingSuccess: (state, action) => {
      state.loading = false;
      state.pendingUsers = action.payload;
      state.error = null;
    },
    getAllUsersPendingFail: (state, action) => {
      state.loading = false;
      state.pendingUsers = null;
      state.error = action.payload;
    },
    getAllUsersApprovedRequest: (state) => {
      state.loading = true;
    },
    getAllUsersApprovedSuccess: (state, action) => {
      state.loading = false;
      state.approvedUsers = action.payload;
      state.error = null;
    },
    getAllUsersApprovedFail: (state, action) => {
      state.loading = false;
      state.approvedUsers = null;
      state.error = action.payload;
    },
  }
);
