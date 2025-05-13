"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { FaWallet } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import {
  removeAmountFromWallet,
  getUserWalletAsync,
} from "@/redux-toolkit/slices/userSlice";
import { getWalletSettingsAsync } from "@/redux-toolkit/slices/settingSlice";
import { useWalletSettings } from "@/hooks/useWalletSettings";
import {
  useFundTransferWallets,
  useFundWithdrawalDays,
  useFundWithdrawalWallets,
} from "@/hooks/useUserSettings";
import {
  WithdrawalContainer,
  WithdrawalForm,
  WalletSection,
  WalletSelector,
  Label,
  Select,
  AmountInput,
  WithdrawalButton,
  ErrorMessage,
} from "./WithdrawalComponentStyle";
import { FUND_TX_TYPE } from "@/lib/fundType";
import { fundWithdrawalAsync } from "@/redux-toolkit/slices/fundSlice";

// Types
interface WithdrawalFormData {
  walletType: string;
  amount: number;
}

const WithdrawalComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.themeCustomizer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithdrawalAllowed, setIsWithdrawalAllowed] = useState(true);
  const { value: fundWithdrawalWallets, loading: fundWithdrawalWalletLoading } =
    useFundWithdrawalWallets();
  const filteredFundWithdrawalWallets = fundWithdrawalWallets?.filter(
    (wallet) => wallet.status
  );
  const { value: fundWithdrawalDays, loading: fundWithdrawalDayLoading } =
    useFundWithdrawalDays();
  const { getWalletNameBySlug, getWalletBalanceBySlug } = useWalletSettings();
  const {
    loading: settingsLoading,
    walletSettings,
    error: settingsError,
  } = useAppSelector((state) => state.setting);
  const {
    loading: userLoading,
    userWallet,
    error: userError,
  } = useAppSelector((state) => state.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<WithdrawalFormData>({
    defaultValues: {
      walletType: "",
      amount: 0,
    },
  });

  const amount = watch("amount");
  const walletType = watch("walletType");

  useEffect(() => {
    if (walletSettings.length === 0 && !settingsLoading) {
      dispatch(getWalletSettingsAsync());
    }
    if (userWallet === null && !userLoading) {
      dispatch(getUserWalletAsync());
    }
  }, [
    dispatch,
    walletSettings.length,
    userWallet,
    settingsLoading,
    userLoading,
  ]);

  // Check if withdrawal is allowed based on the current day
  useEffect(() => {
    if (fundWithdrawalWalletLoading || fundWithdrawalDayLoading) return;
  
    if (!fundWithdrawalDays || fundWithdrawalDays.length === 0) return;
  
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  
    const today = new Date();
    const dayName = days[today.getDay()];
  
    const isAllowed = fundWithdrawalDays.some(
      (day) => day.toLowerCase() === dayName.toLowerCase()
    );
  
    console.log("fundWithdrawalDays", fundWithdrawalDays);
    console.log("isAllowed", isAllowed);
  
    if (isAllowed) {
      setIsWithdrawalAllowed(true);
    } else {
      setIsWithdrawalAllowed(false);
      toast.warn(
        `Withdrawals are only allowed on: ${fundWithdrawalDays.join(", ")}.`
      );
    }
  }, [fundWithdrawalWalletLoading, fundWithdrawalDayLoading, fundWithdrawalDays]);
  

  const onSubmit = async (data: WithdrawalFormData) => {
    if (!isWithdrawalAllowed) {
      toast.error("Withdrawals are not allowed today.");
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
        fundWithdrawalAsync({
          txType: FUND_TX_TYPE.FUND_WITHDRAWAL,
          debitCredit: "DEBIT",
          amount: data.amount,
          walletType: data.walletType,
        })
      ).unwrap();

      dispatch(
        removeAmountFromWallet({
          walletType: data.walletType,
          amount: data.amount,
        })
      );

      toast.success("Withdrawal completed successfully!");
      setValue("amount", 0);
      setValue("walletType", "");
    } catch (error: any) {
      toast.error(error || "Withdrawal failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fundWithdrawalWalletLoading || fundWithdrawalDayLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (settingsLoading || userLoading) {
    return <div className="p-4">Loading wallet data...</div>;
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
    <WithdrawalContainer theme={darkMode ? "dark" : "light"}>
      <WithdrawalForm onSubmit={handleSubmit(onSubmit)}>
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
                  {filteredFundWithdrawalWallets?.map((wallet, index) => (
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
                validate: (value) =>
                  value <= Number(userWallet?.[walletType] ?? 0) ||
                  "Amount exceeds available balance",
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
        </WalletSection>

        <WithdrawalButton
          type="submit"
          disabled={isSubmitting || !isWithdrawalAllowed}
        >
          <FaWallet /> {isSubmitting ? "Withdrawing..." : "Withdraw"}
        </WithdrawalButton>
      </WithdrawalForm>
    </WithdrawalContainer>
  );
};

export default WithdrawalComponent;
