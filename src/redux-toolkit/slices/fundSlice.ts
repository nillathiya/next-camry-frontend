import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import {
  IApiResponse,
  IFundConvertPayload,
  IFundTransaction,
  IFundTransferPayload,
} from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface FundState {
  fundTransactions: IFundTransaction[];
  loading: boolean;
  error: any;
}

const initialState: FundState = {
  fundTransactions: [],
  loading: false,
  error: null,
};

export const verifyTransactionAsync = createAsyncThunk(
  "fund/verifyTransaction",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<IApiResponse<IFundTransaction>>(
        ROUTES.TRANSACTION.FUND.VERIFY,
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

export const fundConvertAsync = createAsyncThunk(
  "fund/fundConvert",
  async (formData: IFundConvertPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<IApiResponse<IFundTransaction>>(
        ROUTES.TRANSACTION.FUND.CONVERT,
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

export const fundTransferAsync = createAsyncThunk(
  "fund/fundTransfer",
  async (formData: IFundTransferPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<IApiResponse<IFundTransaction>>(
        ROUTES.TRANSACTION.FUND.TRANSFER,
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

const fundSlice = createSlice({
  name: "fund",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // verifyTransactionAsync
      .addCase(verifyTransactionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTransactionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.fundTransactions.push(action.payload.data);
      })
      .addCase(verifyTransactionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default fundSlice.reducer;
