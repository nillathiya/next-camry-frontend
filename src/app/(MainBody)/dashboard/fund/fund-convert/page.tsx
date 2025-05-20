"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { FaWallet } from "react-icons/fa";
import {
  addAmountToWallet,
  getUserWalletAsync,
  removeAmountFromWallet,
} from "@/redux-toolkit/slices/userSlice";
import {
  SwapContainer,
  SwapForm,
  WalletSection,
  WalletSelector,
  Label,
  Select,
  AmountInput,
  SwapButton,
  ErrorMessage,
  SwapIcon,
} from "./SwapComponentStyles";
import { useFundConvertWallets } from "@/hooks/useUserSettings";
import { useWalletSettings } from "@/hooks/useWalletSettings";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { FUND_TX_TYPE } from "@/lib/fundType";
import { fundConvertAsync } from "@/redux-toolkit/slices/fundSlice";
import { Spinner } from "reactstrap";

// Types
interface SwapFormData {
  fromWalletType: string;
  walletType: string;
  amount: number;
}

// Component
const SwapComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.themeCustomizer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading: fundConvertWalletLoading, value: fundConvertWallets } =
    useFundConvertWallets();
  const filteredFundConvertWallets = fundConvertWallets?.filter(
    (wallet) => wallet.status
  );
  const { getWalletNameBySlug, getWalletBalanceBySlug } = useWalletSettings();
  const {
    loading: { getWalletSettings },
    walletSettings,
    error: settingsError,
  } = useAppSelector((state) => state.setting);
  const {
    loading: { getUserWallet },
    userWallet,
    error: userError,
  } = useAppSelector((state) => state.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SwapFormData>({
    defaultValues: {
      fromWalletType: "",
      walletType: "",
      amount: 0,
    },
  });

  const fromWalletType = watch("fromWalletType");
  const amount = watch("amount");

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

  if (fundConvertWalletLoading) {
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

  const onSubmit = async (data: SwapFormData) => {
    if (data.fromWalletType === data.walletType) {
      toast.error("Cannot swap to the same wallet type");
      return;
    }

    if (!userWallet) {
      toast.error("Wallet not loaded");
      return;
    }

    const fromBalance = Number(userWallet[data.fromWalletType] ?? 0);

    if (fromBalance < data.amount) {
      toast.error("Insufficient balance");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        fundConvertAsync({ ...data, txType: FUND_TX_TYPE.FUND_CONVERT })
      ).unwrap();
      dispatch(
        removeAmountFromWallet({
          walletType: data.fromWalletType,
          amount: data.amount,
        })
      );
      dispatch(
        addAmountToWallet({
          walletType: data.walletType,
          amount: data.amount,
        })
      );

      toast.success("Swap completed successfully!");
    } catch (error: any) {
      toast.error(error || "Swap failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SwapContainer theme={darkMode ? "dark" : "light"}>
      <SwapForm onSubmit={handleSubmit(onSubmit)} className="">
        <WalletSection>
          <WalletSelector>
            <Label theme={darkMode ? "dark" : "light"}>From Wallet</Label>
            <Controller
              name="fromWalletType"
              control={control}
              rules={{ required: "From wallet is required" }}
              render={({ field }) => (
                <Select {...field} theme={darkMode ? "dark" : "light"}>
                  <option value="">Select Wallet</option>
                  {filteredFundConvertWallets?.map((wallet, index) => (
                    <option key={index} value={wallet.key}>
                      {getWalletNameBySlug(wallet.key)}(
                      {Number(getWalletBalanceBySlug(wallet.key) ?? 0).toFixed(
                        2
                      )}
                      )
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.fromWalletType && (
              <ErrorMessage>{errors.fromWalletType.message}</ErrorMessage>
            )}
          </WalletSelector>

          <div style={{ margin: "10px 0" }}>
            <AmountInput
              type="number"
              placeholder="Amount"
              {...control.register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
              })}
              theme={darkMode ? "dark" : "light"}
            />
            {errors.amount && (
              <ErrorMessage>{errors.amount.message}</ErrorMessage>
            )}
          </div>

          <WalletSelector>
            <Label theme={darkMode ? "dark" : "light"}>To Wallet</Label>
            <Controller
              name="walletType"
              control={control}
              rules={{ required: "To wallet is required" }}
              render={({ field }) => (
                <Select {...field} theme={darkMode ? "dark" : "light"}>
                  <option value="">Select Wallet</option>
                  {fundConvertWallets?.map((wallet, index) => (
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
        </WalletSection>

        <SwapButton type="submit" disabled={isSubmitting}>
          <FaWallet /> {isSubmitting ? "Swapping..." : "Swap"}{" "}
          <SwapIcon theme={darkMode ? "dark" : "light"} />
        </SwapButton>
      </SwapForm>
    </SwapContainer>
  );
};

export default SwapComponent;
