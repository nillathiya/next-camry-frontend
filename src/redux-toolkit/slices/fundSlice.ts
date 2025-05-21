import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import {
  IApiResponse,
  IFundConvertPayload,
  IFundTransaction,
  IFundTransferPayload,
  IFundWithdrawalPayload,
  IGetAllFundTransactionQuery,
  IGetAllIncomeTransactionQuery,
  IIncomeTransaction,
  IncomeInfoDynamic,
} from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { FUND_TX_TYPE } from "@/lib/fundType";

interface FundState {
  fundTransactions: IFundTransaction[];
  incomeTransaction: IIncomeTransaction[];
  userIncomeInfo: IncomeInfoDynamic;
  fetched: {
    verifyTransaction: boolean;
    fundConvert: boolean;
    fundTransfer: boolean;
    fundWithdrawal: boolean;
    getAllFundTransaction: boolean;
    getAllIncomeTransaction: boolean;
    getUserIncomeInfo: boolean;
  };
  loading: {
    verifyTransaction: boolean;
    fundConvert: boolean;
    fundTransfer: boolean;
    fundWithdrawal: boolean;
    getAllFundTransaction: boolean;
    getAllIncomeTransaction: boolean;
    getUserIncomeInfo: boolean;
  };
  error: any;
}

const initialState: FundState = {
  fundTransactions: [],
  incomeTransaction: [],
  userIncomeInfo: {},
  fetched: {
    verifyTransaction: false,
    fundConvert: false,
    fundTransfer: false,
    fundWithdrawal: false,
    getAllFundTransaction: false,
    getAllIncomeTransaction: false,
    getUserIncomeInfo: false,
  },
  loading: {
    verifyTransaction: false,
    fundConvert: false,
    fundTransfer: false,
    fundWithdrawal: false,
    getAllFundTransaction: false,
    getAllIncomeTransaction: false,
    getUserIncomeInfo: false,
  },
  error: null,
};

// Async Thunks
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
      // console.log("Verify transaction error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify transaction"
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
      // console.log("Fund convert error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to convert fund"
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
      // console.log("Fund transfer error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to transfer fund"
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
      // console.log("Fund withdrawal error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to withdraw fund"
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
      // console.log("Get all fund transactions error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch fund transactions"
      );
    }
  }
);

export const getAllIncomeTransactionAsync = createAsyncThunk(
  "fund/getAllIncomeTransaction",
  async (params: IGetAllIncomeTransactionQuery, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IIncomeTransaction[]>>(
        ROUTES.TRANSACTION.INCOME.GET_ALL(params)
      );
      return response.data;
    } catch (error: any) {
      // console.log("Get all income transactions error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch income transactions"
      );
    }
  }
);

export const getUserIncomeInfoAsync = createAsyncThunk(
  "fund/getUserIncomeInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IApiResponse<IncomeInfoDynamic>>(
        ROUTES.TRANSACTION.INCOME.GET_INFO
      );
      return response.data;
    } catch (error: any) {
      // console.log("Get user income info error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user income info"
      );
    }
  }
);

