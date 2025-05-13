import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import {
  IApiResponse,
  IFundConvertPayload,
  IFundTransaction,
  IFundTransferPayload,
  IFundWithdrawalPayload,
  IGetAllFundTransactionQuery,
} from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { FUND_TX_TYPE } from "@/lib/fundType";

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

export const fundWithdrawalAsync = createAsyncThunk(
  "fund/fundWithdrawal",
  async (formData: IFundWithdrawalPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<IApiResponse<IFundTransaction>>(
        ROUTES.TRANSACTION.FUND.WITHDRAWAL,
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

export const getAllFundTransactionAsync = createAsyncThunk(
  "fund/getAllFundTransaction",
  async (params: IGetAllFundTransactionQuery, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IFundTransaction[]>>(
        ROUTES.TRANSACTION.FUND.GET_ALL(params)
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
        const updatedTx = action.payload.data;
        const exists = state.fundTransactions.some(
          (tx) => tx._id === updatedTx._id
        );

        state.fundTransactions = exists
          ? state.fundTransactions.map((tx) =>
              tx._id === updatedTx._id ? updatedTx : tx
            )
          : [...state.fundTransactions, updatedTx];
      })
      .addCase(verifyTransactionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fundConvertAsync
      .addCase(fundConvertAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fundConvertAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTx = action.payload.data;
        const exists = state.fundTransactions.some(
          (tx) => tx._id === updatedTx._id
        );

        state.fundTransactions = exists
          ? state.fundTransactions.map((tx) =>
              tx._id === updatedTx._id ? updatedTx : tx
            )
          : [...state.fundTransactions, updatedTx];
      })
      .addCase(fundConvertAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fundTransferAsync
      .addCase(fundTransferAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fundTransferAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTx = action.payload.data;
        const exists = state.fundTransactions.some(
          (tx) => tx._id === updatedTx._id
        );

        state.fundTransactions = exists
          ? state.fundTransactions.map((tx) =>
              tx._id === updatedTx._id ? updatedTx : tx
            )
          : [...state.fundTransactions, updatedTx];
      })
      .addCase(fundTransferAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fundWithdrawalAsync
      .addCase(fundWithdrawalAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fundWithdrawalAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTx = action.payload.data;
        const exists = state.fundTransactions.some(
          (tx) => tx._id === updatedTx._id
        );

        state.fundTransactions = exists
          ? state.fundTransactions.map((tx) =>
              tx._id === updatedTx._id ? updatedTx : tx
            )
          : [...state.fundTransactions, updatedTx];
      })
      .addCase(fundWithdrawalAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getAllFundTransactionAsync
      .addCase(getAllFundTransactionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFundTransactionAsync.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedTransactions = action.payload.data;

        const txMap = new Map(state.fundTransactions.map((tx) => [tx._id, tx]));

        fetchedTransactions.forEach((tx: any) => {
          txMap.set(tx._id, tx);
        });

        state.fundTransactions = Array.from(txMap.values());
      })
      .addCase(getAllFundTransactionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectAddFundHistory = (state: RootState) =>
  (state.fund.fundTransactions || []).filter(
    (tx) => tx.txType === FUND_TX_TYPE.FUND_ADD
  );

export const selectUserFundTransfer = (state: RootState) =>
  (state.fund.fundTransactions || []).filter(
    (tx) => tx.txType === FUND_TX_TYPE.FUND_TRANSFER
  );

export const selectUserFundConvertHistory = (state: RootState) =>
  (state.fund.fundTransactions || []).filter(
    (tx) => tx.txType === FUND_TX_TYPE.FUND_CONVERT
  );

export const selectUserFundWithdrwalHistory = (state: RootState) =>
  (state.fund.fundTransactions || []).filter(
    (tx) => tx.txType === FUND_TX_TYPE.FUND_WITHDRAWAL
  );

export default fundSlice.reducer;
