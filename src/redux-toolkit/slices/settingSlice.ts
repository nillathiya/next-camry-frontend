import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import {
  IApiResponse,
  IWebsiteSettings,
  IUserSetting,
  IWalletSettings,
  ICompanyInfo,
} from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface SettingState {
  // Fixed typo: SettingState → SettingState
  websiteSettings: IWebsiteSettings[];
  walletSettings: IWalletSettings[];
  userSettings: IUserSetting[];
  companyInfo:ICompanyInfo[];
  loading: boolean; // Changed Boolean to boolean
  error: any;
}

const initialState: SettingState = {
  websiteSettings: [],
  walletSettings: [],
  userSettings: [],
  companyInfo:[],
  loading: false,
  error: null,
};

export const getWebsiteSettingsAsync = createAsyncThunk(
  "settting/getWebsiteSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IWebsiteSettings[]>>(
        ROUTES.SETTINGS.GET_WEBSITE_SETTINGS
      );
      return response.data;
    } catch (error: any) {
      console.log("Setting slice error", error);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const getUsersiteSettingsAsync = createAsyncThunk(
  "setting/getUsersiteSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IUserSetting[]>>(
        ROUTES.SETTINGS.GET_USER_SETTINGS
      );
      return response.data;
    } catch (error: any) {
      console.log("Setting slice error", error);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const getWalletSettingsAsync = createAsyncThunk(
  "setting/getWalletSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IWalletSettings[]>>(
        ROUTES.SETTINGS.GET_WALLET_SETTINGS
      );
      return response.data;
    } catch (error: any) {
      console.log("Setting slice error", error);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

export const getCompanyInfoSettingsAsync = createAsyncThunk(
  "setting/getCompanyInfoSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<ICompanyInfo[]>>(
        ROUTES.SETTINGS.GET_COMPANY_INFO_SETTINGS
      );
      return response.data;
    } catch (error: any) {
      console.log("Setting slice error", error);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getWebsiteSettingsAsync
      .addCase(getWebsiteSettingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWebsiteSettingsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.websiteSettings = action.payload.data;
      })
      .addCase(getWebsiteSettingsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getUsersiteSettingsAsync
      .addCase(getUsersiteSettingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersiteSettingsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userSettings = action.payload.data;
      })
      .addCase(getUsersiteSettingsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //  getWalletSettingsAsync
      .addCase(getWalletSettingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletSettingsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.walletSettings = action.payload.data;
      })
      .addCase(getWalletSettingsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getCompanyInfoSettingsAsync
      .addCase(getCompanyInfoSettingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyInfoSettingsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.companyInfo = action.payload.data;
      })
      .addCase(getCompanyInfoSettingsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default settingSlice.reducer;
