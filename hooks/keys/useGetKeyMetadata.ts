import { HELPER_ADDRESS, PINATA_GATEWAY } from "@/services/web3/constants";
import { useContractQuery } from "../useContractQuery";
import { Address, formatUnits, parseAbi, parseAbiItem } from "viem";
import { useEffect, useState } from "react";
import { KeyData } from "@/types/key-types";

// struct KeyMetadata {
//   address token;
//   address owner;
//   uint256 maxSupply;
//   uint256 totalSupply;
//   uint256 baseCost;
//   uint256 costIncrement;
//   address paymentToken;
//   address treasury;
//   string name;
//   string symbol;
//   string baseURI;
//   ExternalMetadataStorage.ExternalMetadata externalMetadata;
// }

const abi = [
  'function getKeyMetadata(address) public view returns (KeyMetadata)',
  'struct KeyMetadata {address token;address owner;uint256 maxSupply;uint256 totalSupply;uint256 baseCost;uint256 costIncrement;address paymentToken;address treasury;string name;string symbol;string baseURI;ExternalMetadata externalMetadata;}',
  'struct ExternalMetadata {string imageURI;string metadata;}',
]


export const useGetKeyMetadata = (keyAddress: Address) => {
  const [keyMetadata, setKeyMetadata] = useState<KeyData>();
  
  const { data, isLoading, isError } = useContractQuery({
    contractAddress: HELPER_ADDRESS,
    abi: [parseAbiItem(abi)],
    functionName: "getKeyMetadata",
    args: [keyAddress],
    watch: false
  })

  useEffect(() => {
    if (data) {
      setKeyMetadata(decorateBaseKey(data))
    }
  }, [data])
  

  return { data: keyMetadata, isLoading, isError }
};

const decorateBaseKey = (keyData: any): KeyData => {
  return {
    ...keyData,
    address: keyData.token,
    maxSupply: BigInt(keyData.maxSupply).toString(),
    totalSupply: BigInt(keyData.totalSupply).toString(),
    owner: keyData.owner,
    name: keyData.name,
    symbol: keyData.symbol,
    image: keyData.externalMetadata.imageURI ? `${PINATA_GATEWAY}/ipfs/${keyData.externalMetadata.imageURI}` : "",
    metadata: {
      imageHash: keyData.externalMetadata.imageURI,
      descriptorHash: keyData.externalMetadata.metadata,
    }
  }
}
