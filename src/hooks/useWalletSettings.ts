import { useAppSelector } from "@/redux-toolkit/Hooks";
import { IWalletSettings } from "@/types";

export const useWalletSettings = () => {
  const { userWallet } = useAppSelector((state) => state.user);
  const { walletSettings } = useAppSelector((state) => state.setting);

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
