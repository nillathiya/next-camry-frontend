import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import {
  IApiResponse,
  ICheckWalletQuery,
  IGetUserGenerationPayload,
  IOrder,
  IRegisterUserResponse,
  IUserCappingStatus,
  IUser,
  IUserDirectsQuery,
  IUserHierarchy,
  IUserRankAndTeamMetric,
  IUserTeamMetric,
  IUserTopUpPayload,
  IUserWalletInfo,
  IWebsiteSettings,
  ProfileUpdatePayload,
  ProfileUpdateType,
} from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Stats } from "fs";
// import { persistor } from "../store";
// import { signOut } from "next-auth/react";

export interface UserState {
  user: IUser | null;
  userWallet: IUserWalletInfo | null;
  userDirects: IUser[];
  userOrders: IOrder[];
  hierarchy: IUserHierarchy[];
  userRankAndTeamMetric: IUserRankAndTeamMetric;
  userTeamMetric: IUserTeamMetric | null;
  userCappingStatus: IUserCappingStatus | null;
  loading: {
    getUserDirects: boolean;
    getProfile: boolean;
    getUserWallet: boolean;
    registerUser: boolean;
    web3Register: boolean;
    updateProfile: boolean;
    getUserHierarchy: boolean;
    getUserNewsAndEvents: boolean;
    topUpUser: boolean;
    getUserOrders: boolean;
    getUserRankAndTeamMetric: boolean;
    getUserTeamMetric: boolean;
    getUserCappingStatus: boolean;
  };
  error: any;
  newsEvents: INewsEvent[];
  newsThumbnails: string[];
  latestNews: INewsEvent[];
}

const initialState: UserState = {
  user: null,
  userWallet: null,
  userDirects: [],
  userOrders: [],
  hierarchy: [],
  userRankAndTeamMetric: {},
  userTeamMetric: null,
  userCappingStatus: null,
  loading: {
    getUserDirects: false,
    getProfile: false,
    getUserWallet: false,
    registerUser: false,
    web3Register: false,
    updateProfile: false,
    getUserHierarchy: false,
    getUserNewsAndEvents: false,
    topUpUser: false,
    getUserOrders: false,
    getUserRankAndTeamMetric: false,
    getUserTeamMetric: false,
    getUserCappingStatus: false,
  },
  error: null,
  newsEvents: [],
  newsThumbnails: [],
  latestNews: [],
};
export interface INewsEvent {
  thumbnail: any;
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: "news" | "event";
  date: string;
  eventDate?: string;
  createdAt?: string;
  expireDate?: string;
}

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