const fundSlice = createSlice({
  name: "fund",
  initialState,
  reducers: {
    // Reset fetched flags for specific APIs
    resetFetched: (state, action: { payload: keyof FundState['fetched'] | 'all' }) => {
      if (action.payload === 'all') {
        state.fetched = initialState.fetched;
        state.fundTransactions = [];
        state.incomeTransaction = [];
        state.userIncomeInfo = {};
      } else {
        state.fetched[action.payload] = false;
        if (action.payload === 'getAllFundTransaction') {
          state.fundTransactions = [];
        } else if (action.payload === 'getAllIncomeTransaction') {
          state.incomeTransaction = [];
        } else if (action.payload === 'getUserIncomeInfo') {
          state.userIncomeInfo = {};
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // verifyTransactionAsync
      .addCase(verifyTransactionAsync.pending, (state) => {
        state.loading.verifyTransaction = true;
        state.error = null;
      })
      .addCase(verifyTransactionAsync.fulfilled, (state, action) => {
        state.loading.verifyTransaction = false;
        state.fetched.verifyTransaction = true;
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
        state.loading.verifyTransaction = false;
        state.fetched.verifyTransaction = true;
        state.error = action.payload as string;
      })

      // fundConvertAsync
      .addCase(fundConvertAsync.pending, (state) => {
        state.loading.fundConvert = true;
        state.error = null;
      })
      .addCase(fundConvertAsync.fulfilled, (state, action) => {
        state.loading.fundConvert = false;
        state.fetched.fundConvert = true;
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
        state.loading.fundConvert = false;
        state.fetched.fundConvert = true;
        state.error = action.payload as string;
      })

      // fundTransferAsync
      .addCase(fundTransferAsync.pending, (state) => {
        state.loading.fundTransfer = true;
        state.error = null;
      })
      .addCase(fundTransferAsync.fulfilled, (state, action) => {
        state.loading.fundTransfer = false;
        state.fetched.fundTransfer = true;
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
        state.loading.fundTransfer = false;
        state.fetched.fundTransfer = true;
        state.error = action.payload as string;
      })

      // fundWithdrawalAsync
      .addCase(fundWithdrawalAsync.pending, (state) => {
        state.loading.fundWithdrawal = true;
        state.error = null;
      })
      .addCase(fundWithdrawalAsync.fulfilled, (state, action) => {
        state.loading.fundWithdrawal = false;
        state.fetched.fundWithdrawal = true;
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
        state.loading.fundWithdrawal = false;
        state.fetched.fundWithdrawal = true;
        state.error = action.payload as string;
      })

      // getAllFundTransactionAsync
      .addCase(getAllFundTransactionAsync.pending, (state) => {
        state.loading.getAllFundTransaction = true;
        state.error = null;
      })
      .addCase(getAllFundTransactionAsync.fulfilled, (state, action) => {
        state.loading.getAllFundTransaction = false;
        state.fetched.getAllFundTransaction = true;
        const fetchedTransactions = action.payload.data;

        const txMap = new Map(state.fundTransactions.map((tx) => [tx._id, tx]));

        fetchedTransactions.forEach((tx: any) => {
          txMap.set(tx._id, tx);
        });

        state.fundTransactions = Array.from(txMap.values());
      })
      .addCase(getAllFundTransactionAsync.rejected, (state, action) => {
        state.loading.getAllFundTransaction = false;
        state.fetched.getAllFundTransaction = true;
        state.error = action.payload as string;
      })

      // getAllIncomeTransactionAsync
      .addCase(getAllIncomeTransactionAsync.pending, (state) => {
        state.loading.getAllIncomeTransaction = true;
        state.error = null;
      })
      .addCase(getAllIncomeTransactionAsync.fulfilled, (state, action) => {
        state.loading.getAllIncomeTransaction = false;
        state.fetched.getAllIncomeTransaction = true;
        state.incomeTransaction = action.payload.data;
      })
      .addCase(getAllIncomeTransactionAsync.rejected, (state, action) => {
        state.loading.getAllIncomeTransaction = false;
        state.fetched.getAllIncomeTransaction = true;
        state.error = action.payload as string;
      })

      // getUserIncomeInfoAsync
      .addCase(getUserIncomeInfoAsync.pending, (state) => {
        state.loading.getUserIncomeInfo = true;
        state.error = null;
      })
      .addCase(getUserIncomeInfoAsync.fulfilled, (state, action) => {
        state.loading.getUserIncomeInfo = false;
        state.fetched.getUserIncomeInfo = true;
        state.userIncomeInfo = action.payload.data;
      })
      .addCase(getUserIncomeInfoAsync.rejected, (state, action) => {
        state.loading.getUserIncomeInfo = false;
        state.fetched.getUserIncomeInfo = true;
        state.error = action.payload as string;
      });
  },
});

export const { resetFetched } = fundSlice.actions;

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

export const selectUserFundWithdrawalHistory = (state: RootState) =>
  (state.fund.fundTransactions || []).filter(
    (tx) => tx.txType === FUND_TX_TYPE.FUND_WITHDRAWAL
  );

export const selectedTotalWithdrawalAmount = (state: RootState) => {
  return (state.fund.fundTransactions || [])
    .filter((tx) => tx.txType === FUND_TX_TYPE.FUND_WITHDRAWAL)
    .reduce((acc, tx) => acc + (tx.amount || 0), 0);
};

export const selectedTotalIncomeAmount = (state: RootState) => {
  return (state.fund.incomeTransaction || []).reduce(
    (acc, tx) => acc + (tx.amount || 0),
    0
  );
};

export default fundSlice.reducer;