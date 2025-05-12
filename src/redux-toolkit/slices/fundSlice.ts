import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import { IApiResponse, IFundTransaction } from "@/types";
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
