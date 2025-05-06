import { createConfig, http } from "wagmi";
import { bsc } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

// Define supported chains as a readonly tuple
export const supportedChains = [bsc] as const;

// Get the dynamic URL from the current page
const getDynamicUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}`;
  }
  // Fallback for server-side rendering (SSR)
  return "https://your-app-fallback-url.co"; // Replace with your production URL
};
// Configure wallets using RainbowKit's getDefaultWallets
const { connectors } = getDefaultWallets({
  appName: "My Web3 App",
  projectId: "demo_project_id_1234567890abcdef",
  walletConnectParameters: {
    metadata: {
      name: "My Web3 App",
      description: "A Web3 application built with Wagmi and RainbowKit",
      url: getDynamicUrl(), // Explicitly set the URL
      icons: ["https://your-app-icon.png"], // Optional: Add an icon URL
    },
  },
});

// Create Wagmi configuration
export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors,
  transports: {
    [bsc.id]: http(),
  },
  ssr: true,
});

// Create QueryClient for Tanstack Query
export const queryClient = new QueryClient();
