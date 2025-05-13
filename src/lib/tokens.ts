// utils/tokens.js

// Supported chain IDs
export type ChainId = 1 | 56 | 97 | 137 | 42161 | 10;

// USDT addresses by chainId
const usdtAddresses: Record<ChainId, string> = {
  1: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Ethereum
  56: "0x55d398326f99059ff775485246999027b3197955", // BSC Mainnet
  97: "0x7B5E2af1a89a1a23D8031077a24A2454D81b3fbd", // BSC Testnet
  137: "0x3813e82e6f7098b9583FC0F33a962D02018B6803", // Polygon
  42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // Arbitrum
  10: "0x4200000000000000000000000000000000000006", // Optimism
};

// USDC addresses by chainId
const usdcAddresses: Record<ChainId, string> = {
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Ethereum
  56: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // BSC Mainnet
  97: "0x64544969ed7EBf5f083679233325356EbE738930", // BSC Testnet
  137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Polygon
  42161: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // Arbitrum
  10: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", // Optimism
};

// Token configurations
const tokenConfigs = {
  USDT: {
    name: "USDT",
    icon: "https://cdn.worldvectorlogo.com/logos/tether.svg",
    decimals: 6, // Corrected to 6 decimals for USDT
    getAddress: (chainId: ChainId) => usdtAddresses[chainId] || "Not Supported",
  },
  USDC: {
    name: "USDC",
    icon: "https://images.vexels.com/media/users/3/135829/isolated/svg/1a857d341d8b6dd31426d6a62a8d9054.svg",
    decimals: 6, // USDC typically has 6 decimals
    getAddress: (chainId: ChainId) => usdcAddresses[chainId] || "Not Supported",
  },
};

// Function to get token list based on chainId
export const getTokens = (chainId: ChainId) => [
  {
    category: "Stablecoins",
    items: Object.values(tokenConfigs).map((token) => ({
      name: token.name,
      icon: token.icon,
      address: token.getAddress(chainId),
      decimals: token.decimals,
    })),
  },
];

// Export the original getUSDTAddress function for backward compatibility
export const getUSDTAddress = (chainId: ChainId) =>
  usdtAddresses[chainId] || "Not Supported";

// Example usage
// console.log(getTokens(97)); // Tokens for BSC Testnet
// console.log(getUSDTAddress(97)); // BSC Testnet USDT Address