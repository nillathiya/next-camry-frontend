"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { FaWallet } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import {
  addAmountToWallet,
  removeAmountFromWallet,
  getUserWalletAsync,
  checkUsernameAsync,
} from "@/redux-toolkit/slices/userSlice";
import { useWalletSettings } from "@/hooks/useWalletSettings";
import { useFundTransferWallets } from "@/hooks/useUserSettings";
import {
  TransferContainer,
  TransferForm,
  WalletSection,
  WalletSelector,
  Label,
  Select,
  AmountInput,
  UsernameInput,
  TransferButton,
  ErrorMessage,
} from "./TransferComponentStyles";
import { FUND_TX_TYPE } from "@/lib/fundType";
import { fundTransferAsync } from "@/redux-toolkit/slices/fundSlice";
import { Spinner } from "reactstrap";
import { debounce } from "lodash"; // Add lodash for debouncing

// Types
interface TransferFormData {
  walletType: string;
  amount: number;
  username: string;
}

// Component
const TransferComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.themeCustomizer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidUsername, setIsValidUsername] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState(false);
  const { value: fundTransferWallets, loading: fundTransferWalletLoading } =
    useFundTransferWallets();
  const filteredFundTransferWallets = fundTransferWallets?.filter(
    (wallet) => wallet.status
  );
  const { getWalletNameBySlug, getWalletBalanceBySlug } = useWalletSettings();
  const {
    loading: {getWalletSettings},
    walletSettings,
    error: settingsError,
  } = useAppSelector((state) => state.setting);
  const {
    loading: {getUserWallet},
    userWallet,
    error: userError,
  } = useAppSelector((state) => state.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TransferFormData>({
    defaultValues: {
      walletType: "",
      amount: 0,
      username: "",
    },
  });

  const username = watch("username");
  const amount = watch("amount");
  const walletType = watch("walletType");

  useEffect(() => {
    if (userWallet === null && !getUserWallet) {
      dispatch(getUserWalletAsync());
    }
  }, [
    dispatch,
    walletSettings.length,
    userWallet,
    getWalletSettings,
    getUserWallet,
  ]);

  // Debounced username validation
  const validateUsername = async (username: string) => {
    if (!username) {
      setIsValidUsername(false);
      return;
    }

    setIsValidating(true);

    try {
      const result = await dispatch(checkUsernameAsync(username)).unwrap();

      if (result.success) {
        setIsValidUsername(true);
        toast.success("Username is valid");
      } else {
        setIsValidUsername(false);
        toast.error(result.message || "Username not found");
      }
    } catch (error) {
      setIsValidUsername(false);
      toast.error("Error validating username");
    } finally {
      setIsValidating(false);
    }
  };

  // Debounce the validation to avoid excessive API calls
  const debouncedValidateUsername = debounce(validateUsername, 500);

  useEffect(() => {
    debouncedValidateUsername(username);
    return () => {
      debouncedValidateUsername.cancel(); // Cleanup debounce on unmount
    };
  }, [username]);

  const onSubmit = async (data: TransferFormData) => {
    if (!isValidUsername) {
      toast.error("Please enter a valid username");
      return;
    }

    if (!userWallet) {
      toast.error("Wallet not loaded");
      return;
    }

    const balance = Number(userWallet[data.walletType] ?? 0);
    if (balance < data.amount) {
      toast.error("Insufficient balance");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        fundTransferAsync({
          ...data,
          debitCredit: "DEBIT",
          txType: FUND_TX_TYPE.FUND_TRANSFER,
        })
      ).unwrap();

      dispatch(
        removeAmountFromWallet({
          walletType: data.walletType,
          amount: data.amount,
        })
      );

      toast.success("Transfer completed successfully!");
      setValue("amount", 0);
      setValue("username", "");
      setIsValidUsername(false);
    } catch (error: any) {
      toast.error(error || "Transfer failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("fundTransferWalletLoading", fundTransferWalletLoading);
  console.log("settingsLoading", getWalletSettings);
  console.log("getUserWallet", getUserWallet);
  if (fundTransferWalletLoading) {
    return (
      <div className="text-center p-4">
        <Spinner color="primary">Loading...</Spinner>
      </div>
    );
  }
  if (getWalletSettings || getUserWallet) {
    return (
      <div className="text-center p-4">
        <Spinner color="primary">Loading wallet data...</Spinner>
      </div>
    );
  }

  if (settingsError || userError) {
    return (
      <div className="p-4 text-red-600">
        Error: {settingsError || userError}
      </div>
    );
  }

  if (!userWallet || walletSettings.length === 0) {
    return <div className="p-4">No data available.</div>;
  }

  return (
    <TransferContainer theme={darkMode ? "dark" : "light"}>
      <TransferForm onSubmit={handleSubmit(onSubmit)}>
        <WalletSection>
          <WalletSelector>
            <Label theme={darkMode ? "dark" : "light"}>Wallet</Label>
            <Controller
              name="walletType"
              control={control}
              rules={{ required: "Wallet is required" }}
              render={({ field }) => (
                <Select {...field} theme={darkMode ? "dark" : "light"}>
                  <option value="">Select Wallet</option>
                  {filteredFundTransferWallets?.map((wallet, index) => (
                    <option key={index} value={wallet.key}>
                      {getWalletNameBySlug(wallet.key)} (
                      {Number(getWalletBalanceBySlug(wallet.key) ?? 0).toFixed(
                        2
                      )}
                      )
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.walletType && (
              <ErrorMessage>{errors.walletType.message}</ErrorMessage>
            )}
          </WalletSelector>

          <WalletSelector>
            <Label theme={darkMode ? "dark" : "light"}>Amount</Label>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
              }}
              render={({ field }) => (
                <AmountInput
                  type="number"
                  placeholder="Amount"
                  {...field}
                  theme={darkMode ? "dark" : "light"}
                />
              )}
            />
            {errors.amount && (
              <ErrorMessage>{errors.amount.message}</ErrorMessage>
            )}
          </WalletSelector>

          <WalletSelector>
            <Label theme={darkMode ? "dark" : "light"}>
              Recipient Username
            </Label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Username is required" }}
              render={({ field }) => (
                <UsernameInput
                  {...field}
                  placeholder="Enter username"
                  theme={darkMode ? "dark" : "light"}
                  disabled={isValidating}
                />
              )}
            />
            {errors.username && (
              <ErrorMessage>{errors.username.message}</ErrorMessage>
            )}
          </WalletSelector>
        </WalletSection>

        <TransferButton
          type="submit"
          disabled={isSubmitting || !isValidUsername}
        >
          <FaWallet /> {isSubmitting ? "Transferring..." : "Transfer"}
        </TransferButton>
      </TransferForm>
    </TransferContainer>
  );
};

export default TransferComponent;
