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
  IUserLevelWiseGenerationQuery,
  IUserLevelWiseGenerationResponse,
  IUseWithPackageQuery,
  IUserRewardTeamMetrics,
} from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Stats } from "fs";
// import { persistor } from "../store";
// import { signOut } from "next-auth/react";

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

export interface UserState {
  user: IUser | null;
  userWallet: IUserWalletInfo | null;
  userDirects: IUser[];
  userOrders: IOrder[];
  hierarchy: IUserHierarchy[];
  levelWiseGeneration: IUserLevelWiseGenerationResponse[];
  userRankAndTeamMetric: IUserRankAndTeamMetric;
  userTeamMetric: IUserTeamMetric | null;
  userRewardTeamMetrics: IUserRewardTeamMetrics | null;
  userCappingStatus: IUserCappingStatus | null;
  fetched: {
    registerUser: boolean;
    web3Register: boolean;
    getProfile: boolean;
    updateProfile: boolean;
    getUserWallet: boolean;
    getUserDirects: boolean;
    getUserHierarchy: boolean;
    getUserLevelWiseGeneration: boolean;
    getUserNewsAndEvents: boolean;
    checkUsername: boolean;
    userTopUp: boolean;
    getUserOrders: boolean;
    getUserRankAndTeamMetric: boolean;
    getUserRewardTeamMetrics: boolean;
    getUserTeamMetric: boolean;
    getUserCappingStatus: boolean;
  };
  loading: {
    registerUser: boolean;
    web3Register: boolean;
    getProfile: boolean;
    updateProfile: boolean;
    getUserWallet: boolean;
    getUserDirects: boolean;
    getUserHierarchy: boolean;
    getUserLevelWiseGeneration: boolean;
    getUserNewsAndEvents: boolean;
    checkUsername: boolean;
    userTopUp: boolean;
    getUserOrders: boolean;
    getUserRankAndTeamMetric: boolean;
    getUserRewardTeamMetrics: boolean;
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
  levelWiseGeneration: [],
  userRankAndTeamMetric: {},
  userTeamMetric: null,
  userRewardTeamMetrics: null,
  userCappingStatus: null,
  fetched: {
    registerUser: false,
    web3Register: false,
    getProfile: false,
    updateProfile: false,
    getUserWallet: false,
    getUserDirects: false,
    getUserHierarchy: false,
    getUserLevelWiseGeneration: false,
    getUserNewsAndEvents: false,
    checkUsername: false,
    userTopUp: false,
    getUserOrders: false,
    getUserRankAndTeamMetric: false,
    getUserRewardTeamMetrics: false,
    getUserTeamMetric: false,
    getUserCappingStatus: false,
  },
  loading: {
    registerUser: false,
    web3Register: false,
    getProfile: false,
    updateProfile: false,
    getUserWallet: false,
    getUserDirects: false,
    getUserHierarchy: false,
    getUserLevelWiseGeneration: false,
    getUserNewsAndEvents: false,
    checkUsername: false,
    userTopUp: false,
    getUserOrders: false,
    getUserRankAndTeamMetric: false,
    getUserRewardTeamMetrics: false,
    getUserTeamMetric: false,
    getUserCappingStatus: false,
  },
  error: null,
  newsEvents: [],
  newsThumbnails: [],
  latestNews: [],
};

// Async Thunks
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
        images: item.images || [],
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

export const getUserRewardTeamMetricsAsync = createAsyncThunk(
  "user/getUserRewardTeamMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<
        IApiResponse<IUserRewardTeamMetrics>
      >(ROUTES.USER.GET_REWARD_TEAM_METRICS);
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

export const getUserLevelWiseGenerationAsync = createAsyncThunk(
  "user/getUserLevelWiseGeneration",
  async (params: IUserLevelWiseGenerationQuery, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<
        IApiResponse<IUserLevelWiseGenerationResponse[]>
      >(ROUTES.USER.GET_LEVEL_WISE_GENERATION(params));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const getUserWithPackageInfoAsync = createAsyncThunk(
  "user/getUserWithPackageInfo",
  async (params: IUseWithPackageQuery, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IUser>>(
        ROUTES.USER.GET_INFO_WITH_PACKAGE(params)
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
      state.userWallet = null;
      state.userDirects = [];
      state.userOrders = [];
      state.hierarchy = [];
      state.userRankAndTeamMetric = {};
      state.userTeamMetric = null;
      state.userCappingStatus = null;
      state.newsEvents = [];
      state.newsThumbnails = [];
      state.latestNews = [];
      state.fetched = initialState.fetched;
      state.error = null;
    },
    addAmountToWallet: (state, action) => {
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
    resetFetched: (
      state,
      action: { payload: keyof UserState["fetched"] | "all" }
    ) => {
      if (action.payload === "all") {
        state.fetched = initialState.fetched;
        state.user = null;
        state.userWallet = null;
        state.userDirects = [];
        state.userOrders = [];
        state.hierarchy = [];
        state.levelWiseGeneration = [];
        state.userRankAndTeamMetric = {};
        state.userTeamMetric = null;
        state.userCappingStatus = null;
        state.newsEvents = [];
        state.newsThumbnails = [];
        state.latestNews = [];
      } else {
        state.fetched[action.payload] = false;
        if (action.payload === "getProfile") {
          state.user = null;
        } else if (action.payload === "getUserWallet") {
          state.userWallet = null;
        } else if (action.payload === "getUserDirects") {
          state.userDirects = [];
        } else if (action.payload === "getUserOrders") {
          state.userOrders = [];
        } else if (action.payload === "getUserHierarchy") {
          state.hierarchy = [];
        } else if (action.payload === "getUserLevelWiseGeneration") {
          state.levelWiseGeneration = [];
        } else if (action.payload === "getUserRankAndTeamMetric") {
          state.userRankAndTeamMetric = {};
        } else if (action.payload === "getUserTeamMetric") {
          state.userTeamMetric = null;
        } else if (action.payload === "getUserCappingStatus") {
          state.userCappingStatus = null;
        } else if (action.payload === "getUserNewsAndEvents") {
          state.newsEvents = [];
          state.newsThumbnails = [];
          state.latestNews = [];
        }
      }
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
        state.fetched.registerUser = true;
        state.user = action.payload.data.user;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading.registerUser = false;
        state.fetched.registerUser = true;
        state.error = action.payload as string;
      })

      // web3RegisterAsync
      .addCase(web3RegisterAsync.pending, (state) => {
        state.loading.web3Register = true;
        state.error = null;
      })
      .addCase(web3RegisterAsync.fulfilled, (state, action) => {
        state.loading.web3Register = false;
        state.fetched.web3Register = true;
        state.user = action.payload.data.user;
      })
      .addCase(web3RegisterAsync.rejected, (state, action) => {
        state.loading.web3Register = false;
        state.fetched.web3Register = true;
        state.error = action.payload as string;
      })

      // getProfileAsync
      .addCase(getProfileAsync.pending, (state) => {
        state.loading.getProfile = true;
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.loading.getProfile = false;
        state.fetched.getProfile = true;
        state.user = action.payload.data;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.loading.getProfile = false;
        state.fetched.getProfile = true;
        state.error = action.payload as string;
      })

      // updateProfileAsync
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading.updateProfile = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading.updateProfile = false;
        state.fetched.updateProfile = true;
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
        state.fetched.updateProfile = true;
        state.error = action.payload as string;
      })

      // getUserWalletAsync
      .addCase(getUserWalletAsync.pending, (state) => {
        state.loading.getUserWallet = true;
        state.error = null;
      })
      .addCase(getUserWalletAsync.fulfilled, (state, action) => {
        state.loading.getUserWallet = false;
        state.fetched.getUserWallet = true;
        state.userWallet = action.payload.data;
      })
      .addCase(getUserWalletAsync.rejected, (state, action) => {
        state.loading.getUserWallet = false;
        state.fetched.getUserWallet = true;
        state.error = action.payload as string;
      })

      // getUserDirectsAsync
      .addCase(getUserDirectsAsync.pending, (state) => {
        state.loading.getUserDirects = true;
        state.error = null;
      })
      .addCase(getUserDirectsAsync.fulfilled, (state, action) => {
        state.loading.getUserDirects = false;
        state.fetched.getUserDirects = true;
        state.userDirects = action.payload.data;
      })
      .addCase(getUserDirectsAsync.rejected, (state, action) => {
        state.loading.getUserDirects = false;
        state.fetched.getUserDirects = true;
        state.error = action.payload as string;
      })

      // getUserHierarchyAsync
      .addCase(getUserHierarchyAsync.pending, (state) => {
        state.loading.getUserHierarchy = true;
        state.error = null;
      })
      .addCase(getUserHierarchyAsync.fulfilled, (state, action) => {
        state.loading.getUserHierarchy = false;
        state.fetched.getUserHierarchy = true;
        state.hierarchy = action.payload.data;
      })
      .addCase(getUserHierarchyAsync.rejected, (state, action) => {
        state.loading.getUserHierarchy = false;
        state.fetched.getUserHierarchy = true;
        state.error = action.payload as string;
      })

      // getUserNewsAndEventsAsync
      .addCase(getUserNewsAndEventsAsync.pending, (state) => {
        state.loading.getUserNewsAndEvents = true;
        state.error = null;
      })
      .addCase(getUserNewsAndEventsAsync.fulfilled, (state, action) => {
        state.loading.getUserNewsAndEvents = false;
        state.fetched.getUserNewsAndEvents = true;
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
        state.fetched.getUserNewsAndEvents = true;
        state.error = action.payload as string;
      })

      // checkUsernameAsync
      .addCase(checkUsernameAsync.pending, (state) => {
        state.loading.checkUsername = true;
        state.error = null;
      })
      .addCase(checkUsernameAsync.fulfilled, (state, action) => {
        state.loading.checkUsername = false;
        state.fetched.checkUsername = true;
      })
      .addCase(checkUsernameAsync.rejected, (state, action) => {
        state.loading.checkUsername = false;
        state.fetched.checkUsername = true;
        state.error = action.payload as string;
      })

      // userTopUpAsync
      .addCase(userTopUpAsync.pending, (state) => {
        state.loading.userTopUp = true;
        state.error = null;
      })
      .addCase(userTopUpAsync.fulfilled, (state, action) => {
        state.loading.userTopUp = false;
        state.fetched.userTopUp = true;
        const newOrder = action.payload.data;
        if (!newOrder || !newOrder._id) {
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
      })
      .addCase(userTopUpAsync.rejected, (state, action) => {
        state.loading.userTopUp = false;
        state.fetched.userTopUp = true;
        state.error = action.payload as string;
      })

      // getAllUserOrdersAsync
      .addCase(getAllUserOrdersAsync.pending, (state) => {
        state.loading.getUserOrders = true;
        state.error = null;
      })
      .addCase(getAllUserOrdersAsync.fulfilled, (state, action) => {
        state.loading.getUserOrders = false;
        state.fetched.getUserOrders = true;
        state.userOrders = action.payload.data;
      })
      .addCase(getAllUserOrdersAsync.rejected, (state, action) => {
        state.loading.getUserOrders = false;
        state.fetched.getUserOrders = true;
        state.error = action.payload as string;
      })

      // getUserRankAndTeamMetricsAsync
      .addCase(getUserRankAndTeamMetricsAsync.pending, (state) => {
        state.loading.getUserRankAndTeamMetric = true;
        state.error = null;
      })
      .addCase(getUserRankAndTeamMetricsAsync.fulfilled, (state, action) => {
        state.loading.getUserRankAndTeamMetric = false;
        state.fetched.getUserRankAndTeamMetric = true;
        state.userRankAndTeamMetric = action.payload.data;
      })
      .addCase(getUserRankAndTeamMetricsAsync.rejected, (state, action) => {
        state.loading.getUserRankAndTeamMetric = false;
        state.fetched.getUserRankAndTeamMetric = true;
        state.error = action.payload as string;
      })

      // getUserTeamMetricsAsync
      .addCase(getUserTeamMetricsAsync.pending, (state) => {
        state.loading.getUserTeamMetric = true;
        state.error = null;
      })
      .addCase(getUserTeamMetricsAsync.fulfilled, (state, action) => {
        state.loading.getUserTeamMetric = false;
        state.fetched.getUserTeamMetric = true;
        state.userTeamMetric = action.payload.data;
      })
      .addCase(getUserTeamMetricsAsync.rejected, (state, action) => {
        state.loading.getUserTeamMetric = false;
        state.fetched.getUserTeamMetric = true;
        state.error = action.payload as string;
      })

      // getUserCappingStatusAsync
      .addCase(getUserCappingStatusAsync.pending, (state) => {
        state.loading.getUserCappingStatus = true;
        state.error = null;
      })
      .addCase(getUserCappingStatusAsync.fulfilled, (state, action) => {
        state.loading.getUserCappingStatus = false;
        state.fetched.getUserCappingStatus = true;
        state.userCappingStatus = action.payload.data;
      })
      .addCase(getUserCappingStatusAsync.rejected, (state, action) => {
        state.loading.getUserCappingStatus = false;
        state.fetched.getUserCappingStatus = true;
        state.error = action.payload as string;
      })

      // getUserLevelWiseGenerationAsync
      .addCase(getUserLevelWiseGenerationAsync.pending, (state) => {
        state.loading.getUserLevelWiseGeneration = true;
        state.error = null;
      })
      .addCase(getUserLevelWiseGenerationAsync.fulfilled, (state, action) => {
        state.loading.getUserLevelWiseGeneration = false;
        state.fetched.getUserLevelWiseGeneration = true;
        state.levelWiseGeneration = action.payload.data;
      })
      .addCase(getUserLevelWiseGenerationAsync.rejected, (state, action) => {
        state.loading.getUserLevelWiseGeneration = false;
        state.fetched.getUserCappingStatus = true;
        state.error = action.payload as string;
      })

      // getUserRewardTeamMetricsAsync
      .addCase(getUserRewardTeamMetricsAsync.pending, (state) => {
        state.loading.getUserRewardTeamMetrics = true;
        state.error = null;
      })
      .addCase(getUserRewardTeamMetricsAsync.fulfilled, (state, action) => {
        state.loading.getUserRewardTeamMetrics = false;
        state.fetched.getUserRewardTeamMetrics = true;
        state.userRewardTeamMetrics = action.payload.data;
      })
      .addCase(getUserRewardTeamMetricsAsync.rejected, (state, action) => {
        state.loading.getUserRewardTeamMetrics = false;
        state.fetched.getUserRewardTeamMetrics = true;
        state.error = action.payload as string;
      });
  },
});

export const {
  resetUserState,
  addAmountToWallet,
  removeAmountFromWallet,
  clearUserWallet,
  resetFetched,
} = userSlice.actions;

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
