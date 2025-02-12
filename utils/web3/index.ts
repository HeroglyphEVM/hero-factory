import { keccak256, toHex } from "viem";

export const truncateTxHash = (txHash: string) => `${txHash?.substring(0, 5)}...${txHash?.substring(60)}`;

export const beautifyAddress = (address?: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const eventToTopic = (eventName: string) => {
  return keccak256(toHex(eventName));
}