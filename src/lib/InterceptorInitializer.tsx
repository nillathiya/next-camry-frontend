// lib/InterceptorInitializer.tsx
"use client";

import { useEffect, useRef } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { store } from "@/redux-toolkit/store";
import { setupApiInterceptors } from "@/api/apiClient";

const InterceptorInitializer = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const isConnectedRef = useRef(isConnected);
  const addressRef = useRef(address);
  const disconnectRef = useRef(disconnect);

  useEffect(() => {
    isConnectedRef.current = isConnected;
    addressRef.current = address;
    disconnectRef.current = disconnect;
  }, [isConnected, address, disconnect]);

  useEffect(() => {
    setupApiInterceptors({
      store,
      getWalletInfo: () => ({
        isWalletConnected: isConnectedRef.current,
        walletAddress: addressRef.current,
        disconnectWallet: disconnectRef.current,
      }),
    });
  }, [store]);

  return null;
};

export default InterceptorInitializer;