export const getUserNewsAndEventsAsync = createAsyncThunk(
  "user/getUserNewsAndEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<INewsEvent[]>>(
        ROUTES.USER.GET_NEWS_EVENTS
      );
      const transformedData = response.data.data.map((item) => ({
        ...item,
        images: item.images || item.images || [],
      }));
      return { ...response.data, data: transformedData };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Get User news and events failed."
      );
    }
  }
);
export const checkUsernameAsync = createAsyncThunk(
  "user/checkUsername",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<
        IApiResponse<{ valid: boolean; activeStatus: number }>
      >(ROUTES.USER.CHECK_NAME, { username });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const userTopUpAsync = createAsyncThunk(
  "user/userTopUp",
  async (formData: IUserTopUpPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<IApiResponse<IOrder>>(
        ROUTES.USER.TOP_UP,
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

export const getAllUserOrdersAsync = createAsyncThunk(
  "user/getAllUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IOrder[]>>(
        ROUTES.USER.GET_ORDERS
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const getUserRankAndTeamMetricsAsync = createAsyncThunk(
  "user/getUserRankAndTeamMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<
        IApiResponse<IUserRankAndTeamMetric>
      >(ROUTES.USER.GET_RANK_TEAM_METRICS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const getUserTeamMetricsAsync = createAsyncThunk(
  "user/getUserTeamMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IUserTeamMetric>>(
        ROUTES.USER.GET_TEAM_MATRICS
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const getUserCappingStatusAsync = createAsyncThunk(
  "user/getUserCappingStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IUserCappingStatus>>(
        ROUTES.USER.GET_CAPPING_STATUS
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
        state.loading.registerUser = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading.registerUser = false;
        state.user = action.payload.data.user;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading.registerUser = false;
        state.error = action.payload as string;
      })
      // web3RegisterAsync
      .addCase(web3RegisterAsync.pending, (state) => {
        state.loading.web3Register = true;
        state.error = null;
      })
      .addCase(web3RegisterAsync.fulfilled, (state, action) => {
        state.loading.web3Register = false;
        state.user = action.payload.data.user;
      })
      .addCase(web3RegisterAsync.rejected, (state, action) => {
        state.loading.web3Register = false;
        state.error = action.payload as string;
      })

      // getUserWalletAsync
      .addCase(getUserWalletAsync.pending, (state) => {
        state.loading.getUserWallet = true;
        state.error = null;
      })
      .addCase(getUserWalletAsync.fulfilled, (state, action) => {
        state.loading.getUserWallet = false;
        state.userWallet = action.payload.data;
      })
      .addCase(getUserWalletAsync.rejected, (state, action) => {
        state.loading.getUserWallet = false;
        state.error = action.payload as string;
      })
      // getProfileAsync
      .addCase(getProfileAsync.pending, (state) => {
        state.loading.getProfile = true;
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.loading.getProfile = false;
        state.user = action.payload.data;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.loading.getProfile = false;
        state.error = action.payload as string;
      })
      // updateProfileAsync
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading.updateProfile = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading.updateProfile = false;
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
        state.loading.updateProfile = false;
        state.error = action.payload as string;
      })

      // getUserDirectsAsync
      .addCase(getUserDirectsAsync.pending, (state) => {
        state.loading.getUserDirects = true;
        state.error = null;
      })
      .addCase(getUserDirectsAsync.fulfilled, (state, action) => {
        state.loading.getUserDirects = false;
        state.userDirects = action.payload.data;
      })
      .addCase(getUserDirectsAsync.rejected, (state, action) => {
        state.loading.getUserDirects = false;
        state.error = action.payload as string;
      })

      // getUserHierarchyAsync
      .addCase(getUserHierarchyAsync.pending, (state) => {
        state.loading.getUserHierarchy = true;
        state.error = null;
      })
      .addCase(getUserHierarchyAsync.fulfilled, (state, action) => {
        state.loading.getUserHierarchy = false;
        state.hierarchy = action.payload.data;
      })
      .addCase(getUserHierarchyAsync.rejected, (state, action) => {
        state.loading.getUserHierarchy = false;
        state.error = action.payload as string;
      })

      // getUserNewsAndEventsAsync
      .addCase(getUserNewsAndEventsAsync.pending, (state) => {
        state.loading.getUserNewsAndEvents = true;
        state.error = null;
      })
      .addCase(getUserNewsAndEventsAsync.fulfilled, (state, action) => {
        console.log("Raw API response:", action.payload.data);
        state.loading.getUserNewsAndEvents = false;
        state.newsEvents = action.payload.data;
        state.newsThumbnails = action.payload.data.map(
          (item) => item.thumbnail
        );
        state.latestNews = [...action.payload.data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      })
      .addCase(getUserNewsAndEventsAsync.rejected, (state, action) => {
        state.loading.getUserNewsAndEvents = false;
        state.error = action.payload as string;
      })

      // userTopUpAsync
      .addCase(userTopUpAsync.pending, (state) => {
        state.loading.topUpUser = true;
        state.error = null;
      })
      .addCase(userTopUpAsync.fulfilled, (state, action) => {
        const newOrder = action.payload.data;

        // Guard against invalid data
        if (!newOrder || !newOrder._id) {
          state.loading.topUpUser = false;
          return state;
        }

        const exists = state.userOrders.some(
          (order) => order._id === newOrder._id
        );

        state.userOrders = exists
          ? state.userOrders.map((order) =>
              order._id === newOrder._id ? newOrder : order
            )
          : [...state.userOrders, newOrder];

        state.loading.topUpUser = false;
      })
      .addCase(userTopUpAsync.rejected, (state, action) => {
        state.loading.topUpUser = false;
        state.error = action.payload as string;
      })

      // getAllUserOrdersAsync
      .addCase(getAllUserOrdersAsync.pending, (state) => {
        state.loading.getUserOrders = true;
        state.error = null;
      })
      .addCase(getAllUserOrdersAsync.fulfilled, (state, action) => {
        state.loading.getUserOrders = false;
        state.userOrders = action.payload.data;
      })
      .addCase(getAllUserOrdersAsync.rejected, (state, action) => {
        state.loading.getUserOrders = false;
        state.error = action.payload as string;
      })

      // getUserRankAndTeamMetricsAsync
      .addCase(getUserRankAndTeamMetricsAsync.pending, (state) => {
        state.loading.getUserRankAndTeamMetric = true;
        state.error = null;
      })
      .addCase(getUserRankAndTeamMetricsAsync.fulfilled, (state, action) => {
        state.loading.getUserRankAndTeamMetric = false;
        state.userRankAndTeamMetric = action.payload.data;
      })
      .addCase(getUserRankAndTeamMetricsAsync.rejected, (state, action) => {
        state.loading.getUserRankAndTeamMetric = false;
        state.error = action.payload as string;
      })

      // getUserTeamMetricsAsync
      .addCase(getUserTeamMetricsAsync.pending, (state) => {
        state.loading.getUserTeamMetric = true;
        state.error = null;
      })
      .addCase(getUserTeamMetricsAsync.fulfilled, (state, action) => {
        state.loading.getUserTeamMetric = false;
        state.userTeamMetric = action.payload.data;
      })
      .addCase(getUserTeamMetricsAsync.rejected, (state, action) => {
        state.loading.getUserTeamMetric = false;
        state.error = action.payload as string;
      })

      // getUserCappingStatusAsync
      .addCase(getUserCappingStatusAsync.pending, (state) => {
        state.loading.getUserCappingStatus = true;
        state.error = null;
      })
      .addCase(getUserCappingStatusAsync.fulfilled, (state, action) => {
        state.loading.getUserCappingStatus = false;
        state.userCappingStatus = action.payload.data;
      })
      .addCase(getUserCappingStatusAsync.rejected, (state, action) => {
        state.loading.getUserCappingStatus = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUserState, addAmountToWallet, removeAmountFromWallet } =
  userSlice.actions;

export const selectTotalOrderAmount = (state: RootState) => {
  return (state.user.userOrders || []).reduce(
    (acc, order) => acc + (Number(order.bv) || 0),
    0
  );
};

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
