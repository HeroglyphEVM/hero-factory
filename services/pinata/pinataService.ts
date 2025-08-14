import axios from "axios";

import { TokenDescriptor } from "@/types/token-types";
import { PINATA_GATEWAY } from "../web3/constants";

type PinResponse = {
  IpfsHash: string;
};

export const uploadImage = async (imageFile: File): Promise<PinResponse> => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch("/api/pinata/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as { IpfsHash: string };
};

export const uploadTokenMetadata = async (
  metadata: TokenDescriptor
): Promise<PinResponse> => {
  const response = await fetch("/api/pinata/upload-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as { IpfsHash: string };
};

export const fetchTokenMetadata = async (
  metadataHash: string
): Promise<TokenDescriptor> => {
  try {
    const response = await axios.get(`${PINATA_GATEWAY}/ipfs/${metadataHash}`);
    return response.data as TokenDescriptor;
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
};

export const fetchTokenImage = async (imageUrl: string): Promise<Blob> => {
  try {
    const response = await axios.get(imageUrl, { responseType: "blob" });
    return response.data;
  } catch (error) {
    console.error("Error fetching token image:", error);
    throw error;
  }
};
