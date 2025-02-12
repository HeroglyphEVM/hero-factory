import { HELPER_ADDRESS, PINATA_GATEWAY } from "@/services/web3/constants";
import { useContractQuery } from "../useContractQuery";
import { parseAbiItem } from "viem";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { KeyData } from "@/types/key-types";

const abi = [
  'function getAllKeys() view returns (BaseKeyMetadata[])',
  'struct BaseKeyMetadata {address token;address owner;uint256 maxSupply;uint256 totalSupply; string name; string symbol; string imageURI;}',
]

export const useGetFactoryKeys = () => {
  const { address } = useAccount() as { address: string };
  const [keys, setKeys] = useState<KeyData[]>([]);
  const [myKeys, setMyKeys] = useState<KeyData[]>([]);
  
  const { data, isLoading, isError } = useContractQuery({
    contractAddress: HELPER_ADDRESS,
    abi: [parseAbiItem(abi)],
    functionName: "getAllKeys",
    args: [],
    watch: false,
  });

  useEffect(() => {
    if (data) {
      const decoratedKeys = data.map(decorateBaseKey);
      setKeys(decoratedKeys);
      setMyKeys(decoratedKeys.filter((token: KeyData) => token.owner === address));
    }
  }, [data, address])

  return { keys, myKeys, isLoading, isError }
};

const decorateBaseKey = (keyData: any): KeyData => {
  return {
    ...keyData,
    address: keyData.token,
    maxSupply: BigInt(keyData.maxSupply).toString(),
    totalSupply: BigInt(keyData.totalSupply).toString(),
    image: keyData.imageURI ? `${PINATA_GATEWAY}/ipfs/${keyData.imageURI}` : "",
  }
}