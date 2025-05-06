"use client";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig, queryClient } from "@/config/wagmiConfig";

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme()} modalSize="compact">
            {children}
          </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
