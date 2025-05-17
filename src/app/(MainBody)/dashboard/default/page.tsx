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

  if (getWalletSettings) {
    return <div className="p-4">Loading wallet data...</div>;
  }

  if (settingsError) {
    return <div className="p-4 text-red-600">Error: {settingsError}</div>;
  }

  return (
    <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
      <MyAwesomeMap />
    </Suspense>
  );
}
