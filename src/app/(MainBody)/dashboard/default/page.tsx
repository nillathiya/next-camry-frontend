"use client";

import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getWalletSettingsAsync } from "@/redux-toolkit/slices/settingSlice";
import { getUserWalletAsync } from "@/redux-toolkit/slices/userSlice";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

// Dynamic import for the dashboard component
const MyAwesomeMap = dynamic(
  () => import("@/components/general/dashboard/default"),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading dashboard...</div>,
  }
);

export default function DashboardDefault() {
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (walletSettings.length === 0 && !settingsLoading) {
      dispatch(getWalletSettingsAsync());
    }
    if (userWallet === null && !userLoading) {
      dispatch(getUserWalletAsync());
    }
  }, []);

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
    <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
      <MyAwesomeMap />
    </Suspense>
  );
}
