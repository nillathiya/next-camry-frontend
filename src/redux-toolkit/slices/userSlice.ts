import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import {
  IApiResponse,
  ICheckWalletQuery,
  IGetUserGenerationPayload,
  IRegisterUserResponse,
  IUser,
  IUserDirectsQuery,
  IUserHierarchy,
  IUserWalletInfo,
  IWebsiteSettings,
  ProfileUpdatePayload,
  ProfileUpdateType,
} from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
// import { persistor } from "../store";
// import { signOut } from "next-auth/react";

interface UserState {
  user: IUser | null;
  userWallet: IUserWalletInfo | null;
  userDirects: IUser[];
  hierarchy: IUserHierarchy[];
  loading: boolean;
  error: any;
}

const initialState: UserState = {
  user: null,
  userWallet: null,
  userDirects: [],
  hierarchy: [],
  loading: false,
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
      const response = await apiClient.get<IApiResponse<IUser>>(
        ROUTES.USER.GET_PROFILE
      );
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
      // if (type === "avatar" && payload instanceof FormData) {
      //   payload.append("updateAction", "profileImageUpdate");
      // }

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

export const getUserWalletAsync = createAsyncThunk(
  "user/getUserWallet",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IUserWalletInfo>>(
        ROUTES.USER.GET_USER_WALLET
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const getUserDirectsAsync = createAsyncThunk(
  "user/getUserDirects",
  async (params: IUserDirectsQuery, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IUser[]>>(
        ROUTES.USER.GET_USER_DIRECTS(params)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const getUserHierarchyAsync = createAsyncThunk(
  "user/getUserHierarchy",
  async (formData: IGetUserGenerationPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<IApiResponse<IUserHierarchy[]>>(
        ROUTES.USER.GET_GENERATION_TREE,
        formData
      );
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
      state.error = null;
    },
    addAmountToWallet: (state, action) => {
      console.log("action payload", action.payload);
      const { walletType, amount } = action.payload;
      if (state.userWallet && walletType && amount > 0) {
        state.userWallet[walletType] =
          (Number(state.userWallet[walletType]) || 0) + parseFloat(amount);
      } else {
        console.error("Invalid wallet or amount");
      }
    },
    removeAmountFromWallet: (state, action) => {
      const { walletType, amount } = action.payload;
      if (
        state.userWallet &&
        walletType &&
        amount > 0 &&
        (state.userWallet[walletType] || 0) >= amount
      ) {
        state.userWallet[walletType] =
          Number(state.userWallet[walletType]) - parseFloat(amount);
      } else {
        console.error(
          `Insufficient balance in ${walletType} or invalid wallet`
        );
      }
    },
    clearUserWallet: (state) => {
      state.userWallet = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // registerUserAsync
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // web3RegisterAsync
      .addCase(web3RegisterAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(web3RegisterAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
      })
      .addCase(web3RegisterAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getUserWalletAsync
      .addCase(getUserWalletAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserWalletAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userWallet = action.payload.data;
      })
      .addCase(getUserWalletAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getProfileAsync
      .addCase(getProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateProfileAsync
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = {
            ...state.user,
            ...action.payload.data,
            address: {
              ...state.user.address,
              ...action.payload.data.address,
            },
          };
        }
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getUserDirectsAsync
      .addCase(getUserDirectsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDirectsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userDirects = action.payload.data;
      })
      .addCase(getUserDirectsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getUserHierarchyAsync
      .addCase(getUserHierarchyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserHierarchyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.hierarchy = action.payload.data;
      })
      .addCase(getUserHierarchyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { resetUserState ,addAmountToWallet,removeAmountFromWallet} = userSlice.actions;

// export const handleUnauthorized = () => async (dispatch: any) => {
//   try {
//     await persistor.purge();
//     dispatch(resetUserState());
//     await signOut({ redirect: false });
//     window.location.href = "/auth/login";
//   } catch (err) {
//     console.error("Error during logout:", err);
//     window.location.href = "/auth/login";
//   }
// };

export default userSlice.reducer;
