import axios from 'axios';

import { TokenDescriptor } from '@/types/token-types';
import { PINATA_GATEWAY, PINATA_JWT } from '../web3/constants';

type PinResponse = {
  IpfsHash: string;
}

export const uploadImage = async (imageFile: File): Promise<PinResponse> => {
  try {
    const formData = new FormData();

    formData.append("file", imageFile);

    const request = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`
      },
      body: formData,
    });
    if (!request.ok) {
      throw new Error(`HTTP error! status: ${request.status}`);
    }
    return await request.json() as PinResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }

}

export const uploadTokenMetadata = async (metadata: TokenDescriptor): Promise<PinResponse> => {
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as PinResponse;
  } catch (error) {
    console.error('Error uploading metadata to Pinata:', error);
    throw error;
  }
}

export const fetchTokenMetadata = async (metadataHash: string): Promise<TokenDescriptor> => {
  try {
    const response = await axios.get(`${PINATA_GATEWAY}/ipfs/${metadataHash}`);
    return response.data as TokenDescriptor;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
}

export const fetchTokenImage = async (imageUrl: string): Promise<Blob> => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error('Error fetching token image:', error);
    throw error;
  }
}