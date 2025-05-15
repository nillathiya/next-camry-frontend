import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux-toolkit/Hooks";
import { IWalletSettings } from "@/types";
import { getWalletSettingsAsync } from "@/redux-toolkit/slices/settingSlice";

export const useWalletSettings = () => {
  const dispatch = useAppDispatch();
  const { userWallet } = useAppSelector((state) => state.user);
  const { walletSettings } = useAppSelector((state) => state.setting);

  // Fetch wallet settings if not already loaded
  useEffect(() => {
    if (!walletSettings || walletSettings.length === 0) {
      dispatch(getWalletSettingsAsync());
    }
  }, [dispatch, walletSettings]);

  const getWalletBalanceBySlug = (slug: string) => {
    return userWallet ? userWallet[slug] : "N/A";
  };

  const getWalletNameBySlug = (slug: string): string | undefined => {
    const setting = walletSettings.find(
      (setting: IWalletSettings) => setting.slug === slug
    );
    return setting?.name;
  };

  return {
    getWalletBalanceBySlug,
    getWalletNameBySlug,
  };
};
