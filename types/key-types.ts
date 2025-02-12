
import { Address, Hex } from "viem";

export type KeyDescriptor = {
  description: string;
  website: string;
  x: string;
  telegram: string;
  chat: string;
}

type KeyMetadata = {
  imageHash: string; // IPFS hash for the image
  descriptorHash: string; // IPFS hash for the descriptor
}

export type KeyData = {
  address: string; // TODO: type Address
  name: string;
  symbol: string;
  maxSupply: string;
  totalSupply: string;
  owner: string;
  image: string; // URL of the image
  baseURI: string;
  metadata: KeyMetadata;
}

export type KeyTransfer = {
  from: Address;
  to: Address;
  tokenId: number;
  blockNumber: number;
  transactionHash: Hex;
}

export type KeyRedeemType = {
  keyAddress: Address;
  to: Address;
  tokenId: string,
  timestamp: number,
  transactionHash: string,
  name: string;
  image?: string
};

