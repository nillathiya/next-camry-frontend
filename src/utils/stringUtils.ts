export const formatTxType = (txType: string): string => {
  return txType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};