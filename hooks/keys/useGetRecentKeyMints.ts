import { fetchFromUrl, resolveUrl } from "@/services/fetchService";
import { KeyData, KeyRedeemType } from "@/types/key-types";
import { useQuery } from "@tanstack/react-query";
import { Address, Log, parseAbiItem } from "viem";
import { useAccount, usePublicClient } from "wagmi";

const ZERO_BIGINT = BigInt(0);

export const useGetRecentKeyMints = (keyData: KeyData) => {
  const { address } = useAccount() as { address: Address };
  const client = usePublicClient();

  const fetchRecentRedeems = async (): Promise<KeyRedeemType[]> => {
    const currentBlock = await client?.getBlockNumber();
    if (!currentBlock) return [];

    let logs: Log[] = [];
    let blockRange = 2000;
    const maxAttempts = 10;
    let attempts = 0

    while (logs.length < 6 && attempts < maxAttempts) {
      const fromBlock = currentBlock - BigInt(blockRange);

      logs = await client?.getLogs({
        address: keyData.address as Address,
        event: parseAbiItem('event Redeemed(address indexed to, uint256 indexed tokenId, uint32 timestamp)'),
        fromBlock: fromBlock > ZERO_BIGINT ? fromBlock : ZERO_BIGINT,
        toBlock: 'latest'
      }) ?? [];

      blockRange *= 2;
      attempts++;
    }

    return Promise.all(
      logs
        .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
        .slice(0, 10)
        .map(log => parseRedeem(log, keyData))
    );
  }

  return useQuery(
    {
      enabled: !!address,
      queryKey: ['recent-mints', keyData.address],
      queryFn: fetchRecentRedeems,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
}

const parseRedeem = async (log: any, keyData: KeyData): Promise<KeyRedeemType> => {
  const { to, tokenId, timestamp } = log.args;
  let image, name;

  if (keyData.baseURI) {
    const resolvedUrl = resolveUrl(keyData.baseURI);
    const metadata = await fetchFromUrl(`${resolvedUrl}/${tokenId}`);
    name = metadata.name;
    image = resolveUrl(metadata.image);
  } else {
    image = keyData.metadata.imageHash ? `https://gateway.pinata.cloud/ipfs/${keyData.metadata.imageHash}` : undefined;
    name = `${keyData.symbol} #${tokenId}`
  }

  return {
    keyAddress: keyData.address as Address,
    to,
    tokenId: tokenId.toString(),
    timestamp: Number(timestamp),
    transactionHash: log.transactionHash,
    name: name,
    image: image,
  }
}