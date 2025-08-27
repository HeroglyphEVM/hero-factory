import { HELPER_ADDRESS, PINATA_GATEWAY } from "@/services/web3/constants";
import { useContractQuery } from "../useContractQuery";
import { formatUnits, parseAbiItem } from "viem";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TokenData } from "@/types/token-types";

const abi = [
  "function getAllTokens() view returns (BaseTokenMetadata[])",
  "struct BaseTokenMetadata {address token;address owner;bytes32 templateId;uint256 maxSupply;uint256 totalSupply; uint256 rewardPerBlock; string name; string symbol; string imageURI;}",
];

export const useGetFactoryTokens = () => {
  const { address } = useAccount() as { address: string };
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [myTokens, setMyTokens] = useState<TokenData[]>([]);

  const { data, isLoading, isError, error } = useContractQuery({
    contractAddress: HELPER_ADDRESS,
    abi: [parseAbiItem(abi)],
    functionName: "getAllTokens",
    args: [],
    watch: false,
  });

  useEffect(() => {
    if (data) {
      const decoratedTokens = data.map(decorateBaseToken);
      setTokens(decoratedTokens);
      setMyTokens(
        decoratedTokens.filter((token: TokenData) => token.owner === address)
      );
    }
  }, [data, address]);

  return { tokens, myTokens, isLoading, isError };
};

const decorateBaseToken = (tokenData: any): TokenData => {
  return {
    ...tokenData,
    address: tokenData.token,
    maxSupply: formatUnits(tokenData.maxSupply, 18),
    totalSupply: formatUnits(tokenData.totalSupply, 18),
    rewardPerBlock: formatUnits(tokenData.rewardPerBlock, 18),
    image: tokenData.imageURI
      ? `${PINATA_GATEWAY}/ipfs/${tokenData.imageURI}`
      : "",
  };
};
