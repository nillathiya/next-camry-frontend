import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import {
  IApiResponse,
  ICheckWalletQuery,
  IRegisterUserResponse,
  IUser,
  IWebsiteSettings,
  ProfileUpdatePayload,
  ProfileUpdateType,
} from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { persistor } from "../store";
import { signOut } from "next-auth/react";

interface UserState {
  user: IUser | null;
  status: "loading" | "idle" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
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

export const getProfileAsync = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IUser>(ROUTES.USER.GET_PROFILE);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  "user/updateProfile",
  async (
    { payload, type }: { payload: FormData | object; type: "avatar" | "data" },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type":
            type === "avatar" ? "multipart/form-data" : "application/json",
        },
      };
      if (type === "avatar" && payload instanceof FormData) {
        payload.append("updateAction", "profileImageUpdate");
      }

      const response = await apiClient.post(
        ROUTES.USER.EDIT_PROFILE,
        payload,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState(state) {
      state.user = null;
      state.error = null;
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
      })
      // getProfileAsync
      .addCase(getProfileAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // updateProfileAsync
      .addCase(updateProfileAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.status = "idle";
        if (state.user) {
          state.user = {
            ...state.user,
            ...action.payload.data,
            address: {
              ...state.user.address,
              ...action.payload.data.address
            }
          };
        }
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
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
