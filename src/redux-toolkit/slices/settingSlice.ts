import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import {
  IApiResponse,
  IWebsiteSettings,
  IUserSetting,
  IWalletSettings,
  ICompanyInfo,
  IPinSettings,
} from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IRankSettings } from "../../types/setting";

interface SettingState {
  websiteSettings: IWebsiteSettings[];
  walletSettings: IWalletSettings[];
  userSettings: IUserSetting[];
  companyInfo: ICompanyInfo[];
  pinSettings: IPinSettings[];
  rankSettings:IRankSettings[];
  loading: {
    getWebsiteSettings: boolean;
    getUserSettings: boolean;
    getWalletSettings: boolean;
    getCompanyInfo: boolean;
    getPinSettings: boolean;
    getRankSettings:boolean;
  };
  error: any;
}

const initialState: SettingState = {
  websiteSettings: [],
  walletSettings: [],
  userSettings: [],
  companyInfo: [],
  pinSettings: [],
  rankSettings:[],
  loading: {
    getWebsiteSettings: false,
    getUserSettings: false,
    getWalletSettings: false,
    getCompanyInfo: false,
    getPinSettings: false,
    getRankSettings:false,
  },
  error: null,
};

export const getWebsiteSettingsAsync = createAsyncThunk(
  "setting/getWebsiteSettings", // Fixed typo: "settting" → "setting"
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IWebsiteSettings[]>>(
        ROUTES.SETTINGS.GET_WEBSITE_SETTINGS
      );
      return response.data;
    } catch (error: any) {
      console.log("Website settings error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch website settings"
      );
    }
  }
);

export const getUsersiteSettingsAsync = createAsyncThunk(
  "setting/getUserSettings", // Renamed for consistency: "getUsersiteSettings" → "getUserSettings"
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IUserSetting[]>>(
        ROUTES.SETTINGS.GET_USER_SETTINGS
      );
      return response.data;
    } catch (error: any) {
      console.log("User settings error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user settings"
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
      console.log("Wallet settings error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wallet settings"
      );
    }
  }
);

export const getCompanyInfoSettingsAsync = createAsyncThunk(
  "setting/getCompanyInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<ICompanyInfo[]>>(
        ROUTES.SETTINGS.GET_COMPANY_INFO_SETTINGS
      );
      return response.data;
    } catch (error: any) {
      console.log("Company info settings error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company info settings"
      );
    }
  }
);

export const getPinSettingsAsync = createAsyncThunk(
  "setting/getPinSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IPinSettings[]>>(
        ROUTES.SETTINGS.GET_PIN_SETTINGS
      );
      return response.data;
    } catch (error: any) {
      console.log("Pin settings error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company info settings"
      );
    }
  }
);

export const getRankSettingsAsync = createAsyncThunk(
  "setting/getRankSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IRankSettings[]>>(
        ROUTES.SETTINGS.GET_RANK_SETTINGS
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rank settings"
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
        state.loading.getWebsiteSettings = true;
        state.error = null;
      })
      .addCase(getWebsiteSettingsAsync.fulfilled, (state, action) => {
        state.loading.getWebsiteSettings = false;
        state.websiteSettings = action.payload.data;
      })
      .addCase(getWebsiteSettingsAsync.rejected, (state, action) => {
        state.loading.getWebsiteSettings = false;
        state.error = action.payload as string;
      })

      // getUsersiteSettingsAsync
      .addCase(getUsersiteSettingsAsync.pending, (state) => {
        state.loading.getUserSettings = true;
        state.error = null;
      })
      .addCase(getUsersiteSettingsAsync.fulfilled, (state, action) => {
        state.loading.getUserSettings = false;
        state.userSettings = action.payload.data;
      })
      .addCase(getUsersiteSettingsAsync.rejected, (state, action) => {
        state.loading.getUserSettings = false;
        state.error = action.payload as string;
      })

      // getWalletSettingsAsync
      .addCase(getWalletSettingsAsync.pending, (state) => {
        state.loading.getWalletSettings = true;
        state.error = null;
      })
      .addCase(getWalletSettingsAsync.fulfilled, (state, action) => {
        state.loading.getWalletSettings = false;
        state.walletSettings = action.payload.data;
      })
      .addCase(getWalletSettingsAsync.rejected, (state, action) => {
        state.loading.getWalletSettings = false;
        state.error = action.payload as string;
      })

      // getCompanyInfoSettingsAsync
      .addCase(getCompanyInfoSettingsAsync.pending, (state) => {
        state.loading.getCompanyInfo = true;
        state.error = null;
      })
      .addCase(getCompanyInfoSettingsAsync.fulfilled, (state, action) => {
        state.loading.getCompanyInfo = false;
        state.companyInfo = action.payload.data;
      })
      .addCase(getCompanyInfoSettingsAsync.rejected, (state, action) => {
        state.loading.getCompanyInfo = false;
        state.error = action.payload as string;
      })

      // getPinSettingsAsync
      .addCase(getPinSettingsAsync.pending, (state) => {
        state.loading.getPinSettings = true;
        state.error = null;
      })
      .addCase(getPinSettingsAsync.fulfilled, (state, action) => {
        state.loading.getPinSettings = false;
        state.pinSettings = action.payload.data;
      })
      .addCase(getPinSettingsAsync.rejected, (state, action) => {
        state.loading.getPinSettings = false;
        state.error = action.payload as string;
      })

      // getRankSettingsAsync
      .addCase(getRankSettingsAsync.pending, (state) => {
        state.loading.getRankSettings = true;
        state.error = null;
      })
      .addCase(getRankSettingsAsync.fulfilled, (state, action) => {
        state.loading.getRankSettings = false;
        state.rankSettings = action.payload.data;
      })
      .addCase(getRankSettingsAsync.rejected, (state, action) => {
        state.loading.getRankSettings = false;
        state.error = action.payload as string;
      });

  },
});

export default settingSlice.reducer;
