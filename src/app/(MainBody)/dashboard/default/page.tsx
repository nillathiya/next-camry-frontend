"use client";

import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
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
    loading: { getWalletSettings },
    walletSettings,
    error: settingsError,
  } = useAppSelector((state) => state.setting);
  const {
    loading: { getUserWallet },
    userWallet,
    error: userError,
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (userWallet === null && !getUserWallet) {
      dispatch(getUserWalletAsync());
    }
  }, []);

  if (getWalletSettings || getUserWallet) {
    return <div className="p-4">Loading wallet data...</div>;
  }

  if (settingsError || userError) {
    return (
      <div className="p-4 text-red-600">
        Error: {settingsError || userError}
      </div>
    );
  }

  if (!userWallet) {
    return <div className="p-4">No data available.</div>;
  }

  return (
    <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
      <MyAwesomeMap />
    </Suspense>
  );
}
