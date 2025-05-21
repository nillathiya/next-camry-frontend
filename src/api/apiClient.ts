"use client";

import { Store } from "@reduxjs/toolkit";
import axios, { AxiosInstance, AxiosError } from "axios";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useDisconnect, useAccount } from "wagmi";
import { Persistor } from "redux-persist";

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface GetWalletInfoFn {
  isWalletConnected: boolean;
  walletAddress?: string;
  disconnectWallet: () => void;
}
export const setupApiInterceptors = ({
  store,
  persistor,
  getWalletInfo,
}: {
  store: Store;
  persistor: Persistor;
  getWalletInfo: () => GetWalletInfoFn;
}) => {
  let isLoggingOut = false;

  apiClient.interceptors.request.use(
    async (config) => {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      // console.log("Session data:", session);
      if (session?.user?.backendToken) {
        // console.log("Sending backendToken:", session.user.backendToken);
        config.headers.Authorization = `Bearer ${session.user.backendToken}`;
      } else {
        console.warn("No backendToken found in session");
      }

      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401 && !isLoggingOut) {
        isLoggingOut = true;
        try {
          const { isWalletConnected, disconnectWallet, walletAddress } =
            getWalletInfo();

          if (isWalletConnected) {
            // console.log(`Disconnecting wallet: ${walletAddress}`);
            disconnectWallet(); // Disconnect the wallet
            toast.success("Wallet disconnected");
            // console.log("Wallet disconnect called");
          } else {
            console.log("No wallet connected");
          }

          console.warn("Session expired, logging out user...");
          persistor.purge();
          // localStorage.clear();
          await signOut({ redirect: false });
          window.location.href = "/auth/login";
        } catch (err) {
          console.error("Error during 401 handling:", err);
          window.location.href = "/auth/login";
        } finally {
          isLoggingOut = false;
        }
      }
      return Promise.reject(error);
    }
  );
};
