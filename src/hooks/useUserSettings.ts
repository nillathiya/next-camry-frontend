import { useEffect, useMemo } from "react";
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

  useEffect(() => {
    if (!userSettings.length) {
      dispatch(getUsersiteSettingsAsync());
    }
  }, [dispatch, userSettings.length]);

  return userSettings;
};

export const useUserSetting = (
  title: string,
  slug: string
): SettingOption[] | string | undefined => {
  const userSettings = useFetchUserSettings();

  return useMemo(() => {
    const setting = userSettings.find(
      (data: IUserSetting) => data.title === title && data.slug === slug
    );
    return setting?.value as string | SettingOption[] | undefined;
  }, [userSettings, title, slug]);
};

export const useUserSettingValues = (
  criteria: { title: string; slug: string }[]
): (SettingOption[] | string | undefined)[] => {
  const userSettings = useFetchUserSettings();

  return useMemo(() => {
    return criteria.map(
      ({ title, slug }) =>
        userSettings.find(
          (data: IUserSetting) => data.title === title && data.slug === slug
        )?.value as string | undefined
    );
  }, [userSettings, criteria]);
};

export const useMenuItems = (): MenuItem[] | undefined => {
  const userSettings = useFetchUserSettings();

  return useMemo(() => {
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
  }, [userSettings]);
};

export const useAddFundWallet = (): SettingOption | undefined => {
  const setting = useUserSetting("Fund", "add_fund_wallet");

  // Ensure the return type is SettingOption[] | undefined
  return useMemo(() => {
    if (Array.isArray(setting)) {
      return setting[0] as SettingOption;
    }
    return undefined;
  }, [setting]);
};

export const useFundConvertWallets = (): SettingOption[] | undefined => {
  const setting = useUserSetting("Fund", "convert_fund_to_wallets");

  // Ensure the return type is SettingOption[] | undefined
  return useMemo(() => {
    if (Array.isArray(setting)) {
      return setting as SettingOption[];
    }
    return undefined;
  }, [setting]);
};

export const useFundTransferWallets = (): SettingOption[] | undefined => {
  const setting = useUserSetting("Fund", "transfer_fund_wallet");

  // Ensure the return type is SettingOption[] | undefined
  return useMemo(() => {
    if (Array.isArray(setting)) {
      return setting as SettingOption[];
    }
    return undefined;
  }, [setting]);
};
