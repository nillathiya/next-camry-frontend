import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import {
  IApiResponse,
  ICheckWalletQuery,
  IRegisterUserResponse,
  IUser,
  IWebsiteSettings,
} from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { persistor } from "../store";
import { signOut } from "next-auth/react";

interface UserState {
  user: IUser | null;
  status: "loading" | "idle" | "failed";
}

const initialState: UserState = {
  user: null,
  status: "idle",
};

export const registerUserAsync = createAsyncThunk(
  "user/registerUser",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<
        IApiResponse<IRegisterUserResponse>
      >(ROUTES.AUTH.REGISTER, formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const web3RegisterAsync = createAsyncThunk(
  "user/web3Register",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<
        IApiResponse<IRegisterUserResponse>
      >(ROUTES.AUTH.WEB3_REGISTER, formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // registerUserAsync
      .addCase(registerUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.data.user;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.status = "failed";
      })
      // web3RegisterAsync
      .addCase(web3RegisterAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(web3RegisterAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.data.user;
      })
      .addCase(web3RegisterAsync.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});
export const { resetUserState } = userSlice.actions;

export const handleUnauthorized = () => async (dispatch: any) => {
  try {
    await persistor.purge();
    dispatch(resetUserState());
    await signOut({ redirect: false });
    window.location.href = "/auth/login";
  } catch (err) {
    console.error("Error during logout:", err);
    window.location.href = "/auth/login";
  }
};

export default userSlice.reducer;
