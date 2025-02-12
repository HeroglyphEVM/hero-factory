import { Address, Hex } from "viem";

export type TokenDescriptor = {
  description: string;
  website: string;
  x: string;
  telegram: string;
  chat: string;
}

type TokenMetadata = {
  imageHash: string; // IPFS hash for the image
  descriptorHash: string; // IPFS hash for the descriptor
}

export type TokenData = {
  address: string; // TODO: type Address
  name: string;
  symbol: string;
  maxSupply: string;
  totalSupply: string;
  rewardPerBlock: string;
  owner: string;
  image: string; // URL of the image
  metadata: TokenMetadata;
}

export type TokenTransfer = {
  txHash: Hex;
  from: Address;
  to: Address;
  value: string;
  blockNumber: number;
  transactionHash: Address;
}
