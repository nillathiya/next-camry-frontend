import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getUsersiteSettingsAsync } from "@/redux-toolkit/slices/settingSlice";
import { IUserSetting, MenuItem, MenuItemChild, SettingOption } from "@/types";

interface RawMenuItem {
  status: string;
  children?: RawMenuItemChild[];
  [key: string]: any;
}

interface RawMenuItemChild {
  status: string;
  [key: string]: any;
}

const useFetchUserSettings = () => {
  const dispatch = useAppDispatch();
  const { userSettings } = useAppSelector((state) => state.setting);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (userSettings.length === 0) {
        setLoading(true);
        try {
          await dispatch(getUsersiteSettingsAsync()).unwrap(); // Use unwrap to handle the async thunk
        } catch (error) {
          console.error("Failed to fetch user settings:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [dispatch, userSettings.length]);

  return { userSettings, loading };
};

export const useUserSetting = (
  title: string,
  slug: string
): { value: SettingOption[] | string | string[] | undefined; loading: boolean } => {
  const { userSettings, loading } = useFetchUserSettings();

  const value = useMemo(() => {
    if (loading) return undefined; // Return undefined while loading
    const setting = userSettings.find(
      (data: IUserSetting) => data.title === title && data.slug === slug
    );
    return setting?.value as string | SettingOption[] | undefined;
  }, [userSettings, title, slug, loading]);

  return { value, loading };
};

export const useUserSettingValues = (
  criteria: { title: string; slug: string }[]
): {
  values: (SettingOption[] | string | undefined)[];
  loading: boolean;
} => {
  const { userSettings, loading } = useFetchUserSettings();

  const values = useMemo(() => {
    if (loading) return criteria.map(() => undefined); // Return undefined for each while loading
    return criteria.map(({ title, slug }) =>
      userSettings.find(
        (data: IUserSetting) => data.title === title && data.slug === slug
      )?.value as string | undefined
    );
  }, [userSettings, criteria, loading]);

  return { values, loading };
};

export const useMenuItems = (): { items: MenuItem[] | undefined; loading: boolean } => {
  const { userSettings, loading } = useFetchUserSettings();

  const items = useMemo(() => {
    if (loading) return undefined; // Return undefined while loading
    const setting = userSettings.find(
      (data: IUserSetting) =>
        data.title === "Menu Items" && data.slug === "menu_items"
    );

    if (!setting || !Array.isArray(setting.value)) {
      return undefined;
    }

    const normalizeStatus = (status: string | boolean): boolean =>
      typeof status === "string" ? status === "true" : status;

    const isRawMenuItemArray = (value: any[]): value is RawMenuItem[] =>
      value.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "key" in item &&
          "label" in item &&
          "status" in item
      );

    const value = setting.value;
    if (!isRawMenuItemArray(value)) {
      return undefined;
    }

    return value.map((item) => ({
      ...item,
      status: normalizeStatus(item.status),
      children: item.children?.map((child: RawMenuItemChild) => ({
        ...child,
        status: normalizeStatus(child.status),
      })) as MenuItemChild[],
    })) as MenuItem[];
  }, [userSettings, loading]);

  return { items, loading };
};

export const useAddFundWallet = (): { value: SettingOption | undefined; loading: boolean } => {
  const { value: setting, loading } = useUserSetting("Fund", "add_fund_wallet");

  const value = useMemo(() => {
    if (loading || !Array.isArray(setting)) return undefined;
    return setting[0] as SettingOption;
  }, [setting, loading]);

  return { value, loading };
};

export const useFundConvertWallets = (): {
  value: SettingOption[] | undefined;
  loading: boolean;
} => {
  const { value: setting, loading } = useUserSetting("Fund", "convert_fund_to_wallets");

  const value = useMemo(() => {
    if (loading || !Array.isArray(setting)) return undefined;
    return setting as SettingOption[];
  }, [setting, loading]);

  return { value, loading };
};

export const useFundTransferWallets = (): {
  value: SettingOption[] | undefined;
  loading: boolean;
} => {
  const { value: setting, loading } = useUserSetting("Fund", "transfer_fund_wallet");

  const value = useMemo(() => {
    if (loading || !Array.isArray(setting)) return undefined;
    return setting as SettingOption[];
  }, [setting, loading]);

  return { value, loading };
};

export const useFundWithdrawalWallets = (): {
  value: SettingOption[] | undefined;
  loading: boolean;
} => {
  const { value: setting, loading } = useUserSetting("Withdrawal", "withdrawal_fund_wallets");

  const value = useMemo(() => {
    if (loading || !Array.isArray(setting)) return undefined;
    return setting as SettingOption[];
  }, [setting, loading]);

  return { value, loading };
};

export const useFundWithdrawalDays = (): {
  value: string[] | undefined;
  loading: boolean;
} => {
  const { value: setting, loading } = useUserSetting("Withdrawal", "withdrawal_days");

  const value = useMemo(() => {
    if (loading || !Array.isArray(setting)) return undefined;
    return setting as string[];
  }, [setting, loading]);

  return { value, loading };
};