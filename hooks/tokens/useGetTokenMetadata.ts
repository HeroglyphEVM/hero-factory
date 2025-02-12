import { HELPER_ADDRESS, PINATA_GATEWAY } from "@/services/web3/constants";
import { useContractQuery } from "../useContractQuery";
import { Address, formatUnits, parseAbiItem } from "viem";
import { useEffect, useState } from "react";
import { TokenData } from "@/types/token-types";

const abi = [
  'function getTokenMetadata(address) public view returns (HeroTokenMetadata)',
  'struct HeroTokenMetadata {address token;address owner;bytes32 templateId;uint256 maxSupply;uint256 totalSupply;uint256 rewardPerBlock;uint256 maxBonusFullDay;string name;string symbol;ExternalTokenMetadata externalMetadata}',
  'struct ExternalTokenMetadata {string imageURI;string metadata;}',
]

export const useGetTokenMetadata = (tokenAddress: Address) => {
  const [tokenMetadata, setTokenMetadata] = useState<TokenData>();
  
  const { data, isLoading, isError } = useContractQuery({
    contractAddress: HELPER_ADDRESS,
    abi: [parseAbiItem(abi)],
    functionName: "getTokenMetadata",
    args: [tokenAddress],
    watch: false
  })

  useEffect(() => {
    if (data) {
      setTokenMetadata(decorateBaseToken(data))
    }
  }, [data])
  

  return { data: tokenMetadata, isLoading, isError }
};

const decorateBaseToken = (tokenData: any): TokenData => {
  return {
    ...tokenData,
    address: tokenData.token,
    maxSupply: formatUnits(tokenData.maxSupply, 18),
    totalSupply: formatUnits(tokenData.totalSupply, 18),
    rewardPerBlock: formatUnits(tokenData.rewardPerBlock, 18),
    image: tokenData.externalMetadata.imageURI ? `${PINATA_GATEWAY}/ipfs/${tokenData.externalMetadata.imageURI}` : "",
    metadata: {
      imageHash: tokenData.externalMetadata.imageURI,
      descriptorHash: tokenData.externalMetadata.metadata,
    }
  }
}
