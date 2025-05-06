import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getUsersiteSettingsAsync } from "@/redux-toolkit/slices/settingSlice";
import { IUserSetting, MenuItem, MenuItemChild } from "@/types";

interface UserSettingsState {
  userSettings: IUserSetting[];
  loading: boolean;
  error: string | null;
}

export const useUserSettings = (): UserSettingsState => {
  const dispatch = useAppDispatch();
  const { userSettings, loading, error } = useAppSelector((state) => state.setting);

  useEffect(() => {
    if (!userSettings.length) {
      dispatch(getUsersiteSettingsAsync());
    }
  }, [dispatch, userSettings.length]);

  // Memoize normalized settings
  const normalizedSettings = useMemo(() => {
    return userSettings.map((setting) => {
      if (setting.slug === "menu_items" && Array.isArray(setting.value)) {
        const normalizedValue = (setting.value as MenuItem[]).map((item) => ({
          ...item,
          status: item.status === "true" ? true : !!item.status,
          children: item.children?.map((child) => ({
            ...child,
            status: child.status === "true" ? true : !!child.status,
          })),
        }));
        console.log("Normalized Menu Items:", normalizedValue); // Will now only log when userSettings actually changes
        return { ...setting, value: normalizedValue };
      }
      return setting;
    });
  }, [userSettings]); // Only recalculate when userSettings changes

  return { userSettings: normalizedSettings, loading, error };
};