import { createConfig, http } from "wagmi";
import { bsc, bscTestnet, Chain } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

// Load environment variables
const CHAIN_MODE = process.env.NEXT_PUBLIC_CHAIN_MODE || "mainnet";
const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "default_project_id";
const APP_URL_DEV = process.env.NEXT_PUBLIC_APP_URL_DEV || "http://localhost:3000";
const APP_URL_PROD = process.env.NEXT_PUBLIC_APP_URL_PROD || "https://your-app-fallback-url.co";
const APP_ICON_URL = process.env.NEXT_PUBLIC_APP_ICON_URL || "https://your-app-icon.png";

// Validate CHAIN_MODE
const validModes = ["testnet", "mainnet"] as const;
type ChainMode = typeof validModes[number];
const isValidMode = validModes.includes(CHAIN_MODE as any);
const selectedMode: ChainMode = isValidMode ? CHAIN_MODE as ChainMode : "mainnet";

// Determine the chain based on CHAIN_MODE
const selectedChain: Chain = selectedMode === "testnet" ? bscTestnet : bsc;
export const supportedChains = [selectedChain] as const;

// Get the dynamic URL from the current page
const getDynamicUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}`;
  }
  // Fallback for server-side rendering (SSR)
  return selectedMode === "testnet" ? APP_URL_DEV : APP_URL_PROD;
};

// Configure wallets using RainbowKit's getDefaultWallets
const { connectors } = getDefaultWallets({
  appName: "CamryChain",
  projectId: WALLET_CONNECT_PROJECT_ID,
  walletConnectParameters: {
    metadata: {
      name: "CamryChain",
      description: "Camry Chain DApp formerly Camry World",
      url: getDynamicUrl(),
      icons: [APP_ICON_URL],
    },
  },
});

// Create Wagmi configuration with explicit type for transports
export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors,
  transports: {
    [selectedChain.id]: http(),
  } as Record<typeof selectedChain.id, ReturnType<typeof http>>,
  ssr: true,
});

// Create QueryClient for Tanstack Query
export const queryClient = new QueryClient();